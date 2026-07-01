import os
import json
import time
from typing import List, Optional

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai

# Load a local .env file when present (no-op in production where vars are set in the dashboard)
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

app = FastAPI(title="Music Buddy API")

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

# How many candidates we ask the LLM for, and how many we ultimately show.
# We ask for a couple extra as a buffer for cross-turn de-duplication.
DESIRED_COUNT = 10
CANDIDATE_COUNT = 12

SYSTEM_PROMPT = f"""
You are Music Buddy, an AI music discovery assistant. Your job is to recommend
real, existing songs based on the user's natural-language request.

Rules:
1. Return {CANDIDATE_COUNT} recommendations (we display about {DESIRED_COUNT}; the extras cover
   de-duplication across turns). If the user asks for a specific number N, return N+2.
2. Each recommendation must be a real artist and track that exists in mainstream music catalogs.
3. Write exactly ONE sentence per reason — specific, honest, and tied to the user's words.
   Reference their stated mood, reference artists, or constraints explicitly.
4. When the user asks for novelty ("never heard," "nothing famous," "emerging"), bias toward
   lesser-known artists while staying truthful — do not invent fake songs or artists.
5. Respect negation ("no pop," "less sad") and refinement instructions from conversation history.
6. Do not repeat tracks already listed in PREVIOUS_RECOMMENDATIONS unless the user asks to keep them.
7. Set "mood" to the SINGLE best-fitting vibe of the request from EXACTLY this list:
   calm, sad, energetic, focus, happy, romantic, dark, dreamy.
8. Output ONLY valid JSON matching the schema below. No markdown, no commentary outside JSON.

Response schema:
{{
  "recommendations": [
    {{ "artist": "string", "track": "string", "reason": "string" }}
  ],
  "assistantSummary": "string — one friendly line summarizing what you picked",
  "mood": "one of: calm, sad, energetic, focus, happy, romantic, dark, dreamy"
}}

Examples:

Example A — Initial discovery:
User: I love Phoebe Bridgers but I'm bored of her. Sad quiet vibe, nothing famous.
Assistant JSON: {{
  "recommendations": [
    {{
      "artist": "Lomelda",
      "track": "Sunshine",
      "reason": "Quiet, confessional folk with the same intimate, whispered vocals you love in Phoebe, but she's far less mainstream so this is likely new to you."
    }}
  ],
  "assistantSummary": "Here are some whisper-soft, under-the-radar picks in Phoebe's emotional lane."
}}
"""


# ---------------------------------------------------------------------------
# Metadata enrichment via the iTunes Search API (free, no API key / account).
# Chosen over Deezer because Deezer withholds results from datacenter IPs
# (e.g. Render), whereas iTunes works reliably from any host.
# ---------------------------------------------------------------------------

ITUNES_SEARCH_URL = "https://itunes.apple.com/search"

# Simple in-memory cache so repeated artists/tracks (e.g. across refinement turns)
# don't re-hit iTunes — also helps stay under iTunes' ~20 requests/minute limit.
_search_cache: dict = {}
_CACHE_TTL = 24 * 60 * 60  # 24h


def _best_match(items: List[dict], artist: str, track: str) -> Optional[dict]:
    """Score iTunes search results and return the best one if it clears a confidence bar."""
    a_low, t_low = artist.lower().strip(), track.lower().strip()
    best, best_score = None, 0.0
    for it in items:
        name = (it.get("artistName") or "").lower()
        title = (it.get("trackName") or "").lower()
        score = 0.0
        if name == a_low:
            score += 3
        elif a_low and (a_low in name or name in a_low):
            score += 1
        if title == t_low:
            score += 3
        elif t_low and (t_low in title or title in t_low):
            score += 1
        if score > best_score:
            best, best_score = it, score
    # Require a real signal on both artist and track (>= 4 total).
    return best if best_score >= 4 else None


def _upscale_art(url: Optional[str]) -> Optional[str]:
    """iTunes returns 100x100 art; request a larger version."""
    if not url:
        return None
    return url.replace("100x100bb", "600x600bb")


