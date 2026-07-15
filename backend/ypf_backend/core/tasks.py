import logging
from datetime import timedelta

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from ypf_backend.farms.models import CropPlanting, Farm, Recommendation, WeatherData
from ypf_backend.utils.ml_predictions import generate_yield_predictions_for_farm
from ypf_backend.utils.notification_service import send_urgent_alert
from ypf_backend.utils.weather_service import update_farm_weather_data

logger = logging.getLogger(__name__)


@shared_task
def update_all_weather_data():
    """Celery task to update weather data for all farms with coordinates."""
    farms = Farm.objects.filter(coordinates__isnull=False)
    success_count = 0

    for farm in farms:
        if update_farm_weather_data(farm.id):
            success_count += 1

    logger.info("Updated weather for %s/%s farms", success_count, farms.count())
    return {"updated": success_count, "total": farms.count()}


@shared_task
def generate_yield_predictions():
    """Generate yield predictions for all farms (daily task + on-demand callable)."""
    farms = Farm.objects.all()
    success_count = 0

    for farm in farms:
        if generate_yield_predictions_for_farm(farm.id):
            success_count += 1

    logger.info("Generated predictions for %s/%s farms", success_count, farms.count())
    return {"predicted": success_count, "total": farms.count()}


@shared_task
def score_pest_disease_risk():
    """Evaluate and generate pest/disease alerts using weather and crop risk logic."""
    from ypf_backend.api.views import PestDiseaseAlertViewSet

    viewset = PestDiseaseAlertViewSet()
    created = 0

    for farm in Farm.objects.filter(coordinates__isnull=False):
        created += len(viewset._generate_for_farm(farm))

    return {"alerts_created": created}


@shared_task
def send_harvest_alerts():
    """Send harvest alerts to farmers with impending harvest windows."""
    today = timezone.now().date()
    upcoming_harvests = CropPlanting.objects.select_related("field__farm__user", "crop", "field").filter(
        expected_harvest_date__gte=today,
        expected_harvest_date__lte=today + timedelta(days=7),
        status="growing",
    )

    sent = 0
    for planting in upcoming_harvests:
        farm_user = planting.field.farm.user
        subject = f"Harvest Alert: {planting.crop.name} ready soon"
        message = (
            f"Your {planting.crop.name} in {planting.field.name} will be ready to harvest on "
            f"{planting.expected_harvest_date}."
        )

        if send_urgent_alert(farm_user, subject, message):
            sent += 1
        else:
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [farm_user.email])
                sent += 1
            except Exception as exc:
                logger.error("Error sending harvest alert: %s", exc)

    return {"alerts_sent": sent}


@shared_task
def send_pest_alerts():
    """Distribute high-risk pest/disease alerts through configured channels."""
    high_risk_alerts = Recommendation.objects.none()
    try:
        from ypf_backend.farms.models import PestDiseaseAlert

        high_risk_alerts = PestDiseaseAlert.objects.select_related("farm__user").filter(
            is_acknowledged=False,
            risk_level__in=["high", "critical"],
        )
    except Exception as exc:
        logger.error("Unable to load pest alerts: %s", exc)
        return {"alerts_sent": 0}

    sent = 0
    for alert in high_risk_alerts:
        farm_user = alert.farm.user
        subject = f"Pest Alert ({alert.risk_level.upper()}): {alert.title}"
        message = f"{alert.description}\n\nField: {alert.field.name}\nCrop: {alert.crop.name}"
        if send_urgent_alert(farm_user, subject, message):
            sent += 1

    return {"alerts_sent": sent, "total_alerts": high_risk_alerts.count()}


@shared_task
def send_weekly_summary():
    """Send a weekly summary email to all farmers with active plantings."""
    active_farm_users = (
        Farm.objects.filter(fields__plantings__status__in=["planned", "growing"])
        .values_list("user__email", flat=True)
        .distinct()
    )

    sent = 0
    for email in active_farm_users:
        if not email:
            continue
        try:
            send_mail(
                "Weekly Farm Summary",
                "Your weekly YieldPF summary is ready in the dashboard.",
                settings.DEFAULT_FROM_EMAIL,
                [email],
            )
            sent += 1
        except Exception as exc:
            logger.error("Error sending weekly summary to %s: %s", email, exc)

    return {"summaries_sent": sent}


# Backward-compatible aliases for previously referenced task names.
generate_nightly_predictions = generate_yield_predictions
generate_daily_pest_alerts = score_pest_disease_risk
send_weekly_farm_summaries = send_weekly_summary
