import type { Metadata } from "next";
import FacilitatorForm from "@/components/FacilitatorForm";
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
  facilitator: {
    eyebrow: string;
    heading: string;
    intro: string;
    whatYouDoLabel: string;
    whatYouDo: string[];
    whatWeLookLabel: string;
    whatWeLook: string[];
    detailsLabel: string;
    details: string[];
    processLabel: string;
    process: string[];
    formHeading: string;
    formIntro: string;
  };
};

export default async function JoinPage() {
  const audience = await getAudience();
  // The workshop facilitator has its own dedicated section + registration form
  // below, so drop it from the generic roles list (it may still exist in Sanity).
  const jobs = (await getJobs()).filter(
    (j) => j.id !== "workshop-facilitator" && !/facilitator/i.test(j.title),
  );
  const c = (await getPageContent("join")) as Content;
  const f = c.facilitator;

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

      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="card">
          <p className="eyebrow">{f.eyebrow}</p>
          <h2 className="mt-2 font-hand text-3xl font-extrabold text-ink">{f.heading}</h2>
          <p className="mt-3 text-ink/70">{f.intro}</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="font-hand text-sm font-bold text-ink/80">{f.whatYouDoLabel}</p>
              <ul className="mt-2 space-y-1 text-sm text-ink/70">
                {f.whatYouDo.map((r) => (
                  <li key={r} className="flex gap-2"><span className="text-insight">✓</span><span>{r}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-hand text-sm font-bold text-ink/80">{f.whatWeLookLabel}</p>
              <ul className="mt-2 space-y-1 text-sm text-ink/70">
                {f.whatWeLook.map((r) => (
                  <li key={r} className="flex gap-2"><span className="text-grow">•</span><span>{r}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {f.details.map((d) => (
              <span key={d} className="rounded-full border border-mist bg-surface px-3 py-1 text-xs font-medium text-ink/70">
                {d}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-mist/40 p-5">
            <p className="font-hand text-sm font-bold text-ink/80">{f.processLabel}</p>
            <ol className="mt-2 space-y-1.5 text-sm text-ink/70">
              {f.process.map((p, i) => (
                <li key={p} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-surface">
                    {i + 1}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 border-t border-mist pt-6">
            <h3 className="font-hand text-2xl font-bold text-ink">{f.formHeading}</h3>
            <p className="mt-1 text-ink/70">{f.formIntro}</p>
            <div className="mt-5">
              <FacilitatorForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
