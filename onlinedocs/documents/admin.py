from django.contrib import admin
from .models import Document, DocumentShare

class DocumentShareInline(admin.TabularInline):
    model = DocumentShare
    extra = 1  # Number of blank forms shown
    autocomplete_fields = ['user']  # Optional, improves user selection
    verbose_name = "Shared User"
    verbose_name_plural = "Shared Users"

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'owner', 'created_at', 'updated_at')
    list_filter = ('owner', 'created_at')
    search_fields = ('title', 'owner__username', 'content')
    
    fieldsets = (
        (None, {
            'fields': ('title', 'content', 'owner')
        }),
    )

    inlines = [DocumentShareInline]

    def save_model(self, request, obj, form, change):
        if not obj.owner_id:
            obj.owner = request.user
        super().save_model(request, obj, form, change)
