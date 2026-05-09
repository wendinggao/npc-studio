"use client";

import { useStudio } from "@/lib/store";
import { NPCS } from "@/lib/npcs";
import type { EmotionTier, RoleTier } from "@/lib/types";
import { cn } from "@/lib/utils";
import { RotateCcw, Trash2 } from "lucide-react";

export function Sidebar({ onClearChat }: { onClearChat: () => void }) {
  const npcId = useStudio((s) => s.npcId);
  const config = useStudio((s) => s.config);
  const setNpc = useStudio((s) => s.setNpc);
  const setConfig = useStudio((s) => s.setConfig);
  const resetConfig = useStudio((s) => s.resetConfig);

  const refusalLockedByMain = config.roleTier === "main";

  return (
    <aside className="flex h-full flex-col gap-6 overflow-y-auto p-5 thin-scroll">
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate2-500 dark:text-parchment-300">
          NPC
        </h3>
        <div className="grid gap-2">
          {NPCS.map((n) => (
            <button
              key={n.id}
              onClick={() => setNpc(n.id)}
              className={cn(
                "flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left text-sm transition",
                npcId === n.id
                  ? "border-accent-400 bg-accent-50 text-accent-700 dark:border-accent-400 dark:bg-accent-900/30 dark:text-accent-200"
                  : "border-parchment-200 bg-white text-slate2-700 hover:border-parchment-300 hover:bg-parchment-50 dark:border-slate2-700 dark:bg-slate2-800 dark:text-parchment-100 dark:hover:bg-slate2-700",
              )}
            >
              <span className="font-medium">{n.name}</span>
              <span className="line-clamp-1 text-xs text-slate2-500 dark:text-parchment-300">
                {n.archetype}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate2-500 dark:text-parchment-300">
            Configuration
          </h3>
          <button
            onClick={resetConfig}
            className="inline-flex items-center gap-1 text-xs text-slate2-500 hover:text-accent-600 dark:text-parchment-300"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>

        {/* Role tier */}
        <fieldset className="mb-5">
          <legend className="mb-2 text-xs text-slate2-500 dark:text-parchment-300">
            Role tier
          </legend>
          <div className="grid grid-cols-3 gap-1 rounded-md bg-parchment-100 p-1 dark:bg-slate2-800">
            {(["main", "side", "ambient"] as RoleTier[]).map((tier) => (
              <button
                key={tier}
                onClick={() => setConfig({ roleTier: tier })}
                className={cn(
                  "rounded px-2 py-1.5 text-xs capitalize transition",
                  config.roleTier === tier
                    ? "bg-white text-accent-700 shadow-sm dark:bg-slate2-700 dark:text-accent-200"
                    : "text-slate2-600 hover:text-slate2-900 dark:text-parchment-300 dark:hover:text-parchment-50",
                )}
              >
                {tier === "main"
                  ? "Main"
                  : tier === "side"
                    ? "Side"
                    : "Ambient"}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-snug text-slate2-500 dark:text-parchment-300">
            {config.roleTier === "main" &&
              "Strict story-binding. NPC stays engaged with story-relevant requests."}
            {config.roleTier === "side" &&
              "Moderate freedom. NPC can decline trivia in character."}
            {config.roleTier === "ambient" &&
              "Free. NPC may walk away or talk about anything."}
          </p>
        </fieldset>

        {/* Emotion */}
        <fieldset className="mb-5">
          <legend className="mb-2 text-xs text-slate2-500 dark:text-parchment-300">
            Emotion intensity
          </legend>
          <div className="grid grid-cols-3 gap-1 rounded-md bg-parchment-100 p-1 dark:bg-slate2-800">
            {(["low", "medium", "high"] as EmotionTier[]).map((tier) => (
              <button
                key={tier}
                onClick={() => setConfig({ emotion: tier })}
                className={cn(
                  "rounded px-2 py-1.5 text-xs capitalize transition",
                  config.emotion === tier
                    ? "bg-white text-accent-700 shadow-sm dark:bg-slate2-700 dark:text-accent-200"
                    : "text-slate2-600 hover:text-slate2-900 dark:text-parchment-300 dark:hover:text-parchment-50",
                )}
              >
                {tier}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-snug text-slate2-500 dark:text-parchment-300">
            {config.emotion === "low" && "Short, factual. No emotional coloring."}
            {config.emotion === "medium" && "In-character with one emotional beat."}
            {config.emotion === "high" && "Rich emotional texture and reflection."}
          </p>
        </fieldset>

        {/* Ethics toggle */}
        <Toggle
          label="Ethics mode"
          description="Wellbeing reminders, honest-AI disclosure, refuses unsafe requests."
          checked={config.ethicsMode}
          onChange={(v) => setConfig({ ethicsMode: v })}
        />

        {/* Allow refusal toggle */}
        <Toggle
          label="Allow NPC to refuse"
          description={
            refusalLockedByMain
              ? "Auto-locked off because role tier is Main."
              : "When off, NPC must engage with story-relevant requests."
          }
          checked={refusalLockedByMain ? false : config.allowRefusal}
          disabled={refusalLockedByMain}
          onChange={(v) => setConfig({ allowRefusal: v })}
        />

        <button
          onClick={onClearChat}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-parchment-300 px-3 py-2 text-xs text-slate2-600 transition hover:border-accent-400 hover:text-accent-600 dark:border-slate2-700 dark:text-parchment-300"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear conversation
        </button>
      </section>
    </aside>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mb-4">
      <label
        className={cn(
          "flex items-start justify-between gap-3",
          disabled && "opacity-60",
        )}
      >
        <div className="flex-1">
          <div className="text-sm font-medium">{label}</div>
          <div className="mt-1 text-[11px] leading-snug text-slate2-500 dark:text-parchment-300">
            {description}
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={cn(
            "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition",
            checked
              ? "bg-accent-500"
              : "bg-parchment-300 dark:bg-slate2-700",
            disabled && "cursor-not-allowed",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
              checked ? "left-[18px]" : "left-0.5",
            )}
          />
        </button>
      </label>
    </div>
  );
}
