import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ypf_backend.settings')

app = Celery('ypf_backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Periodic Tasks Schedule
from celery.schedules import crontab

app.conf.beat_schedule = {
    'update-weather-every-hour': {
        'task': 'ypf_backend.core.tasks.update_all_weather_data',
        'schedule': crontab(minute=0),  # Every hour
    },
    'generate-predictions-daily': {
        'task': 'ypf_backend.core.tasks.generate_nightly_predictions',
        'schedule': crontab(hour=22, minute=0),  # 10 PM daily
    },
    'send-harvest-alerts': {
        'task': 'ypf_backend.core.tasks.send_harvest_alerts',
        'schedule': crontab(hour=6, minute=0),  # 6 AM daily
    },
}
