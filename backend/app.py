import os
import json
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import OpenAI

app = FastAPI(title="Spotify Music Buddy API")

# Allow requests from the Next.js frontend (Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("LLM_API_KEY") or "dummy_key"
client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
)

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
    
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": req.message}
    ]

    try:
        completion = client.chat.completions.create(
            model=os.environ.get("LLM_MODEL", "llama-3.1-8b-instant"),
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=2000,
            timeout=30.0
        )
        
        raw_content = completion.choices[0].message.content
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

@app.get("/health")
def health_check():
    return {"status": "ok"}
