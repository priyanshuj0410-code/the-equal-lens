import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTeam, getPageContent } from "@/lib/knowledge";
import { scatterForPath } from "@/lib/pageMyths";
import { getAudience } from "@/lib/audience";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";

export const metadata: Metadata = {
  title: "About - The Equal Lens",
  description:
    "Our vision, mission, values, and the people helping people unlearn bias and relearn empathy.",
};

type Audienced = { kid: string; adult: string };

type Content = {
  hero: { eyebrow: string; headline: Audienced; body: Audienced };
  narrative: Audienced;
  vision: { eyebrow: string; body: Audienced };
  mission: { eyebrow: string; body: Audienced };
  coreValues: {
    sectionEyebrow: string;
    sectionHeading: string;
    items: { tag: string; name: string; body: string }[];
  };
  team: { sectionEyebrow: string; sectionHeading: string };
};

const VALUE_COLORS = ["bg-insight/15 text-[#0F6E56]", "bg-grow/15 text-[#993C1D]"];

const LINK_ICONS: Record<string, ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.4 4.78 5.52V21h-4v-5.5c0-1.3-.02-3-1.95-3-1.95 0-2.25 1.45-2.25 2.9V21H10z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.5 8.6L23 22h-6.9l-5.4-7-6.2 7H1.4l8-9.1L1 2h7l4.9 6.5zm-2.4 18h1.9L7.6 4H5.6z" />
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18" />
    </svg>
  ),
};

export default async function AboutPage() {
  const audience = await getAudience();
  const c = (await getPageContent("about")) as Content;
  const team = await getTeam();

  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="sparkle" className="anim-wobble absolute right-10 top-12 w-9 text-grow" />
        <Doodle name="spiral" className="anim-float absolute left-8 top-24 w-10 text-brandsoft" />
        <Doodle name="heart" className="anim-wobble absolute right-1/4 bottom-10 w-7 text-grow" />
        <MythScatter items={scatterForPath("/about", audience)} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="eyebrow">
            {c.hero.eyebrow}
          </p>
          <h1 className="mt-3 font-hand text-4xl font-extrabold text-ink sm:text-5xl">
            {c.hero.headline[audience]}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">{c.hero.body[audience]}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-8 text-lg leading-relaxed text-ink/80">
        <p>{c.narrative[audience]}</p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-5 py-12 md:grid-cols-2">
        <div className="card hover-pop">
          <p className="eyebrow">
            {c.vision.eyebrow}
          </p>
          <p className="mt-3 font-hand text-2xl font-bold text-ink">{c.vision.body[audience]}</p>
        </div>
        <div className="card hover-pop">
          <p className="eyebrow">
            {c.mission.eyebrow}
          </p>
          <p className="mt-3 font-hand text-2xl font-bold text-ink">{c.mission.body[audience]}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="text-center">
          <p className="eyebrow">
            {c.coreValues.sectionEyebrow}
          </p>
          <h2 className="mt-2 font-hand text-4xl font-extrabold">{c.coreValues.sectionHeading}</h2>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {c.coreValues.items.map((v, i) => (
            <div key={v.tag} className="card hover-pop">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-hand text-lg font-extrabold ${VALUE_COLORS[i % VALUE_COLORS.length]}`}>
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
          <p className="eyebrow">
            {c.team.sectionEyebrow}
          </p>
          <h2 className="mt-2 font-hand text-4xl font-extrabold">{c.team.sectionHeading}</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => {
            const now = m.photo || "/team/placeholder.svg";
            const baby = m.babyPhoto || now; // graceful fallback when no baby pic yet
            const links = m.links ? Object.entries(m.links).filter(([, v]) => v) : [];
            return (
              <div
                key={m.id}
                className="team-card sticker hover-pop overflow-hidden rounded-3xl bg-surface"
              >
                <div className="team-photo aspect-square w-full bg-mist">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="now" src={now} alt={m.name} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="baby" src={baby} alt="" aria-hidden="true" />
                </div>
                <div className="p-5">
                  <h3 className="font-hand text-xl font-extrabold text-ink">{m.name}</h3>
                  <p className="mt-0.5 text-sm font-semibold text-brand">
                    {m.role}
                    {m.pronouns && (
                      <span className="font-normal text-ink/70"> · {m.pronouns}</span>
                    )}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/65">
                    {m.bio}
                  </p>
                  {links.length > 0 && (
                    <div className="mt-4 flex gap-2">
                      {links.map(([k, href]) => (
                        <a
                          key={k}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${m.name} on ${k}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-mist text-brand transition-colors hover:border-ink hover:bg-mist hover:text-ink"
                        >
                          {LINK_ICONS[k] ?? LINK_ICONS.website}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
