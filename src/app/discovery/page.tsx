import type { Metadata } from "next";
import { Doodle } from "@/components/Doodles";

// Unlisted pitch page. Nothing on the site links here, and it stays out of search.
export const metadata: Metadata = {
  title: "The Discovery Program · The Equal Lens",
  description:
    "An 8 session life skills journey for children, taught through play, stories and real conversation. Free pilot, 2026.",
  robots: { index: false, follow: false },
};

const LENSY_WAVE = "/Lensy%20-%20Wave.svg";
const LENSY_IDEA = "/Lensy%20-%20Idea.svg";
const LENSY_STAND = "/Lensy%20-%20Stand.svg";

const TOTAL = 12;

// Faint fill + darkened text, matching the about-page accent tiles.
const TILE = [
  "bg-insight/15 text-[#0F6E56]",
  "bg-grow/15 text-[#993C1D]",
  "bg-sky/15 text-[#1C5A86]",
  "bg-sun/25 text-[#8A5A00]",
];

const STATS = [
  { big: "8", label: "Weekly sessions" },
  { big: "60", label: "Minutes each" },
  { big: "5 to 16", label: "Age groups covered" },
  { big: "₹0", label: "Cost to you" },
];

const SESSIONS = [
  { n: "01", title: "Who Am I?", sub: "Knowing yourself" },
  { n: "02", title: "Feelings Are OK", sub: "Naming and sharing feelings" },
  { n: "03", title: "Fair Is Fair", sub: "Gender and fairness" },
  { n: "04", title: "Speak Up", sub: "Speaking with confidence" },
  { n: "05", title: "My Body, My Rules", sub: "Body safety and personal space" },
  { n: "06", title: "We, More Than Me", sub: "Working together and including everyone" },
  { n: "07", title: "Safe Online", sub: "Staying safe on phones and the internet" },
  { n: "08", title: "Kind Humans", sub: "Looking back and celebrating" },
];

const FLOW = [
  { title: "Story Time", min: "10 min", desc: "A short story opens the session and brings in the theme for the week." },
  { title: "Big Question", min: "15 min", desc: "Children talk about a real life moment in small groups. Gentle, guided talk." },
  { title: "Game or Activity", min: "20 min", desc: "A hands on game, role play, or card activity where children learn by doing." },
  { title: "Reflect and Share", min: "10 min", desc: "Each child shares one thing they are taking home today." },
  { title: "Mission Card", min: "5 min", desc: "A small task to try at home with family or friends." },
];

const SKILLS = [
  "Empathy", "Teamwork", "Inclusion", "Communication",
  "Confidence", "Understanding Feelings", "Body Safety", "Online Safety",
  "Gender Fairness", "Knowing Yourself", "Standing Up for Others", "Healthy Relationships",
];

const AGES = [
  {
    range: "5 to 7 years", name: "Little Explorers",
    points: ["Feelings have names", "Kindness is a superpower", "My body belongs to me", "Friends and fairness"],
    how: "Stories, puppets, colouring, simple games",
  },
  {
    range: "8 to 10 years", name: "Curious Minds",
    points: ["Emotions and empathy", "Gender and fairness", "Body safety", "Speaking up"],
    how: "Card games, role play, group talks",
  },
  {
    range: "11 to 13 years", name: "Rising Leaders",
    points: ["Growing up and identity", "Consent and boundaries", "Online safety", "Standing up for others"],
    how: "Debate, journaling, team missions",
  },
  {
    range: "14 to 16 years", name: "Changemakers",
    points: ["Healthy relationships", "Looking after your mind", "Communication", "Being a friend to all"],
    how: "Group talks, real stories, projects",
  },
];

const RECEIVES = [
  { title: "Complete Programme Kit", desc: "All 8 session plans, facilitator guides, Lensy story kits, and game materials." },
  { title: "Facilitator Training", desc: "One full training day so your team runs every session with confidence." },
  { title: "Session Guides", desc: "Clear, step by step plans sent before every single session." },
  { title: "Impact Report", desc: "A full end of programme report, ready to share with your donors and board." },
  { title: "Certificates for Every Child", desc: "Printed certificates for each child who finishes the programme." },
  { title: "Partner Recognition", desc: "Official TEL Partner certification for your organisation." },
];

