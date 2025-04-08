from rest_framework import serializers
from .models import ButtonLog

class ButtonLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ButtonLog
        fields = "__all__"
