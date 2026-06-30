import requests

url = "https://spotify-mvp.onrender.com/recommend"
payload = {"message": "I like listening to Justin Bieber but I am kind of bored of him"}
headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
