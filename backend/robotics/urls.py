from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def home(request):
    return HttpResponse("<h1>Welcome to the Robotics</h1> <h3>CSE Backend Team</h3>")

urlpatterns = [
    path('',home),
    path('admin/', admin.site.urls),
    path('api/motion/', include('motion_control.urls')),
    path('api/monitoring/', include('monitoring.urls')),
    path('api/auth/', include('user_management.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
