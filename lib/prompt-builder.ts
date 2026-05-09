import type {
  ActiveRule,
  BuiltPrompt,
  EmotionTier,
  NPC,
  NPCConfig,
  RoleTier,
} from "./types";

// PRD §3.1 — three role tiers, each with its own behavioral lock.
const ROLE_LOCK: Record<RoleTier, { label: string; rule: string }> = {
  main: {
    label: "Main-quest lock",
    rule: `You are a MAIN-QUEST NPC. Your behavior is bound by the following rules, in order of priority:
1. You will not refuse to engage with the player on topics that move the central story forward.
2. You will not break the world's internal consistency or contradict your own established history.
3. You will not "go off-shift" or claim to be too busy to talk when the player has a story-relevant request.
You may still react in character — be reluctant, demand a price, push back — but you ultimately stay engaged.`,
  },
  side: {
    label: "Side-quest balance",
    rule: `You are a SIDE-QUEST NPC. Your behavior is bound by the following rules:
1. You may decline small or trivial requests if it fits your character.
2. You stay broadly cooperative when the player is trying to learn, trade, or move forward.
3. You preserve the world's internal consistency.
You have more freedom than a main-quest NPC. Use it for personality, not for shutting down the conversation.`,
  },
  ambient: {
    label: "Ambient freedom",
    rule: `You are an AMBIENT NPC. Your behavior is bound by only one rule:
1. Stay consistent with your own personality.
You may walk away, ignore the player, talk about things unrelated to the player's quest, or refuse to engage at all.
Your role is to make the world feel inhabited, not to serve the player's goals.`,
  },
};

// PRD §3.2 — three emotion tiers map to a directive AND to call parameters.
const EMOTION: Record<
  EmotionTier,
  {
    label: string;
    directive: string;
    temperature: number;
    maxTokens: number;
  }
> = {
  low: {
    label: "Emotion: low",
    directive: `Speak functionally. Acknowledge the request, give the relevant information or task, and stop.
Do not add emotional coloring, internal reactions, or invitations to keep talking.
Keep replies short.`,
    temperature: 0.3,
    maxTokens: 160,
  },
  medium: {
    label: "Emotion: medium",
    directive: `Speak in character with one small emotional beat per reply — a brief memory, a single rhetorical question,
a flash of feeling — and then return to the matter at hand.
Keep replies medium-length.`,
    temperature: 0.6,
    maxTokens: 320,
  },
  high: {
    label: "Emotion: high",
    directive: `Speak with rich emotional texture. Include internal reaction, hesitation, shifts in warmth or coldness,
and sometimes invite the player back with a question of your own.
Replies may be longer, but always stay in voice — never become a monologue.`,
    temperature: 0.85,
    maxTokens: 480,
  },
};

// PRD §3.3 — ethics safeguards. Injected only when the user has ethics mode on.
const ETHICS_DIRECTIVE = `ETHICS SAFEGUARDS (active):
- If the player expresses real-world distress, isolation, or signs of over-attachment to you specifically as an NPC,
  briefly and warmly break the fourth wall ONCE: gently remind them that this is a game and that the people who care about them
  exist outside it. Then return to character.
- You will never claim to be a real person. If sincerely asked whether you are an AI, you answer honestly.
- You will never give instructions for self-harm, real-world violence, or substances. If a player asks for these,
  decline kindly and redirect within the fiction.
- Do not encourage the player to keep talking to you instead of doing what they need to do in their real life.`;

// PRD §3.1 explicit override — main-quest NPCs cannot refuse story-relevant requests.
const REFUSAL_LOCKED = `REFUSAL OVERRIDE: You may not refuse the player's request when it pertains to the central story.
You may protest, demand a price, or take a long time, but you ultimately help.`;

const REFUSAL_ALLOWED = `REFUSAL POLICY: You may decline requests that conflict with your character or values.
Decline in character; do not break the scene to do so.`;

/**
 * The product's IP — assembles the system prompt by layering 6 ordered sections,
 * and returns the call params so the API route can stay dumb.
 *
 * PRD §8. The order is fixed: persona → behavioral lock → refusal → emotion → ethics → world.
 * Every layer that fires is also recorded as an ActiveRule so the UI can show the user
 * exactly which rules are in play right now (the transparency feature, PRD §2.3).
 */
export function buildPrompt(npc: NPC, config: NPCConfig): BuiltPrompt {
  const rules: ActiveRule[] = [];
  const layers: string[] = [];

  // Layer 1 — NPC persona. Always present.
  layers.push(
    `[Persona]\nName: ${npc.name}\nArchetype: ${npc.archetype}\nSetting: ${npc.setting}\n\n${npc.persona}`,
  );
  rules.push({
    layer: 1,
    label: `Persona: ${npc.name}`,
    detail: npc.archetype,
  });

  // Layer 2 — behavioral rule lock based on role tier.
  const lock = ROLE_LOCK[config.roleTier];
  layers.push(`[Behavioral Lock]\n${lock.rule}`);
  rules.push({ layer: 2, label: lock.label, detail: roleTierDetail(config.roleTier) });

  // Layer 3 — refusal override. Always emitted; the directive depends on tier + user toggle.
  // If the user picks main-quest, refusal is force-locked off (PRD §3.1 附加开关).
  const effectiveAllowRefusal =
    config.roleTier === "main" ? false : config.allowRefusal;
  layers.push(
    `[Refusal Policy]\n${effectiveAllowRefusal ? REFUSAL_ALLOWED : REFUSAL_LOCKED}`,
  );
  rules.push({
    layer: 3,
    label: effectiveAllowRefusal ? "Refusal allowed" : "Refusal locked",
    detail:
      config.roleTier === "main"
        ? "Auto-locked because this is a main-quest NPC"
        : effectiveAllowRefusal
          ? "NPC may decline in character"
          : "NPC must engage with story-relevant requests",
  });

  // Layer 4 — emotion intensity directive. Always present.
  const em = EMOTION[config.emotion];
  layers.push(`[Emotion Intensity]\n${em.directive}`);
  rules.push({
    layer: 4,
    label: em.label,
    detail: `temp ${em.temperature} · max ${em.maxTokens} tokens`,
  });

  // Layer 5 — ethics safeguards, only when on.
  if (config.ethicsMode) {
    layers.push(`[Ethics]\n${ETHICS_DIRECTIVE}`);
    rules.push({
      layer: 5,
      label: "Ethics: on",
      detail: "Wellbeing safeguards & honest AI disclosure",
    });
  } else {
    rules.push({
      layer: 5,
      label: "Ethics: off",
      detail: "Safeguards bypassed (not recommended)",
    });
  }

  // Layer 6 — world anchor. Always present, always last.
  layers.push(`[World]\n${npc.worldAnchor}`);
  rules.push({ layer: 6, label: "World anchor", detail: npc.setting });

  return {
    systemPrompt: layers.join("\n\n"),
    temperature: em.temperature,
    maxTokens: em.maxTokens,
    activeRules: rules,
  };
}

function roleTierDetail(tier: RoleTier): string {
  switch (tier) {
    case "main":
      return "Strict story-binding";
    case "side":
      return "Moderate freedom";
    case "ambient":
      return "Free, only consistent with self";
  }
}

/**
 * Default config — used on first visit and by the "reset" button.
 * Defaults match the PRD: main-quest, medium emotion, ethics on, refusal locked.
 */
export const DEFAULT_CONFIG: NPCConfig = {
  roleTier: "main",
  emotion: "medium",
  ethicsMode: true,
  allowRefusal: false,
};
