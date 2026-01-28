import os
import django
import sys

# Add the project directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'robotics.settings')
django.setup()

from django.contrib.auth import get_user_model

try:
    print("Attempting to connect to database...")
    User = get_user_model()
    print(f"User model: {User}")
    
    # Try to fetch one user or count
    print("Executing query...")
    count = User.objects.count()
    print(f"Success! User count: {count}")
    
    # Try the specific call that failed: get_by_natural_key if possible, or just a get
    # The error was in get_by_natural_key(username)
    # let's try to find a user if count > 0
    if count > 0:
        u = User.objects.first()
        print(f"Fetched user: {u}")
        
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
