from rest_framework.views import APIView
from rest_framework.response import Response
from .models import RobotLog, SystemEvent
from .serializers import RobotLogSerializer, SystemEventSerializer
from django.conf import settings
import os

class RobotLogView(APIView):
    def get(self, request):
        logs = RobotLog.objects.all().order_by('-timestamp')
        serializer = RobotLogSerializer(logs, many=True)
        return Response(serializer.data)

class SystemEventView(APIView):
    def get(self, request):
        events = SystemEvent.objects.all().order_by('-timestamp')
        serializer = SystemEventSerializer(events, many=True)
        return Response(serializer.data)
