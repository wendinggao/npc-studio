# NPC Studio

LIF001 Group D30 — Assessment 2 product. A web app that turns the four NPC-design principles from our Semester 1 research into interactive controls. See [NPC_Studio_PRD.md](NPC_Studio_PRD.md) for the full spec.

## Quick start

```bash
cp .env.example .env.local
# put your real ANTHROPIC_API_KEY into .env.local

npm install
npm run dev
```

Then open <http://localhost:3000>.

## What's where

- [lib/prompt-builder.ts](lib/prompt-builder.ts) — the IP. Pure function: `(npc, config) → systemPrompt + params + activeRules`. Six layers, in order: persona, behavioral lock, refusal override, emotion intensity, ethics safeguards, worldview anchor.
- [lib/npcs.ts](lib/npcs.ts) — the 10 preset NPCs (PRD §6).
- [lib/scenarios.ts](lib/scenarios.ts) — the 8 starter scenarios (PRD §7).
- [lib/store.ts](lib/store.ts) — Zustand store + `localStorage` persistence.
- [app/api/chat/route.ts](app/api/chat/route.ts) — SSE streaming endpoint. Emits `rules` event first, then `token` events.
- [app/studio/page.tsx](app/studio/page.tsx) — the three-column main page.
- [app/page.tsx](app/page.tsx) — landing page.
- [app/about/page.tsx](app/about/page.tsx) — AI-disclosure / reflection page.

## Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Deploy

Push to GitHub, then import on Vercel and set `ANTHROPIC_API_KEY` as an env var in the project settings. No backend database is required.

## Hard scope rules

Per PRD §16, the following are explicitly **out of scope** for this assessment: login/accounts, any backend database, voice I/O, 3D/VR rendering, multi-NPC group chat, server-side history, payments. Don't add these without first re-reading §16.

## License & academic integrity

This is coursework for the LIF001 module. AI-tool usage is fully disclosed on the in-app About page. See PRD §5.3.
