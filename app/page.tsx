import Link from "next/link";
import { ArrowRight, Github, Lock, Heart, Sparkles, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-parchment-50 dark:bg-slate2-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-parchment-100 via-parchment-50 to-accent-50/40 dark:from-slate2-800 dark:via-slate2-900 dark:to-slate2-900" />
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32 lg:px-8">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-accent-600 dark:text-accent-300">
            LIF001 Group D30 · Assessment 2
          </p>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Design AI NPCs <span className="text-accent-500">with principles.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate2-600 dark:text-parchment-200">
            Configure an AI-driven NPC's persona, role tier, emotion intensity,
            and ethics safeguards — then chat with the result and feel the
            difference within seconds.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-300"
            >
              Try the Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-md border border-parchment-300 bg-white/60 px-5 py-3 text-sm font-medium text-slate2-700 transition hover:bg-white dark:border-slate2-700 dark:bg-slate2-800/60 dark:text-parchment-100 dark:hover:bg-slate2-800"
            >
              About / AI disclosure
            </Link>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-3 py-3 text-sm text-slate2-500 hover:text-slate2-800 dark:text-parchment-300 dark:hover:text-parchment-50"
            >
              <Github className="h-4 w-4" />
              Source on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Problem cards */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-300">
          The problem
        </h2>
        <p className="mt-2 max-w-3xl text-2xl font-semibold sm:text-3xl">
          Game NPCs today are stuck between two bad options.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <ProblemCard
            title="They all sound the same."
            body="Most large-model NPCs collapse into the same friendly, helpful voice. The world stops feeling like a world."
            citation="Cited in Semester 1 research, ref. forthcoming"
          />
          <ProblemCard
            title="They have no rules of engagement."
            body="An NPC that can be talked into anything will eventually break the story. An NPC that refuses everything is no fun to talk to."
            citation="Cited in Semester 1 research, ref. forthcoming"
          />
          <ProblemCard
            title="They invite over-attachment."
            body="When NPCs are too convincingly intimate, players forget that real relationships exist outside the game."
            citation="Cited in Semester 1 research, ref. forthcoming"
          />
        </div>
      </section>

      {/* Solution cards — four design principles */}
      <section className="bg-parchment-100/60 py-20 dark:bg-slate2-800/40">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-300">
            Our four design principles, made tangible
          </h2>
          <p className="mt-2 max-w-3xl text-2xl font-semibold sm:text-3xl">
            Every principle is a control you can flip and feel.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <SolutionCard
              icon={<Lock className="h-5 w-5" />}
              title="Behavioral Rule Lock"
              body="Three role tiers — main quest, side quest, ambient — each with a different behavioral lock injected as part of the system prompt."
            />
            <SolutionCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Three-Tier Emotion Intensity"
              body="A slider that drives both the prompt directive and the model's temperature and length. Low, medium, high — short and flat to long and warm."
            />
            <SolutionCard
              icon={<Heart className="h-5 w-5" />}
              title="Ethics & Wellbeing Safeguards"
              body="A toggleable ethics layer that adds gentle fourth-wall reminders when the conversation drifts toward over-attachment, plus a 15-minute break prompt."
            />
            <SolutionCard
              icon={<Users className="h-5 w-5" />}
              title="Co-op over Dependence"
              body="One click encodes your entire NPC config into a shareable URL. Send it to a friend and explore the same NPC together."
            />
          </div>
          <div className="mt-12">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-accent-600"
            >
              Open the Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-parchment-200/60 py-10 text-sm text-slate2-500 dark:border-slate2-800 dark:text-parchment-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 lg:px-8">
          <span>NPC Studio · LIF001 Group D30 · 2025–26</span>
          <div className="flex gap-5">
            <Link href="/studio" className="hover:text-accent-500">
              Studio
            </Link>
            <Link href="/about" className="hover:text-accent-500">
              About
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ProblemCard({
  title,
  body,
  citation,
}: {
  title: string;
  body: string;
  citation: string;
}) {
  return (
    <div className="rounded-xl border border-parchment-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate2-700 dark:bg-slate2-800">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-slate2-600 dark:text-parchment-200">
        {body}
      </p>
      <p className="mt-4 text-xs italic text-slate2-400 dark:text-parchment-300/70">
        {citation}
      </p>
    </div>
  );
}

function SolutionCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-parchment-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate2-700 dark:bg-slate2-800">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300">
          {icon}
        </span>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <p className="mt-4 text-sm text-slate2-600 dark:text-parchment-200">
        {body}
      </p>
    </div>
  );
}
