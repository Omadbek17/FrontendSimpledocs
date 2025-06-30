from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Document(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Owner of the document
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='owned_documents'
    )

    # Users with whom the document is shared
    shared_with = models.ManyToManyField(
        User,
        through='DocumentShare',
        related_name='shared_documents',
        blank=True
    )

    def __str__(self):
        return f"{self.title} ({self.owner.username})"

    def is_shared_with(self, user):
        return self.shared_with.filter(id=user.id).exists()


class DocumentShare(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # Permissions
    can_edit = models.BooleanField(default=False)
    can_share = models.BooleanField(default=False)

    class Meta:
        unique_together = ('document', 'user')

    def __str__(self):
        return f"{self.user.username} access to '{self.document.title}'"
