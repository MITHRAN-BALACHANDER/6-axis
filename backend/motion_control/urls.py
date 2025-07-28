from django.urls import path
from .views import IK2DView, MotionProfileView

urlpatterns = [
    path('ik/', IK2DView.as_view(), name='ik-2d'),
    path('<str:profile_name>/', MotionProfileView.as_view(), name='motion-profile'),
]
