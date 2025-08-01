from    celery           import Celery
from    cloud_hw3.config import celery_config

app = Celery("cloud_hw3")
app.conf.update(celery_config)

import  cloud_hw3.tasks
