import type { Metadata } from "next";
import VolunteerForm from "@/components/VolunteerForm";
import { getJobs } from "@/lib/knowledge";

export const metadata: Metadata = {
  title: "Join us — The Equal Lens",
  description:
    "Volunteer or join the team — help bring fairness education to more children.",
};

export default function JoinPage() {
  const jobs = getJobs();

  return (
    <div>
      <section className="bg-violet-600 text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <p className="font-display text-xs uppercase tracking-widest text-violet-200">
            Join us
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Be part of how kids learn fairness
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-violet-100">
            Bring a workshop to life, or help behind the scenes. Every bit moves
            a child from noticing to acting.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="font-display text-2xl font-semibold">Open roles</h2>
        {jobs.length === 0 ? (
          <p className="mt-4 text-ink/60">
            No open roles right now — but we&rsquo;d still love volunteers. Fill
            in the form below.
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {jobs.map((j) => (
              <div
                key={j.id}
                className="rounded-3xl border border-mist bg-white p-7"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-xl font-semibold">
                    {j.title}
                  </h3>
                  <span className="rounded-full bg-violet-100 px-3 py-0.5 text-xs font-medium text-violet-800">
                    {j.type}
                  </span>
                  {j.location && (
                    <span className="text-xs text-ink/50">{j.location}</span>
                  )}
                </div>
                <p className="mt-2 text-ink/70">{j.summary}</p>

                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  {j.responsibilities && (
                    <div>
                      <p className="text-sm font-medium text-ink/80">
                        What you&rsquo;ll do
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-ink/70">
                        {j.responsibilities.map((r) => (
                          <li key={r} className="flex gap-2">
                            <span className="text-insight">✓</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {j.requirements && (
                    <div>
                      <p className="text-sm font-medium text-ink/80">
                        What we look for
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-ink/70">
                        {j.requirements.map((r) => (
                          <li key={r} className="flex gap-2">
                            <span className="text-grow">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <a
                    href={`mailto:${
                      j.applyEmail || "support@theequallens.com"
                    }?subject=${encodeURIComponent(`Application: ${j.title}`)}`}
                    className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-800"
                  >
                    Apply by email
                  </a>
                  {j.compensation && (
                    <span className="text-xs text-ink/50">{j.compensation}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white/60 py-16">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="font-display text-2xl font-semibold">
            Volunteer with us
          </h2>
          <p className="mt-2 text-ink/70">
            Tell us a little about yourself and how you&rsquo;d like to help.
          </p>
          <div className="mt-6">
            <VolunteerForm />
          </div>
        </div>
      </section>
    </div>
  );
}
