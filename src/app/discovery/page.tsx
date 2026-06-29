import type { Metadata } from "next";
import { Doodle } from "@/components/Doodles";

// Unlisted pitch page — nothing on the site links here. Keep it out of search too.
export const metadata: Metadata = {
  title: "The Discovery Program — The Equal Lens",
  description:
    "An 8-session life-skills journey for children, taught through play, stories and real conversation. Free pilot, 2026.",
  robots: { index: false, follow: false },
};

const LENSY_WAVE = "/Lensy%20-%20Wave.svg";
const LENSY_IDEA = "/Lensy%20-%20Idea.svg";
const LENSY_THINK = "/Lensy%20-%20Think.svg";
const LENSY_STAND = "/Lensy%20-%20Stand.svg";

// Tints reuse the about-page accent convention (faint fill + darkened text).
const TILE = [
  "bg-insight/15 text-[#0F6E56]",
  "bg-grow/15 text-[#993C1D]",
  "bg-sky/15 text-[#1C5A86]",
  "bg-sun/25 text-[#8A5A00]",
];

const STATS = [
  { big: "8", label: "Weekly sessions" },
  { big: "60", label: "Minutes each" },
  { big: "5–16", label: "Age groups covered" },
  { big: "₹0", label: "Cost to your organisation" },
];

const SESSIONS = [
  { n: "01", title: "Who Am I?", sub: "Identity & self-worth" },
  { n: "02", title: "Feelings Are OK", sub: "Emotions & expression" },
  { n: "03", title: "Fair Is Fair", sub: "Gender & stereotypes" },
  { n: "04", title: "Speak Up", sub: "Communication & confidence" },
  { n: "05", title: "My Body, My Rules", sub: "Body safety & personal rights" },
  { n: "06", title: "We, More Than Me", sub: "Teamwork & inclusion" },
  { n: "07", title: "Safe Online", sub: "Digital safety & bystanders" },
  { n: "08", title: "Kind Humans", sub: "Reflection & celebration" },
];

const FLOW = [
  { title: "Story Time", desc: "A short story opens the session and introduces the week's theme.", min: "10 min" },
  { title: "Big Question", desc: "Children discuss a real-life scenario in small groups — guided conversation.", min: "15 min" },
  { title: "Game or Activity", desc: "A hands-on game, role-play or card activity where children learn by doing.", min: "20 min" },
  { title: "Reflect & Share", desc: "Each child shares one thing they are taking home from today.", min: "10 min" },
  { title: "Mission Card", desc: "A small weekly challenge to practise at home with family or friends.", min: "5 min" },
];

const SKILLS = [
  "Empathy", "Teamwork", "Inclusion", "Communication",
  "Confidence", "Emotional Intelligence", "Body Safety", "Digital Safety",
  "Gender Fairness", "Self-awareness", "Bystander Power", "Healthy Relationships",
];

const AGES = [
  {
    range: "5–7 years", name: "Little Explorers",
    points: ["Feelings have names", "Kindness is a superpower", "My body belongs to me", "Friends and fairness"],
    how: "Stories, puppets, colouring, simple games",
  },
  {
    range: "8–10 years", name: "Curious Minds",
    points: ["Emotions and empathy", "Gender and fairness", "Body safety", "Speaking up"],
    how: "Card games, role-play, group discussions",
  },
  {
    range: "11–13 years", name: "Rising Leaders",
    points: ["Puberty and identity", "Consent and boundaries", "Digital safety", "Bystander courage"],
    how: "Debate, journaling, team missions",
  },
  {
    range: "14–16 years", name: "Changemakers",
    points: ["Healthy relationships", "Mental wellness", "Communication", "Being an ally"],
    how: "Peer discussions, case studies, projects",
  },
];

const RECEIVES = [
  { title: "Complete Programme Kit", desc: "All 8 session plans, facilitator guides, Lensy story kits and game materials." },
  { title: "Facilitator Training", desc: "One full training day so your team runs every session with confidence." },
  { title: "Session Guides", desc: "Detailed step-by-step plans delivered before every single session." },
  { title: "Impact Report", desc: "A full end-of-programme report, ready to share with your donors and board." },
  { title: "Certificates for Every Child", desc: "Printed certificates for each child who completes the programme." },
  { title: "Partner Recognition", desc: "Official TEL Partner certification for your organisation." },
];

