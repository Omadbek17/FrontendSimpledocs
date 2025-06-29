from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponseForbidden
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password

from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Document
from .serializers import DocumentSerializer
from .forms import DocumentForm

User = get_user_model()

# -------------------------------
# ✅ API Views (REST endpoints)
# -------------------------------

class DocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Document.objects.filter(Q(owner=user) | Q(shared_with=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DocumentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Document.objects.filter(Q(owner=user) | Q(shared_with=user)).distinct()


class MyDocumentsView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(owner=self.request.user)


class SharedDocumentsView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(shared_with=self.request.user)


class ShareDocumentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        username = request.data.get('username')
        if not username:
            return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            document = Document.objects.get(id=pk)
        except Document.DoesNotExist:
            return Response({'error': 'Document not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user != document.owner:
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            user_to_share = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user_to_share == request.user:
            return Response({'error': 'Cannot share document with yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        if user_to_share in document.shared_with.all():
            return Response({'message': f'Document already shared with {username}.'})

        document.shared_with.add(user_to_share)
        return Response({'message': f'Document shared with {username}.'})


# ✅ Register view is open to anyone (no auth required)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'success': False, 'error': 'Username and password required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'success': False, 'error': 'Username already taken.'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create(username=username, password=make_password(password))
    return Response({'success': True, 'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)


# ----------------------------------
# ✅ Template-Based Views (require login)
# ----------------------------------

@login_required
def document_list_view(request):
    documents = Document.objects.filter(Q(owner=request.user) | Q(shared_with=request.user)).distinct()
    return render(request, 'documents/document_list.html', {'documents': documents})


@login_required
def document_detail_view(request, pk):
    document = get_object_or_404(Document, pk=pk)
    if request.user != document.owner and request.user not in document.shared_with.all():
        return HttpResponseForbidden("You don't have permission to view this document.")
    return render(request, 'documents/document_detail.html', {'document': document})


@login_required
def document_create_view(request):
    if request.method == 'POST':
        form = DocumentForm(request.POST)
        if form.is_valid():
            doc = form.save(commit=False)
            doc.owner = request.user
            doc.save()
            return redirect('document-list')
    else:
        form = DocumentForm()
    return render(request, 'documents/document_form.html', {'form': form, 'form_title': 'Create Document'})


@login_required
def document_update_view(request, pk):
    document = get_object_or_404(Document, pk=pk, owner=request.user)
    if request.method == 'POST':
        form = DocumentForm(request.POST, instance=document)
        if form.is_valid():
            form.save()
            return redirect('document-detail', pk=document.pk)
    else:
        form = DocumentForm(instance=document)
    return render(request, 'documents/document_form.html', {'form': form, 'form_title': 'Edit Document'})
