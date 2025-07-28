# monitoring/urls.py

from django.urls import path
from .views import RobotLogView, SystemEventView

urlpatterns = [
    path('logs/', RobotLogView.as_view(), name='robot-logs'),
    path('system-events/', SystemEventView.as_view(), name='system-events'),
]
