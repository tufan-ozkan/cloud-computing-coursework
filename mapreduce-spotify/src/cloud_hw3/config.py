celery_config = {
    "broker_url"        : "redis://localhost:6379/0",
    "result_backend"    : "redis://localhost:6379/0",
    "task_serializer"   : "json",
    "result_serializer" : "json",
    "accept_content"    : ["json"],
    "timezone"          : "Europe/Istanbul",
    "enable_utc"        : True,
}

FILE_PATH = "data/900k Definitive Spotify Dataset.json"
RESULT_PATH = "results.json"

CHUNK_SIZE = 1000
