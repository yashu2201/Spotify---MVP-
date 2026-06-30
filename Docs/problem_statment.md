## 1. Problem Statment:
You are a Product Manager on the Growth Team at Spotify.
The company has successfully acquired millions of users and built one of the world's most sophisticated recommendation systems. However, a significant percentage of listening still comes from repeat playlists, familiar artists, previously discovered tracks.
One of your company’s strategic goals is to increase meaningful music discovery and reduce repetitive listening behavior.
## 2. Objective:
 Build an AI-Native MVP
Based on your insights, design and build a functional MVP.
The MVP may take the form of a prototype for a feature within the existing product or an agent. You need to deploy these to production.
The MVP must demonstrate why AI is uniquely suited to solving this problem.
You should clearly explain:
•	Why traditional recommendation systems are insufficient
•	What AI unlocks that was previously difficult
•	How AI changes the user experience
## 3. The problem, defined precisely

> A significant share of listening comes from **repeat behavior** (repeat playlists, familiar artists, previously discovered tracks). The strategic goal is to **increase meaningful music discovery and reduce repetitive listening.**

### 3.1 The "Comfort Trap" (background)
Spotify's algorithms are excellent at *reinforcement*. Surfaces like Discover Weekly, Release Radar, and the AI DJ reliably find music adjacent to known taste. The paradox: they are so good at predicting what a user will like that they have made **passive, comfortable consumption the path of least resistance.** Three mechanics deepen the trap:

- **Discovery is a weekly *event*, not a daily *habit*.** Many users "check Discover Weekly on Monday" rather than discovering continuously.
- **Low-intent listening dominates.** Most listening hours happen during work, exercise, commuting, and chores, where users prioritize *flow* and *familiarity* and the perceived cost of a bad recommendation interrupting them is high.
- **The "Liked Songs" black hole.** A user's Liked Songs / favorite playlists are a treasure chest *and* a behavioral trap: the zero-cognitive-load default that crowds out exploration.

### 3.2 The core problem: **Discovery Friction**
**Discovery Friction** = the cognitive, emotional, and temporal cost of finding *and adopting* new music exceeds the immediate reward of a known favorite. It shows up as:

- **Cognitive load** — "What should I listen to?" is taxing; users pick the easiest answer.
- **Fear of the vibe-killer** — for a dinner party or focus session, the social/emotional cost of one bad track is high, so users won't risk the unknown.
- **The "evaluation tax"** — new songs usually need several listens to move from *unfamiliar* → *enjoyable*; users rarely invest that unless the hook is immediate (mere-exposure effect, see §6).

### 3.3 Defining the two operative terms (so metrics are unambiguous)

**Repetitive listening.** A user's **repeat ratio** = share of listening time/streams over a window coming from content already in their established rotation (e.g., top-N tracks/artists, or tracks first played > X days ago and replayed without recent novelty). *High repeat ratio is normal and often healthy.* It becomes a *problem signal* only when paired with evidence of unmet exploration intent (searching "new music," skipping through autoplay looking for something fresh, dwelling on discovery surfaces without converting, stated boredom).

**Meaningful discovery (the crux).** A discovery is *meaningful* when a user (a) encounters a track or artist **not previously in their rotation**, AND (b) subsequently shows **durable adoption** within a window — re-listen within N days, save/like, add to a personal playlist, or follow the artist. The deepest unit of success is a **new artist entering rotation**, which is stickier than a single viral track.

### 3.4 Jobs-To-Be-Done frame
- **When I'm bored of my music,** I want to find something new that excites me, **so I can feel refreshed and engaged again.**
- **When I want to focus/work out/wind down,** I want audio that matches my energy without distracting me, **so I can stay in flow.** *(This job often conflicts with discovery — context-awareness is essential.)*
- **When I'm setting a mood for others** (party, date, shared space), I want music that's reliably good, **so I'm not embarrassed by a bad track.** *(High stakes → low risk tolerance for novelty.)*
## 5. How discovery works today (so we build on it, not reinvent it) (✅)

### 5.1 The recommendation engine (briefly)
Spotify's personalization combines three signal families: **collaborative filtering** (listeners like you), **content/audio analysis** (how a track actually sounds), and **NLP** on text about music (descriptions, playlist titles, editorial, cultural context). 2026 reporting indicates the system increasingly weights **save rate and repeat-listen ratio far above raw stream volume** when deciding what to surface in flagship playlists — i.e., it already optimizes for *durable* engagement, not just plays.

### 5.2 Surface inventory (where discovery can or does happen)
Any new work must *complement* these, not duplicate them.

- **Discover Weekly** — Monday personalized playlist of new-to-you tracks; ~30 tracks, now refreshable by up to ~5 genres. The canonical "lean-back" discovery ritual.
- **Release Radar** — Friday playlist of new releases from followed/related artists. Skews to known artists' new work.
- **Daily Mixes** — genre/mood-clustered mixes blending familiar + adjacent.
- **Daylist** — mood-and-time playlist refreshing multiple times a day; strong for contextual, lightly-novel listening.
- **AI DJ** — AI-curated, voice-narrated session (50+ markets) with voice steering ("play more emerging indie"). *Note: critics find it less adventurous than Discover Weekly — tuned for comfortable variety, not deep discovery.*
- **Smart Shuffle** — injects recommended tracks into a user's existing playlists ("discovery in the flow of repeat").
- **Prompted Playlist** *(beta; US, CA, UK, IE, AU, SE, NZ)* — natural-language playlist generation ("fresh tracks and emerging artists only," "songs I love but haven't played this year"). Puts discovery *control* in the user's words.
- **Blend** — shared playlist merging two users' tastes; social discovery vector.