def resolve_track(artist: str, track: str) -> Optional[dict]:
    """Search iTunes for an LLM-suggested song and return its album art + canonical names.

    Returns None when iTunes has no confident match — note this does NOT prove the song
    is fake (the iTunes Store index has real gaps), so callers keep unmatched songs and
    just show a placeholder. Raises on network failure so the caller can log it.
    """
    cache_key = f"{artist.lower().strip()}|{track.lower().strip()}"
    cached = _search_cache.get(cache_key)
    if cached and time.time() - cached[1] < _CACHE_TTL:
        return cached[0]

    resp = requests.get(
        ITUNES_SEARCH_URL,
        params={"term": f"{artist} {track}", "media": "music", "entity": "song", "limit": 10},
        headers={"User-Agent": "MusicBuddy/1.0"},
        timeout=8,
    )
    resp.raise_for_status()
    items = resp.json().get("results", [])

    best = _best_match(items, artist, track)
    result = None
    if best:
        release = best.get("releaseDate") or ""
        result = {
            "artist": best.get("artistName", artist),
            "track": best.get("trackName", track),
            "albumArtUrl": _upscale_art(best.get("artworkUrl100")),
            "albumName": best.get("collectionName"),
            "year": release[:4] if len(release) >= 4 else None,
        }
    _search_cache[cache_key] = (result, time.time())  # cache hits AND misses
    return result


# ---------------------------------------------------------------------------
# Second-opinion existence check via MusicBrainz (the near-complete open music
# database). Used only for songs iTunes can't match, so we can safely DROP true
# hallucinations without falsely dropping real songs that iTunes simply lacks.
# ---------------------------------------------------------------------------

MUSICBRAINZ_URL = "https://musicbrainz.org/ws/2/recording"
# MusicBrainz requires a descriptive User-Agent with contact info.
_MB_USER_AGENT = "MusicBuddy/1.0 ( https://github.com/music-buddy )"
_mb_cache: dict = {}
_mb_last_call = [0.0]  # mutable holder for simple rate-limiting (1 req/sec)


def _mb_throttle():
    """MusicBrainz allows ~1 request/second; space calls out accordingly."""
    elapsed = time.time() - _mb_last_call[0]
    if elapsed < 1.1:
        time.sleep(1.1 - elapsed)
    _mb_last_call[0] = time.time()


def _mb_match(recs: List[dict], artist: str, track: str) -> bool:
    a_low, t_low = artist.lower().strip(), track.lower().strip()
    for r in recs:
        title = (r.get("title") or "").lower()
        credits = r.get("artist-credit") or []
        names = " ".join((c.get("name") or "") for c in credits).lower()
        artist_ok = bool(a_low) and (a_low in names)
        title_ok = bool(t_low) and (t_low == title or t_low in title or title in t_low)
        if artist_ok and title_ok:
            return True
    return False


def exists_on_musicbrainz(artist: str, track: str) -> bool:
    """Return True if MusicBrainz has a recording matching this artist + track.

    Returns True on any network error too — we never drop a song just because the
    existence check was unavailable (benefit of the doubt).
    """
    key = f"{artist.lower().strip()}|{track.lower().strip()}"
    if key in _mb_cache:
        return _mb_cache[key]

    a = artist.replace('"', "").strip()
    t = track.replace('"', "").strip()
    query = f'artist:"{a}" AND recording:"{t}"'
    try:
        _mb_throttle()
        resp = requests.get(
            MUSICBRAINZ_URL,
            params={"query": query, "fmt": "json", "limit": 5},
            headers={"User-Agent": _MB_USER_AGENT},
            timeout=10,
        )
        resp.raise_for_status()
        recs = resp.json().get("recordings", [])
    except Exception as e:
        print(f"MusicBrainz error for '{artist} - {track}': {e}")
        return True  # don't drop on outage

    found = _mb_match(recs, artist, track)
    _mb_cache[key] = found
    return found


