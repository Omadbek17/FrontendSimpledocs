from pathlib import Path
import os
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# -------------------
# BASIC SETTINGS
# -------------------
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-secret-key")
DEBUG = os.environ.get("DEBUG", "False") == "True"
ALLOWED_HOSTS = ["simpledocsnew.onrender.com", "localhost", "127.0.0.1"]

# -------------------
# APPLICATIONS
# -------------------
INSTALLED_APPS = [
    "corsheaders",
    "channels",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "users",
    "documents",
]

# -------------------
# MIDDLEWARE
# -------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # CORS DOIMO BIRINCHI
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# -------------------
# DATABASE
# -------------------
DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}"
    )
}

# -------------------
# TIME & LANGUAGE
# -------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# -------------------
# STATIC FILES
# -------------------
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"

# -------------------
# REST FRAMEWORK
# -------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

# -------------------
# CORS SETTINGS
# -------------------
CORS_ALLOW_ALL_ORIGINS = True  # 🚀 TESTDA HAMMA ORIGINLARGA RUXSAT BER
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "https://frontend-simpledocs-98hy.vercel.app",
    "https://simpledocsnew.onrender.com",
]

# -------------------
# CHANNELS & REDIS
# -------------------
REDIS_URL = os.environ.get("REDIS_URL", "redis://127.0.0.1:6379")
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {"hosts": [REDIS_URL]},
    },
}

# -------------------
# CELERY
# -------------------
CELERY_BROKER_URL = REDIS_URL

# -------------------
# DEFAULT PRIMARY KEY
# -------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
