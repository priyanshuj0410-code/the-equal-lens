import type { Metadata } from "next";
import Link from "next/link";
import { getPrograms } from "@/lib/knowledge";

export const metadata: Metadata = {
  title: "Programs — The Equal Lens",
  description:
    "Workshops, school programs, family sessions, and community events that bring fairness education to life.",
};

export default function ProgramsPage() {
  const programs = getPrograms();

  return (
    <div>
      <section className="bg-violet-600 text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <p className="font-display text-xs uppercase tracking-widest text-violet-200">
            Programs
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Fairness education, brought to life
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-violet-100">
            Playful, research-backed programs for schools, families, and
            communities — never preachy, always purposeful.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border border-mist bg-white p-8"
            >
              <h2 className="font-display text-xl font-semibold text-violet-600">
                {p.title}
              </h2>
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

      <section className="bg-violet-600 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-5 py-16 text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Ready to bring The Equal Lens to your community?
          </h2>
          <p className="mt-3 max-w-xl text-violet-100">
            We&rsquo;ll tailor a program to your school or organization — and
            hand you everything you need.
          </p>
          <Link
            href="/contact"
            className="mt-6 rounded-full bg-white px-6 py-2.5 font-medium text-violet-600 transition-colors hover:bg-violet-100"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