const NEED = [
  { k: "15 to 30", label: "children", note: "Any age group, or a few groups." },
  { k: "A room", label: "to meet weekly", note: "Any space where children can sit and move." },
  { k: "8 weeks", label: "8 sessions", note: "One hour a week, at a time that suits you." },
  { k: "Honest", label: "feedback", note: "Tell us what works and what does not." },
];

const GETS = [
  "Full programme kit and materials",
  "Session by session guides",
  "Certificates for every child",
  "Partner certificate for your organisation",
  "The Equal Lens merchandise for every child",
];

const FOUNDING = [
  { photo: "/discovery/team/rashi-khandelwal.jpg", name: "Rashi Khandelwal", role: "Founder" },
  { photo: "/discovery/team/savneet-mehar.jpg", name: "Savneet Mehar", role: "Co-Founder" },
  { photo: "/discovery/team/arushi-verma.jpg", name: "Arushi Verma", role: "Co-Founder" },
];
const CORE = [
  { photo: "/discovery/team/priyanshu-jain.jpg", name: "Priyanshu Jain", role: "Edu-based Game Designer" },
  { photo: "/discovery/team/shraddha-shah.jpg", name: "Shraddha Shah", role: "Learning Experience Curator" },
  { photo: "/discovery/team/aniket-singh.jpg", name: "Aniket Singh", role: "Content Strategist" },
];

