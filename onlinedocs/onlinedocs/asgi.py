import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import documents.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinedocs.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            documents.routing.websocket_urlpatterns
        )
    ),
})
