"""Compare Gemini API speed: OpenAI-compat vs direct REST."""
import time
import requests
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-3.5-flash-lite"
PROMPT = "What is the capital of France? Reply in one sentence."

# --- Method 1: Direct REST API ---
print("=== Method 1: Direct REST API ===")
t1 = time.time()
url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
payload = {"contents": [{"parts": [{"text": PROMPT}]}]}
resp = requests.post(url, json=payload, timeout=30)
data = resp.json()
print(f"Raw response: {data}")
if "candidates" in data:
    text = data["candidates"][0]["content"]["parts"][0]["text"]
    print(f"Response: {text}")
else:
    print(f"ERROR: {data.get('error', data)}")
elapsed1 = time.time() - t1
print(f"Time: {elapsed1:.1f}s\n")

# --- Method 2: OpenAI-compatible endpoint ---
print("=== Method 2: OpenAI-compatible endpoint ===")
t2 = time.time()
client = OpenAI(
    api_key=API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)
response = client.chat.completions.create(
    model=MODEL,
    messages=[{"role": "user", "content": PROMPT}],
)
elapsed2 = time.time() - t2
print(f"Response: {response.choices[0].message.content}")
print(f"Time: {elapsed2:.1f}s")
