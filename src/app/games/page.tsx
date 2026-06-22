import type { Metadata } from "next";
import { scatterForPath } from "@/lib/pageMyths";
import { getAudience } from "@/lib/audience";
import { getPageContent } from "@/lib/knowledge";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";

export const metadata: Metadata = {
  title: "Games - The Equal Lens",
  description: "Learn about fairness and challenge bias through play.",
};

type GameItem = { name: string; blurb: string };

type Content = {
  hero: {
    eyebrow: string;
    headline: { kid: string; adult: string };
    body: { kid: string; adult: string };
  };
  items: { kid: GameItem[]; adult: GameItem[] };
  badge: string;
};

const ITEM_COLORS = ["bg-sun", "bg-insight"];

export default async function GamesPage() {
  const audience = await getAudience();
  const c = (await getPageContent("games")) as Content;
  const items = c.items[audience];

  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="zigzag" className="anim-float absolute left-10 top-16 w-16 text-grow" />
        <Doodle name="sparkle" className="anim-wobble absolute right-12 top-12 w-9 text-sun" />
        <Doodle name="swirl" className="anim-float absolute right-1/4 bottom-10 w-14 text-brandsoft" />
        <MythScatter items={scatterForPath("/games", audience)} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="eyebrow">
            {c.hero.eyebrow}
          </p>
          <h1 className="mt-3 font-hand text-4xl font-extrabold text-ink sm:text-5xl">{c.hero.headline[audience]}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">{c.hero.body[audience]}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((g, i) => (
            <div
              key={g.name}
              style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
              className="card hover-pop"
            >
              <span className={`rounded-full border-2 border-ink ${ITEM_COLORS[i % ITEM_COLORS.length]} px-3 py-1 font-hand text-xs font-bold text-[#221436]`}>
                {c.badge}
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
