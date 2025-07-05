import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import documents.routing

from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.applications import Starlette

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinedocs.settings')

# Django HTTP app
django_asgi_app = get_asgi_application()

# Starlette app bilan CORS qo‘shamiz
starlette_app = Starlette()
starlette_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            documents.routing.websocket_urlpatterns
        )
    ),
})
