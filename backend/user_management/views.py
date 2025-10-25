from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from monitoring.models import SystemEvent
from django.conf import settings

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password)
        SystemEvent.objects.create(event_type='LOGIN', message=f"New user registered and logged in: {username}")
        login(request, user)
        return Response({'message': 'User registered and logged in successfully.'})

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            SystemEvent.objects.create(event_type='LOGIN', message=f"User logged in: {username}")
            return Response({'message': 'Login successful.'})
        else:
            SystemEvent.objects.create(event_type='APP_ERROR', message=f"Failed login attempt for username: {username}")
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            username = request.user.username
            logout(request)
            SystemEvent.objects.create(event_type='LOGOUT', message=f"User logged out: {username}")
            return Response({'message': 'Logout successful.'})
        return Response({'error': 'Not logged in.'}, status=status.HTTP_400_BAD_REQUEST)

class CheckAuthView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({'isAuthenticated': True})
        else:
            return Response({'isAuthenticated': False}, status=status.HTTP_401_UNAUTHORIZED)

class VerifyLogPasswordView(APIView):
    def post(self, request):
        password = request.data.get('password')
        if password == settings.LOG_PASSWORD:
            return Response({'success': True})
        else:
            return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)
