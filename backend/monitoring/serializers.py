from rest_framework import serializers
from .models import RobotLog, SystemEvent

class RobotLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RobotLog
        fields = '__all__'

class SystemEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemEvent
        fields = '__all__'
