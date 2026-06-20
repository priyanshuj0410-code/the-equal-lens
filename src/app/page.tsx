import Link from "next/link";
import { getMyths } from "@/lib/knowledge";

const loop = [
  { step: "Notice", body: "Help kids spot patterns and question assumptions in everyday moments." },
  { step: "Question", body: "Encourage curiosity about why things are the way they are." },
  { step: "Reflect", body: "Make space to think about fairness, impact, and other perspectives." },
  { step: "Act", body: "Empower kids to make choices that challenge stereotypes." },
];

const why = [
  { title: "Absorbed early", body: "Much of our bias is picked up before age 12 — through play, not lessons." },
  { title: "Empathy grows", body: "Mixed, inclusive groups help children build empathy for one another." },
  { title: "Seeing is believing", body: "What kids see represented shapes what they believe they can become." },
];

export default function Home() {
  const myths = getMyths();
  const teaser = myths[0];
  const preview = myths.slice(0, 3);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="font-display text-xs uppercase tracking-widest text-violet-400">
            Unlearn. Relearn. Grow.
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Kids don&rsquo;t learn bias in classrooms.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink/70">
            They pick it up on playgrounds, in jokes, online. So we don&rsquo;t
            lecture — we help children notice it, question it, and draw something
            fairer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/programs"
              className="rounded-full bg-violet-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-violet-800"
            >
              Explore programs
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-violet-200 px-6 py-2.5 font-medium text-violet-600 transition-colors hover:bg-violet-50"
            >
              Our approach
            </Link>
          </div>
        </div>

        {teaser && (
          <div className="rounded-3xl bg-violet-600 p-8 text-white">
            <p className="font-display text-xs uppercase tracking-widest text-violet-200">
              Unlearn → Relearn
            </p>
            <p className="mt-4 text-lg text-violet-200 line-through decoration-grow decoration-2">
              {teaser.myth}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">
              {teaser.truth}
            </p>
            <p className="mt-3 text-sm text-violet-100">{teaser.explanation}</p>
          </div>
        )}
      </section>

      <section className="bg-white/60 py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center font-display text-3xl font-semibold">
            Why this matters
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {why.map((w) => (
              <div
                key={w.title}
                className="rounded-3xl border border-mist bg-white p-7"
              >
                <h3 className="font-display text-lg font-semibold text-violet-600">
                  {w.title}
                </h3>
                <p className="mt-2 text-ink/70">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <p className="font-display text-xs uppercase tracking-widest text-violet-400">
            How we change it
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold">
            Notice → Question → Reflect → Act
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loop.map((l, i) => (
            <div
              key={l.step}
              className="rounded-3xl border border-mist bg-white p-6"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 font-display text-sm font-semibold text-violet-800">
                {i + 1}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">
                {l.step}
              </h3>
              <p className="mt-1 text-sm text-ink/70">{l.body}</p>
            </div>
          ))}
        </div>
      </section>

      {preview.length > 0 && (
        <section className="bg-white/60 py-16">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="text-center font-display text-3xl font-semibold">
              Myths we help kids unbox
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {preview.map((m) => (
                <div
                  key={m.id}
                  className="rounded-3xl border border-mist bg-white p-6"
                >
                  <p className="text-ink/50 line-through decoration-grow decoration-2">
                    {m.myth}
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold text-violet-600">
                    {m.truth}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-violet-600 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-5 py-16 text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Bring The Equal Lens to your community
          </h2>
          <p className="mt-3 max-w-xl text-violet-100">
            Workshops, school programs, family sessions, and events — tailored to
            your group.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-white px-6 py-2.5 font-medium text-violet-600 transition-colors hover:bg-violet-100"
            >
              Get in touch
            </Link>
            <Link
              href="/join"
              className="rounded-full border border-white/40 px-6 py-2.5 font-medium text-white transition-colors hover:bg-white/10"
            >
              Join us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
