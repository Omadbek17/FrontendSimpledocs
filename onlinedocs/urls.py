from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from documents.views import register

urlpatterns = [
    # Health check
    path('', lambda request: JsonResponse({"message": "SimpleDocs API is running 🚀"})),

    # Admin panel
    path('admin/', admin.site.urls),

    # Auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register, name='register'),

    # API apps
    path('api/users/', include('users.urls')),
    path('api/documents/', include('documents.urls')),

    # Browsable API login/logout
    path('api-auth/', include('rest_framework.urls')),
]
