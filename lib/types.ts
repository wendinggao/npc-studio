// Behavioral lock tier — PRD §3.1.
export type RoleTier = "main" | "side" | "ambient";

// Emotion intensity tier — PRD §3.2.
export type EmotionTier = "low" | "medium" | "high";

// Per-conversation user choices for the active NPC — PRD §5.2 left column.
export type NPCConfig = {
  roleTier: RoleTier;
  emotion: EmotionTier;
  ethicsMode: boolean;
  allowRefusal: boolean;
};

// Static NPC catalog entry — PRD §6.
export type NPC = {
  id: string;
  name: string;
  archetype: string;
  setting: string;
  tags: string[];
  // English persona prompt — used as Layer 1 of the system prompt (PRD §8).
  persona: string;
  // First line the NPC speaks before any user input.
  opener: string;
  // One short sentence anchoring the NPC's world — Layer 6.
  worldAnchor: string;
};

// Starter scenario — PRD §7.
export type Scenario = {
  id: string;
  title: string;
  npcId: string;
  opener: string;
};

// Chat turn stored locally — PRD §11.1 step 8.
export type ChatTurn = {
  id: string;
  role: "user" | "npc";
  content: string;
  ts: number;
};

// One assembled rule, surfaced to the behavior-log panel — PRD §5.2 right column.
export type ActiveRule = {
  layer: 1 | 2 | 3 | 4 | 5 | 6;
  label: string;
  detail: string;
};

// Output of buildPrompt() — PRD §8.
export type BuiltPrompt = {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  activeRules: ActiveRule[];
};

// Wire format for /api/chat request body.
// We send the full NPC object (not just an id) so the server doesn't need its
// own catalog — this is what makes user-created NPCs work end-to-end without
// a backend persistence layer (PRD §16: localStorage only).
export type ChatRequest = {
  npc: NPC;
  config: NPCConfig;
  history: ChatTurn[];
  message: string;
};

// SSE event payloads — emitted in this order: one `rules`, then many `token`, then `done` or `error`.
export type SSERulesEvent = {
  type: "rules";
  rules: ActiveRule[];
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
};

export type SSETokenEvent = { type: "token"; text: string };
export type SSEDoneEvent = { type: "done" };
export type SSEErrorEvent = { type: "error"; message: string };
export type SSEEvent =
  | SSERulesEvent
  | SSETokenEvent
  | SSEDoneEvent
  | SSEErrorEvent;
