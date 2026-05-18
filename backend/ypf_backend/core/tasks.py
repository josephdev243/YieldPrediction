from celery import shared_task
import logging
from ypf_backend.farms.models import Farm, Recommendation, CropPlanting
from ypf_backend.utils.weather_service import update_farm_weather_data
from ypf_backend.utils.ml_predictions import generate_yield_predictions_for_farm

logger = logging.getLogger(__name__)


@shared_task
def update_all_weather_data():
    """Celery task to update weather data for all farms."""
    farms = Farm.objects.all()
    success_count = 0
    
    for farm in farms:
        if update_farm_weather_data(farm.id):
            success_count += 1
    
    logger.info(f"Updated weather for {success_count}/{farms.count()} farms")
    return {'updated': success_count, 'total': farms.count()}


@shared_task
def generate_nightly_predictions():
    """Celery task to generate yield predictions for all farms."""
    farms = Farm.objects.all()
    success_count = 0
    
    for farm in farms:
        if generate_yield_predictions_for_farm(farm.id):
            success_count += 1
    
    logger.info(f"Generated predictions for {success_count}/{farms.count()} farms")
    return {'predicted': success_count, 'total': farms.count()}


@shared_task
def generate_recommendations(farm_id):
    """Celery task to generate AI recommendations for a farm."""
    try:
        farm = Farm.objects.get(id=farm_id)
        active_plantings = CropPlanting.objects.filter(
            field__farm=farm,
            status__in=['growing']
        )
        
        recommendations = []
        
        for planting in active_plantings:
            field = planting.field
            
            # Check soil health
            if field.soil_ph and (field.soil_ph < 6.0 or field.soil_ph > 7.5):
                rec = Recommendation.objects.create(
                    farm=farm,
                    category='fertilizer',
                    title='Soil pH Adjustment Needed',
                    description=f'Soil pH is {field.soil_ph}. Consider adding lime or sulfur.',
                    priority='high'
                )
                recommendations.append(rec)
            
            # Check moisture
            if field.moisture_level and field.moisture_level < 30:
                rec = Recommendation.objects.create(
                    farm=farm,
                    category='irrigation',
                    title='Irrigation Recommended',
                    description=f'Soil moisture is {field.moisture_level}%. Consider irrigating.',
                    priority='high'
                )
                recommendations.append(rec)
        
        logger.info(f"Generated {len(recommendations)} recommendations for farm {farm_id}")
        return {'recommendations_created': len(recommendations)}
    except Farm.DoesNotExist:
        logger.error(f"Farm {farm_id} not found")
        return {'error': 'Farm not found'}


@shared_task
def send_harvest_alerts():
    """Celery task to send harvest alerts."""
    from datetime import timedelta, datetime
    from django.core.mail import send_mail
    
    upcoming_harvests = CropPlanting.objects.filter(
        expected_harvest_date__lte=datetime.now().date() + timedelta(days=7),
        expected_harvest_date__gte=datetime.now().date(),
        status='growing'
    )
    
    for planting in upcoming_harvests:
        farm_user = planting.field.farm.user
        subject = f"Harvest Alert: {planting.crop.name} ready soon"
        message = f"Your {planting.crop.name} in {planting.field.name} will be ready to harvest on {planting.expected_harvest_date}"
        
        try:
            send_mail(subject, message, 'noreply@ypf-farming.com', [farm_user.email])
            logger.info(f"Harvest alert sent to {farm_user.email}")
        except Exception as e:
            logger.error(f"Error sending harvest alert: {e}")
    
    return {'alerts_sent': upcoming_harvests.count()}
