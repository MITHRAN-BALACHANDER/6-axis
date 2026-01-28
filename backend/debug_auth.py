
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'robotics.settings')
django.setup()
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

username = 'admin'
password = 'admin'

print(f"Checking user: {username}")
try:
    user = User.objects.get(username=username)
    print(f"User found: {user}")
    print(f"Is active: {user.is_active}")
    print(f"Check password result: {user.check_password(password)}")
    
    auth_user = authenticate(username=username, password=password)
    print(f"Authenticate result: {auth_user}")

except User.DoesNotExist:
    print("User does not exist")
