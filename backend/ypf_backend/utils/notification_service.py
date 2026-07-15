import logging

from django.conf import settings
from django.core.mail import send_mail

from ypf_backend.utils.sms_service import send_sms

logger = logging.getLogger(__name__)

try:
    from twilio.rest import Client
except Exception:  # pragma: no cover
    Client = None


def send_email_notification(subject, message, recipients):
    if not recipients:
        return False
    try:
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipients)
        return True
    except Exception as exc:
        logger.error("Email notification failed: %s", exc)
        return False


def send_sms_notification(message, phone_number):
    if not phone_number:
        return False

    # Prefer Twilio if configured; fallback to Africa's Talking helper.
    sid = getattr(settings, "TWILIO_ACCOUNT_SID", "")
    token = getattr(settings, "TWILIO_AUTH_TOKEN", "")
    from_number = getattr(settings, "TWILIO_PHONE_NUMBER", "")

    if Client and sid and token and from_number:
        try:
            client = Client(sid, token)
            client.messages.create(body=message, from_=from_number, to=phone_number)
            return True
        except Exception as exc:
            logger.error("Twilio SMS failed: %s", exc)

    try:
        send_sms(message, [phone_number])
        return True
    except Exception as exc:
        logger.error("Fallback SMS failed: %s", exc)
        return False


def send_whatsapp_notification(message, whatsapp_number):
    if not whatsapp_number:
        return False

    if not whatsapp_number.startswith("whatsapp:"):
        whatsapp_number = f"whatsapp:{whatsapp_number}"

    sid = getattr(settings, "TWILIO_ACCOUNT_SID", "")
    token = getattr(settings, "TWILIO_AUTH_TOKEN", "")
    from_number = getattr(settings, "TWILIO_WHATSAPP_NUMBER", "")

    if not (Client and sid and token and from_number):
        logger.info("Twilio WhatsApp not configured; skipping WhatsApp notification")
        return False

    try:
        client = Client(sid, token)
        client.messages.create(body=message, from_=from_number, to=whatsapp_number)
        return True
    except Exception as exc:
        logger.error("Twilio WhatsApp failed: %s", exc)
        return False


def send_urgent_alert(user, subject, message):
    """Send urgent notifications through enabled channels; succeeds if at least one channel delivers."""
    delivered = False

    if user.prefers_email_notifications and user.email:
        delivered = send_email_notification(subject, message, [user.email]) or delivered

    if user.prefers_sms_notifications and user.phone_number:
        delivered = send_sms_notification(message, user.phone_number) or delivered

    if user.prefers_whatsapp_notifications and user.whatsapp_number:
        delivered = send_whatsapp_notification(message, user.whatsapp_number) or delivered

    return delivered
