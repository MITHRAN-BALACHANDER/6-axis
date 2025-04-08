from django.urls import path
from .views import log_button_click, get_logs

urlpatterns = [
    path("logs/", log_button_click, name="log_button_click"),
    path("logs/get/", get_logs, name="get_logs"),
]
