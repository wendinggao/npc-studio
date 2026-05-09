## CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

The Next.js app is scaffolded and runs end-to-end (Phase 1 complete). The product spec and course materials still live alongside the code:

- [NPC_Studio_PRD.md](NPC_Studio_PRD.md) — the authoritative spec (Chinese). Read this before changing product behavior; if code and PRD disagree, fix the code or amend the PRD's §18 with a dated note.
- Four LIF001 course PDFs (handbook, themes, two assessment task sheets) — context, not requirements.
- [app/](app/), [components/](components/), [lib/](lib/) — implementation. Stack: Next.js 14 App Router + TypeScript, Tailwind, Zustand with `localStorage` persistence, Anthropic SDK with SSE streaming. No backend database (PRD §16).

## Common commands

```bash
npm run dev        # local dev server at :3000
npm run build      # production build (also runs lint + typecheck)
npm run typecheck  # tsc --noEmit (faster feedback than build)
npm run lint       # next lint
```

Node was installed via `brew install node@20` and is keg-only, so `node` is on PATH only after `export PATH="/opt/homebrew/opt/node@20/bin:$PATH"` (or after `brew link --force node@20`). The dev server requires `ANTHROPIC_API_KEY` in `.env.local` for the chat path; pages render without it.

## Project context

LIF001 Group D30 Assessment 2 — a web app called **NPC Studio** that demos four NPC-design principles from the team's Semester 1 research. Hard deadline: **2026-05-15 23:59**, submitted as a Vercel URL plus a 5–8 minute video. Marker should grasp the value within seconds of opening the link.

PRD is in Chinese; **all shipped UI copy must be English** (§14 splits "NPC 内容设计" and "场景与文案" specifically to handle EN translation). NPC system prompts are written in English (§6).

## Core architecture (read before implementing the chat path)

The product's "intelligence" is concentrated in **one pure function** at [lib/prompt-builder.ts](lib/prompt-builder.ts), described in §8 of the PRD:

```
buildPrompt(npc, userConfig) -> { systemPrompt, temperature, maxTokens, activeRules[] }
```

This function is the IP. It is human-written, auditable, and must NOT be replaced by "let the model figure it out." It assembles the system prompt in **6 ordered layers**:

1. NPC personality core (from §6 NPC library)
2. Behavioral rule lock — main / side / ambient (from user config)
3. Refusal override (from user toggle; auto-off when role = main quest)
4. Emotion intensity directive — low/medium/high (from user slider)
5. Ethics safeguards (only when ethics mode on)
6. Worldview anchor (from §6)

Call parameters move with the emotion tier: temperature 0.3 / 0.6 / 0.85 and max tokens ~160 / ~320 / ~480 for low / medium / high. The point is that users **feel** the difference — short+flat vs. long+rich — within ~10 seconds of changing a control (§2.2).

### Transparency is a feature, not a debug aid

Every chat response surfaces the active rule list AND the assembled system prompt to the right-hand "behavior log" panel ([components/studio/BehaviorLog.tsx](components/studio/BehaviorLog.tsx); §5.2 right column, §8 transparency). Most AI products hide their system prompt; deliberately exposing it is one of the listed innovation points (§2.3). Don't accidentally remove this when refactoring.

### Streaming + state shape

Per §11.1: [app/api/chat/route.ts](app/api/chat/route.ts) builds the prompt, **first** emits the active-rules event, **then** streams model tokens via SSE. The client at [lib/sse-client.ts](lib/sse-client.ts) parses the stream; [components/studio/Chat.tsx](components/studio/Chat.tsx) appends tokens to the active NPC bubble. State + history live in [lib/store.ts](lib/store.ts) (Zustand `persist` → `localStorage`). There is **no backend database** (§16).

### Share-link encoding

`(npcId + config)` is base64url-encoded into `location.hash` ([lib/share-codec.ts](lib/share-codec.ts)), so it never hits server logs. [app/studio/StudioClient.tsx](app/studio/StudioClient.tsx) restores config from the hash on mount, then strips it.

### Session timer

`sessionSeconds` accumulates only while the tab is visible and persists across reloads via Zustand. It triggers a wellbeing modal at **15 minutes**; "5 more minutes" sets the next prompt to **10 minutes** from snooze time, **not zero** (PRD §11.3). The math is in [app/studio/StudioClient.tsx](app/studio/StudioClient.tsx) — the threshold is `lastWellbeingPromptAt + SNOOZE_INTERVAL`, not `sessionSeconds = 0`. Don't "simplify" this.

## Hard scope rules

§16 lists features that are **explicitly out of scope** for the 12-day timeline. Do not add them even if they seem natural:

- No login / accounts
- No backend database (localStorage only)
- No voice I/O, no 3D/VR
- No multi-NPC group chat
- No server-side history persistence
- No payments / paywall / ads

If asked to build something on this list, surface §16 first and ask for confirmation before proceeding.

## Working conventions

- The PRD is the source of truth. When code and PRD disagree, fix the code or amend the PRD with a dated note in §18 — don't silently drift.
- Acceptance is the §15 checklist. A change that breaks any checked item is a regression.
- API keys live in Vercel env vars only — never in client bundles, never in git (§12.2).
- Anthropic Claude Sonnet is the primary model; DeepSeek is the documented fallback for China access (§9, §12.3, §17). Keep the model adapter swappable.
