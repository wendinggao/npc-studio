"use client";

import { useMemo } from "react";
import { NPCS, NPC_BY_ID } from "./npcs";
import { useStudio } from "./store";
import type { NPC } from "./types";

/**
 * Merged list of built-in + user-created NPCs.
 * Built-ins come first to keep the demo experience consistent across machines.
 */
export function useAllNpcs(): NPC[] {
  const userNpcs = useStudio((s) => s.userNpcs);
  return useMemo(() => [...NPCS, ...userNpcs], [userNpcs]);
}

/**
 * Look up an NPC by id across both catalogs. Returns undefined if neither has it
 * — caller should treat that as a stale id (e.g. share link to a deleted custom NPC).
 */
export function useNpcById(id: string): NPC | undefined {
  const userNpc = useStudio((s) => s.userNpcs.find((n) => n.id === id));
  return NPC_BY_ID[id] ?? userNpc;
}
