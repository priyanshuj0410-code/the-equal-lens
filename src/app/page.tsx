import Link from "next/link";
import Mascot from "@/components/Mascot";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";
import BiasChannels from "@/components/BiasChannels";
import { scatterForPath } from "@/lib/pageMyths";
import { getAudience } from "@/lib/audience";

const loop = [
  { step: "Notice", body: "Spot the patterns and assumptions hiding in everyday moments.", color: "bg-sun" },
  { step: "Question", body: "Get curious about why things are the way they are.", color: "bg-insight" },
  { step: "Reflect", body: "Think about fairness, impact, and other points of view.", color: "bg-sky" },
  { step: "Act", body: "Make choices that challenge stereotypes — and mean it.", color: "bg-grow" },
];

const stats = [
  { n: "70%", cap: "of stereotypes absorbed before age 12", color: "text-grow" },
  { n: "85%", cap: "of mixed classrooms improve empathy", color: "text-sky" },
  { n: "92%", cap: "representation shapes aspiration", color: "text-insight" },
];

export default async function Home() {
  const audience = await getAudience();
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <Doodle name="squiggle" className="anim-float absolute left-6 top-28 w-14 text-insight" />
        <Doodle name="sparkle" className="anim-wobble absolute right-10 top-16 w-9 text-grow" />
        <Doodle name="spiral" className="anim-float absolute left-1/3 top-10 w-10 text-brandsoft" />
        <Doodle name="star" className="anim-wobble absolute right-1/4 bottom-12 w-8 text-sun" />
        <Doodle name="arrow" className="anim-float absolute right-16 bottom-24 w-14 text-brandsoft" />
        <Doodle name="heart" className="anim-wobble absolute left-12 bottom-16 w-7 text-grow" />

        <MythScatter items={scatterForPath("/")} />

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-block rounded-full border-2 border-ink bg-surface px-4 py-1 font-hand text-sm font-bold text-brand shadow-[3px_3px_0_#C5B6DE]">
              ✦ Unlearn. Relearn. Grow.
            </span>
            <h1 className="mt-5 font-hand text-4xl font-extrabold leading-[1.05] text-ink sm:text-6xl">
              Kids don&rsquo;t learn{" "}
              <span className="relative whitespace-nowrap text-brand">
                bias
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 8 C28 2 72 2 98 7" fill="none" stroke="#FF7A5C" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>{" "}
              in classrooms.
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink/70">
              They pick it up on playgrounds, in jokes, online. So we don&rsquo;t
              lecture — we hand kids an eraser and a pencil, and let them fix it
              themselves.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/programs"
                className="inline-block rounded-full border-[2.5px] border-ink bg-violet-600 px-6 py-3 font-hand text-base font-bold text-white shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
              >
                Explore programs
              </Link>
              <Link
                href="/about"
                className="inline-block rounded-full border-[2.5px] border-violet-600 bg-surface px-6 py-3 font-hand text-base font-bold text-brand shadow-[4px_4px_0_#C5B6DE] transition-transform hover:-translate-y-0.5"
              >
                Our approach
              </Link>
            </div>
            <p className="mt-5 font-hand text-lg text-brand">
              ✦ Psst — grab <strong>UN</strong> or <strong>RE</strong> from the
              toolbar below and doodle right on this page.
            </p>
          </div>

          <div className="flex items-end justify-center gap-2">
            <Mascot type="un" className="anim-bob h-44 w-auto drop-shadow-xl" />
            <Mascot type="re" className="anim-float h-52 w-auto drop-shadow-xl" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <h2 className="font-hand text-4xl font-extrabold text-ink">Why this matters</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">
            The numbers tell a powerful story about early childhood learning.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.cap}
              style={{ transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}
              className="sticker hover-pop rounded-3xl bg-surface p-8 text-center"
            >
              <div className={`font-hand text-6xl font-extrabold ${s.color}`}>{s.n}</div>
              <p className="mt-2 text-ink/70">{s.cap}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW KIDS LEARN BIAS */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <h2 className="font-hand text-4xl font-extrabold text-ink">How kids learn bias</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">
            Bias isn&rsquo;t taught in lessons — it&rsquo;s absorbed through everyday
            experiences. Tap each to explore.
          </p>
        </div>
        <div className="mt-8">
          <BiasChannels audience={audience} />
        </div>
      </section>

      {/* LOOP */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center">
            <span className="font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
              How we change it
            </span>
            <h2 className="mt-2 font-hand text-4xl font-extrabold text-ink">
              Notice → Question → Reflect → Act
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loop.map((l, i) => (
              <div
                key={l.step}
                style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
                className="sticker hover-pop rounded-2xl bg-surface p-6"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink ${l.color} font-hand text-lg font-extrabold text-[#221436]`}
                >
                  {i + 1}
                </div>
                <h3 className="mt-3 font-hand text-xl font-bold">{l.step}</h3>
                <p className="mt-1 text-sm text-ink/70">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-band text-white">
        <Doodle name="sparkle" className="anim-wobble absolute left-10 top-10 w-10 text-sun" />
        <Doodle name="squiggle" className="anim-float absolute right-12 top-16 w-16 text-insight" />
        <Doodle name="star" className="anim-wobble absolute right-1/3 bottom-8 w-8 text-grow" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-16 text-center">
          <div className="flex items-end gap-1">
            <Mascot type="un" className="anim-bob h-24 w-auto" />
            <Mascot type="re" className="anim-float h-28 w-auto" />
          </div>
          <h2 className="mt-4 font-hand text-4xl font-extrabold">
            Bring The Equal Lens to your community
          </h2>
          <p className="mt-3 max-w-xl text-violet-100">
            Workshops, school programs, family sessions, and events — tailored to
            your group.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full border-[2.5px] border-ink bg-sun px-6 py-3 font-hand text-base font-bold text-[#221436] shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
            >
              Get in touch
            </Link>
            <Link
              href="/join"
              className="rounded-full border-[2.5px] border-white bg-transparent px-6 py-3 font-hand text-base font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Join us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