// One presentation slide: a bounded, numbered frame so each break is obvious.
function Slide({
  n,
  kicker,
  tone = "paper",
  children,
}: {
  n: number;
  kicker: string;
  tone?: "paper" | "band";
  children: React.ReactNode;
}) {
  const band = tone === "band";
  return (
    <section className="px-4 sm:px-6">
      <div
        className={`relative mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col rounded-[2rem] border-2 border-ink p-7 shadow-[6px_6px_0_var(--color-ink)] sm:p-12 ${
          band ? "bg-band text-white" : "bg-surface text-ink"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`font-hand text-sm font-bold uppercase tracking-[0.1em] ${
              band ? "text-sun" : "text-brandsoft"
            }`}
          >
            {kicker}
          </span>
          <span className="font-hand text-sm font-bold opacity-50">
            {String(n).padStart(2, "0")} / {TOTAL}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">{children}</div>

        <div
          className={`flex items-center justify-between border-t-2 pt-4 font-hand text-xs font-bold ${
            band ? "border-white/15 text-white/50" : "border-mist text-ink/40"
          }`}
        >
          <span>The Equal Lens</span>
          <span>The Discovery Program · 2026</span>
        </div>
      </div>
    </section>
  );
}

function ProfileCard({ photo, name, role }: { photo: string; name: string; role: string }) {
  return (
    <div className="sticker hover-pop overflow-hidden rounded-3xl bg-surface">
      <div className="aspect-square w-full bg-mist">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="p-5 text-center">
        <h3 className="font-hand text-xl font-extrabold text-ink">{name}</h3>
        <p className="mt-0.5 text-sm font-semibold text-brand">{role}</p>
      </div>
    </div>
  );
}

export default function DiscoveryPage() {
  return (
    <div className="space-y-8 overflow-x-hidden py-10">
      {/* 01 - COVER */}
      <Slide n={1} kicker="Free Pilot · 2026">
        <div className="relative text-center">
          <Doodle name="sparkle" className="anim-wobble absolute left-2 top-0 w-9 text-sun sm:left-10" />
          <Doodle name="star" className="anim-float absolute right-2 top-6 w-7 text-grow sm:right-12" />

          <h1 className="mx-auto max-w-3xl font-hand text-5xl font-extrabold leading-[1.05] text-ink sm:text-7xl">
            Raising Kinder
            <br />
            Human Beings.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
            An 8 session life skills journey for children. Taught with play, stories, and real
            conversations.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 font-hand text-sm font-bold text-brand">
            <span className="rounded-full bg-mist px-3 py-1">For NGOs</span>
            <span className="rounded-full bg-mist px-3 py-1">For Schools</span>
            <span className="rounded-full bg-mist px-3 py-1">For Child Care Homes</span>
          </div>

          <div className="mt-8 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LENSY_WAVE} alt="Lensy waving" className="anim-bob h-36 w-auto sm:h-44" />
          </div>
          <p className="mt-3 font-hand text-xl font-extrabold tracking-wide text-brand">
            Unlearn. Relearn. Grow.
          </p>
        </div>
      </Slide>

      {/* 02 - WHAT IS IT */}
      <Slide n={2} kicker="What is The Equal Lens?">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-hand text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              A life skills programme children actually feel.
            </h2>
            <p className="mt-4 text-ink/70">
              The Equal Lens is an 8 session life skills programme for children aged 5 to 16. One
              hour, once a week, for eight weeks.
            </p>
            <p className="mt-3 text-ink/70">
              Children learn empathy, confidence, body safety, fairness, and how to understand their
              feelings. Not from lectures, but from play, stories, and real talk with Lensy, their
              friend and guide.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s, i) => (
              <div key={s.label} className="card flex flex-col items-center gap-2 p-5 text-center">
                <span className={`flex h-16 w-16 items-center justify-center rounded-2xl font-hand text-xl font-extrabold ${TILE[i % TILE.length]}`}>
                  {s.big}
                </span>
                <span className="font-hand text-sm font-bold text-ink/70">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* 03 - THE 8 SESSION JOURNEY */}
      <Slide n={3} kicker="The 8 session journey">
        <div>
          <div className="text-center">
            <h2 className="font-hand text-3xl font-extrabold text-ink sm:text-4xl">
              One hour. One theme. A new chapter every week.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SESSIONS.map((s, i) => (
              <div key={s.n} className="card flex flex-col gap-3 p-5">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl font-hand text-lg font-extrabold ${TILE[i % TILE.length]}`}>
                  {s.n}
                </span>
                <div>
                  <h3 className="font-hand text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-1 text-sm text-ink/60">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* 04 - INSIDE ONE SESSION */}
      <Slide n={4} kicker="Inside one session">
        <div>
          <div className="text-center">
            <h2 className="font-hand text-3xl font-extrabold text-ink sm:text-4xl">
              60 minutes. No lectures. Every child joins in from the first minute.
            </h2>
          </div>
          <ol className="mx-auto mt-8 max-w-3xl space-y-3">
            {FLOW.map((f, i) => (
              <li key={f.title} className="card flex items-center gap-4 p-4">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-hand text-lg font-extrabold ${TILE[i % TILE.length]}`}>
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-hand text-base font-bold text-ink">{f.title}</h3>
                  <p className="text-sm text-ink/60">{f.desc}</p>
                </div>
                <span className="shrink-0 rounded-full bg-mist px-3 py-1 font-hand text-xs font-bold text-brand">
                  {f.min}
                </span>
              </li>
            ))}
          </ol>
          <div className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brandsoft/50 px-5 py-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LENSY_IDEA} alt="" className="h-9 w-auto" />
            <p className="text-sm text-ink/70">
              Your facilitator gets a full, step by step guide before every session.
            </p>
          </div>
        </div>
      </Slide>

      {/* 05 - WHAT CHILDREN LEARN */}
      <Slide n={5} kicker="What children learn">
        <div className="text-center">
          <h2 className="font-hand text-3xl font-extrabold text-ink sm:text-4xl">
            Real skills. For life. Not a test score.
          </h2>
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
            {SKILLS.map((skill, i) => (
              <span
                key={skill}
                className={`rounded-full border-2 border-ink px-4 py-2 font-hand text-sm font-bold shadow-[2px_2px_0_var(--color-ink)] ${TILE[i % TILE.length]}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </Slide>

      {/* 06 - EVERY AGE */}
      <Slide n={6} kicker="One programme. Every age.">
        <div>
          <div className="text-center">
            <h2 className="font-hand text-3xl font-extrabold text-ink sm:text-4xl">
              Same values. Same Lensy. Made for the way each age learns.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </Slide>

      {/* 07 - CERTIFICATE */}
      <Slide n={7} kicker="Every child earns a certificate">
        <div>
          <div className="text-center">
            <h2 className="font-hand text-3xl font-extrabold text-ink sm:text-4xl">
              Not for being perfect. For showing up, staying curious, and growing.
            </h2>
          </div>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-2">
            <div className="card relative -rotate-2 p-8 text-center">
              <p className="font-hand text-2xl tracking-widest text-sun">★ ★ ★ ★ ★</p>
              <p className="mt-4 font-hand text-2xl font-extrabold text-ink">Certificate of Completion</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-brandsoft">
                The Equal Lens · Life Skills Programme
              </p>
              <p className="mt-6 text-sm text-ink/50">This certifies that</p>
              <p className="mx-auto mt-2 w-2/3 border-b-2 border-dashed border-ink/30 pb-1 font-hand text-lg font-bold text-ink/40">
                Child&rsquo;s Name
              </p>
              <p className="mt-3 text-sm text-ink/60">
                has completed all 8 sessions of the Life Skills Journey.
              </p>
            </div>
            <ol className="space-y-5">
              {[
                { t: "For the child", d: "For many children in a home, this is the first certificate they have ever held." },
                { t: "For your organisation", d: "A real, structured programme you can show to donors and trustees." },
                { t: "Partner recognition", d: "The Equal Lens names your organisation a TEL Certified Partner." },
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
        </div>
      </Slide>

      {/* 08 - WHAT YOU RECEIVE */}
      <Slide n={8} kicker="What your organisation receives">
        <div>
          <div className="text-center">
            <h2 className="font-hand text-3xl font-extrabold text-ink sm:text-4xl">
              Everything you need to run it with confidence.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RECEIVES.map((r, i) => (
              <div key={r.title} className="card flex flex-col gap-2 p-5">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl font-hand text-base font-extrabold ${TILE[i % TILE.length]}`}>
                  ✓
                </span>
                <h3 className="mt-1 font-hand text-lg font-bold text-ink">{r.title}</h3>
                <p className="text-sm text-ink/60">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* 09 - FREE */}
      <Slide n={9} kicker="It is free" tone="band">
        <div className="relative text-center">
          <Doodle name="sparkle" className="anim-wobble absolute left-4 top-0 w-10 text-sun" />
          <Doodle name="star" className="anim-float absolute right-4 bottom-0 w-8 text-grow" />
          <p className="font-hand text-7xl font-extrabold tracking-tight text-sun sm:text-8xl">FREE.</p>
          <p className="mt-4 font-hand text-2xl font-bold">Not because we have to.</p>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Because every child deserves this. No matter their budget, their school, or where they
            come from.
          </p>
        </div>
      </Slide>

      {/* 10 - JOIN THE PILOT */}
      <Slide n={10} kicker="Join the pilot">
        <div>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-4 py-1.5 font-hand text-sm font-bold text-ink shadow-[2px_2px_0_var(--color-ink)]">
              ★ Only 5 spots
            </span>
            <h2 className="mt-4 font-hand text-3xl font-extrabold text-ink sm:text-4xl">
              We are choosing 3 to 5 organisations for the first group.
            </h2>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <p className="eyebrow">What we need from you</p>
              <ul className="mt-4 space-y-4">
                {NEED.map((nd, i) => (
                  <li key={nd.label} className="flex items-start gap-4">
                    <span className={`flex h-12 w-20 shrink-0 items-center justify-center rounded-xl font-hand text-sm font-extrabold ${TILE[i % TILE.length]}`}>
                      {nd.k}
                    </span>
                    <div>
                      <p className="font-hand font-bold text-ink">{nd.label}</p>
                      <p className="text-sm text-ink/60">{nd.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card card--soft p-6">
              <p className="eyebrow">What your organisation gets</p>
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
        </div>
      </Slide>

      {/* 11 - THE PEOPLE */}
      <Slide n={11} kicker="The people behind this">
        <div>
          <div className="text-center">
            <h2 className="mx-auto max-w-2xl font-hand text-3xl font-extrabold text-ink sm:text-4xl">
              Educators, facilitators, child development practitioners, and people who care deeply.
            </h2>
          </div>

          <p className="mt-8 text-center font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
            Founding Team
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {FOUNDING.map((m) => (
              <ProfileCard key={m.name} {...m} />
            ))}
          </div>

          <p className="mt-8 text-center font-hand text-sm font-bold uppercase tracking-widest text-brandsoft">
            Core Team
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {CORE.map((m) => (
              <ProfileCard key={m.name} {...m} />
            ))}
          </div>
        </div>
      </Slide>

      {/* 12 - PARTNER WITH US */}
      <Slide n={12} kicker="Partner with us" tone="band">
        <div className="relative text-center">
          <Doodle name="squiggle" className="anim-float absolute left-2 top-0 w-14 text-insight" />
          <Doodle name="heart" className="anim-wobble absolute right-2 top-4 w-9 text-grow" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LENSY_STAND} alt="Lensy" className="anim-bob mx-auto h-24 w-auto" />
          <h2 className="mt-5 font-hand text-4xl font-extrabold leading-tight sm:text-5xl">
            Partner with us.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/80">
            Your organisation will not just run a programme. You will help raise better human beings.
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
      </Slide>
    </div>
  );
}
