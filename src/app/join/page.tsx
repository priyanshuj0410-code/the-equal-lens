import type { Metadata } from "next";
import VolunteerForm from "@/components/VolunteerForm";
import { getJobs } from "@/lib/knowledge";
import { scatterForPath } from "@/lib/pageMyths";
import { Doodle } from "@/components/Doodles";
import MythScatter from "@/components/MythScatter";

export const metadata: Metadata = {
  title: "Join us — The Equal Lens",
  description:
    "Volunteer or join the team — help bring fairness education to more children.",
};

export default function JoinPage() {
  const jobs = getJobs();

  return (
    <div>
      <section className="relative overflow-hidden">
        <Doodle name="star" className="anim-wobble absolute left-12 top-14 w-9 text-sun" />
        <Doodle name="arrow" className="anim-float absolute right-16 top-16 w-12 text-violet-400" />
        <MythScatter items={scatterForPath("/join")} />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="font-hand text-sm font-bold uppercase tracking-widest text-violet-400">
            Join us
          </p>
          <h1 className="mt-3 font-hand text-5xl font-extrabold text-ink">
            Be part of how kids learn fairness
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
            Bring a workshop to life, or help behind the scenes. Every bit moves
            a child from noticing to acting.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8">
        <h2 className="font-hand text-3xl font-extrabold">Open roles</h2>
        {jobs.length === 0 ? (
          <p className="mt-4 text-ink/60">
            No open roles right now — but we&rsquo;d still love volunteers. Fill
            in the form below.
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {jobs.map((j) => (
              <div key={j.id} className="sticker rounded-3xl bg-white p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-hand text-2xl font-bold">{j.title}</h3>
                  <span className="rounded-full border-2 border-ink bg-sun px-3 py-0.5 font-hand text-xs font-bold text-ink">
                    {j.type}
                  </span>
                  {j.location && <span className="text-xs text-ink/50">{j.location}</span>}
                </div>
                <p className="mt-2 text-ink/70">{j.summary}</p>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  {j.responsibilities && (
                    <div>
                      <p className="font-hand text-sm font-bold text-ink/80">What you&rsquo;ll do</p>
                      <ul className="mt-2 space-y-1 text-sm text-ink/70">
                        {j.responsibilities.map((r) => (
                          <li key={r} className="flex gap-2"><span className="text-insight">✓</span><span>{r}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {j.requirements && (
                    <div>
                      <p className="font-hand text-sm font-bold text-ink/80">What we look for</p>
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
                  className="mt-5 inline-block rounded-full border-[2.5px] border-ink bg-violet-600 px-5 py-2 font-hand text-sm font-bold text-white shadow-[3px_3px_0_#221436] transition-transform hover:-translate-y-0.5"
                >
                  Apply by email
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-2xl px-5 py-12">
        <div className="sticker rounded-3xl bg-white p-8">
          <h2 className="font-hand text-3xl font-extrabold">Volunteer with us</h2>
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
