# monitoring/urls.py

from django.urls import path
from .views import RobotLogView, SystemEventView, HardwareFeedbackView, SoftwareFeedbackView

urlpatterns = [
    path('logs/', RobotLogView.as_view(), name='robot-logs'),
    path('system-events/', SystemEventView.as_view(), name='system-events'),
    path('feedback/hardware/', HardwareFeedbackView.as_view(), name='hardware-feedback'),
    path('feedback/software/', SoftwareFeedbackView.as_view(), name='software-feedback'),
]
