import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — NPC Studio",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-parchment-50 dark:bg-slate2-900">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link
          href="/"
          className="text-xs uppercase tracking-wider text-accent-600 hover:text-accent-500 dark:text-accent-300"
        >
          ← Back to NPC Studio
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">About</h1>
        <p className="mt-3 text-sm text-slate2-600 dark:text-parchment-200">
          NPC Studio is the Assessment 2 product for{" "}
          <strong>LIF001 Group D30 — AI in Gaming and Virtual Reality</strong>{" "}
          (Academic Year 2025–26). This page satisfies the module's academic
          integrity requirement for full disclosure of AI tool use.
        </p>

        <Section title="The team">
          <p className="text-sm">
            D30 members and their assessment roles. Update this list before
            submission so it matches your final group sheet.
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate2-700 dark:text-parchment-100">
            <li>
              <strong>[Group leader name]</strong> — leader, primary developer
            </li>
            <li>
              <strong>[Member name]</strong> — NPC content design (×2)
            </li>
            <li>
              <strong>[Member name]</strong> — scenarios &amp; English copy (×2)
            </li>
            <li>
              <strong>[Member name]</strong> — visual / UX
            </li>
            <li>
              <strong>[Member name]</strong> — video production (×2)
            </li>
            <li>
              <strong>[Member name]</strong> — QA &amp; user testing
            </li>
            <li>
              <strong>[Member name]</strong> — documentation &amp; reflection
            </li>
          </ul>
        </Section>

        <Section title="AI tools used">
          <p className="text-sm">
            We disclose every AI tool that contributed to this product, in line
            with the LIF001 academic integrity requirement.
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <strong>Claude Code (CLI):</strong> Used to scaffold the Next.js
              project, generate boilerplate components, and pair-program the
              prompt-builder logic.
            </li>
            <li>
              <strong>Anthropic Claude (Sonnet) API:</strong> Powers every NPC
              reply at runtime. The model receives the system prompt produced
              by our prompt builder; it does <em>not</em> directly receive the
              user's raw config.
            </li>
            <li>
              <strong>[Add other AI tools your team used here]</strong> —
              ChatGPT, Cursor, Copilot, Midjourney, etc. Disclose each one.
            </li>
          </ul>
        </Section>

        <Section title="Reflection">
          <p className="text-sm">
            Replace this section with the team's honest 200–300 word reflection
            before submission. Suggested structure: (1) what AI accelerated for
            us, (2) where AI was wrong and a human caught it, (3) what we
            learned about working with AI as collaborators rather than oracles.
          </p>
          <p className="mt-3 text-sm italic text-slate2-500 dark:text-parchment-300">
            Draft notes (delete before submission): the core IP — the
            prompt-builder pure function — was specified by the team and
            reviewed line-by-line. The model never decides which rule layers
            apply; that is human-authored code. The wellbeing timer
            implementation was AI-suggested; we deliberately verified that the
            "5 more minutes" snooze sets the next prompt 10 minutes out, not
            zero, per PRD §11.3.
          </p>
        </Section>

        <Section title="What's deliberately not here">
          <p className="text-sm">
            Per PRD §16, the following features are <strong>out of scope</strong>{" "}
            for this assessment and intentionally not built: user accounts, any
            backend database, voice I/O, 3D / VR rendering, multi-NPC group chat,
            server-side conversation persistence, payments. We made these calls
            up front to keep the 12-day timeline honest.
          </p>
        </Section>

        <Section title="License">
          <p className="text-sm">
            Coursework — not licensed for commercial use. NPC personas, scenario
            text, and product copy are written by Group D30 unless cited
            otherwise.
          </p>
        </Section>

        <div className="mt-12 border-t border-parchment-200 pt-6 text-xs text-slate2-400 dark:border-slate2-700 dark:text-parchment-300">
          <Link href="/studio" className="hover:text-accent-500">
            Open the Studio →
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-300">
        {title}
      </h2>
      <div className="mt-3 text-slate2-700 dark:text-parchment-100">
        {children}
      </div>
    </section>
  );
}
