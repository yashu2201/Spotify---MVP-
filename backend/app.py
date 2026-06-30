import os
import json
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai

app = FastAPI(title="Spotify Music Buddy API")

frontend_url = os.environ.get("FRONTEND_URL", "https://spotify-mvp-wheat.vercel.app")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = (os.environ.get("GEMINI_API_KEY") or os.environ.get("OPENAI_API_KEY") or os.environ.get("LLM_API_KEY") or "dummy_key").strip()
genai.configure(api_key=api_key)

SYSTEM_PROMPT = """
You are Music Buddy, an AI music discovery assistant. Your job is to recommend
real, existing songs based on the user's natural-language request.

Rules:
1. Return exactly 10 recommendations unless the user asks for a different number (max 15).
2. Each recommendation must be a real artist and track that exists in mainstream music catalogs.
3. Write exactly ONE sentence per reason — specific, honest, and tied to the user's words.
   Reference their stated mood, reference artists, or constraints explicitly.
4. When the user asks for novelty ("never heard," "nothing famous," "emerging"), bias toward
   lesser-known artists while staying truthful — do not invent fake songs or artists.
5. Respect negation ("no pop," "less sad") and refinement instructions from conversation history.
6. Do not repeat tracks already listed in PREVIOUS_RECOMMENDATIONS unless the user asks to keep them.
7. Output ONLY valid JSON matching the schema below. No markdown, no commentary outside JSON.

Response schema:
{
  "recommendations": [
    { "artist": "string", "track": "string", "reason": "string" }
  ],
  "assistantSummary": "string — one friendly line summarizing what you picked"
}

Examples:

Example A — Initial discovery:
User: I love Phoebe Bridgers but I'm bored of her. Sad quiet vibe, nothing famous.
Assistant JSON: {
  "recommendations": [
    {
      "artist": "Lomelda",
      "track": "Sunshine",
      "reason": "Quiet, confessional folk with the same intimate, whispered vocals you love in Phoebe, but she's far less mainstream so this is likely new to you."
    }
  ],
  "assistantSummary": "Here are 10 whisper-soft, under-the-radar picks in Phoebe's emotional lane."
}
"""

class RecommendRequest(BaseModel):
    message: str = Field(..., min_length=3, max_length=2000)

@app.post("/recommend")
def recommend_music(req: RecommendRequest):
    start = time.time()
    try:
        model = genai.GenerativeModel(
            model_name=os.environ.get("LLM_MODEL", "gemini-1.5-flash"),
            system_instruction=SYSTEM_PROMPT
        )
        response = model.generate_content(
            req.message,
            generation_config={"response_mime_type": "application/json", "temperature": 0.7}
        )
        
        raw_content = response.text
        parsed = json.loads(raw_content)
        
        latency_ms = int((time.time() - start) * 1000)
        
        return {
            "recommendations": parsed.get("recommendations", []),
            "assistantSummary": parsed.get("assistantSummary", ""),
            "meta": {
                "resolved": len(parsed.get("recommendations", [])),
                "dropped": 0,
                "latencyMs": latency_ms
            }
        }
    except Exception as e:
        print(f"Recommend API Error: {e}")
        raise HTTPException(status_code=502, detail=f"Error details: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Spotify Music Buddy API! The backend is running successfully."}

@app.get("/debug-key")
def debug_key():
    key = (os.environ.get("GEMINI_API_KEY") or os.environ.get("OPENAI_API_KEY") or os.environ.get("LLM_API_KEY") or "dummy_key").strip()
    safe_preview = key[:4] + "***" + key[-4:] if len(key) > 8 else key
    return {
        "key_preview": safe_preview,
        "key_length": len(key),
        "is_valid_format": key.startswith("AIza")
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
