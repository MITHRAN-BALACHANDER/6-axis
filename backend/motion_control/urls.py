from django.urls import path
from .views import run_motion_profile


urlpatterns = [
    path('motion/<str:profile_type>/', run_motion_profile),
]
