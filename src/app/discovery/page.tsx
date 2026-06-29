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
const LENSY_STAND = "/Lensy%20-%20Stand.svg";

const TOTAL = 14;

// Small tinted backplates for the one-emoji-per-tile grids. Brand colour stays
// structural elsewhere; these are the only place the four accents appear.
const TILE = ["bg-insight/15", "bg-grow/15", "bg-sky/15", "bg-sun/25"];

const STATS = [
  { big: "8", label: "Weekly sessions" },
  { big: "60", label: "Minutes each" },
  { big: "5 to 16", label: "Age groups" },
  { big: "₹0", label: "Cost to you" },
];

const SESSIONS = [
  { n: "01", emoji: "🪞", title: "Who Am I?", sub: "Knowing yourself" },
  { n: "02", emoji: "💛", title: "Feelings Are OK", sub: "Naming and sharing feelings" },
  { n: "03", emoji: "⚖️", title: "Fair Is Fair", sub: "Gender and fairness" },
  { n: "04", emoji: "🗣️", title: "Speak Up", sub: "Speaking with confidence" },
  { n: "05", emoji: "✋", title: "My Body, My Rules", sub: "Body safety and personal space" },
  { n: "06", emoji: "🤝", title: "We, More Than Me", sub: "Working together, including everyone" },
  { n: "07", emoji: "📱", title: "Safe Online", sub: "Staying safe on phones and the internet" },
  { n: "08", emoji: "🌟", title: "Kind Humans", sub: "Looking back and celebrating" },
];

const FLOW = [
  { title: "Story Time", min: "10 min", desc: "A short story opens the session and brings in the theme for the week." },
  { title: "Big Question", min: "15 min", desc: "Children talk about a real life moment in small groups. Gentle, guided talk." },
  { title: "Game or Activity", min: "60 min", desc: "A hands on game, role play, or card activity where children learn by doing." },
  { title: "Reflect and Share", min: "10 min", desc: "Each child shares one thing they are taking home today." },
  { title: "Mission Card", min: "5 min", desc: "A small task to try at home with family or friends." },
];

