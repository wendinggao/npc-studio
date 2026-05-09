"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trash2, X } from "lucide-react";
import type { NPC } from "@/lib/types";

type Draft = Omit<NPC, "id"> & { id?: string };

const EMPTY: Draft = {
  name: "",
  archetype: "",
  setting: "",
  persona: "",
  opener: "",
  worldAnchor: "",
  tags: [],
};

const PERSONA_TEMPLATE = `You are [name], [one-line description].
You speak in [voice — short and dry / warm and rambling / formal / etc.].
You [defining behavior — e.g. trade gossip for coin; never give a straight answer; protect every patient as your own].
You never break character. You never explain that you are an AI.`;

export function NPCEditor({
  open,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  initial: NPC | null;
  onClose: () => void;
  onSave: (draft: Draft) => void;
  onDelete?: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [tagsRaw, setTagsRaw] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reload form whenever the modal is opened with a different NPC.
  useEffect(() => {
    if (!open) return;
    if (initial) {
      setDraft({ ...initial });
      setTagsRaw(initial.tags.join(", "));
    } else {
      setDraft(EMPTY);
      setTagsRaw("");
    }
    setError(null);
  }, [open, initial]);

  if (!open) return null;

  const isEdit = Boolean(initial);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function submit() {
    // Required-field validation. Persona drives the system prompt; if it's empty,
    // the LLM has nothing to anchor on and the persona layer becomes a no-op.
    const required: (keyof Draft)[] = [
      "name",
      "archetype",
      "setting",
      "persona",
      "opener",
      "worldAnchor",
    ];
    for (const f of required) {
      if (!String(draft[f] ?? "").trim()) {
        setError(`Field "${labelFor(f)}" is required.`);
        return;
      }
    }
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ ...draft, tags });
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate2-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-parchment-200 bg-white shadow-2xl dark:border-slate2-700 dark:bg-slate2-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-parchment-200 px-6 py-4 dark:border-slate2-700">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold">
                {isEdit ? "Edit custom NPC" : "Create a custom NPC"}
              </h2>
              <p className="text-[11px] text-slate2-500 dark:text-parchment-300">
                Stored locally in your browser. Share-link export works for these too.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate2-400 hover:bg-parchment-50 hover:text-slate2-700 dark:hover:bg-slate2-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 thin-scroll">
          <Field label="Name" hint="Displayed in the NPC list and chat header.">
            <input
              type="text"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Marlow the Tavernkeeper"
              className={inputCls}
            />
          </Field>

          <Field
            label="Archetype"
            hint="One-line description. Shows under the name in the NPC list."
          >
            <input
              type="text"
              value={draft.archetype}
              onChange={(e) => set("archetype", e.target.value)}
              placeholder="e.g. Gruff but kind tavern owner"
              className={inputCls}
            />
          </Field>

          <Field
            label="Setting"
            hint="Where in the fictional world this NPC lives."
          >
            <input
              type="text"
              value={draft.setting}
              onChange={(e) => set("setting", e.target.value)}
              placeholder="e.g. A frontier town on the edge of a dying empire"
              className={inputCls}
            />
          </Field>

          <Field
            label="Persona (English)"
            hint="The core system prompt for this NPC. This is what makes the LLM stay in character. Use 2nd-person (You are...). Keep it concrete."
          >
            <textarea
              value={draft.persona}
              onChange={(e) => set("persona", e.target.value)}
              placeholder={PERSONA_TEMPLATE}
              rows={8}
              className={textareaCls}
            />
          </Field>

          <Field label="Opener" hint="The first line shown when no chat exists yet.">
            <textarea
              value={draft.opener}
              onChange={(e) => set("opener", e.target.value)}
              placeholder="e.g. Pull up a stool. Coin first, story second."
              rows={2}
              className={textareaCls}
            />
          </Field>

          <Field
            label="World anchor"
            hint="One sentence about the world that gets injected as the last layer of every prompt."
          >
            <input
              type="text"
              value={draft.worldAnchor}
              onChange={(e) => set("worldAnchor", e.target.value)}
              placeholder="e.g. The empire is collapsing. Bandits have grown bolder."
              className={inputCls}
            />
          </Field>

          <Field
            label="Tags (optional)"
            hint="Comma-separated. Used by the team to group NPCs (e.g. main, mystery, side)."
          >
            <input
              type="text"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="main, lore-source, gruff"
              className={inputCls}
            />
          </Field>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-parchment-200 px-6 py-3 dark:border-slate2-700">
          {isEdit && initial && onDelete ? (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Delete "${initial.name}"? Their chat history will be removed too. This can't be undone.`,
                  )
                ) {
                  onDelete(initial.id);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition hover:border-red-400 hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/40"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-parchment-300 px-3 py-2 text-sm text-slate2-700 hover:border-accent-400 hover:text-accent-600 dark:border-slate2-700 dark:text-parchment-100"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-600"
            >
              {isEdit ? "Save changes" : "Create NPC"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate2-600 dark:text-parchment-200">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-[11px] leading-snug text-slate2-500 dark:text-parchment-300">
          {hint}
        </p>
      )}
    </div>
  );
}

function labelFor(key: string): string {
  switch (key) {
    case "name":
      return "Name";
    case "archetype":
      return "Archetype";
    case "setting":
      return "Setting";
    case "persona":
      return "Persona";
    case "opener":
      return "Opener";
    case "worldAnchor":
      return "World anchor";
    default:
      return key;
  }
}

const inputCls =
  "w-full rounded-md border border-parchment-300 bg-white px-3 py-2 text-sm text-slate2-900 outline-none placeholder:text-slate2-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 dark:border-slate2-700 dark:bg-slate2-900 dark:text-parchment-50 dark:placeholder:text-parchment-300/50";
const textareaCls =
  "w-full resize-y rounded-md border border-parchment-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-slate2-900 outline-none placeholder:text-slate2-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 dark:border-slate2-700 dark:bg-slate2-900 dark:text-parchment-50 dark:placeholder:text-parchment-300/50";
