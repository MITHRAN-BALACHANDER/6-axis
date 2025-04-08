from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ButtonLog
from .serializers import ButtonLogSerializer

@api_view(["POST"])
def log_button_click(request):
    """API to log button clicks."""
    serializer = ButtonLogSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_logs(request):
    """API to fetch all button click logs."""
    logs = ButtonLog.objects.all().order_by("-timestamp")  # Latest logs first
    serializer = ButtonLogSerializer(logs, many=True)
    return Response(serializer.data)
