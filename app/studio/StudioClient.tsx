"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/studio/Sidebar";
import { Chat } from "@/components/studio/Chat";
import { BehaviorLog } from "@/components/studio/BehaviorLog";
import { TopBar } from "@/components/studio/TopBar";
import { WellbeingModal } from "@/components/studio/WellbeingModal";
import { useStudio } from "@/lib/store";
import { readShareFromLocation } from "@/lib/share-codec";
import type { ActiveRule } from "@/lib/types";

const FIFTEEN_MINUTES = 15 * 60;
// PRD §11.3: "再聊 5 分钟" sets next prompt to 10 minutes from now,
// i.e. the prompt threshold is `lastPrompt + 10 min`, NOT 0 reset.
const SNOOZE_INTERVAL = 10 * 60;

export default function StudioClient() {
  const applyShared = useStudio((s) => s.applyShared);
  const tickSecond = useStudio((s) => s.tickSecond);
  const sessionSeconds = useStudio((s) => s.sessionSeconds);
  const lastWellbeingPromptAt = useStudio((s) => s.lastWellbeingPromptAt);
  const markWellbeingPrompt = useStudio((s) => s.markWellbeingPrompt);
  const clearHistory = useStudio((s) => s.clearHistory);
  const npcId = useStudio((s) => s.npcId);
  const setNpc = useStudio((s) => s.setNpc);

  // Hydration guard — Zustand persist needs the client mount before reading store.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Apply shared config from URL hash on mount, then strip the hash.
  useEffect(() => {
    if (!mounted) return;
    const shared = readShareFromLocation();
    if (shared) {
      applyShared(shared.npcId, shared.config);
      // Strip the hash so refresh-after-tweak doesn't keep overwriting.
      history.replaceState(null, "", window.location.pathname);
    }
  }, [mounted, applyShared]);

  // Session timer — only tick when the tab is visible (PRD §11.3 spirit:
  // "foreground time", not background).
  useEffect(() => {
    if (!mounted) return;
    let interval: ReturnType<typeof setInterval> | null = null;
    function start() {
      if (interval) return;
      interval = setInterval(() => tickSecond(), 1000);
    }
    function stop() {
      if (interval) clearInterval(interval);
      interval = null;
    }
    function onVis() {
      if (document.visibilityState === "visible") start();
      else stop();
    }
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [mounted, tickSecond]);

  // Wellbeing modal — fires the first time at 15 min, and every 10 min after a snooze.
  const [showWellbeing, setShowWellbeing] = useState(false);
  useEffect(() => {
    const threshold =
      lastWellbeingPromptAt === 0
        ? FIFTEEN_MINUTES
        : lastWellbeingPromptAt + SNOOZE_INTERVAL;
    if (sessionSeconds >= threshold && !showWellbeing) {
      setShowWellbeing(true);
      markWellbeingPrompt();
    }
  }, [sessionSeconds, lastWellbeingPromptAt, showWellbeing, markWellbeingPrompt]);

  // Active rules + assembled system prompt — set every time the server emits the rules event.
  const [activeRules, setActiveRules] = useState<ActiveRule[] | null>(null);
  const [assembledSystem, setAssembledSystem] = useState("");

  // Reset rules when NPC switches — the visible rules should match the *next* exchange's NPC.
  useEffect(() => {
    setActiveRules(null);
    setAssembledSystem("");
  }, [npcId]);

  // Composer draft (lifted so scenarios can prefill it).
  const [draft, setDraft] = useState("");

  function applyScenario(targetNpcId: string, opener: string) {
    if (targetNpcId !== npcId) {
      setNpc(targetNpcId);
    }
    setDraft(opener);
  }

  if (!mounted) {
    // Avoid hydration mismatch — render a minimal placeholder before the client store is ready.
    return (
      <div className="grid h-screen place-items-center bg-parchment-50 text-sm text-slate2-400 dark:bg-slate2-900 dark:text-parchment-300">
        Loading studio…
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-parchment-50 dark:bg-slate2-900">
      <TopBar onUseScenario={applyScenario} />
      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[320px_1fr_320px]">
        {/* Left — sidebar */}
        <div className="hidden border-r border-parchment-200 bg-white/40 lg:block dark:border-slate2-700 dark:bg-slate2-800/40">
          <Sidebar onClearChat={() => clearHistory(npcId)} />
        </div>

        {/* Center — chat */}
        <div className="bg-white dark:bg-slate2-800/20">
          <Chat
            draft={draft}
            onDraftChange={setDraft}
            onRulesUpdate={(rules, systemPrompt) => {
              setActiveRules(rules);
              setAssembledSystem(systemPrompt);
            }}
          />
        </div>

        {/* Right — behavior log */}
        <div className="hidden border-l border-parchment-200 bg-white/40 lg:block dark:border-slate2-700 dark:bg-slate2-800/40">
          <BehaviorLog rules={activeRules} systemPrompt={assembledSystem} />
        </div>

        {/* Mobile stack: sidebar + log appear below the chat as collapsibles. */}
        <div className="border-t border-parchment-200 lg:hidden dark:border-slate2-700">
          <details className="border-b border-parchment-200 dark:border-slate2-700">
            <summary className="cursor-pointer px-5 py-3 text-sm font-medium">
              NPC & configuration
            </summary>
            <Sidebar onClearChat={() => clearHistory(npcId)} />
          </details>
          <details>
            <summary className="cursor-pointer px-5 py-3 text-sm font-medium">
              Behavior log
            </summary>
            <BehaviorLog rules={activeRules} systemPrompt={assembledSystem} />
          </details>
        </div>
      </div>

      <WellbeingModal
        open={showWellbeing}
        onSnooze={() => setShowWellbeing(false)}
        onLeave={() => setShowWellbeing(false)}
      />

      {/* Footer link to About — required by PRD §5.3 (academic-integrity disclosure). */}
      <div className="border-t border-parchment-200 px-5 py-2 text-[11px] text-slate2-400 dark:border-slate2-700 dark:text-parchment-300">
        AI usage and reflection are disclosed on the{" "}
        <Link href="/about" className="underline hover:text-accent-500">
          About page
        </Link>
        .
      </div>
    </div>
  );
}
