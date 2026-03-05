#!/usr/bin/env python
"""
Script to test user authentication and list all users.
Usage: python test_auth.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'robotics.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

def list_users():
    """List all users in the database."""
    print("\n=== All Users in Database ===")
    users = User.objects.all()
    if not users.exists():
        print("No users found in database!")
        return
    
    for user in users:
        print(f"\n👤 Username: {user.username}")
        print(f"   Email: {user.email or '(not set)'}")
        print(f"   Active: {'✅ Yes' if user.is_active else '❌ No'}")
        print(f"   Superuser: {'✅ Yes' if user.is_superuser else '❌ No'}")
        print(f"   Staff: {'✅ Yes' if user.is_staff else '❌ No'}")

def test_credentials():
    """Test user credentials."""
    print("\n=== Test User Credentials ===\n")
    
    username = input("Enter username to test: ").strip()
    password = input("Enter password: ").strip()
    
    # Try to authenticate
    user = authenticate(username=username, password=password)
    
    if user is not None:
        print(f"\n✅ Authentication SUCCESSFUL for user '{username}'")
        print(f"   User is active: {user.is_active}")
        print(f"   User is superuser: {user.is_superuser}")
    else:
        print(f"\n❌ Authentication FAILED for user '{username}'")
        print("   Possible reasons:")
        print("   1. Incorrect username or password")
        print("   2. User account is not active")
        print("   3. User does not exist")
        
        # Check if user exists
        if User.objects.filter(username=username).exists():
            user_obj = User.objects.get(username=username)
            print(f"\n   ℹ️  User '{username}' exists in database")
            print(f"   Active status: {user_obj.is_active}")
        else:
            print(f"\n   ℹ️  User '{username}' does NOT exist in database")

if __name__ == "__main__":
    print("=" * 50)
    print("User Authentication Test Tool")
    print("=" * 50)
    
    # List all users first
    list_users()
    
    # Test credentials
    print("\n")
    test_credentials()
