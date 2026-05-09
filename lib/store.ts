"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CONFIG } from "./prompt-builder";
import { DEFAULT_NPC_ID } from "./npcs";
import type { ChatTurn, NPC, NPCConfig } from "./types";

// User-created NPC IDs are prefixed so they never collide with built-in IDs
// like "marlow" / "elara" / etc.
const USER_NPC_PREFIX = "u-";

function makeUserNpcId(): string {
  return USER_NPC_PREFIX + Math.random().toString(36).slice(2, 10);
}

export function isUserNpcId(id: string): boolean {
  return id.startsWith(USER_NPC_PREFIX);
}

// Per-NPC chat history, keyed by npcId. Switching NPCs preserves the previous conversation
// so users can compare answers across personas without losing history.
type HistoryMap = Record<string, ChatTurn[]>;

type StudioState = {
  npcId: string;
  config: NPCConfig;
  history: HistoryMap;
  // User-created NPCs, persisted in localStorage alongside config + history.
  // Built-in NPCs (lib/npcs.ts) are NOT stored here — they're shipped with the bundle.
  userNpcs: NPC[];
  // Total foreground time in this session, in seconds — drives the wellbeing modal.
  sessionSeconds: number;
  // Used to suppress repeat wellbeing modals after the user dismisses one.
  lastWellbeingPromptAt: number; // session-seconds value at which we last prompted

  // setters
  setNpc: (id: string) => void;
  setConfig: (cfg: Partial<NPCConfig>) => void;
  resetConfig: () => void;
  appendTurn: (npcId: string, turn: ChatTurn) => void;
  // Append text to the last NPC turn for that NPC; used while streaming.
  appendToLastNpcTurn: (npcId: string, text: string) => void;
  clearHistory: (npcId: string) => void;
  tickSecond: () => void;
  markWellbeingPrompt: () => void;
  // applyShared from URL hash — may carry a full custom NPC for user-created shares.
  applyShared: (npcId: string, cfg: NPCConfig, customNpc?: NPC) => void;

  // User NPC CRUD. `addUserNpc` returns the generated id so the caller can
  // immediately switch to it.
  addUserNpc: (draft: Omit<NPC, "id">) => string;
  updateUserNpc: (id: string, patch: Partial<Omit<NPC, "id">>) => void;
  removeUserNpc: (id: string) => void;
};

export const useStudio = create<StudioState>()(
  persist(
    (set) => ({
      npcId: DEFAULT_NPC_ID,
      config: DEFAULT_CONFIG,
      history: {},
      userNpcs: [],
      sessionSeconds: 0,
      lastWellbeingPromptAt: 0,

      setNpc: (id) => set({ npcId: id }),

      setConfig: (cfg) =>
        set((s) => {
          const merged: NPCConfig = { ...s.config, ...cfg };
          // PRD §3.1 附加开关: main-quest auto-locks refusal off.
          if (merged.roleTier === "main") merged.allowRefusal = false;
          return { config: merged };
        }),

      resetConfig: () => set({ config: DEFAULT_CONFIG }),

      appendTurn: (npcId, turn) =>
        set((s) => ({
          history: {
            ...s.history,
            [npcId]: [...(s.history[npcId] ?? []), turn],
          },
        })),

      appendToLastNpcTurn: (npcId, text) =>
        set((s) => {
          const list = s.history[npcId] ?? [];
          if (list.length === 0) return s;
          const last = list[list.length - 1]!;
          if (last.role !== "npc") return s;
          const updated: ChatTurn = { ...last, content: last.content + text };
          return {
            history: {
              ...s.history,
              [npcId]: [...list.slice(0, -1), updated],
            },
          };
        }),

      clearHistory: (npcId) =>
        set((s) => ({ history: { ...s.history, [npcId]: [] } })),

      tickSecond: () =>
        set((s) => ({ sessionSeconds: s.sessionSeconds + 1 })),

      markWellbeingPrompt: () =>
        set((s) => ({ lastWellbeingPromptAt: s.sessionSeconds })),

      applyShared: (npcId, cfg, customNpc) =>
        set((s) => {
          if (!customNpc) return { npcId, config: cfg };
          // Merge or replace by id so re-imports don't pile up duplicates.
          const i = s.userNpcs.findIndex((n) => n.id === customNpc.id);
          const userNpcs =
            i >= 0
              ? s.userNpcs.map((n, idx) => (idx === i ? customNpc : n))
              : [...s.userNpcs, customNpc];
          return { npcId, config: cfg, userNpcs };
        }),

      addUserNpc: (draft) => {
        const id = makeUserNpcId();
        set((s) => ({
          userNpcs: [...s.userNpcs, { ...draft, id }],
        }));
        return id;
      },

      updateUserNpc: (id, patch) =>
        set((s) => ({
          userNpcs: s.userNpcs.map((n) =>
            n.id === id ? { ...n, ...patch, id: n.id } : n,
          ),
        })),

      removeUserNpc: (id) =>
        set((s) => {
          const userNpcs = s.userNpcs.filter((n) => n.id !== id);
          // If the removed NPC was the active one, fall back to the default.
          const npcId = s.npcId === id ? DEFAULT_NPC_ID : s.npcId;
          // Drop its chat history too — no orphan data.
          const { [id]: _, ...history } = s.history;
          return { userNpcs, npcId, history };
        }),
    }),
    {
      name: "npc-studio:v1",
      // sessionSeconds is part of the persisted state per PRD §11.3 — survive refresh.
    },
  ),
);
