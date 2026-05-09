# NPC Studio

> LIF001 Group D30 — Assessment 2 product. A web app that turns the four NPC-design principles from our Semester 1 research into interactive controls. Pick an NPC, set role tier, emotion intensity, and ethics safeguards, then chat with the result and feel the difference within seconds.

The product spec lives in [NPC_Studio_PRD.md](NPC_Studio_PRD.md). Architecture and design rationale are documented for AI tools and humans alike in [CLAUDE.md](CLAUDE.md).

---

## Quick start (5 minutes)

You need **Node.js 20+**, **git**, and an API key from one supported provider. We recommend **DeepSeek** — RMB billing, fast in mainland China, and reliably keeps the NPC in character.

### 1. Install Node.js 20

| OS | Command |
|---|---|
| **macOS** (Homebrew) | `brew install node@20` then `echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc` |
| **Windows** | Download the v20 LTS `.msi` from <https://nodejs.org/> and run the installer |
| **Linux** (Debian/Ubuntu) | `curl -fsSL https://deb.nodesource.com/setup_20.x \| sudo -E bash - && sudo apt install -y nodejs` |

Verify: `node -v` should print `v20.x`.

### 2. Get a DeepSeek API key

1. Register at <https://platform.deepseek.com/> with your phone number.
2. Top up at least ¥10 (more than enough for a 12-day demo cycle — `deepseek-chat` is roughly ¥1 / 1M input tokens, ¥2 / 1M output).
3. **API Keys → Create new** → copy the `sk-...` string.

> **Each teammate should generate their own key.** Don't share one key across the team — DeepSeek rate-limits per key and rotating one shared key when somebody leaks it is painful.

### 3. Clone and install

```bash
git clone https://github.com/wendinggao/npc-studio.git
cd npc-studio
npm install
```

### 4. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and replace the placeholder with the four lines below:

```bash
MODEL_PROVIDER=openai
OPENAI_API_KEY=sk-your-real-deepseek-key-here
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

`.env.local` is gitignored — it never gets committed.

### 5. Run

```bash
npm run dev
```

Open <http://localhost:3000>, click **Try the Studio**, send a message. You should see a streaming reply from Marlow within a couple of seconds, with the six active rule chips appearing on the right.

### 6. (Optional) Make your own NPC

The 10 built-in NPCs are joined by an open-ended slot for your own characters — useful for trying the prompt builder against personas you wrote yourself, and a strong moment for the Assessment 2 demo video.

1. In the left sidebar, click **+ New** above the NPC list.
2. Fill in the seven fields. The **Persona** field is the one that actually drives the LLM — write it in second person ("You are…"), keep it concrete, and make sure to include a "you never break character" line. The placeholder shows the recommended template.
3. Click **Create NPC** — you'll be switched to the new character automatically. Send a message and watch the same six rule chips light up on the right; the architecture treats your custom NPC exactly like a built-in one.
4. To edit later, hover any NPC with the ✨ icon and click the pencil. The same modal lets you delete (with a confirmation that also clears its chat history).
5. The **Share** button in the top bar embeds the full NPC body into the URL hash when the active NPC is custom — anyone who opens the link will auto-import it into their own local list.

User-created NPCs live in `localStorage`. Clearing your browser data wipes them; nothing leaves your machine until you click Share.

---

## Switching providers

Three providers are wired in. Pick one by editing `MODEL_PROVIDER` in `.env.local` — the code path stays the same. **Restart `npm run dev` after changing the env file** (Fast Refresh does not reload `.env`).

### DeepSeek (recommended for mainland China)

```bash
MODEL_PROVIDER=openai
OPENAI_API_KEY=sk-your-deepseek-key
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

### Anthropic Claude (highest quality, requires international payment)

```bash
MODEL_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-key
# ANTHROPIC_MODEL=claude-sonnet-4-6  # optional override
```

If your machine sits behind an HTTP proxy (e.g. Clash on `127.0.0.1:7890`), the Anthropic SDK will pick it up automatically as long as `HTTPS_PROXY` is exported in your shell.

### OpenRouter (transparent multi-model gateway)

```bash
MODEL_PROVIDER=openai
OPENAI_API_KEY=sk-or-your-openrouter-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=anthropic/claude-sonnet-4-5
```

