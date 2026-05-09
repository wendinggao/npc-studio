"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActiveRule } from "@/lib/types";

const LAYER_ACCENT: Record<ActiveRule["layer"], string> = {
  1: "bg-parchment-200 text-parchment-800 dark:bg-parchment-800/40 dark:text-parchment-100",
  2: "bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-200",
  3: "bg-slate2-200 text-slate2-700 dark:bg-slate2-700 dark:text-parchment-100",
  4: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  5: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  6: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
};

const LAYER_NAME: Record<ActiveRule["layer"], string> = {
  1: "L1 · Persona",
  2: "L2 · Behavioral lock",
  3: "L3 · Refusal",
  4: "L4 · Emotion",
  5: "L5 · Ethics",
  6: "L6 · World",
};

export function BehaviorLog({
  rules,
  systemPrompt,
}: {
  rules: ActiveRule[] | null;
  systemPrompt: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="flex h-full flex-col gap-5 overflow-y-auto p-5 thin-scroll">
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate2-500 dark:text-parchment-300">
          Active rules
        </h3>
        {rules ? (
          <ul className="space-y-2">
            {rules.map((r, i) => (
              <li
                key={i}
                className="rounded-md border border-parchment-200 bg-white p-2.5 text-xs dark:border-slate2-700 dark:bg-slate2-800"
              >
                <span
                  className={cn(
                    "mr-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium",
                    LAYER_ACCENT[r.layer],
                  )}
                >
                  {LAYER_NAME[r.layer]}
                </span>
                <span className="font-medium">{r.label}</span>
                <div className="mt-1 text-[11px] leading-snug text-slate2-500 dark:text-parchment-300">
                  {r.detail}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border border-dashed border-parchment-300 p-3 text-xs text-slate2-500 dark:border-slate2-700 dark:text-parchment-300">
            Send a message to see which rules are active. Each is one of the six prompt layers.
          </p>
        )}
      </section>

      <section>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-md border border-parchment-200 bg-white px-3 py-2 text-xs font-medium transition hover:border-accent-300 dark:border-slate2-700 dark:bg-slate2-800"
        >
          <span>View full system prompt</span>
          {open ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
        {open && (
          <pre className="mt-2 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-md border border-parchment-200 bg-parchment-50 p-3 text-[11px] leading-relaxed text-slate2-700 thin-scroll dark:border-slate2-700 dark:bg-slate2-900 dark:text-parchment-200">
            {systemPrompt || "Send a message first."}
          </pre>
        )}
        <p className="mt-2 text-[11px] leading-snug text-slate2-400 dark:text-parchment-300/70">
          These rules are passed to the model via prompt — not enforced as hard constraints. The model may still drift; that's part of the honest design.
        </p>
      </section>
    </aside>
  );
}
