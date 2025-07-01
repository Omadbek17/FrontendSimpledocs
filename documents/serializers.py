from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'owner']
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        # If you're updating shared_with from admin or API, handle it manually
        shared_with = validated_data.pop('shared_with', None)
        instance = super().update(instance, validated_data)
        if shared_with is not None:
            instance.shared_with.set(shared_with)
        return instance
