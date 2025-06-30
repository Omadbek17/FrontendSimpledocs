from __future__ import absolute_import
import os
from celery import Celery
os.environ['CELERYD_FORCE_EXECV'] = 'true'


# set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinedocs.settings')

app = Celery('onlinedocs')

# load config from Django settings
app.config_from_object('django.conf:settings', namespace='CELERY')

# auto-discover tasks from all registered Django apps
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
