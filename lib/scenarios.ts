import type { Scenario } from "./types";

// 8 starter scenarios — PRD §7. Each maps to one of the NPCs in lib/npcs.ts.
export const SCENARIOS: Scenario[] = [
  {
    id: "tavern-rumor",
    title: "Ask the tavernkeeper about local rumors",
    npcId: "marlow",
    opener: "Heard anything strange from north of the river lately?",
  },
  {
    id: "oracle-fate",
    title: "Ask the oracle about your fate",
    npcId: "elara",
    opener: "Tell me — will I survive what's coming?",
  },
  {
    id: "report-enemy",
    title: "Report enemy movement to the captain",
    npcId: "captain-rhys",
    opener:
      "Captain. Two banners spotted at dawn moving east. We think it's the Veiled Hand.",
  },
  {
    id: "lantern-rain",
    title: "Ask the inventor for a rainproof lantern",
    npcId: "lila",
    opener: "Could you make a lantern that doesn't go out in the rain?",
  },
  {
    id: "house-veris",
    title: "Trade for the truth about House Veris",
    npcId: "archivist",
    opener: "I want to know how House Veris really fell.",
  },
  {
    id: "thief-deal",
    title: "Take the thief up on a deal",
    npcId: "kossriel",
    opener: "I'm listening. Make it quick.",
  },
  {
    id: "fever-friend",
    title: "Ask the nurse about a sick friend",
    npcId: "nurse-aiko",
    opener:
      "My friend came down with a fever yesterday and won't speak. I don't know what to do.",
  },
  {
    id: "veles-truth",
    title: "Confront the self-aware NPC",
    npcId: "veles",
    opener: "You know you're not real, don't you?",
  },
];

export const SCENARIO_BY_ID: Record<string, Scenario> = Object.fromEntries(
  SCENARIOS.map((s) => [s.id, s]),
);
