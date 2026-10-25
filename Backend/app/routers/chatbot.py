from fastapi import APIRouter
from pydantic import BaseModel
import base64
import binascii
from typing import Optional
from app.services.llm_service import chat_bot
from app.services.translation_service import detect_chat_language, translate_text
from fastapi import HTTPException

router = APIRouter()

class ChatbotRequest(BaseModel):
    query: str
    lang: str = "en"
    image: Optional[str] = None # Base64 encoded image

@router.post("/chatbot")
async def process_chat(request: ChatbotRequest):
    # Chat with Gemini
    image_bytes = None
    if request.image and request.image != "string":
        try:
            image_bytes = base64.b64decode(request.image)
        except binascii.Error:
            raise HTTPException(status_code=400, detail="Invalid base64 image data")
            
    detected_lang = detect_chat_language(request.query, request.lang)
    response_text = chat_bot(request.query, image_bytes, detected_lang)

    # Keep old translation behavior only for English inputs.
    if detected_lang == "en":
        final_response = translate_text(response_text, request.lang)
    else:
        final_response = response_text
    
    return {
        "response": final_response,
        "detected_lang": detected_lang,
    }
