import json
import base64
import re
import traceback
from app.config import settings

try:
    from openai import OpenAI
except Exception:
    OpenAI = None


def _clean_fenced_json(text: str) -> str:
    response_text = (text or "").strip()
    if response_text.startswith("```json"):
        response_text = response_text[7:]
    if response_text.startswith("```"):
        response_text = response_text[3:]
    if response_text.endswith("```"):
        response_text = response_text[:-3]
    return response_text.strip()


# ---------------------------------------------------------------------------
# Client helpers
# ---------------------------------------------------------------------------

GEMINI_MODEL = "gemini-3.5-flash-lite"

def _get_openai_client():
    """Return an OpenAI-compatible client routed through Requesty."""
    requesty_api_key = getattr(settings, "OPENAI_API_KEY", None)
    if not requesty_api_key:
        raise ValueError("OPENAI_API_KEY is required in app settings")
    if OpenAI is None:
        raise ValueError("openai package is not installed. Add it to requirements and install dependencies.")
    return OpenAI(api_key=requesty_api_key, base_url="https://router.requesty.ai/v1")

def _get_gemini_client():
    """Return an OpenAI client pointed at Gemini's OpenAI-compatible endpoint."""
    if OpenAI is None:
        raise ValueError("openai package is not installed.")
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is required")
    return OpenAI(
        api_key=settings.GEMINI_API_KEY,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )


# ---------------------------------------------------------------------------
# System prompts
# ---------------------------------------------------------------------------

CHATBOT_SYSTEM_PROMPTS = {
    "en": (
        "You are the AgriVision Chatbot: a friendly, practical agricultural expert for farmers. "
        "Always give answers in clean, easy-to-read Markdown. "
        "Formatting rules: "
        "(1) start with a 1-line direct answer, "
        "(2) then short sections with headings, "
        "(3) use concise bullets/checklists, "
        "(4) keep paragraphs to 1-2 lines, "
        "(5) add relevant emojis sparingly (max 3 total), "
        "(6) avoid walls of text and jargon. "
        "If image is provided, include a brief visual-observation section before recommendations. "
        "When useful, provide a practical action plan (today/this week)."
    ),
    "hi": (
        "Aap AgriVision Chatbot hain: kisanon ke liye ek friendly aur practical krishi visheshagya. "
        "Har jawab saaf aur padhne mein aasan Markdown mein dein. "
        "Format niyam: "
        "(1) shuru mein 1 line ka seedha jawab, "
        "(2) phir chhote section aur heading, "
        "(3) sankshipt bullet/checklist, "
        "(4) paragraph 1-2 line se zyada na ho, "
        "(5) sirf relevant emoji ka simit istemal (max 3), "
        "(6) lamba, bhaari aur technical jargon wala text na dein. "
        "Agar image mile to recommendation se pehle chhota visual observation section dein. "
        "Jab upyogi ho tab practical action plan (aaj/is hafte) dein."
    ),
    "mr": (
        "Tumhi AgriVision Chatbot aahat: shetkaryansathi upayogi, practical krushi margadarshak. "
        "Pratyek uttar swachh ani vachnyas soplya Markdown madhye dya. "
        "Format niyam: "
        "(1) suruvat 1 linechya direct uttaraney kara, "
        "(2) nantar lahan heading sah section dya, "
        "(3) sankshipt bullets/checklist vapra, "
        "(4) paragraph 1-2 olinchya aat theva, "
        "(5) upyukt emoji maryadit vapra (max 3), "
        "(6) mothya textche bhaag ani avghad jargon tala. "
        "Image asel tar sujhav denya aadhi thodyat visual observation dya. "
        "Garaj asel tar practical action plan (aaj/ya athavdyat) dya."
    ),
    "kn": (
        "Neevu AgriVision Chatbot: raitarige sneha-poorvaka mattu prayojanaka krishi sahayaka. "
        "Prati uttara spashta, odalu sulabha Markdown nalli kodi. "
        "Rachane niyamagaLu: "
        "(1) modalu 1 line direct uttara, "
        "(2) nantara chikka heading saha vibhaaga, "
        "(3) sankshipta bullet/checklist, "
        "(4) paragraph 1-2 salugaLige seemita, "
        "(5) sambandhita emoji maryadita balake (max 3), "
        "(6) doDDa text block mattu kashta jargon tappisi. "
        "Image iddare sujanege modalu chikka visual observation vibhaaga kodi. "
        "Avasyakathe iddare practical action plan (ivattu/ee vaaradalli) kodi."
    ),
}


