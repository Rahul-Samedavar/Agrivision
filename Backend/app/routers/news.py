from fastapi import APIRouter
from pydantic import BaseModel
from app.services.serper_service import search_news
from app.services.translation_service import translate_text

router = APIRouter()

class NewsRequest(BaseModel):
    place: str
    lang: str = "en"

@router.post("/news")
async def get_news(request: NewsRequest):
    # Fetch news
    news_query = f"agriculture news in {request.place}"
    news_result = search_news(news_query)
    news_items = news_result.get('news', [])
    
    formatted_news = []
    for item in news_items:
        title = item.get('title')
        snippet = item.get('snippet')
        
        # Translate title and snippet
        translated_title = translate_text(title, request.lang) if title else ""
        translated_snippet = translate_text(snippet, request.lang) if snippet else ""
        
        formatted_news.append({
            "title": translated_title,
            "snippet": translated_snippet,
            "link": item.get('link'),
            "date": item.get('date'),
            "source": item.get('source'),
            "image_url": item.get('imageUrl')
        })
        
    return formatted_news
