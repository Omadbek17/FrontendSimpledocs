from django.urls import path
from .views import (
    DocumentListCreateView,
    DocumentRetrieveUpdateDestroyView,
    MyDocumentsView,
    SharedDocumentsView,
    ShareDocumentView,
    register  # ✅ added this
)
from . import views as html_views

urlpatterns = [
    # ✅ Registration endpoint
    path('register/', register, name='register'),

    # API endpoints
    path('', DocumentListCreateView.as_view(), name='document-list'),
    path('<int:pk>/', DocumentRetrieveUpdateDestroyView.as_view(), name='document-detail'),
    path('my-documents/', MyDocumentsView.as_view(), name='my-documents'),
    path('shared-documents/', SharedDocumentsView.as_view(), name='shared-documents'),
    path('<int:pk>/share/', ShareDocumentView.as_view(), name='share-document'),

    # Optional HTML views
    path('html/', html_views.document_list_view, name='document-list'),
    path('html/create/', html_views.document_create_view, name='document-create'),
    path('html/<int:pk>/', html_views.document_detail_view, name='document-detail'),
    path('html/<int:pk>/edit/', html_views.document_update_view, name='document-update'),
]
