import type { Metadata } from "next";
import DonateForm from "@/components/DonateForm";
import { scatterForPath } from "@/lib/pageMyths";
import { getAudience } from "@/lib/audience";
import { getPageContent } from "@/lib/knowledge";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";

export const metadata: Metadata = {
  title: "Donate - The Equal Lens",
  description:
    "Support gender-equality education for children. Help us keep The Equal Lens free for every child.",
};

type Content = {
  hero: {
    eyebrow: string;
    headline: string;
    body: { kid: string; adult: string };
  };
  whyGiveHeading: string;
  whyGive: { title: string; body: string }[];
  formHeading: string;
  formLabels: { amount: string; name: string; email: string };
  comingSoonNote: string;
  secureNote: string;
};

export default async function DonatePage() {
  const audience = await getAudience();
  const c = (await getPageContent("donate")) as Content;
  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="heart" className="anim-wobble absolute left-10 top-16 w-12 text-grow" />
        <Doodle name="sparkle" className="anim-wobble absolute right-14 top-12 w-9 text-sun" />
        <MythScatter items={scatterForPath("/donate", audience)} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="eyebrow">{c.hero.eyebrow}</p>
          <h1 className="mt-3 font-hand text-4xl font-extrabold text-ink sm:text-5xl">{c.hero.headline}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">{c.hero.body[audience]}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-8 px-5 py-10 md:grid-cols-2">
        <div className="card">
          <h2 className="font-hand text-2xl font-bold">{c.whyGiveHeading}</h2>
          <ul className="mt-4 space-y-4">
            {c.whyGive.map((w) => (
              <li key={w.title}>
                <p className="font-hand text-lg font-bold text-brand">{w.title}</p>
                <p className="mt-1 text-sm text-ink/70">{w.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-hand text-2xl font-bold">{c.formHeading}</h2>
          <div className="mt-4">
            <DonateForm
              labels={c.formLabels}
              comingSoon={c.comingSoonNote}
              secureNote={c.secureNote}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
