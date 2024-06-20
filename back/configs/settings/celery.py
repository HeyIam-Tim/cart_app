import os
from celery import Celery
from celery.schedules import crontab


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configs.settings.base')

app = Celery('configs')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()


app.conf.beat_schedule = {
    # 'get-distributors-every-24-hours': {
    #     'task': 'abcp.tasks.distributors',
    #     'schedule': crontab(minute='*/1440'),
    # },
    'get-regions-zzap-every-month': {
        'task': 'zzap.tasks.regions_zzap',
        'schedule': crontab(0, 0, day_of_month='1'),
    },
    'get-brands-zzap-every-month': {
        'task': 'zzap.tasks.brands_zzap',
        'schedule': crontab(0, 0, day_of_month='1'),
    },
}