# ---------------------------------------------------------------------------
# Gemini helpers (via OpenAI-compatible endpoint)
# ---------------------------------------------------------------------------

def _gemini_text(prompt: str, system_instruction: str = None, temperature: float = 0.4) -> str:
    """Call Gemini with a text-only prompt via OpenAI-compatible API."""
    client = _get_gemini_client()
    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
    messages.append({"role": "user", "content": prompt})

    completion = client.chat.completions.create(
        model=GEMINI_MODEL,
        temperature=temperature,
        messages=messages,
    )
    return completion.choices[0].message.content or ""


def _gemini_vision(prompt: str, image_data: bytes, system_instruction: str = None, temperature: float = 0.4) -> str:
    """Call Gemini with an image + text prompt via OpenAI-compatible API."""
    client = _get_gemini_client()
    img_b64 = base64.b64encode(image_data).decode("utf-8")

    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
    messages.append({
        "role": "user",
        "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}},
        ],
    })

    completion = client.chat.completions.create(
        model=GEMINI_MODEL,
        temperature=temperature,
        messages=messages,
    )
    return completion.choices[0].message.content or ""


# ---------------------------------------------------------------------------
# Disease detection
# ---------------------------------------------------------------------------

def detect_disease(image_data: bytes, query: str = ""):
    prompt = (
        "You are an expert agricultural plant-pathology assistant for farmers. Analyze this crop image and provide practical advice. "
        "IMPORTANT OUTPUT STYLE (strict): "
        "\n- Use clean Markdown with clear section headings."
        "\n- Keep response readable and spacious: short paragraphs (1-2 lines), bullet points, and blank lines between sections."
        "\n- Use only a few relevant emojis (max 1 per section), not decorative emoji spam."
        "\n- Avoid long dense text blocks."
        "\n\nREQUIRED SECTIONS (in this order):"
        "\n## 1) 🧾 Quick Diagnosis"
        "\n- Disease name (or likely issue if uncertain)"
        "\n- Confidence: High/Medium/Low"
        "\n- Severity: Mild/Moderate/Severe"
        "\n\n## 2) 🔎 What You Observed"
        "\n- 3-5 key visible symptoms from the image"
        "\n\n## 3) 🌿 Natural / Organic Plan"
        "\n- Ingredients with quantity"
        "\n- Step-by-step use"
        "\n- Frequency and duration"
        "\n\n## 4) 🧪 Chemical / Market Solution"
        "\n- Active ingredient(s) and product type"
        "\n- Practical dose per liter"
        "\n- How and when to spray/apply"
        "\n- Safety precautions"
        "\n\n## 5) ✅ Next 7-Day Action Plan"
        "\n- Day-wise or stage-wise quick checklist"
        "\n\n## 6) 🚨 When To Escalate"
        "\n- Red flags to contact local agriculture officer/lab"
        f"\n\nFarmer query/context: {query}"
        "\n\nRespond only in Markdown and keep language simple for farmers."
    )
    img_b64 = base64.b64encode(image_data).decode("utf-8")
    messages = [{"role": "user", "content": [
        {"type": "text", "text": prompt},
        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}},
    ]}]
    try:
        print("[LLM] detect_disease: trying OpenAI via Requesty...")
        completion = _get_openai_client().chat.completions.create(
            model="openai/gpt-4o-mini", temperature=0.4, messages=messages
        )
        print("[LLM] detect_disease: OpenAI via Requesty succeeded")
        return completion.choices[0].message.content or ""
    except Exception as e:
        print(f"[LLM] detect_disease: OpenAI via Requesty FAILED: {e}")
        traceback.print_exc()
        print("[LLM] detect_disease: falling back to Gemini...")
        return _gemini_vision(prompt, image_data, temperature=0.4)

