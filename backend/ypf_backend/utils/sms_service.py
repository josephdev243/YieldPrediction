"""Africa's Talking SMS helpers."""

import logging

import africastalking
from django.conf import settings

logger = logging.getLogger(__name__)

_sms_service = None


def get_sms_service():
    """Initialize and return the Africa's Talking SMS service."""
    global _sms_service

    if _sms_service is None:
        africastalking.initialize(
            settings.AFRICAS_TALKING_USERNAME,
            settings.AFRICAS_TALKING_API_KEY,
        )
        _sms_service = africastalking.SMS

    return _sms_service


def send_sms(message, recipients):
    """Send an SMS message to one or more recipients.

    Args:
        message: Message body to send.
        recipients: A list of phone numbers in international format.
    """
    sms = get_sms_service()

    try:
        return sms.send(message, recipients)
    except Exception as exc:
        logger.error("Error sending SMS via Africa's Talking: %s", exc)
        raise


def send_test_sms():
    """Send a sample SMS to the configured test number."""
    return send_sms("Hello farmers 🚜", ["+254794084764"])