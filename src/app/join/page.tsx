import type { Metadata } from "next";
import VolunteerForm from "@/components/VolunteerForm";
import { getJobs, getPageContent } from "@/lib/knowledge";
import { scatterForPath } from "@/lib/pageMyths";
import { getAudience } from "@/lib/audience";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";

export const metadata: Metadata = {
  title: "Join us - The Equal Lens",
  description:
    "Volunteer or join the team - help bring fairness education to more children.",
};

type Content = {
  hero: {
    eyebrow: string;
    headline: { kid: string; adult: string };
    body: { kid: string; adult: string };
  };
  openRolesHeading: string;
  noOpenRolesFallback: string;
  jobCardLabels: {
    responsibilitiesLabel: string;
    requirementsLabel: string;
    applyCta: string;
  };
  volunteerHeading: string;
  volunteerIntro: string;
};

export default async function JoinPage() {
  const audience = await getAudience();
  const jobs = await getJobs();
  const c = (await getPageContent("join")) as Content;

  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="star" className="anim-wobble absolute left-12 top-14 w-9 text-sun" />
        <Doodle name="arrow" className="anim-float absolute right-16 top-16 w-12 text-brandsoft" />
        <MythScatter items={scatterForPath("/join", audience)} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="eyebrow">
            {c.hero.eyebrow}
          </p>
          <h1 className="mt-3 font-hand text-4xl font-extrabold text-ink sm:text-5xl">
            {c.hero.headline[audience]}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
            {c.hero.body[audience]}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8">
        <h2 className="font-hand text-3xl font-extrabold">{c.openRolesHeading}</h2>
        {jobs.length === 0 ? (
          <p className="mt-4 text-ink/60">
            {c.noOpenRolesFallback}
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {jobs.map((j) => (
              <div key={j.id} className="sticker rounded-3xl bg-surface p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-hand text-2xl font-bold">{j.title}</h3>
                  <span className="rounded-full border-2 border-ink bg-sun px-3 py-0.5 font-hand text-xs font-bold text-[#221436]">
                    {j.type}
                  </span>
                  {j.location && <span className="text-xs text-ink/50">{j.location}</span>}
                </div>
                <p className="mt-2 text-ink/70">{j.summary}</p>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  {j.responsibilities && (
                    <div>
                      <p className="font-hand text-sm font-bold text-ink/80">{c.jobCardLabels.responsibilitiesLabel}</p>
                      <ul className="mt-2 space-y-1 text-sm text-ink/70">
                        {j.responsibilities.map((r) => (
                          <li key={r} className="flex gap-2"><span className="text-insight">✓</span><span>{r}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {j.requirements && (
                    <div>
                      <p className="font-hand text-sm font-bold text-ink/80">{c.jobCardLabels.requirementsLabel}</p>
                      <ul className="mt-2 space-y-1 text-sm text-ink/70">
                        {j.requirements.map((r) => (
                          <li key={r} className="flex gap-2"><span className="text-grow">•</span><span>{r}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <a
                  href={`mailto:${j.applyEmail || "support@theequallens.com"}?subject=${encodeURIComponent(`Application: ${j.title}`)}`}
                  className="mt-5 btn btn--primary btn--sm"
                >
                  {c.jobCardLabels.applyCta}
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-2xl px-5 py-12">
        <div className="card">
          <h2 className="font-hand text-3xl font-extrabold">{c.volunteerHeading}</h2>
          <p className="mt-2 text-ink/70">
            {c.volunteerIntro}
          </p>
          <div className="mt-6">
            <VolunteerForm />
          </div>
        </div>
      </section>
    </div>
  );
}
