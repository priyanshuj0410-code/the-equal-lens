import Link from "next/link";
import Mascot from "@/components/Mascot";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";
import BiasChannels from "@/components/BiasChannels";
import { scatterForPath } from "@/lib/pageMyths";
import { getAudience } from "@/lib/audience";
import { getPageContent, getTestimonials } from "@/lib/knowledge";
import Testimonials from "@/components/Testimonials";

type Audience = "kid" | "adult";

type ByAudience<T> = { kid: T; adult: T };

type Headline = { title: string; highlight: string; titleEnd: string };
type LinkItem = { label: string; href: string };
type Stat = { n: string; cap: string };
type LoopStep = { step: string; body: string };

type Content = {
  hero: {
    tag: string;
    headline: ByAudience<Headline>;
    body: ByAudience<string>;
    psstDo: ByAudience<string>;
    ctaButtons: LinkItem[];
  };
  stats: {
    heading: string;
    sub: ByAudience<string>;
    items: ByAudience<Stat[]>;
  };
  bias: {
    heading: ByAudience<string>;
    sub: ByAudience<string>;
  };
  loop: {
    eyebrow: string;
    heading: string;
    items: ByAudience<LoopStep[]>;
  };
  cta: {
    heading: ByAudience<string>;
    sub: ByAudience<string>;
    buttons: LinkItem[];
  };
  testimonials: { eyebrow: string; heading: string };
};

const STAT_COLORS = ["text-grow", "text-sky", "text-insight"];
const LOOP_COLORS = ["bg-sun", "bg-insight", "bg-sky", "bg-grow"];

export default async function Home() {
  const audience = (await getAudience()) as Audience;
  const c = (await getPageContent("home")) as Content;
  const testimonials = await getTestimonials(audience);

  const headline = c.hero.headline[audience];

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

        <MythScatter items={scatterForPath("/", audience)} />

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="tag">
              {c.hero.tag}
            </span>
            <h1 className="mt-5 font-hand text-4xl font-extrabold leading-[1.05] text-ink sm:text-6xl">
              {headline.title}{" "}
              <span className="relative whitespace-nowrap text-brand">
                {headline.highlight}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 8 C28 2 72 2 98 7" fill="none" stroke="#FF7A5C" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>{" "}
              {headline.titleEnd}
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink/70">{c.hero.body[audience]}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={c.hero.ctaButtons[0].href} className="btn btn--primary">
                {c.hero.ctaButtons[0].label}
              </Link>
              <Link href={c.hero.ctaButtons[1].href} className="btn btn--outline">
                {c.hero.ctaButtons[1].label}
              </Link>
            </div>
            <p className="mt-5 font-hand text-lg text-brand">
              ✦ Psst - grab <strong>UN</strong> or <strong>RE</strong> from the toolbar
              below and {c.hero.psstDo[audience]} right on this page.
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
          <h2 className="font-hand text-4xl font-extrabold text-ink">{c.stats.heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">{c.stats.sub[audience]}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {c.stats.items[audience].map((s, i) => (
            <div
              key={s.cap}
              style={{ transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}
              className="card hover-pop text-center"
            >
              <div
                className={`font-hand font-extrabold leading-tight ${STAT_COLORS[i]} ${
                  audience === "adult" ? "text-3xl" : "text-6xl"
                }`}
              >
                {s.n}
              </div>
              <p className="mt-2 text-ink/70">{s.cap}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW BIAS IS ABSORBED */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <h2 className="font-hand text-4xl font-extrabold text-ink">{c.bias.heading[audience]}</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">{c.bias.sub[audience]}</p>
        </div>
        <div className="mt-8">
          <BiasChannels audience={audience} />
        </div>
      </section>

      {/* LOOP */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center">
            <span className="eyebrow">
              {c.loop.eyebrow}
            </span>
            <h2 className="mt-2 font-hand text-4xl font-extrabold text-ink">
              {c.loop.heading}
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.loop.items[audience].map((l, i) => (
              <div
                key={l.step}
                style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
                className="sticker hover-pop rounded-2xl bg-surface p-6"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink ${LOOP_COLORS[i]} font-hand text-lg font-extrabold text-[#221436]`}
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

      {/* TESTIMONIALS */}
      <Testimonials
        items={testimonials}
        eyebrow={c.testimonials.eyebrow}
        heading={c.testimonials.heading}
      />

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
          <h2 className="mt-4 font-hand text-4xl font-extrabold">{c.cta.heading[audience]}</h2>
          <p className="mt-3 max-w-xl text-violet-100">{c.cta.sub[audience]}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href={c.cta.buttons[0].href} className="btn btn--sun">
              {c.cta.buttons[0].label}
            </Link>
            <Link
              href={c.cta.buttons[1].href}
              className="btn btn--band"
            >
              {c.cta.buttons[1].label}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
