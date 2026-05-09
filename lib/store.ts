"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CONFIG } from "./prompt-builder";
import { DEFAULT_NPC_ID } from "./npcs";
import type { ChatTurn, NPCConfig } from "./types";

// Per-NPC chat history, keyed by npcId. Switching NPCs preserves the previous conversation
// so users can compare answers across personas without losing history.
type HistoryMap = Record<string, ChatTurn[]>;

type StudioState = {
  npcId: string;
  config: NPCConfig;
  history: HistoryMap;
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
  applyShared: (npcId: string, cfg: NPCConfig) => void;
};

export const useStudio = create<StudioState>()(
  persist(
    (set) => ({
      npcId: DEFAULT_NPC_ID,
      config: DEFAULT_CONFIG,
      history: {},
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

      applyShared: (npcId, cfg) =>
        set(() => ({ npcId, config: cfg })),
    }),
    {
      name: "npc-studio:v1",
      // sessionSeconds is part of the persisted state per PRD §11.3 — survive refresh.
    },
  ),
);
