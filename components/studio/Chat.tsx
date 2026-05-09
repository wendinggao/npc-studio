"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useStudio } from "@/lib/store";
import { useNpcById } from "@/lib/all-npcs";
import { streamChatRequest } from "@/lib/sse-client";
import { uid } from "@/lib/utils";
import type { ActiveRule, ChatTurn } from "@/lib/types";

// Stable identity for "no history yet" — `?? []` would create a new array every
// render and trip useSyncExternalStore's tearing check, causing infinite renders.
const EMPTY_HISTORY: ChatTurn[] = [];

export function Chat({
  draft,
  onDraftChange,
  onRulesUpdate,
}: {
  draft: string;
  onDraftChange: (v: string) => void;
  onRulesUpdate: (rules: ActiveRule[], systemPrompt: string) => void;
}) {
  const npcId = useStudio((s) => s.npcId);
  const config = useStudio((s) => s.config);
  const history = useStudio((s) => s.history[npcId] ?? EMPTY_HISTORY);
  const appendTurn = useStudio((s) => s.appendTurn);
  const appendToLastNpcTurn = useStudio((s) => s.appendToLastNpcTurn);

  const npc = useNpcById(npcId);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history, streaming]);

  async function send() {
    if (streaming) return;
    const text = draft.trim();
    if (!text) return;
    setError(null);
    onDraftChange("");

    // Push the user turn and an empty NPC placeholder we'll stream into.
    const captureNpcId = npcId;
    appendTurn(captureNpcId, {
      id: uid(),
      role: "user",
      content: text,
      ts: Date.now(),
    });
    appendTurn(captureNpcId, {
      id: uid(),
      role: "npc",
      content: "",
      ts: Date.now(),
    });
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      if (!npc) throw new Error("No NPC selected.");
      await streamChatRequest(
        {
          npc,
          config,
          history,
          message: text,
        },
        (ev) => {
          if (ev.type === "rules") {
            onRulesUpdate(ev.rules, ev.systemPrompt);
          } else if (ev.type === "token") {
            appendToLastNpcTurn(captureNpcId, ev.text);
          } else if (ev.type === "error") {
            setError(ev.message);
          }
        },
        ctrl.signal,
      );
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  if (!npc) return null;

  return (
    <div className="flex h-full flex-col">
      {/* Conversation */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-6 py-6 thin-scroll"
      >
        {history.length === 0 && !streaming && (
          <div className="grid h-full place-items-center text-center text-sm text-slate2-400 dark:text-parchment-300">
            <div>
              <div className="mb-2 text-base font-medium text-slate2-500 dark:text-parchment-200">
                {npc.name} is waiting.
              </div>
              <p className="max-w-sm">
                "{npc.opener}"
              </p>
            </div>
          </div>
        )}
        {history.map((turn, i) => {
          const isUser = turn.role === "user";
          const isLastNpc =
            !isUser && i === history.length - 1 && streaming;
          return (
            <div
              key={turn.id}
              className={isUser ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  isUser
                    ? "max-w-[78%] rounded-2xl rounded-br-sm bg-slate2-700 px-4 py-2.5 text-sm text-white shadow-sm dark:bg-slate2-700"
                    : "max-w-[82%] rounded-2xl rounded-bl-sm border border-parchment-200 bg-white px-4 py-2.5 text-sm text-slate2-800 shadow-sm dark:border-slate2-700 dark:bg-slate2-800 dark:text-parchment-100"
                }
              >
                {!isUser && (
                  <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-accent-600 dark:text-accent-300">
                    {npc.name}
                  </div>
                )}
                <div
                  className={
                    "whitespace-pre-wrap leading-relaxed " +
                    (isLastNpc && turn.content.length === 0 ? "cursor-blink" : "") +
                    (isLastNpc && turn.content.length > 0 ? " cursor-blink" : "")
                  }
                >
                  {turn.content}
                </div>
              </div>
            </div>
          );
        })}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
            The NPC seems distracted. {error}{" "}
            <button
              onClick={() => {
                setError(null);
                void send();
              }}
              className="underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-parchment-200 p-4 dark:border-slate2-700">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={onKey}
            rows={2}
            placeholder={`Speak to ${npc.name}…  (Enter sends, Shift+Enter newline)`}
            className="flex-1 resize-none rounded-md border border-parchment-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate2-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-200 dark:border-slate2-700 dark:bg-slate2-800 dark:text-parchment-50 dark:placeholder:text-parchment-300/60"
          />
          <button
            onClick={() => void send()}
            disabled={streaming || draft.trim().length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-accent-500 px-4 text-sm font-medium text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {streaming ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
