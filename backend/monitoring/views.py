from rest_framework.views import APIView
from rest_framework.response import Response
from .models import RobotLog, SystemEvent, Feedback
from .serializers import RobotLogSerializer, SystemEventSerializer, FeedbackSerializer
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

class HardwareFeedbackView(APIView):
    def get(self, request):
        feedback = Feedback.objects.filter(type='HARDWARE').order_by('-timestamp')
        serializer = FeedbackSerializer(feedback, many=True)
        return Response(serializer.data)

class SoftwareFeedbackView(APIView):
    def get(self, request):
        feedback = Feedback.objects.filter(type='SOFTWARE').order_by('-timestamp')
        serializer = FeedbackSerializer(feedback, many=True)
        return Response(serializer.data)
