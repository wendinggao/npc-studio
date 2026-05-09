"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock, Copy, Share2, Sparkles } from "lucide-react";
import { useStudio } from "@/lib/store";
import { SCENARIOS } from "@/lib/scenarios";
import { buildShareUrl } from "@/lib/share-codec";

function formatDuration(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec.toString().padStart(2, "0")}s`;
}

export function TopBar({
  onUseScenario,
}: {
  onUseScenario: (npcId: string, opener: string) => void;
}) {
  const sessionSeconds = useStudio((s) => s.sessionSeconds);
  const npcId = useStudio((s) => s.npcId);
  const config = useStudio((s) => s.config);

  const [copied, setCopied] = useState(false);

  async function share() {
    const url = buildShareUrl(npcId, config);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: prompt the URL so the user can copy manually.
      window.prompt("Copy this share link:", url);
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-parchment-200 bg-white/80 px-5 backdrop-blur dark:border-slate2-700 dark:bg-slate2-900/80">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-semibold text-slate2-800 hover:text-accent-600 dark:text-parchment-50"
      >
        <Sparkles className="h-4 w-4 text-accent-500" />
        NPC Studio
      </Link>

      <div className="flex flex-1 items-center justify-center gap-3">
        <ScenarioPicker onUseScenario={onUseScenario} />
      </div>

      <div className="flex items-center gap-2">
        <span
          className="hidden items-center gap-1.5 rounded-full bg-parchment-100 px-2.5 py-1 text-xs text-slate2-600 sm:inline-flex dark:bg-slate2-800 dark:text-parchment-200"
          title="Session time accumulates while the Studio tab is open."
        >
          <Clock className="h-3 w-3" /> {formatDuration(sessionSeconds)}
        </span>
        <button
          onClick={share}
          className="inline-flex items-center gap-1.5 rounded-md border border-parchment-300 bg-white px-3 py-1.5 text-xs font-medium text-slate2-700 transition hover:border-accent-400 hover:text-accent-600 dark:border-slate2-700 dark:bg-slate2-800 dark:text-parchment-100"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" /> Share
            </>
          )}
        </button>
      </div>
    </header>
  );
}

function ScenarioPicker({
  onUseScenario,
}: {
  onUseScenario: (npcId: string, opener: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-parchment-300 bg-white px-3 py-1.5 text-xs font-medium text-slate2-700 transition hover:border-accent-400 hover:text-accent-600 dark:border-slate2-700 dark:bg-slate2-800 dark:text-parchment-100"
      >
        Try a starter scenario
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-1/2 top-full z-20 mt-2 w-80 -translate-x-1/2 rounded-lg border border-parchment-200 bg-white p-2 shadow-lg dark:border-slate2-700 dark:bg-slate2-800">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  onUseScenario(sc.npcId, sc.opener);
                  setOpen(false);
                }}
                className="block w-full rounded px-3 py-2 text-left text-xs hover:bg-parchment-50 dark:hover:bg-slate2-700"
              >
                <div className="font-medium text-slate2-800 dark:text-parchment-50">
                  {sc.title}
                </div>
                <div className="mt-0.5 line-clamp-1 text-[11px] text-slate2-500 dark:text-parchment-300">
                  "{sc.opener}"
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
