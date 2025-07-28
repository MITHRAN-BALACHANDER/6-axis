from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/motion/', include('motion_control.urls')),
    path('api/monitoring/', include('monitoring.urls')),
    path('api/auth/', include('user_management.urls')),
]
