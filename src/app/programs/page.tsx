import type { Metadata } from "next";
import Link from "next/link";
import { getPrograms } from "@/lib/knowledge";
import { scatterForPath } from "@/lib/pageMyths";
import { getAudience } from "@/lib/audience";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";
import Mascot from "@/components/Mascot";

export const metadata: Metadata = {
  title: "Programs - The Equal Lens",
  description:
    "Workshops and sessions that bring fairness education to life - for schools, families, workplaces, and communities.",
};

const PROGRAMS = {
  kid: {
    heroTitle: "Fairness education, brought to life",
    heroSub:
      "Playful, research-backed programs for schools, families, and communities - never preachy, always purposeful.",
    whyTitle: "Kids don’t remember lectures. They remember what they figure out themselves.",
    whySub: "That’s the idea behind every Equal Lens program - and why the lesson actually sticks.",
    oldText: "Sit kids down and tell them what’s fair.",
    oldOutcome: "Polite nods… forgotten by lunch.",
    newText: "Hand kids the tools to spot bias and rewrite it - through play they enjoy.",
    newOutcome: "A shift they actually carry with them.",
    proof: ["Age-appropriate", "Research-backed", "Fits your curriculum", "No prep for you"],
    ctaTitle: "Ready to bring The Equal Lens to your community?",
    ctaSub: "We’ll tailor a program to your school or organization - and hand you everything you need.",
  },
  adult: {
    heroTitle: "Bias workshops people don’t roll their eyes at",
    heroSub:
      "Honest, practical, research-backed sessions for workplaces, campuses, and communities - never preachy.",
    whyTitle: "Slideshows don’t change minds. Noticing it yourself does.",
    whySub: "That’s the idea behind every Equal Lens session - and why it actually outlasts the meeting.",
    oldText: "Run a one-off ‘unconscious bias’ slideshow and tick the box.",
    oldOutcome: "Everyone nods. Nothing changes by Monday.",
    newText: "Give people honest tools to spot bias in real situations - and practise doing it differently.",
    newOutcome: "Habits that outlast the session.",
    proof: ["Judgment-free", "Research-backed", "Fits your org", "No prep for you"],
    ctaTitle: "Ready to bring The Equal Lens to your team?",
    ctaSub: "We’ll tailor a session to your workplace, campus, or community - and hand you everything you need.",
  },
};

const features = [
  {
    title: "Built around your group",
    body: "Every session is shaped to your community’s ages, context, and goals - never copy-paste.",
    bodyAdult: "Every session is shaped to your team’s context, seniority, and goals - never a generic deck.",
    color: "#993C1D",
    tint: "#FAD9CE",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    ),
  },
  {
    title: "Proof it's working",
    body: "Quick pre- and post-session check-ins show exactly how attitudes shift.",
    bodyAdult: "Quick pre- and post-session check-ins show exactly how attitudes and behaviours shift.",
    color: "#0F6E56",
    tint: "#D7F5EC",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
  {
    title: "Led by real educators",
    body: "Trained facilitators who hold the room with warmth - and zero preachiness.",
    bodyAdult: "Trained facilitators who hold the room with honesty - and zero preachiness.",
    color: "#185FA5",
    tint: "#DCEEFB",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="m8.5 13-1.5 9 5-3 5 3-1.5-9" />
      </svg>
    ),
  },
  {
    title: "Around your timetable",
    body: "Weekdays, evenings, weekends - we fit you, not the other way round.",
    bodyAdult: "Weekdays, evenings, remote - we fit your calendar, not the other way round.",
    color: "#8A5A00",
    tint: "#FCEFCB",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
];

export default async function ProgramsPage() {
  const audience = await getAudience();
  const t = PROGRAMS[audience];
  const programs = getPrograms(audience);

  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="star" className="anim-wobble absolute right-12 top-12 w-9 text-sun" />
        <Doodle name="squiggle" className="anim-float absolute left-8 top-20 w-14 text-insight" />
        <Doodle name="arrow" className="anim-float absolute right-20 bottom-10 w-12 text-brandsoft" />
        <MythScatter items={scatterForPath("/programs", audience)} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="eyebrow">
            Programs
          </p>
          <h1 className="mt-3 font-hand text-4xl font-extrabold text-ink sm:text-5xl">
            {t.heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">{t.heroSub}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((p, i) => (
            <div
              key={p.id}
              style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
              className="card hover-pop"
            >
              <h2 className="font-hand text-2xl font-bold text-brand">{p.title}</h2>
              <p className="mt-2 text-ink/70">{p.summary}</p>
              <ul className="mt-4 space-y-2">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-ink/80">
                    <span className="mt-0.5 text-insight">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <p className="eyebrow">
            Why choose us
          </p>
          <h2 className="mx-auto mt-2 max-w-2xl font-hand text-3xl font-extrabold text-ink sm:text-4xl">
            {t.whyTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">{t.whySub}</p>
        </div>

        <div className="mt-10 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-3xl border-2 border-dashed border-violet-200 bg-surface/50 p-7">
            <span className="font-hand text-xs font-bold uppercase tracking-widest text-ink/40">
              the usual way
            </span>
            <p className="mt-3 font-hand text-xl font-bold text-ink/45 line-through decoration-grow decoration-2">
              {t.oldText}
            </p>
            <p className="mt-3 text-sm text-ink/45">{t.oldOutcome}</p>
          </div>

          <Doodle name="arrow" className="mx-auto w-12 rotate-90 text-brandsoft md:rotate-0" />

          <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-violet-600 p-7 text-white shadow-[6px_7px_0_var(--color-ink)]">
            <span className="font-hand text-xs font-bold uppercase tracking-widest text-violet-200">
              the equal lens way
            </span>
            <p className="mt-3 max-w-[15rem] font-hand text-xl font-bold">{t.newText}</p>
            <p className="mt-3 max-w-[15rem] text-sm text-violet-100">{t.newOutcome}</p>
            <Mascot type="re" className="pointer-events-none absolute -bottom-2 right-1 h-24 w-auto" />
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="sticker flex gap-4 rounded-3xl bg-surface p-6">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-ink"
                style={{ background: f.tint, color: f.color }}
              >
                {f.icon}
              </div>
              <div>
                <h3 className="font-hand text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-1 text-sm text-ink/70">
                  {audience === "adult" ? f.bodyAdult : f.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {t.proof.map((p) => (
            <span
              key={p}
              className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-surface px-3 py-1.5 font-hand text-xs font-bold text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-insight" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 6" />
              </svg>
              {p}
            </span>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-band text-white">
        <Doodle name="sparkle" className="anim-wobble absolute left-10 top-10 w-9 text-sun" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-16 text-center">
          <h2 className="font-hand text-3xl font-extrabold">{t.ctaTitle}</h2>
          <p className="mt-3 max-w-xl text-violet-100">{t.ctaSub}</p>
          <Link
            href="/contact"
            className="mt-6 btn btn--sun"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
