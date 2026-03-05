import requests

url = 'http://localhost:8000/api/auth/login/'

# Create a session to maintain cookies
session = requests.Session()

# Step 1: Get CSRF token
print("Step 1: Getting CSRF token...")
response = session.get(url)
print(f"GET Status: {response.status_code}")
print(f"Cookies: {session.cookies.get_dict()}")

# Step 2: Login with credentials
print("\nStep 2: Logging in...")
csrf_token = session.cookies.get('csrftoken')
print(f"CSRF Token: {csrf_token}")

headers = {
    'X-CSRFToken': csrf_token,
    'Content-Type': 'application/json',
}

data = {
    'username': 'admin@siet.ac.in',
    'password': 'admin123'
}

response = session.post(url, json=data, headers=headers)
print(f"POST Status: {response.status_code}")
print(f"Response: {response.text}")
print(f"Cookies after login: {session.cookies.get_dict()}")
