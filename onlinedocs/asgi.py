import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import documents.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinedocs.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # HTTP uchun
    "websocket": AuthMiddlewareStack(  # WebSocket uchun auth bilan
        URLRouter(
            documents.routing.websocket_urlpatterns  # ws:// uchun marshrutlar
        )
    ),
})
