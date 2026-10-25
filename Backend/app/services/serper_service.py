import requests
from app.config import settings


SERPER_TIMEOUT_SECONDS = 20


def _headers():
    api_key = (settings.SERPER_API_KEY or "").strip()
    if not api_key:
        raise ValueError("SERPER_API_KEY is required")
    return {
        "X-API-KEY": api_key,
        "Content-Type": "application/json",
    }


def _post_serper(url: str, payload: dict):
    response = requests.post(
        url,
        headers=_headers(),
        json=payload,
        timeout=SERPER_TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    return response.json()


def search_maps(query: str):
    url = "https://google.serper.dev/maps"
    payload = {"q": query}
    return _post_serper(url, payload)


def search_places(query: str, gl: str = "in"):
    url = "https://google.serper.dev/places"
    payload = {"q": query, "gl": gl}
    return _post_serper(url, payload)


def search_shopping(query: str, num: int = 40):
    url = "https://google.serper.dev/shopping"
    payload = {"q": query, "gl": "in", "num": num}
    return _post_serper(url, payload)


def search_news(query: str, num: int = 40):
    url = "https://google.serper.dev/news"
    payload = {"q": query, "gl": "in", "num": num}
    return _post_serper(url, payload)
