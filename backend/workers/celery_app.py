"""
Celery application configuration for asynchronous task processing
"""
from celery import Celery
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Create Celery app
celery_app = Celery(
    "meri_awaaz_workers",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["workers.tasks"]
)

# Configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_serializer_kwargs={
        'ensure_ascii': False,
    },
    # Task routing
    task_routes={
        "workers.tasks.process_new_issue": {"queue": "issue_processing"},
        "workers.tasks.call_llava_service": {"queue": "ai_vision"},
        "workers.tasks.call_analysis_agent": {"queue": "ai_analysis"},
        "workers.tasks.call_triage_agent": {"queue": "ai_triage"},
    },
    # Worker configuration
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    # Result expiration
    result_expires=3600,  # 1 hour
    # Task retry configuration
    task_retry_max_count=3,
    task_retry_delay=60,  # 1 minute
)

# Health check task
@celery_app.task(bind=True)
def health_check(self):
    """Health check task for monitoring worker status"""
    return {"status": "healthy", "worker_id": self.request.id}

if __name__ == "__main__":
    celery_app.start()