> **Don't use `aicanapi.com`-style "Anthropic-compatible" proxies that ship with their own assistant persona.** They inject thousands of tokens of override instructions and break in-character role-play. We hit this in development; see the discussion in PRD §17.

---

## Common gotchas

| Problem | Likely cause | Fix |
|---|---|---|
| `command not found: node` | Homebrew's `node@20` is keg-only and isn't in PATH | Run the `export PATH=...` line from step 1, or open a fresh terminal |
| `command not found: brew` after install | Homebrew didn't add itself to PATH | Follow the line printed at the end of `brew install` (it tells you what to add to your shell profile) |
| Page loads but chat returns "Connection error" | API key wrong, or `.env.local` not picked up | Double-check the key, then **stop and restart `npm run dev`** — env vars are only read at process start |
| `npm install` fails with `EACCES` on Windows | Permission issue | Open PowerShell **as administrator** and retry, or use Git Bash |
| Marlow breaks character mid-conversation | You are using a non-transparent proxy | Switch `MODEL_PROVIDER` to a real provider (DeepSeek / Anthropic / OpenRouter) |
| Studio page shows infinite-loop error | Stale browser bundle | Hard reload with `Cmd + Shift + R` (macOS) or `Ctrl + Shift + R` (Windows / Linux) |

---

## Project layout

The product's "intelligence" is a single human-written pure function. Everything else is a thin shell around it.

| File | Purpose |
|---|---|
| [lib/prompt-builder.ts](lib/prompt-builder.ts) | **The IP** — `(npc, config) → systemPrompt + params + activeRules`. Six layers, ordered: persona → behavioral lock → refusal → emotion → ethics → world (PRD §8). |
| [lib/npcs.ts](lib/npcs.ts) | The 10 preset NPCs (PRD §6). English personas. |
| [lib/scenarios.ts](lib/scenarios.ts) | The 8 starter scenarios (PRD §7). |
| [lib/store.ts](lib/store.ts) | Zustand store + `localStorage` persistence — chat history per NPC, session timer, wellbeing snooze state. |
| [lib/model-adapter.ts](lib/model-adapter.ts) | Provider dispatch — Anthropic SDK or OpenAI-compatible (DeepSeek / OpenRouter). |
| [app/api/chat/route.ts](app/api/chat/route.ts) | SSE streaming endpoint. Emits one `rules` event first, then `token` events, then `done`. |
| [app/studio/StudioClient.tsx](app/studio/StudioClient.tsx) | Three-column Studio page, mobile-collapsible. |
| [app/page.tsx](app/page.tsx) | Landing page. |
| [app/about/page.tsx](app/about/page.tsx) | AI-disclosure / reflection page (PRD §5.3). Update before submission. |

---

## npm scripts

```bash
npm run dev        # local dev server at http://localhost:3000
npm run build      # production build (also runs lint + typecheck)
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit (faster than full build)
npm run lint       # next lint
```

---

## Deploy to Vercel

1. Push your branch to GitHub (already done if you cloned this repo).
2. Sign in to <https://vercel.com/> with your GitHub account and import this repository.
3. In **Project Settings → Environment Variables**, paste the four lines from your `.env.local` (DO NOT commit them to git):
   - `MODEL_PROVIDER`
   - `OPENAI_API_KEY`
   - `OPENAI_BASE_URL`
   - `OPENAI_MODEL`
4. Click **Deploy**. Vercel will give you a `https://npc-studio-…vercel.app` URL — that's the link to put in your video and submit on Learning Mall.

No backend database is required.

---

## Hard scope rules

Per PRD §16, the following features are **explicitly out of scope** and intentionally not built:

- User accounts / login
- Any backend database (`localStorage` only)
- Voice input / output
- 3D / VR rendering
- Multi-NPC group chat
- Server-side conversation persistence
- Payments / paywalls / ads

Don't add these without first re-reading §16 and discussing with the team.

---

## Academic integrity

This is coursework for the LIF001 module. AI-tool usage is fully disclosed on the in-app **About** page ([app/about/page.tsx](app/about/page.tsx)) per the requirements in PRD §5.3. Update that page before submission with the team roster, the AI tools you used, and your honest reflection (suggested length: 200–300 words).
