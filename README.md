# Music Buddy

AI-native music discovery MVP — a conversational web app where you describe what you're looking for in natural language and receive explainable song recommendations.

## Live demo

_Coming in Phase 4._

## Architecture

See [Docs/architecture.md](./Docs/architecture.md) and [Docs/phases/phase-0-foundation.md](./Docs/phases/phase-0-foundation.md).

## Prerequisites

- Node.js 20+
- npm 10+
- OpenAI API key (Phase 1+)
- Spotify Developer credentials (Phase 2 metadata enrichment; optional in Phase 0 validation)

## Local setup

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd "Graduation Project 2"
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

5. Verify the health endpoint:

   ```bash
   curl http://localhost:3000/api/health
   ```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `LLM_PROVIDER` | Phase 1 | LLM provider (`openai`) |
| `LLM_API_KEY` | Phase 1 | API key for the LLM provider |
| `LLM_MODEL` | Phase 1 | Model name (default: `gpt-4o-mini`) |
| `SPOTIFY_CLIENT_ID` | Phase 2 | Spotify app client ID (metadata only) |
| `SPOTIFY_CLIENT_SECRET` | Phase 2 | Spotify app client secret |
| `NEXT_PUBLIC_APP_NAME` | No | Display name (default: Music Buddy) |

## Validation scripts (Phase 0)

After configuring `.env.local`:

```bash
npm run validate:llm
npm run validate:spotify
```

- `validate:llm` — confirms LLM returns JSON matching the locked prompt schema
- `validate:spotify` — confirms Client Credentials token + track search (album art metadata)

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler (no emit) |
| `npm run validate:llm` | Validate LLM API connectivity |
| `npm run validate:spotify` | Validate Spotify metadata API |

## MVP scope notes

- Explainability-first discovery via natural language
- No "Open in Spotify" links or in-app playback in MVP
- Spotify API used server-side for album art only (Phase 2)

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API
- Zod (LLM response validation)

## Project structure

```
src/
├── app/
│   ├── api/health/route.ts   # Health check
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/llm/
│   ├── client.ts               # LLM client (Phase 1)
│   ├── prompts.ts              # System prompt v1
│   └── parse-response.ts       # Zod validation
└── types/
    ├── recommendation.ts       # LLM schemas
    └── api.ts                  # API contracts
```

## Phase status

- [x] Phase 0 — Foundation
- [ ] Phase 1 — Core MVP (LLM + UI)
- [ ] Phase 2 — Metadata enrichment
- [ ] Phase 3 — Conversational refinement
- [ ] Phase 4 — Production deployment
- [ ] Phase 5 — Measurement & evaluation
