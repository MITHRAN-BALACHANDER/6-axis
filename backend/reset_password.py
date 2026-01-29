import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'robotics.settings')
django.setup()
from django.contrib.auth.models import User

username = 'admin@siet.ac.in'
new_password = 'admin123'

user = User.objects.get(username=username)
user.set_password(new_password)
user.save()
print(f'✅ Password reset for {username} to: {new_password}')
