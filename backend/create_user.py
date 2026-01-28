import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'robotics.settings')
django.setup()
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print("Superuser 'admin' created.")
else:
    print("Superuser 'admin' already exists.")
