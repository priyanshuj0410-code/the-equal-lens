import type { Metadata } from "next";
import { getTeam } from "@/lib/knowledge";
import { scatterForPath } from "@/lib/pageMyths";
import { getAudience } from "@/lib/audience";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";

export const metadata: Metadata = {
  title: "About - The Equal Lens",
  description:
    "Our vision, mission, values, and the people helping people unlearn bias and relearn empathy.",
};

const ABOUT = {
  kid: {
    title: "Building awareness through play",
    sub: "Children don’t learn bias in lessons - they soak it up from playgrounds, media, family, and the words around them. We’re here to interrupt that, gently.",
    narrative:
      "By middle school, many of these patterns are already set. So we don’t lecture - we design playful, purposeful experiences that make bias visible and invite reflection. When kids meet fairness through play instead of memorisation, they build the confidence to question what they’re told to accept.",
    vision:
      "A generation that treats fairness as something they do - noticing bias and choosing better, on their own.",
    mission:
      "We help children unlearn bias and relearn empathy through play, before inherited ideas harden into lifelong assumptions.",
  },
  adult: {
    title: "The bias you carry didn’t start with you",
    sub: "We absorbed it from playgrounds, screens, and ‘that’s just how it is’ - long before we could question it. The Equal Lens helps adults notice it and choose differently.",
    narrative:
      "By adulthood most of it runs on autopilot - in who we hire, who we expect to caretake, who we picture as ‘the leader.’ We don’t lecture. We make those patterns visible and give people honest, judgment-free ways to unlearn them and relearn something fairer.",
    vision:
      "Adults who treat fairness as a daily practice - noticing bias and choosing better, on their own.",
    mission:
      "We help 18–35s unlearn the bias they absorbed and relearn empathy - in their workplaces, relationships, and homes.",
  },
};

const values = [
  {
    tag: "UN",
    name: "Unlearn",
    color: "bg-insight/15 text-[#0F6E56]",
    body: "The courage to question and let go of inherited bias. We help people notice patterns, ask why, and start fresh.",
  },
  {
    tag: "RE",
    name: "Relearn",
    color: "bg-grow/15 text-[#993C1D]",
    body: "The empathy to build something fairer in its place. We help people imagine new possibilities and act on them.",
  },
];

export default async function AboutPage() {
  const audience = await getAudience();
  const t = ABOUT[audience];
  const team = await getTeam();

  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="sparkle" className="anim-wobble absolute right-10 top-12 w-9 text-grow" />
        <Doodle name="spiral" className="anim-float absolute left-8 top-24 w-10 text-brandsoft" />
        <Doodle name="heart" className="anim-wobble absolute right-1/4 bottom-10 w-7 text-grow" />
        <MythScatter items={scatterForPath("/about", audience)} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
            About
          </p>
          <h1 className="mt-3 font-hand text-4xl font-extrabold text-ink sm:text-5xl">
            {t.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">{t.sub}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-8 text-lg leading-relaxed text-ink/80">
        <p>{t.narrative}</p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-5 py-12 md:grid-cols-2">
        <div className="sticker hover-pop rounded-3xl bg-surface p-8">
          <p className="font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
            Vision
          </p>
          <p className="mt-3 font-hand text-2xl font-bold text-ink">{t.vision}</p>
        </div>
        <div className="sticker hover-pop rounded-3xl bg-surface p-8">
          <p className="font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
            Mission
          </p>
          <p className="mt-3 font-hand text-2xl font-bold text-ink">{t.mission}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="text-center">
          <p className="font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
            Core values
          </p>
          <h2 className="mt-2 font-hand text-4xl font-extrabold">Unlearn &amp; Relearn</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {values.map((v) => (
            <div key={v.tag} className="sticker hover-pop rounded-3xl bg-surface p-8">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-hand text-lg font-extrabold ${v.color}`}>
                {v.tag}
              </div>
              <h3 className="mt-4 font-hand text-2xl font-bold">{v.name}</h3>
              <p className="mt-2 text-ink/70">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="text-center">
          <p className="font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
            Our team
          </p>
          <h2 className="mt-2 font-hand text-4xl font-extrabold">The people behind the lens</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <div key={m.id} className="sticker hover-pop rounded-3xl bg-surface p-6 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.photo || "/team/placeholder.svg"}
                alt={m.name}
                className="mx-auto h-24 w-24 rounded-full border-2 border-ink object-cover"
              />
              <h3 className="mt-4 font-hand text-lg font-bold">{m.name}</h3>
              <p className="text-sm text-brand">{m.role}</p>
              {m.pronouns && <p className="text-xs text-ink/50">{m.pronouns}</p>}
              <p className="mt-3 text-sm text-ink/70">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
