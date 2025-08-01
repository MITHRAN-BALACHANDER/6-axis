from django.urls import path
from .views import IK6DView, MotionProfileView

urlpatterns = [
    path('ik/', IK6DView.as_view(), name='ik-6d'),
    path('<str:profile_name>/', MotionProfileView.as_view(), name='motion-profile'),
]
