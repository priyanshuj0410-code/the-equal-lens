import type { Metadata } from "next";
import { scatterForPath } from "@/lib/pageMyths";
import { getAudience } from "@/lib/audience";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";

export const metadata: Metadata = {
  title: "Games — The Equal Lens",
  description: "Learn about fairness and challenge bias through play.",
};

const GAMES = {
  kid: {
    title: "Learn fairness through play",
    sub: "Until our games are rebuilt, the whole site is your playground — grab UN and RE from the toolbar and bust a myth right here.",
    items: [
      { name: "Sort It Out!", blurb: "Some statements feel normal — but are they fair? Drag each card into the right box and find out.", color: "bg-sun" },
      { name: "What Would You Do?", blurb: "Real situations kids face every day. Make your choice: challenge it, or let it slide.", color: "bg-insight" },
    ],
  },
  adult: {
    title: "Same idea, grown-up edition",
    sub: "Until our games are rebuilt, the whole site is your canvas — grab UN and RE from the toolbar and bust a myth right here.",
    items: [
      { name: "Spot the Bias", blurb: "Real moments from work, dating, and family. Which are fair — and which just feel normal?", color: "bg-sun" },
      { name: "What Would You Do?", blurb: "You see it in a meeting or a group chat. Speak up, or let it slide?", color: "bg-insight" },
    ],
  },
};

export default async function GamesPage() {
  const audience = await getAudience();
  const t = GAMES[audience];

  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="zigzag" className="anim-float absolute left-10 top-16 w-16 text-grow" />
        <Doodle name="sparkle" className="anim-wobble absolute right-12 top-12 w-9 text-sun" />
        <Doodle name="swirl" className="anim-float absolute right-1/4 bottom-10 w-14 text-brandsoft" />
        <MythScatter items={scatterForPath("/games", audience)} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
            Games
          </p>
          <h1 className="mt-3 font-hand text-4xl font-extrabold text-ink sm:text-5xl">{t.title}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">{t.sub}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {t.items.map((g, i) => (
            <div
              key={g.name}
              style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
              className="sticker hover-pop rounded-3xl bg-surface p-8"
            >
              <span className={`rounded-full border-2 border-ink ${g.color} px-3 py-1 font-hand text-xs font-bold text-[#221436]`}>
                coming soon
              </span>
              <h2 className="mt-4 font-hand text-2xl font-bold">{g.name}</h2>
              <p className="mt-2 text-ink/70">{g.blurb}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
