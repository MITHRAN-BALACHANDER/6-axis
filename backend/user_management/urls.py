from django.urls import path
from .views import RegisterView, LoginView, LogoutView, CheckAuthView, VerifyLogPasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-auth/', CheckAuthView.as_view(), name='check-auth'),
    path('verify-log-password/', VerifyLogPasswordView.as_view(), name='verify-log-password'),
]
