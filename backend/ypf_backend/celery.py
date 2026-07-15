import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ypf_backend.settings')

app = Celery('ypf_backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Periodic Tasks Schedule
from celery.schedules import crontab

app.conf.beat_schedule = {
    'update_all_weather_data': {
        'task': 'ypf_backend.core.tasks.update_all_weather_data',
        'schedule': crontab(minute=0),  # Every hour
    },
    'generate_yield_predictions': {
        'task': 'ypf_backend.core.tasks.generate_yield_predictions',
        'schedule': crontab(hour=22, minute=0),  # 10 PM daily
    },
    'send-harvest-alerts': {
        'task': 'ypf_backend.core.tasks.send_harvest_alerts',
        'schedule': crontab(hour=6, minute=0),  # 6 AM daily
    },
    'score_pest_disease_risk': {
        'task': 'ypf_backend.core.tasks.score_pest_disease_risk',
        'schedule': crontab(hour=8, minute=0),
    },
    'send_pest_alerts': {
        'task': 'ypf_backend.core.tasks.send_pest_alerts',
        'schedule': crontab(hour=8, minute=30),
    },
    'send_weekly_summary': {
        'task': 'ypf_backend.core.tasks.send_weekly_summary',
        'schedule': crontab(hour=7, minute=0, day_of_week='sun'),
    },
}