# ---------------------------------------------------------------------------
# Product extraction
# ---------------------------------------------------------------------------

def extract_agri_products(detection_text: str):
    def _heuristic_product_candidates(text: str):
        """Fallback parser for product suggestions when model output is empty or invalid."""
        candidates, seen = [], set()
        patterns = [
            r"active\s+ingredient\(s\)\s*:\s*(.+)",
            r"product\s+type\s*:\s*(.+)",
            r"recommended\s+products?\s*:\s*(.+)",
        ]
        for line in (text or "").splitlines():
            clean = line.strip(" -*\t")
            if not clean:
                continue
            for pattern in patterns:
                match = re.search(pattern, clean, flags=re.IGNORECASE)
                if not match:
                    continue
                for value in re.split(r",|/|\band\b", match.group(1), flags=re.IGNORECASE):
                    name = value.strip(" .:;-")
                    if len(name) >= 3 and name.lower() not in seen:
                        seen.add(name.lower())
                        candidates.append({"name": name, "category": "other"})
        return candidates[:8]
    prompt = (
        "From the disease analysis below, extract only AGRICULTURAL treatment inputs that a farmer can buy "
        "(fungicides, pesticides, bio-products, micronutrients, plant supplements, soil amendments, etc.). "
        "Prefer active ingredients and practical market search terms. "
        'Return STRICT JSON only with this format: {"products": [{"name": "...", "category": "fungicide|pesticide|bio|nutrient|other"}]}. '
        'Do not include non-agriculture items. If none are present return {"products": []}. '
        f"Analysis: {detection_text}"
    )
    try:
        print("[LLM] extract_agri_products: trying OpenAI via Requesty...")
        completion = _get_openai_client().chat.completions.create(
            model="openai/gpt-4o-mini", temperature=0,
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": prompt}],
        )
        extraction_text = _clean_fenced_json(completion.choices[0].message.content or "")
        parsed = json.loads(extraction_text)
        products = parsed.get("products", []) if isinstance(parsed, dict) else []
        if isinstance(products, list) and products:
            return products
        return _heuristic_product_candidates(detection_text)
    except Exception as e:
        print(f"[LLM] extract_agri_products: OpenAI via Requesty FAILED: {e}")
        traceback.print_exc()
        print("[LLM] extract_agri_products: falling back to Gemini...")
        try:
            extraction_text = _clean_fenced_json(_gemini_text(prompt, temperature=0))
            parsed = json.loads(extraction_text)
            products = parsed.get("products", []) if isinstance(parsed, dict) else []
            return products if isinstance(products, list) and products else _heuristic_product_candidates(detection_text)
        except Exception as fallback_error:
            print(f"[LLM] extract_agri_products: Gemini FAILED: {fallback_error}")
            traceback.print_exc()
            return _heuristic_product_candidates(detection_text)

# ---------------------------------------------------------------------------
# Chatbot
# ---------------------------------------------------------------------------

def chat_bot(query: str, image_data: bytes = None, language: str = "en"):
    system_instruction = CHATBOT_SYSTEM_PROMPTS.get(language, CHATBOT_SYSTEM_PROMPTS["en"])
    content = [{"type": "text", "text": query}]
    if image_data:
        img_b64 = base64.b64encode(image_data).decode("utf-8")
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}})
    try:
        print("[LLM] chat_bot: trying OpenAI via Requesty...")
        completion = _get_openai_client().chat.completions.create(
            model="openai/gpt-4o-mini", temperature=0.7,
            messages=[{"role": "system", "content": system_instruction}, {"role": "user", "content": content}],
        )
        print("[LLM] chat_bot: OpenAI via Requesty succeeded")
        return completion.choices[0].message.content or ""
    except Exception as e:
        print(f"[LLM] chat_bot: OpenAI via Requesty FAILED: {e}")
        traceback.print_exc()
        print("[LLM] chat_bot: falling back to Gemini...")
        if image_data:
            return _gemini_vision(query, image_data, system_instruction=system_instruction, temperature=0.7)
        return _gemini_text(query, system_instruction=system_instruction, temperature=0.7)
