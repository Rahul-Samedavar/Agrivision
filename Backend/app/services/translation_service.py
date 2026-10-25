import re
from sarvamai import SarvamAI
from app.config import settings

client = SarvamAI(api_subscription_key=settings.SARVAM_API_KEY)

MAX_TRANSLATION_INPUT_CHARS = 1900
SUPPORTED_CHAT_LANGS = {"en", "hi", "mr", "kn"}

# mapping lang string
def get_sarvam_lang_code(lang: str) -> str:
    mapping = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'mr': 'mr-IN',
        'kn': 'kn-IN',
    }
    return mapping.get(lang, 'en-IN')


def _normalize_chat_lang(lang: str) -> str:
    return lang if lang in SUPPORTED_CHAT_LANGS else "en"


def detect_chat_language(text: str, fallback_lang: str = "en") -> str:
    fallback = _normalize_chat_lang((fallback_lang or "").lower())
    content = (text or "").strip()
    if not content:
        return fallback

    if re.search(r"[\u0C80-\u0CFF]", content):
        return "kn"

    if re.search(r"[\u0900-\u097F]", content):
        lowered = content.lower()
        hi_markers = ["है", "हैं", "क्या", "कैसे", "आप", "कृपया", "मुझे"]
        mr_markers = ["आहे", "आहेत", "काय", "कसे", "तुम्ही", "मला", "पाहिजे"]

        hi_score = sum(marker in lowered for marker in hi_markers)
        mr_score = sum(marker in lowered for marker in mr_markers)

        if mr_score > hi_score:
            return "mr"
        if hi_score > mr_score:
            return "hi"
        if fallback in {"hi", "mr"}:
            return fallback
        return "hi"

    if re.search(r"[a-zA-Z]", content):
        return "en"

    return fallback


def _chunk_text(text: str, max_len: int = MAX_TRANSLATION_INPUT_CHARS) -> list[str]:
    if len(text) <= max_len:
        return [text]

    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + max_len, text_len)

        if end < text_len:
            split_at = text.rfind("\n", start, end)
            if split_at <= start:
                split_at = text.rfind(" ", start, end)
            if split_at > start:
                end = split_at

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        if end == start:
            end = min(start + max_len, text_len)
        start = end

    return chunks

def translate_text(text: str, target_lang: str) -> str:
    target_code = get_sarvam_lang_code(target_lang)
    if target_code == 'en-IN':
        return text

    chunks = _chunk_text(text)
    translated_chunks = []

    for chunk in chunks:
        response = client.text.translate(
            input=chunk,
            source_language_code="en-IN",
            target_language_code=target_code,
            model="sarvam-translate:v1",
            numerals_format="native"
        )
        translated_chunks.append(response.translated_text)

    return "\n\n".join(translated_chunks)
