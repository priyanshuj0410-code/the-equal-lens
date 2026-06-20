import type { Metadata } from "next";
import { getTeam } from "@/lib/knowledge";

export const metadata: Metadata = {
  title: "About — The Equal Lens",
  description:
    "Our vision, mission, values, and the people helping kids unlearn bias and relearn empathy.",
};

const values = [
  {
    tag: "UN",
    name: "Unlearn",
    color: "bg-insight/15 text-[#0F6E56]",
    body: "The courage to question and let go of inherited bias. We help kids notice patterns, ask why, and start fresh.",
  },
  {
    tag: "RE",
    name: "Relearn",
    color: "bg-grow/15 text-[#993C1D]",
    body: "The empathy to build something fairer in its place. We help kids imagine new possibilities and act on them.",
  },
];

export default function AboutPage() {
  const team = getTeam();

  return (
    <div>
      <section className="bg-violet-600 text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <p className="font-display text-xs uppercase tracking-widest text-violet-200">
            About
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Building awareness through play
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-violet-100">
            Children don&rsquo;t learn bias in lessons — they soak it up from
            playgrounds, media, family, and the words around them. We&rsquo;re
            here to interrupt that, gently.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 text-lg leading-relaxed text-ink/80">
        <p>
          By the time kids reach middle school, many of these patterns are
          already set. That&rsquo;s why we created The Equal Lens — to help young
          people notice, question, and reshape these ideas before they harden
          into lifelong assumptions.
        </p>
        <p className="mt-5">
          We don&rsquo;t lecture. We design playful, purposeful experiences —
          games, scenarios, activities — that make bias visible and invite
          reflection. When children meet fairness through play instead of
          memorisation, they build the confidence to question what they&rsquo;re
          told to accept.
        </p>
      </section>

      <section className="bg-white/60 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 px-5 md:grid-cols-2">
          <div className="rounded-3xl border border-mist bg-white p-8">
            <p className="font-display text-xs uppercase tracking-widest text-violet-400">
              Vision
            </p>
            <p className="mt-3 font-display text-xl text-ink">
              A generation that treats fairness as something they{" "}
              <em>do</em> — noticing bias and choosing better, on their own.
            </p>
          </div>
          <div className="rounded-3xl border border-mist bg-white p-8">
            <p className="font-display text-xs uppercase tracking-widest text-violet-400">
              Mission
            </p>
            <p className="mt-3 font-display text-xl text-ink">
              We help children unlearn bias and relearn empathy through play,
              before inherited ideas harden into lifelong assumptions.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <p className="font-display text-xs uppercase tracking-widest text-violet-400">
            Core values
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold">
            Unlearn &amp; Relearn
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">
            Two moves sit at the heart of everything — a continuous loop, not a
            one-time fix.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.tag}
              className="rounded-3xl border border-mist bg-white p-8"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl font-display font-semibold ${v.color}`}
              >
                {v.tag}
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">
                {v.name}
              </h3>
              <p className="mt-2 text-ink/70">{v.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-ink/60">
          Awareness, empathy, critical thinking, and inclusion all live inside
          these two.
        </p>
      </section>

      <section className="bg-white/60 py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center">
            <p className="font-display text-xs uppercase tracking-widest text-violet-400">
              Our team
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold">
              The people behind the lens
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div
                key={m.id}
                className="rounded-3xl border border-mist bg-white p-6 text-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.photo || "/team/placeholder.svg"}
                  alt={m.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {m.name}
                </h3>
                <p className="text-sm text-violet-600">{m.role}</p>
                {m.pronouns && (
                  <p className="text-xs text-ink/50">{m.pronouns}</p>
                )}
                <p className="mt-3 text-sm text-ink/70">{m.bio}</p>
                {m.placeholder && (
                  <span className="mt-3 inline-block rounded-full bg-mist px-2 py-0.5 text-[11px] text-violet-800">
                    placeholder
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