const NEED = [
  { k: "15–30", label: "children", note: "Any age group, or multiple groups." },
  { k: "A room", label: "to meet weekly", note: "Anywhere children can sit and move." },
  { k: "8 weeks", label: "8 sessions", note: "One hour a week, at a time that suits you." },
  { k: "Honest", label: "feedback", note: "Tell us what works and what does not." },
];

const GETS = [
  "Full programme kit and materials",
  "Session-by-session guides",
  "Certificates for every child",
  "Partner certificate for your organisation",
  "The Equal Lens merchandise for every child",
];

const FOUNDING = [
  { initials: "RK", name: "Rashi Khandelwal", role: "Founder" },
  { initials: "SM", name: "Savneet Mehar", role: "Co-Founder" },
  { initials: "AV", name: "Arushi Verma", role: "Co-Founder" },
];
const CORE = [
  { initials: "PJ", name: "Priyanshu Jain", role: "Edu-based Game Designer" },
  { initials: "SS", name: "Shraddha Shah", role: "Learning Experience Curator" },
  { initials: "AS", name: "Aniket Singh", role: "Content Strategist" },
];

const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-2 font-hand text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-ink/70">{sub}</p>}
    </div>
  );
}

export default function DiscoveryPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-5xl px-5 pb-10 pt-16 text-center sm:pt-24">
        <Doodle name="sparkle" className="anim-wobble absolute left-6 top-10 w-9 text-sun sm:left-16" />
        <Doodle name="star" className="anim-float absolute right-8 top-20 w-7 text-grow sm:right-24" />
        <Doodle name="squiggle" className="anim-float absolute left-1/4 bottom-2 w-12 text-insight" />

        <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-4 py-1.5 font-hand text-sm font-bold text-ink shadow-[2px_2px_0_var(--color-ink)]">
          ★ Free Pilot · 2026
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl font-hand text-5xl font-extrabold leading-[1.05] text-ink sm:text-7xl">
          Raising Kinder
          <br />
          Human Beings.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
          An 8-session life-skills journey for children — taught through play, stories and real
          conversation.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 font-hand text-sm font-bold text-brand">
          <span className="rounded-full bg-mist px-3 py-1">For NGOs</span>
          <span className="rounded-full bg-mist px-3 py-1">Schools</span>
          <span className="rounded-full bg-mist px-3 py-1">Child-Care Organisations</span>
        </div>

        <div className="relative mt-10 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LENSY_WAVE} alt="Lensy waving" className="anim-bob h-40 w-auto sm:h-52" />
        </div>
        <p className="mt-4 font-hand text-xl font-extrabold tracking-wide text-brand">
          Unlearn. Relearn. Grow.
        </p>
      </section>

      {/* ── WHAT IS IT ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <SectionHead
          eyebrow="What is The Equal Lens?"
          title="A life-skills programme children actually feel."
          sub="An 8-session guided programme for children aged 5 to 16 — one hour, once a week, for eight weeks. Children build empathy, confidence, body safety, fairness and emotional intelligence not through lectures, but through play, stories and real conversation, led by Lensy."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`card flex flex-col items-center gap-2 p-6 text-center ${TILTS[i % TILTS.length]}`}>
              <span className={`flex h-16 w-16 items-center justify-center rounded-2xl font-hand text-2xl font-extrabold ${TILE[i % TILE.length]}`}>
                {s.big}
              </span>
              <span className="font-hand text-sm font-bold text-ink/70">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY IT MATTERS ───────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-5 py-12">
        <div className="card card--soft relative p-8 sm:p-12">
          <Doodle name="heart" className="anim-wobble absolute -right-3 -top-4 w-10 text-grow" />
          <Eyebrow>Why this matters</Eyebrow>
          <h2 className="mt-2 font-hand text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            School teaches them to pass. We teach them to live well together.
          </h2>
          <p className="mt-4 text-ink/70">
            Maths and science are taught every day. Empathy, consent, body safety, speaking up and
            fairness are mostly left to chance — and to whoever happens to be in a child&rsquo;s life. The
            Discovery Program closes that gap, for every child, through play rather than lectures:
            real skills, for life, not a test score.
          </p>
        </div>
      </section>

      {/* ── THE 8-SESSION JOURNEY ────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <SectionHead eyebrow="The 8-session journey" title="One hour. One theme. A new chapter every week." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SESSIONS.map((s, i) => (
            <div key={s.n} className="card flex flex-col gap-3 p-5 hover-pop">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl font-hand text-lg font-extrabold ${TILE[i % TILE.length]}`}>
                {s.n}
              </span>
              <div>
                <h3 className="font-hand text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-ink/60">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INSIDE ONE SESSION ───────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <SectionHead eyebrow="Inside one session" title="60 minutes. No lectures. Engaged from minute one." />
        <ol className="mt-10 space-y-4">
          {FLOW.map((f, i) => (
            <li key={f.title} className="card flex items-center gap-4 p-5">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-hand text-lg font-extrabold ${TILE[i % TILE.length]}`}>
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-hand text-lg font-bold text-ink">{f.title}</h3>
                <p className="text-sm text-ink/60">{f.desc}</p>
              </div>
              <span className="shrink-0 rounded-full bg-mist px-3 py-1 font-hand text-xs font-bold text-brand">
                {f.min}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brandsoft/50 px-5 py-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LENSY_IDEA} alt="" className="h-10 w-auto" />
          <p className="text-sm text-ink/70">
            Your facilitator receives a complete, step-by-step guide before every single session.
          </p>
        </div>
      </section>

      {/* ── WHAT CHILDREN LEARN ──────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <SectionHead eyebrow="What children learn" title="Real skills. For life. Not a test score." />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {SKILLS.map((skill, i) => (
            <span
              key={skill}
              className={`rounded-full border-2 border-ink px-4 py-2 font-hand text-sm font-bold shadow-[2px_2px_0_var(--color-ink)] ${TILE[i % TILE.length]}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* ── EVERY AGE ────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <SectionHead
          eyebrow="One programme. Every age."
          title="Same values. Same Lensy. Tuned to how each age learns."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AGES.map((a, i) => (
            <div key={a.range} className="card flex flex-col p-5">
              <span className={`self-start rounded-full px-3 py-1 font-hand text-xs font-bold ${TILE[i % TILE.length]}`}>
                {a.range}
              </span>
              <h3 className="mt-3 font-hand text-xl font-extrabold text-ink">{a.name}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
                {a.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-brand">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t-2 border-mist pt-3 text-xs text-ink/50">
                <span className="font-bold text-brandsoft">How:</span> {a.how}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CERTIFICATE ──────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <SectionHead eyebrow="Every child earns a certificate" title="Not for being perfect. For showing up and growing." />
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-2">
          <div className="card relative -rotate-2 p-8 text-center">
            <p className="font-hand text-2xl tracking-widest text-sun">★ ★ ★ ★ ★</p>
            <p className="mt-4 font-hand text-2xl font-extrabold text-ink">Certificate of Completion</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-brandsoft">
              The Equal Lens · Life-Skills Programme
            </p>
            <p className="mt-6 text-sm text-ink/50">This certifies that</p>
            <p className="mx-auto mt-2 w-2/3 border-b-2 border-dashed border-ink/30 pb-1 font-hand text-lg font-bold text-ink/40">
              Child&rsquo;s Name
            </p>
            <p className="mt-3 text-sm text-ink/60">has completed all 8 sessions of the Life-Skills Journey.</p>
          </div>
          <ol className="space-y-5">
            {[
              { t: "For the child", d: "For many children in care, this is the first certificate they have ever held." },
              { t: "For your organisation", d: "A credentialed, structured programme you can present to donors and trustees." },
              { t: "Partner recognition", d: "The Equal Lens officially certifies your organisation as a TEL Certified Partner." },
            ].map((item, i) => (
              <li key={item.t} className="flex gap-4">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-hand text-sm font-extrabold ${TILE[i % TILE.length]}`}>
                  {`0${i + 1}`}
                </span>
                <div>
                  <h3 className="font-hand text-lg font-bold text-ink">{item.t}</h3>
                  <p className="text-sm text-ink/60">{item.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── WHAT YOU RECEIVE ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <SectionHead eyebrow="What your organisation receives" title="Everything you need to run it with confidence." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RECEIVES.map((r, i) => (
            <div key={r.title} className="card flex flex-col gap-2 p-6 hover-pop">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl font-hand text-base font-extrabold ${TILE[i % TILE.length]}`}>
                ✓
              </span>
              <h3 className="mt-1 font-hand text-lg font-bold text-ink">{r.title}</h3>
              <p className="text-sm text-ink/60">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FREE band ────────────────────────────────────────── */}
      <section className="relative my-8 overflow-hidden bg-band py-20 text-center text-white">
        <Doodle name="sparkle" className="anim-wobble absolute left-10 top-10 w-10 text-sun" />
        <Doodle name="star" className="anim-float absolute right-12 bottom-10 w-8 text-grow" />
        <div className="mx-auto max-w-2xl px-5">
          <p className="font-hand text-7xl font-extrabold tracking-tight text-sun sm:text-8xl">FREE.</p>
          <p className="mt-4 font-hand text-2xl font-bold">Not because we have to.</p>
          <p className="mt-2 text-white/80">
            Because every child deserves this — regardless of their budget, their school, or their
            postcode.
          </p>
        </div>
      </section>

      {/* ── JOIN THE PILOT ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-4 py-1.5 font-hand text-sm font-bold text-ink shadow-[2px_2px_0_var(--color-ink)]">
            ★ Only 5 spots
          </span>
          <h2 className="mt-4 font-hand text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            We&rsquo;re selecting 3 to 5 organisations for the first cohort.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="card p-7">
            <Eyebrow>What we need from you</Eyebrow>
            <ul className="mt-4 space-y-4">
              {NEED.map((n, i) => (
                <li key={n.label} className="flex items-start gap-4">
                  <span className={`flex h-12 w-16 shrink-0 items-center justify-center rounded-xl font-hand text-base font-extrabold ${TILE[i % TILE.length]}`}>
                    {n.k}
                  </span>
                  <div>
                    <p className="font-hand font-bold text-ink">{n.label}</p>
                    <p className="text-sm text-ink/60">{n.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card card--soft p-7">
            <Eyebrow>What your organisation gets</Eyebrow>
            <ul className="mt-4 space-y-3">
              {GETS.map((g) => (
                <li key={g} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-insight/20 font-hand text-sm font-bold text-[#0F6E56]">
                    ✓
                  </span>
                  <span className="text-ink/80">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── THE PEOPLE ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <SectionHead eyebrow="The people behind this" title="Educators, facilitators & people who care deeply." />

        <p className="mt-10 text-center font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
          Founding Team
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {FOUNDING.map((m, i) => (
            <div key={m.name} className="card flex flex-col items-center gap-3 p-6 text-center">
              <span className={`flex h-16 w-16 items-center justify-center rounded-full font-hand text-xl font-extrabold ${TILE[i % TILE.length]}`}>
                {m.initials}
              </span>
              <div>
                <p className="font-hand text-lg font-bold text-ink">{m.name}</p>
                <p className="text-sm text-brandsoft">{m.role}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
          Core Team
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {CORE.map((m, i) => (
            <div key={m.name} className="card flex flex-col items-center gap-3 p-6 text-center">
              <span className={`flex h-16 w-16 items-center justify-center rounded-full font-hand text-xl font-extrabold ${TILE[(i + 1) % TILE.length]}`}>
                {m.initials}
              </span>
              <div>
                <p className="font-hand text-lg font-bold text-ink">{m.name}</p>
                <p className="text-sm text-brandsoft">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-band py-20 text-center text-white">
        <Doodle name="squiggle" className="anim-float absolute left-10 top-12 w-16 text-insight" />
        <Doodle name="heart" className="anim-wobble absolute right-12 top-16 w-9 text-grow" />
        <div className="mx-auto max-w-3xl px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LENSY_STAND} alt="Lensy" className="anim-bob mx-auto h-28 w-auto" />
          <h2 className="mt-6 font-hand text-4xl font-extrabold leading-tight sm:text-5xl">
            Partner with us.
          </h2>
          <p className="mt-3 text-lg text-white/80">
            You won&rsquo;t just run a programme — you&rsquo;ll raise better human beings.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="https://theequallens.com" className="btn btn--sun" target="_blank" rel="noreferrer">
              theequallens.com
            </a>
            <a href="mailto:support@theequallens.com" className="btn btn--outline border-white/40 text-white">
              support@theequallens.com
            </a>
            <a href="tel:+917699996104" className="btn btn--outline border-white/40 text-white">
              +91 76999 96104
            </a>
          </div>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-sun bg-sun/15 px-4 py-1.5 font-hand text-sm font-bold text-sun">
            ★ Only 5 pilot spots available
          </p>
          <p className="mt-6 font-hand text-xl font-extrabold tracking-wide text-sun">
            Unlearn. Relearn. Grow.
          </p>
        </div>
      </section>
    </div>
  );
}
