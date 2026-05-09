"use client";

import { Heart } from "lucide-react";

export function WellbeingModal({
  open,
  onSnooze,
  onLeave,
}: {
  open: boolean;
  onSnooze: () => void;
  onLeave: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate2-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-parchment-200 bg-white p-6 shadow-xl dark:border-slate2-700 dark:bg-slate2-800">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300">
            <Heart className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Take a moment.</h2>
            <p className="mt-2 text-sm text-slate2-600 dark:text-parchment-200">
              You've been here for about 15 minutes. The NPCs aren't going
              anywhere — and the people who care about you are real.
            </p>
            <p className="mt-3 text-sm text-slate2-600 dark:text-parchment-200">
              Stretch, drink water, message a friend, or step outside.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onSnooze}
            className="rounded-md border border-parchment-300 px-3 py-2 text-sm text-slate2-700 hover:border-accent-400 hover:text-accent-600 dark:border-slate2-700 dark:text-parchment-100"
          >
            5 more minutes
          </button>
          <button
            onClick={onLeave}
            className="rounded-md bg-accent-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-600"
          >
            I'll take a break
          </button>
        </div>
      </div>
    </div>
  );
}
