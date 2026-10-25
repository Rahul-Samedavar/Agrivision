from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.services.serper_service import search_places
from app.services.translation_service import translate_text

router = APIRouter()


class SoilTestRequest(BaseModel):
    place: str
    lang: str = "en"


class PrivateLab(BaseModel):
    title: str | None
    address: str | None
    lat: float | None
    lon: float | None
    rating: float | None
    ratingCount: int | None
    phoneNumber: str | None
    website: str | None


class GovernmentLab(BaseModel):
    title: str | None
    address: str | None
    lat: float | None
    lon: float | None
    rating: float | None
    ratingCount: int | None
    phoneNumber: str | None
    website: str | None


class SoilTestResponse(BaseModel):
    private: List[PrivateLab]
    government: List[GovernmentLab]


def _norm_text(value: str | None) -> str:
    return (value or "").strip().lower()


def _coords_match(a: dict, b: dict, tolerance: float = 0.0005) -> bool:
    lat_a, lon_a = a.get("lat"), a.get("lon")
    lat_b, lon_b = b.get("lat"), b.get("lon")
    if None in (lat_a, lon_a, lat_b, lon_b):
        return False
    return abs(lat_a - lat_b) <= tolerance and abs(lon_a - lon_b) <= tolerance


def _is_same_lab(private_lab: dict, govt_lab: dict) -> bool:
    p_title = _norm_text(private_lab.get("title"))
    g_title = _norm_text(govt_lab.get("title"))
    p_addr = _norm_text(private_lab.get("address"))
    g_addr = _norm_text(govt_lab.get("address"))
    p_phone = _norm_text(private_lab.get("phoneNumber"))
    g_phone = _norm_text(govt_lab.get("phoneNumber"))
    p_site = _norm_text(private_lab.get("website"))
    g_site = _norm_text(govt_lab.get("website"))

    # Strong direct identifiers.
    if p_phone and g_phone and p_phone == g_phone:
        return True
    if p_site and g_site and p_site == g_site:
        return True

    # Title + address together is a strong match.
    if p_title and g_title and p_addr and g_addr and p_title == g_title and p_addr == g_addr:
        return True

    # Title + near-identical coordinates is also a strong match.
    if p_title and g_title and p_title == g_title and _coords_match(private_lab, govt_lab):
        return True

    # Fallback: at least two signals match among title/address/coords.
    signals = 0
    if p_title and g_title and p_title == g_title:
        signals += 1
    if p_addr and g_addr and p_addr == g_addr:
        signals += 1
    if _coords_match(private_lab, govt_lab):
        signals += 1
    return signals >= 2


def _remove_private_duplicates(private_labs: list[dict], government_labs: list[dict]) -> list[dict]:
    deduped_private = []
    for p_lab in private_labs:
        if any(_is_same_lab(p_lab, g_lab) for g_lab in government_labs):
            continue
        deduped_private.append(p_lab)
    return deduped_private


def _completeness_score(item: dict) -> int:
    optional_fields = ["phoneNumber", "website", "rating", "ratingCount"]
    return sum(1 for key in optional_fields if item.get(key) is not None)


def _translate_lab(lab: dict, lang: str) -> dict:
    translated = dict(lab)
    if translated.get("title"):
        translated["title"] = translate_text(translated["title"], lang)
    if translated.get("address"):
        translated["address"] = translate_text(translated["address"], lang)
    return translated


def _normalize_serper_place(place: dict) -> dict:
    return {
        "title": place.get("title"),
        "address": place.get("address"),
        "lat": place.get("latitude"),
        "lon": place.get("longitude"),
        "rating": place.get("rating"),
        "ratingCount": place.get("ratingCount"),
        "phoneNumber": place.get("phoneNumber"),
        "website": place.get("website"),
    }


def _fetch_labs_for_query(query: str) -> list[dict]:
    result = search_places(query)
    places = result.get("places", [])

    labs = [_normalize_serper_place(p) for p in places]
    labs.sort(key=_completeness_score, reverse=True)
    return labs

@router.post("/soil-test")
async def get_soil_labs(request: SoilTestRequest) -> SoilTestResponse:
    private_query = f"Find Private soil testing labs within 50km of {request.place}"
    government_query = f"Find Government soil testing labs within 50km of {request.place}"

    private_labs = _fetch_labs_for_query(private_query)
    government_labs = _fetch_labs_for_query(government_query)

    # If a lab appears in both categories, keep it only in government.
    private_labs = _remove_private_duplicates(private_labs, government_labs)

    if request.lang != "en":
        private_labs = [_translate_lab(l, request.lang) for l in private_labs]
        government_labs = [_translate_lab(l, request.lang) for l in government_labs]

    return {
        "private": private_labs,
        "government": government_labs,
    }
