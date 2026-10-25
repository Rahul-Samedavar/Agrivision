from fastapi import APIRouter
from pydantic import BaseModel
import base64
from app.services.llm_service import detect_disease, extract_agri_products
from app.services.serper_service import search_shopping
from app.services.translation_service import translate_text

router = APIRouter()

class DiseaseRequest(BaseModel):
    image: str # Base64 encoded image
    query: str = ""
    lang: str = "en"


def _looks_agri_product(title: str | None, source: str | None) -> bool:
    text = f"{title or ''} {source or ''}".lower()
    agri_keywords = [
        "fungicide", "pesticide", "insecticide", "herbicide", "fertilizer",
        "agri", "agriculture", "crop", "plant", "seed", "biofungicide",
        "garden", "horticulture", "foliar", "micronutrient", "nutrient",
        "calcium", "magnesium", "zinc", "boron", "sulfate", "sulphate",
        "npk", "chelate", "soil conditioner", "plant tonic"
    ]
    bad_keywords = [
        "amplifier", "speaker", "audio", "guitar", "home", "quilt", "comforter"
    ]

    if any(bad in text for bad in bad_keywords):
        return False
    return any(good in text for good in agri_keywords)

@router.post("/disease-detect")
async def process_disease(request: DiseaseRequest):
    # Detect Disease
    image_bytes = base64.b64decode(request.image)
    detection_text = detect_disease(image_bytes, request.query)
    extracted_products = extract_agri_products(detection_text)
    
    products = []
    seen_links = set()
    for item in extracted_products:
        product_name = (item.get("name") or "").strip() if isinstance(item, dict) else ""
        category = (item.get("category") or "other").strip().lower() if isinstance(item, dict) else "other"
        if not product_name:
            continue

        # Use category-aware query; previous fungicide-only bias caused misses for nutrient disorders.
        if category == "nutrient":
            suffix = "agriculture plant nutrient foliar spray india"
        elif category in ("fungicide", "pesticide", "bio"):
            suffix = f"agriculture {category} crop treatment india"
        else:
            suffix = "agriculture crop plant treatment india"

        search_query = f"{product_name} {suffix}"
        search_results = search_shopping(search_query)
        shopping = search_results.get('shopping', [])

        for s_item in shopping[:8]:
            title = s_item.get('title')
            source = s_item.get('source')
            link = s_item.get('link')
            if not link or link in seen_links:
                continue
            if not _looks_agri_product(title, source):
                continue

            products.append({
                "name": title,
                "price": s_item.get('price'),
                "image_url": s_item.get('imageUrl'),
                "buy_link": link
            })
            seen_links.add(link)

            # keep top results concise
            if len(products) >= 15:
                break
        if len(products) >= 15:
            break
                    
    # Translate and format
    translated_detection = translate_text(detection_text, request.lang)
    
    # Note: we might also want to translate product names, but usually leaving them in english or basic translation is fine. Let's just return them.
    return {
        "analysis": translated_detection,
        "recommended_products": products
    }
