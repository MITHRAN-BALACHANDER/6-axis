import requests

url = 'http://localhost:8000/api/auth/login/'
data = {'username': 'admin', 'password': 'admin'}

try:
    # First get CSRF cookie
    session = requests.Session()
    # Assuming there's a CSRF endpoint, usually get to set cookie
    # The view says LoginView get sets the cookie
    r_get = session.get(url)
    print(f"GET status: {r_get.status_code}")
    print(f"Cookies: {session.cookies.get_dict()}")
    
    csrftoken = session.cookies.get('csrftoken')
    headers = {'X-CSRFToken': csrftoken, 'Referer': url}
    
    r_post = session.post(url, json=data, headers=headers)
    print(f"POST status: {r_post.status_code}")
    print(f"Response: {r_post.text}")
    
except Exception as e:
    print(f"Error: {e}")
