import type { Metadata } from "next";
import Link from "next/link";
import { getPrograms } from "@/lib/knowledge";
import { scatterForPath } from "@/lib/pageMyths";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";

export const metadata: Metadata = {
  title: "Programs — The Equal Lens",
  description:
    "Workshops, school programs, family sessions, and community events that bring fairness education to life.",
};

const features = [
  {
    title: "Custom Content",
    body: "Programs tailored to your community's needs",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    ),
  },
  {
    title: "Measurable Impact",
    body: "Pre and post-session assessments available",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
  {
    title: "Certified Facilitators",
    body: "All sessions led by trained educators",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="m8.5 13-1.5 9 5-3 5 3-1.5-9" />
      </svg>
    ),
  },
  {
    title: "Flexible Scheduling",
    body: "Available weekdays, evenings, and weekends",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
];

export default function ProgramsPage() {
  const programs = getPrograms();

  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="star" className="anim-wobble absolute right-12 top-12 w-9 text-sun" />
        <Doodle name="squiggle" className="anim-float absolute left-8 top-20 w-14 text-insight" />
        <Doodle name="arrow" className="anim-float absolute right-20 bottom-10 w-12 text-violet-400" />
        <MythScatter items={scatterForPath("/programs")} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="font-hand text-sm font-bold uppercase tracking-widest text-violet-400">
            Programs
          </p>
          <h1 className="mt-3 font-hand text-4xl font-extrabold text-ink sm:text-5xl">
            Fairness education, brought to life
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
            Playful, research-backed programs for schools, families, and
            communities — never preachy, always purposeful.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((p, i) => (
            <div
              key={p.id}
              style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
              className="sticker hover-pop rounded-3xl bg-white p-8"
            >
              <h2 className="font-hand text-2xl font-bold text-violet-600">{p.title}</h2>
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

      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="text-center font-hand text-4xl font-extrabold text-ink">
          Why choose our programs
        </h2>
        <div className="mt-10 grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title}>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink bg-sun text-ink">
                {f.icon}
              </div>
              <h3 className="mt-3 font-hand text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-ink/70">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-violet-600 text-white">
        <Doodle name="sparkle" className="anim-wobble absolute left-10 top-10 w-9 text-sun" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-16 text-center">
          <h2 className="font-hand text-3xl font-extrabold">
            Ready to bring The Equal Lens to your community?
          </h2>
          <p className="mt-3 max-w-xl text-violet-100">
            We&rsquo;ll tailor a program to your school or organization — and hand
            you everything you need.
          </p>
          <Link
            href="/contact"
            className="mt-6 rounded-full border-[2.5px] border-ink bg-sun px-6 py-3 font-hand text-base font-bold text-ink shadow-[4px_4px_0_#221436] transition-transform hover:-translate-y-0.5"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
