import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import documents.routing

from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.applications import Starlette

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinedocs.settings')

django_asgi_app = get_asgi_application()

# Starlette app orqali CorsMiddleware qo‘shamiz
app = Starlette()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # test uchun hammasiga ruxsat, xohlasang origin qo‘y
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Django ASGI ilovasini Starlette ichiga joylash
app.mount("/", django_asgi_app)

application = ProtocolTypeRouter({
    "http": app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            documents.routing.websocket_urlpatterns
        )
    ),
})