// 12 skills grouped into a deliberate taxonomy. Safety is highlighted because it
// threads straight back to the Stakes slide.
const SKILL_GROUPS = [
  {
    label: "Knowing yourself",
    items: [
      { name: "Knowing Yourself", emoji: "🪞" },
      { name: "Understanding Feelings", emoji: "💭" },
      { name: "Confidence", emoji: "⭐" },
      { name: "Communication", emoji: "💬" },
    ],
  },
  {
    label: "Living with others",
    items: [
      { name: "Empathy", emoji: "💛" },
      { name: "Teamwork", emoji: "🤝" },
      { name: "Inclusion", emoji: "🌈" },
      { name: "Gender Fairness", emoji: "⚖️" },
      { name: "Standing Up for Others", emoji: "🛡️" },
      { name: "Healthy Relationships", emoji: "💞" },
    ],
  },
  {
    label: "Staying safe",
    highlight: true,
    items: [
      { name: "Body Safety", emoji: "✋" },
      { name: "Online Safety", emoji: "📱" },
    ],
  },
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

// Sticky note (brand accent). Used sparingly now. Shown only on lg (16:9 mode).
function StickyNote({
  tone,
  className = "",
  rotate = -3,
  children,
}: {
  tone: string;
  className?: string;
  rotate?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${tone} absolute z-20 hidden w-44 rounded-xl border-2 border-ink p-3 text-center font-hand text-sm font-bold leading-snug text-ink shadow-[3px_3px_0_var(--color-ink)] lg:block ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}

// One presentation slide. Left-aligned assertion title + content, vertically
// centered as one balanced block between the eyebrow and footer. 16:9 on
// desktop, auto height on mobile.
function Slide({
  n,
  kicker,
  title,
  tone = "paper",
  note,
  children,
}: {
  n: number;
  kicker: string;
  title?: string;
  tone?: "paper" | "band";
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  const band = tone === "band";
  return (
    <section className="px-4 sm:px-6">
      <div
        className={`deck-slide relative mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border-2 border-ink p-6 shadow-[6px_6px_0_var(--color-ink)] sm:p-8 lg:aspect-video lg:p-12 ${
          band ? "bg-band text-white" : "canvas-dots bg-paper text-ink"
        }`}
      >
        {note}
        <div className="flex items-center justify-between">
          <span
            className={`font-display text-xs font-bold uppercase tracking-[0.15em] ${
              band ? "text-sun" : "text-brandsoft"
            }`}
          >
            {kicker}
          </span>
          <span className="font-display text-xs font-bold opacity-40">
            {String(n).padStart(2, "0")} / {TOTAL}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-4">
          {title && (
            <div className="mb-6">
              <h2
                className={`max-w-[24ch] font-display text-2xl font-bold leading-[1.1] sm:text-3xl lg:text-4xl ${
                  band ? "text-white" : "text-ink"
                }`}
              >
                {title}
              </h2>
              <span className="mt-3 block h-1 w-12 rounded-full bg-brand" />
            </div>
          )}
          {children}
        </div>

        <div
          className={`flex items-center justify-between border-t-2 pt-3 font-display text-[0.7rem] font-bold ${
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
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-surface shadow-[3px_3px_0_var(--color-ink)]">
      <div className="aspect-square w-full bg-mist">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={name} className="h-full w-full object-cover object-center" />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-display text-lg font-bold leading-tight text-ink">{name}</h3>
        <p className="text-sm font-semibold text-brand">{role}</p>
      </div>
    </div>
  );
}

export default function DiscoveryPage() {
  return (
    <div className="deck-root space-y-7 overflow-x-hidden py-10">
      {/* 01 - COVER (dark) */}
      <Slide
        n={1}
        kicker="Free Pilot · 2026"
        tone="band"
        note={
          <StickyNote tone="note--yellow" rotate={-4} className="bottom-10 right-10">
            Made with love, in India
          </StickyNote>
        }
      >
        <div className="grid items-center gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-7xl">
              Raising kinder
              <br />
              human beings.
            </h1>
            <p className="mt-5 max-w-md text-base text-white/80 lg:text-lg">
              An 8 session life skills journey for children. Taught with play, stories, and real
              conversations.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-display text-sm font-semibold text-white">
              <span className="rounded-full bg-white/15 px-3 py-1">For NGOs</span>
              <span className="rounded-full bg-white/15 px-3 py-1">For Schools</span>
              <span className="rounded-full bg-white/15 px-3 py-1">For Child Care Homes</span>
            </div>
            <p className="mt-6 font-hand text-xl font-extrabold tracking-wide text-sun">
              Unlearn. Relearn. Grow.
            </p>
          </div>
          <div className="hidden text-center lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LENSY_WAVE} alt="Lensy waving" className="anim-bob mx-auto h-48 w-auto" />
          </div>
        </div>
      </Slide>

      {/* 02 - THE STAKES (dark, empty-ledger) */}
      <Slide n={2} kicker="The gap" tone="band">
        <div>
          <h2 className="max-w-[26ch] font-display text-2xl font-bold leading-[1.12] text-white sm:text-3xl lg:text-4xl">
            School teaches them to pass. No one teaches them to cope.
          </h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-widest text-white/50">
                What school teaches
              </p>
              <ul className="mt-3 space-y-2">
                {["Maths", "Science", "Reading", "Exams"].map((s) => (
                  <li key={s} className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2 font-display text-sm font-semibold text-white">
                    <span className="text-sun">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-widest text-sun">
                What life demands
              </p>
              <ul className="mt-3 space-y-2">
                {["Name a feeling", "Say no, and mean it", "Stay safe online", "Ask for help"].map((s) => (
                  <li key={s} className="flex items-center gap-3 rounded-lg border-2 border-dashed border-white/30 px-3 py-2 font-display text-sm font-semibold text-white/50">
                    <span className="text-white/30">◌</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-sm text-white/70">
            For children growing up in care homes, there is often no one to close this gap. That is
            the gap The Equal Lens exists to fill.
          </p>
        </div>
      </Slide>

      {/* 03 - WHAT IS IT */}
      <Slide
        n={3}
        kicker="What is The Equal Lens?"
        title="A life skills programme children feel, not sit through."
        note={
          <StickyNote tone="note--mint" rotate={3} className="bottom-10 right-10">
            Just one hour a week
          </StickyNote>
        }
      >
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <p className="text-sm leading-relaxed text-ink/70">
            An 8 session guided programme for children aged 5 to 16. One hour, once a week, for eight
            weeks. Children build empathy, confidence, body safety, fairness, and how to understand
            their feelings. Not from lectures, but from play, stories, and real talk with Lensy,
            their friend and guide.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border-2 border-ink bg-surface px-5 py-4 shadow-[3px_3px_0_var(--color-ink)]">
                <p className="whitespace-nowrap font-display text-3xl font-extrabold text-brand lg:text-4xl">{s.big}</p>
                <p className="mt-1 font-display text-xs font-bold uppercase tracking-wide text-brandsoft">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* 04 - THE JOURNEY */}
      <Slide
        n={4}
        kicker="The 8 session journey"
        title="Every week builds on the last."
        note={
          <StickyNote tone="note--peach" rotate={-3} className="bottom-12 right-10">
            A new theme every week
          </StickyNote>
        }
      >
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {SESSIONS.map((s, i) => (
            <div key={s.n} className="flex flex-col gap-2 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_var(--color-ink)]">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold text-brandsoft">{s.n}</span>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${TILE[i % TILE.length]}`}>{s.emoji}</span>
              </div>
              <h3 className="font-display text-base font-bold leading-tight text-ink">{s.title}</h3>
              <p className="text-xs text-ink/55">{s.sub}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs font-semibold text-brandsoft">
          One arc, from knowing yourself to looking out for others. Each theme is a skill they keep for life.
        </p>
      </Slide>

      {/* 05 - INSIDE ONE SESSION */}
      <Slide
        n={5}
        kicker="Inside one session"
        title="The same hour, every single week."
      >
        <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {FLOW.map((f) => (
            <div key={f.title} className="flex flex-col gap-2 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_var(--color-ink)]">
              <span className="self-start rounded-full bg-mist px-2.5 py-0.5 font-display text-xs font-bold text-brand">{f.min}</span>
              <h3 className="font-display text-sm font-bold leading-tight text-ink">{f.title}</h3>
              <p className="text-xs leading-snug text-ink/55">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-display text-sm font-bold text-ink">
          10 + 15 + 60 + 10 + 5 <span className="text-brandsoft">=</span> 100 minutes.
        </p>
        <p className="mt-1 text-xs text-ink/55">
          Your facilitator gets a full, step by step guide before every session.
        </p>
      </Slide>

      {/* 06 - WHAT CHILDREN LEARN */}
      <Slide
        n={6}
        kicker="What children learn"
        title="Real skills for life. Not a test score."
        note={
          <StickyNote tone="note--yellow" rotate={4} className="bottom-12 right-10">
            Skills for life, not exams
          </StickyNote>
        }
      >
        <div className="grid gap-5 sm:grid-cols-3">
          {SKILL_GROUPS.map((g) => (
            <div key={g.label}>
              <p className={`font-display text-xs font-bold uppercase tracking-widest ${g.highlight ? "text-[#8A5A00]" : "text-brandsoft"}`}>
                {g.label}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span
                    key={s.name}
                    className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 font-display text-xs font-semibold shadow-[2px_2px_0_var(--color-ink)] ${
                      g.highlight ? "bg-sun/30 text-ink" : "bg-surface text-ink"
                    }`}
                  >
                    <span className="text-sm">{s.emoji}</span>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Slide>

      {/* 07 - EVERY AGE */}
      <Slide
        n={7}
        kicker="One programme, every age"
        title="Same values, tuned to how each age learns."
        note={
          <StickyNote tone="note--mint" rotate={-4} className="bottom-12 right-10">
            Lensy grows with them
          </StickyNote>
        }
      >
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {AGES.map((a, i) => (
            <div key={a.range} className="flex flex-col rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_var(--color-ink)]">
              <span className={`self-start rounded-full px-2.5 py-1 font-display text-xs font-bold text-ink ${TILE[i % TILE.length]}`}>
                {a.range}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-ink">{a.name}</h3>
              <ul className="mt-2 space-y-1 text-sm text-ink/70">
                {a.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-brand">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t-2 border-mist pt-2 text-xs text-ink/50">
                <span className="font-bold text-brandsoft">How:</span> {a.how}
              </p>
            </div>
          ))}
        </div>
      </Slide>

      {/* 08 - CERTIFICATE → IMPACT PROMISE */}
      <Slide
        n={8}
        kicker="Every child earns a certificate"
        title="For many, the first certificate they will ever hold."
      >
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <ol className="space-y-4">
            {[
              { t: "For the child", d: "For many children in a home, this is the first certificate they have ever held." },
              { t: "For your organisation", d: "A real, structured programme you can show to donors and trustees." },
              { t: "Partner recognition", d: "The Equal Lens names your organisation a TEL Certified Partner." },
            ].map((item, i) => (
              <li key={item.t} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">{item.t}</h3>
                  <p className="text-sm text-ink/60">{item.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="rotate-2 rounded-2xl border-2 border-ink bg-surface p-6 text-center shadow-[4px_4px_0_var(--color-ink)]">
            <p className="font-hand text-xl tracking-widest text-sun">★ ★ ★ ★ ★</p>
            <p className="mt-3 font-display text-xl font-extrabold text-ink">Certificate of Completion</p>
            <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-widest text-brandsoft">
              The Equal Lens · Life Skills Programme
            </p>
            <p className="mt-4 text-sm text-ink/50">This certifies that</p>
            <p className="mx-auto mt-1 w-2/3 border-b-2 border-dashed border-ink/30 pb-1 font-hand text-base font-bold text-ink/40">
              Child&rsquo;s Name
            </p>
            <p className="mt-2 text-sm text-ink/60">has completed all 8 sessions of the Life Skills Journey.</p>
          </div>
        </div>
      </Slide>

      {/* 09 - WHAT YOU RECEIVE */}
      <Slide
        n={9}
        kicker="What your organisation receives"
        title="Everything you need. Nothing you have to build."
      >
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {RECEIVES.map((r, i) => (
            <div key={r.title} className="flex flex-col gap-1.5 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_var(--color-ink)]">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg font-display text-base font-bold text-ink ${TILE[i % TILE.length]}`}>
                ✓
              </span>
              <h3 className="mt-0.5 font-display text-base font-bold leading-tight text-ink">{r.title}</h3>
              <p className="text-xs text-ink/55">{r.desc}</p>
            </div>
          ))}
        </div>
      </Slide>

      {/* 10 - IT'S FREE (dark) */}
      <Slide
        n={10}
        kicker="It is free"
        tone="band"
        note={
          <StickyNote tone="note--yellow" rotate={5} className="bottom-12 right-12">
            Yes, fully free
          </StickyNote>
        }
      >
        <div className="relative">
          <Doodle name="sparkle" className="anim-wobble absolute right-10 top-0 hidden w-10 text-sun lg:block" />
          <p className="font-hand text-7xl font-extrabold tracking-tight text-sun sm:text-8xl lg:text-9xl">FREE.</p>
          <p className="mt-3 max-w-2xl font-display text-xl font-bold text-white lg:text-2xl">
            Not because we have to. Because every child deserves this.
          </p>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            Whatever their budget, their school, or where they come from.
          </p>
        </div>
      </Slide>

      {/* 11 - JOIN THE PILOT */}
      <Slide
        n={11}
        kicker="Join the pilot"
        title="We are choosing 5 organisations for the first cohort."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-brandsoft">A small ask</p>
            <ul className="mt-3 space-y-2.5">
              {NEED.map((nd, i) => (
                <li key={nd.label} className="flex items-center gap-3">
                  <span className={`flex h-9 w-20 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold text-ink ${TILE[i % TILE.length]}`}>
                    {nd.k}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-ink">{nd.label}</p>
                    <p className="text-xs text-ink/55">{nd.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_var(--color-ink)]">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-brandsoft">A big return</p>
            <ul className="mt-3 space-y-2">
              {GETS.map((g) => (
                <li key={g} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-insight/20 font-display text-xs font-bold text-[#0F6E56]">
                    ✓
                  </span>
                  <span className="text-sm text-ink/80">{g}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-3 py-1 font-display text-xs font-bold text-ink shadow-[2px_2px_0_var(--color-ink)]">
              ★ Only 5 spots
            </p>
          </div>
        </div>
      </Slide>

      {/* 12 - FOUNDING TEAM */}
      <Slide
        n={12}
        kicker="The people behind this"
        title="Educators, facilitators, and people who care deeply."
        note={
          <StickyNote tone="note--mint" rotate={4} className="bottom-10 right-8">
            We care, a lot
          </StickyNote>
        }
      >
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-brandsoft">Founding Team</p>
          <div className="mt-4 grid max-w-3xl gap-5 sm:grid-cols-3">
            {FOUNDING.map((m) => (
              <ProfileCard key={m.name} {...m} />
            ))}
          </div>
        </div>
      </Slide>

      {/* 13 - CORE TEAM */}
      <Slide
        n={13}
        kicker="The people behind this"
        title="The team who bring every session to life."
        note={
          <StickyNote tone="note--peach" rotate={-4} className="bottom-10 right-8">
            Real people behind it
          </StickyNote>
        }
      >
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-brandsoft">Core Team</p>
          <div className="mt-4 grid max-w-3xl gap-5 sm:grid-cols-3">
            {CORE.map((m) => (
              <ProfileCard key={m.name} {...m} />
            ))}
          </div>
        </div>
      </Slide>

      {/* 14 - PARTNER WITH US (dark close) */}
      <Slide
        n={14}
        kicker="Partner with us"
        tone="band"
        note={
          <StickyNote tone="note--yellow" rotate={-5} className="bottom-12 right-10">
            Let us begin together
          </StickyNote>
        }
      >
        <div className="grid items-center gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl lg:text-5xl">
              You won&rsquo;t just run a programme. You&rsquo;ll help raise better humans.
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
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
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-sun bg-sun/15 px-4 py-1 font-display text-sm font-bold text-sun">
              ★ Only 5 pilot spots available
            </p>
            <p className="mt-5 font-hand text-xl font-extrabold tracking-wide text-sun">
              Unlearn. Relearn. Grow.
            </p>
          </div>
          <div className="hidden text-center lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LENSY_STAND} alt="Lensy" className="anim-bob mx-auto h-44 w-auto" />
          </div>
        </div>
      </Slide>
    </div>
  );
}
