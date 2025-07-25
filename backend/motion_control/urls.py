from django.urls import path
from .views import IK2DView

urlpatterns = [
    path('ik/', IK2DView.as_view(), name='ik-2d'),
]
