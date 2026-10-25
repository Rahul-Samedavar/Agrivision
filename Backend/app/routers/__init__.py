from fastapi import APIRouter
from .soil_test import router as soil_router
from .disease import router as disease_router
from .chatbot import router as chatbot_router
from .news import router as news_router

router = APIRouter()
router.include_router(soil_router, prefix="/api")
router.include_router(disease_router, prefix="/api")
router.include_router(chatbot_router, prefix="/api")
router.include_router(news_router, prefix="/api")