def enrich_recommendations(candidates: List[dict], prior_keys: set):
    """Attach real iTunes album art, verify existence, and drop true hallucinations.

    For each song:
      - iTunes confident match  -> keep with real album art + canonical names
      - iTunes miss, MB confirms -> keep (real song) with a placeholder
      - iTunes miss, MB also miss -> drop (almost certainly a hallucination)
    De-duplicates against songs already shown this conversation.
    Returns (recommendations, dropped_count).
    """
    out = []
    dropped = 0
    for c in candidates:
        if len(out) >= DESIRED_COUNT:
            break
        llm_key = f"{c['artist'].lower().strip()}|{c['track'].lower().strip()}"
        if llm_key in prior_keys:
            continue

        meta = None
        try:
            meta = resolve_track(c["artist"], c["track"])
        except Exception as e:
            print(f"iTunes search error for '{c['artist']} - {c['track']}': {e}")

        if meta:
            key = f"{meta['artist'].lower().strip()}|{meta['track'].lower().strip()}"
            if key in prior_keys:
                continue
            prior_keys.add(key)
            prior_keys.add(llm_key)
            out.append({
                "artist": meta["artist"],
                "track": meta["track"],
                "reason": c["reason"],
                "albumArtUrl": meta.get("albumArtUrl"),
                "albumName": meta.get("albumName"),
                "year": meta.get("year"),
            })
        elif exists_on_musicbrainz(c["artist"], c["track"]):
            # Real song that iTunes just doesn't index — keep it with a placeholder.
            prior_keys.add(llm_key)
            out.append({"artist": c["artist"], "track": c["track"], "reason": c["reason"]})
        else:
            # Neither catalog knows it -> drop as a likely hallucination.
            dropped += 1

    return out, dropped


# ---------------------------------------------------------------------------
# Request / response models
# ---------------------------------------------------------------------------

class HistoryMessage(BaseModel):
    role: str
    content: str


class RecommendRequest(BaseModel):
    message: str = Field(..., min_length=3, max_length=2000)
    history: Optional[List[HistoryMessage]] = None
    priorTrackKeys: Optional[List[str]] = None


def _build_contents(req: RecommendRequest) -> list:
    """Build Gemini `contents` (multi-turn) from history + the new user message."""
    contents = []
    for h in (req.history or [])[-10:]:
        role = "user" if h.role == "user" else "model"
        contents.append({"role": role, "parts": [h.content]})

    user_text = req.message
    if req.priorTrackKeys:
        dedupe_block = "\n".join(req.priorTrackKeys[:150])
        user_text += (
            "\n\nPREVIOUS_RECOMMENDATIONS (do NOT repeat these unless I explicitly ask):\n"
            + dedupe_block
        )
    contents.append({"role": "user", "parts": [user_text]})
    return contents


@app.post("/recommend")
def recommend_music(req: RecommendRequest):
    start = time.time()
    try:
        model_name = os.environ.get("LLM_MODEL", "gemini-2.5-flash")
        # Ignore stale OpenAI/Groq model names left in old env vars.
        if any(x in model_name.lower() for x in ("llama", "gpt", "mixtral", "1.5")):
            model_name = "gemini-2.5-flash"

        model = genai.GenerativeModel(model_name=model_name, system_instruction=SYSTEM_PROMPT)
        response = model.generate_content(
            _build_contents(req),
            generation_config={"response_mime_type": "application/json", "temperature": 0.7},
        )

        raw_content = (response.text or "").strip()
        # Strip stray markdown fences just in case.
        if raw_content.startswith("```"):
            raw_content = raw_content.strip("`")
            if raw_content.lower().startswith("json"):
                raw_content = raw_content[4:]
        parsed = json.loads(raw_content)

        candidates = [
            c for c in parsed.get("recommendations", [])
            if isinstance(c, dict) and c.get("artist") and c.get("track")
        ]
        prior_keys = set(k.lower().strip() for k in (req.priorTrackKeys or []))

        recommendations, dropped = enrich_recommendations(candidates, prior_keys)
        latency_ms = int((time.time() - start) * 1000)
        with_art = sum(1 for r in recommendations if r.get("albumArtUrl"))

        allowed_moods = {"calm", "sad", "energetic", "focus", "happy", "romantic", "dark", "dreamy"}
        mood = str(parsed.get("mood", "")).lower().strip()
        if mood not in allowed_moods:
            mood = "calm"

        return {
            "recommendations": recommendations,
            "assistantSummary": parsed.get("assistantSummary", ""),
            "mood": mood,
            "meta": {
                "resolved": with_art,
                "dropped": dropped,
                "latencyMs": latency_ms,
            },
        }
    except Exception as e:
        print(f"Recommend API Error: {e}")
        raise HTTPException(status_code=502, detail=f"Error details: {str(e)}")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Music Buddy API! The backend is running successfully."}


@app.get("/health")
def health_check():
    return {"status": "ok", "metadata_provider": "itunes"}
