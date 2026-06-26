"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

// run a layout effect on the client, a no-op-ish effect on the server (avoids SSR warning)
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// public/ filenames have spaces + capitals - encode for the URL
const SHIP_CLOSED = "/Ship%20-%20Closed.svg";
const SHIP_FLYING = "/Ship%20-%20Flying.svg";
const LENSY_WAVE = "/Lensy%20-%20Wave.svg";
const LENSY_IDEA = "/Lensy%20-%20Idea.svg";

const KID_QUESTIONS = [
  {
    place: "At the airport, I saw a toy store.",
    body: "One aisle said “Boys.” One said “Girls.” Nobody could explain why dinosaurs and science belonged on only one side.",
  },
  {
    place: "I watched people shopping for a new baby.",
    body: "Everyone reached for blue for one baby and pink for another. But… how does a colour know who it belongs to?",
  },
  {
    place: "I read about people’s jobs today.",
    body: "Someone laughed when a boy said he’d be a nurse, and when a girl said she’d be an engineer. My spaceship doesn’t get the joke.",
  },
  {
    place: "I saw two kids trip and cry.",
    body: "A grown-up told one to “be brave” and hugged the other. Do feelings really work differently depending on who you are?",
  },
];

const ADULT_QUESTIONS = [
  {
    place: "I sat in on a work meeting today.",
    body: "A woman shared an idea and the room went quiet. A man said the same thing later and everyone loved it. Did the idea change shape on the way across the table?",
  },
  {
    place: "I learned two Earth words: “bossy” and “strong leader.”",
    body: "They seem to describe the exact same actions… but people only use one for women and the other for men. My spaceship can’t tell them apart.",
  },
  {
    place: "I visited a home where two grown-ups both have jobs.",
    body: "Yet only one of them remembers the birthdays, the groceries, and the dentist. How did that extra job get handed out?",
  },
  {
    place: "A dad asked for time off for his new baby.",
    body: "People acted surprised, like caring was a strange hobby for him. On my planet, a parent is just a parent. What did I miss?",
  },
  {
    place: "People kept asking a happy, single woman when she’d “settle down.”",
    body: "As if she were unfinished. Nobody asked the man beside her. Is one of them more finished than the other?",
  },
  {
    place: "A grown man teared up at a film — then apologised for it.",
    body: "Apologised! For having a feeling. Are feelings handed out in different amounts depending on who you are?",
  },
];

const BIO: [string, string][] = [
  ["Species", "Curious Alien"],
  ["Mission", "Understand Humans"],
  ["Special skill", "Asking questions that make stereotypes sound strange"],
  ["Favourite word", "“Why?”"],
  ["Current status", "Confused, but learning 🚀"],
];

const OPEN_KEY = "lensy-opened";
type View = "q" | "tell" | "meet" | "thanks";

function isMobileVp() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;
}

// smooth Catmull-Rom spline through the waypoints -> an SVG path string
function catmullRom(pts: [number, number][]) {
  if (pts.length < 2) return "";
  const d = [`M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(
      `C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
    );
  }
  return d.join(" ");
}

// the looping flight path (traced from the drawing): up the left, around a loop,
// sweep right, then down into the bubble at (bx, by). Waypoints scale with the viewport.
function flightPath(bx: number, by: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const wp: [number, number][] = [
    [0.18 * w, 1.15 * h],
    [0.38 * w, 0.61 * h],
    [0.385 * w, 0.3 * h],
    [0.46 * w, 0.245 * h],
    [0.525 * w, 0.34 * h],
    [0.41 * w, 0.585 * h],
    [0.6 * w, 0.645 * h],
    [0.74 * w, 0.49 * h],
    [0.86 * w, 0.47 * h],
    [0.965 * w, 0.66 * h],
    [bx, by],
  ];
  return catmullRom(wp);
}

export default function LensyPopup({ audience }: { audience: "kid" | "adult" }) {
  const QUESTIONS = audience === "adult" ? ADULT_QUESTIONS : KID_QUESTIONS;
  const [open, setOpen] = useState(false);
  const [knocking, setKnocking] = useState(false); // "knock knock" scribble
  const [view, setView] = useState<View>("q");
  const [qi, setQi] = useState(0);
  const [thought, setThought] = useState("");
  const [dock, setDock] = useState<HTMLElement | null>(null); // mobile slot next to the toolbar
  const [landed, setLanded] = useState(true); // ship parked in its bubble
  const [flying, setFlying] = useState(false); // play the fly-in
  const [flight, setFlight] = useState<{ d: string } | null>(null);
  const knockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flightRef = useRef<HTMLDivElement | null>(null);
  const flightScaleRef = useRef<HTMLDivElement | null>(null);
  const openOnceRef = useRef(false);
  const landedOnce = useRef(false);

  // grab the toolbar's mobile dock slot (rendered by SiteCanvas)
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setDock(document.getElementById("lensy-dock")),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  // the ship flies in on every full page load (so a hard refresh always replays it);
  // Lensy then auto-opens once per session on desktop.
  useIsoLayoutEffect(() => {
    setQi(Math.floor(Math.random() * QUESTIONS.length));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let openedBefore = false;
    try {
      openedBefore = !!sessionStorage.getItem(OPEN_KEY);
    } catch {}
    const willOpen = !openedBefore && !isMobileVp();
    openOnceRef.current = willOpen;
    if (willOpen) {
      try {
        sessionStorage.setItem(OPEN_KEY, "1");
      } catch {}
    }
    if (!reduce) {
      setLanded(false);
      setFlying(true);
    } else if (willOpen) {
      openTimer.current = setTimeout(() => setOpen(true), 2500);
    }  }, []);

  // once flying, find the (visible) bubble and aim the ship at it
  useEffect(() => {
    if (!flying) return;
    let raf = 0;
    let tries = 0;
    const find = () => {
      const bubbles = Array.from(document.querySelectorAll<HTMLElement>("[data-lensy-bubble]"));
      const target = bubbles.find((b) => b.getBoundingClientRect().width > 0);
      if (target) {
        const r = target.getBoundingClientRect();
        setFlight({ d: flightPath(r.left + r.width / 2, r.top + r.height / 2) });
      } else if (tries++ < 20) {
        raf = requestAnimationFrame(find);
      } else {
        land();
      }
    };
    raf = requestAnimationFrame(find);
    return () => cancelAnimationFrame(raf);  }, [flying]);

  // fly the ship along the path with a gravity-like feel: launch fast, slow to a
  // near-stop at the loop's apex (where it swells ~2x), then cruise at a constant
  // speed to landing. A slow ease-in/out drives the zoom.
  useEffect(() => {
    const el = flightRef.current;
    const sc = flightScaleRef.current;
    if (!flight || !el) return;
    const dur = 6000;
    const tApex = 0.46; // when (in time) the ship reaches the apex

    // find where along the path length the apex (highest point) sits
    let apexFrac = 0.38;
    try {
      const m = document.createElementNS("http://www.w3.org/2000/svg", "path");
      m.setAttribute("d", flight.d);
      const total = m.getTotalLength();
      if (total > 0) {
        let minY = Infinity;
        let apexLen = 0;
        for (let i = 0; i <= 120; i++) {
          const L = (i / 120) * total;
          const pt = m.getPointAtLength(L);
          if (pt.y < minY) {
            minY = pt.y;
            apexLen = L;
          }
        }
        apexFrac = Math.min(0.6, Math.max(0.2, apexLen / total));
      }
    } catch {}

    const path = el.animate(
      [
        { offsetDistance: "0%", offset: 0, easing: "cubic-bezier(0.1, 0.65, 0.35, 1)" },
        { offsetDistance: `${(apexFrac * 100).toFixed(1)}%`, offset: tApex, easing: "linear" },
        { offsetDistance: "100%", offset: 1 },
      ],
      { duration: dur, fill: "forwards" }
    );
    const grow = sc?.animate(
      [
        { transform: "scale(1)", offset: 0, easing: "cubic-bezier(0.42, 0, 0.58, 1)" },
        { transform: "scale(2)", offset: tApex, easing: "cubic-bezier(0.42, 0, 0.58, 1)" },
        { transform: "scale(1)", offset: 1 },
      ],
      { duration: dur, fill: "forwards" }
    );
    path.onfinish = () => land();
    const fallback = setTimeout(() => land(), dur + 400); // safety net if onfinish is missed
    return () => {
      path.cancel();
      grow?.cancel();
      clearTimeout(fallback);
    };  }, [flight]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (knockTimer.current) clearTimeout(knockTimer.current);
      if (openTimer.current) clearTimeout(openTimer.current);
    };  }, []);

  // touchdown: park the ship, then (desktop only) deliver Lensy without the knock-knock
  function land() {
    if (landedOnce.current) return;
    landedOnce.current = true;
    setLanded(true);
    setFlying(false);
    setFlight(null);
    if (openOnceRef.current) {
      if (openTimer.current) clearTimeout(openTimer.current);
      openTimer.current = setTimeout(() => setOpen(true), 1000);
    }
  }

  function close() {
    setOpen(false);
    setView("q");
    setThought("");
  }

  // tap the ship -> knock, knock -> Lensy comes out
  function knock() {
    if (knocking || open || !landed) return;
    setKnocking(true);
    setView("q");
    knockTimer.current = setTimeout(() => {
      setKnocking(false);
      setOpen(true);
    }, 850);
  }

  function nextQuestion() {
    setQi((i) => (i + 1) % QUESTIONS.length);
    setView("q");
    setThought("");
  }

  function sendThought() {
    setView("thanks");
    setThought("");
  }

  const btnPrimary =
    "rounded-full border-2 border-ink bg-sun px-3 py-2 font-hand text-sm font-bold text-[#221436] shadow-[2px_2px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5";
  const btnOutline =
    "rounded-full border-2 border-violet-300 bg-surface px-3 py-2 font-hand text-sm font-bold text-brand transition-colors hover:bg-mist";
  const btnGhost =
    "rounded-full px-3 py-2 font-hand text-sm font-bold text-brandsoft transition-colors hover:text-brand";

  const q = QUESTIONS[qi % QUESTIONS.length];

  // the ship bubble (rendered in the corner on desktop, docked by the toolbar on mobile)
  const launcher = (
    <div className="relative">
      {knocking && (
        <div
          aria-hidden
          className="anim-pop pointer-events-none absolute bottom-full right-0 mb-2 -rotate-6 whitespace-nowrap text-right"
        >
          <span className="font-hand text-2xl font-extrabold text-brand [text-shadow:1px_1px_0_var(--color-surface)]">
            knock, knock!
          </span>
          <svg viewBox="0 0 120 12" className="ml-auto mt-0.5 h-2 w-28 text-grow">
            <path d="M2 7c10-6 20 4 30-1s20-6 30 0 20 4 30-1 18-2 26 1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
      {/* bubble matches the canvas toolbar's height + look */}
      <button
        data-lensy-bubble
        onClick={open ? close : knock}
        aria-label={open ? "Close Lensy" : "Call Lensy"}
        title={open ? "Close Lensy" : "Call Lensy"}
        className="ship-bubble overflow-visible"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SHIP_CLOSED}
          alt="Lensy's spaceship - tap to call Lensy"
          className={`h-11 w-auto transition-opacity duration-200 ${landed ? "opacity-100" : "opacity-0"}`}
        />
      </button>
    </div>
  );

  return (
    <>
      {/* desktop: ship parked in the bottom-right corner */}
      <div className="fixed bottom-4 right-3 z-50 hidden sm:block sm:right-5">{launcher}</div>

      {/* mobile: ship docked next to the centered toolbar (portaled into SiteCanvas) */}
      {dock && createPortal(launcher, dock)}

      {/* the ship flying in along the drawn path, with its rocket flame */}
      {flight && (
        <div
          ref={flightRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[55]"
          style={
            {
              offsetPath: `path('${flight.d}')`,
              offsetRotate: "0deg",
              offsetDistance: "0%",
              willChange: "offset-distance",
            } as CSSProperties
          }
        >
          <div ref={flightScaleRef} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SHIP_FLYING} alt="" className="relative z-10 block h-12 w-auto" />
            <svg
              viewBox="0 0 110 150"
              className="lz-flame-fly absolute left-1/2 top-[64%] z-0"
              style={{ width: 24, height: 33 }}
            >
              <path d="M16,8 C0,54 16,92 30,118 C40,134 48,142 55,150 C62,142 70,134 80,118 C94,92 110,54 94,8 C84,30 72,28 55,30 C38,28 26,30 16,8 Z" fill="#FF7A5C" />
              <path d="M30,14 C16,52 30,84 42,106 C48,116 52,122 55,128 C58,122 62,116 68,106 C80,84 94,52 80,14 C70,32 62,32 55,34 C48,32 40,32 30,14 Z" fill="#FFC94D" />
              <path d="M42,22 C32,52 42,76 50,94 C52,98 54,102 55,106 C56,102 58,98 60,94 C68,76 78,52 68,22 C62,36 58,36 55,38 C52,36 48,36 42,22 Z" fill="#FFF1C9" />
            </svg>
          </div>
        </div>
      )}

      {/* the chat popover (corner on desktop, fullscreen on mobile) - no ship here */}
      {open && (
        <div
          role="dialog"
          aria-label="Lensy says hi"
          className="fixed inset-0 z-50 flex flex-col justify-center overflow-y-auto bg-surface px-5 py-6 sm:inset-auto sm:bottom-24 sm:right-5 sm:z-40 sm:block sm:w-[340px] sm:max-w-[calc(100vw-1.5rem)] sm:overflow-visible sm:rounded-3xl sm:border-[2.5px] sm:border-ink sm:p-4 sm:shadow-[5px_6px_0_var(--color-ink)] sm:anim-pop"
        >
          <button
            onClick={close}
            aria-label="Close Lensy"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink transition-colors hover:bg-mist"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>

          {/* greeting */}
          <div className="flex items-end gap-2 pr-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={view === "thanks" ? LENSY_IDEA : LENSY_WAVE} alt="Lensy" className="anim-bob h-16 w-auto shrink-0" />
            <div className="bubble mb-1">
              <span className="font-hand text-sm font-bold text-brand">Lensy</span>
              <br />
              Hi! I just landed on Planet Earth 👋 My spaceship is still figuring a few things out…
            </div>
          </div>

          {/* QUESTION */}
          {view === "q" && (
            <>
              <div className="mt-3 rounded-2xl border-2 border-mist bg-paper p-3 text-sm text-ink/80">
                <p className="font-semibold text-ink">{q.place}</p>
                <p className="mt-1">{q.body}</p>
                <p className="mt-2 font-hand font-bold text-brand">My spaceship is confused. Can you help me understand?</p>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <button onClick={() => setView("tell")} className={btnPrimary}>
                  Tell Lensy what you think
                </button>
                <div className="flex gap-2">
                  <button onClick={nextQuestion} className={`${btnOutline} flex-1`}>
                    Another question
                  </button>
                  <button onClick={() => setView("meet")} className={`${btnGhost} shrink-0`}>
                    Meet Lensy
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TELL LENSY */}
          {view === "tell" && (
            <div className="mt-3">
              <p className="text-sm text-ink/80">What do you think? Lensy is listening 👀</p>
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                rows={3}
                placeholder="Type your thought for Lensy…"
                className="mt-2 w-full resize-none rounded-2xl border-2 border-mist bg-paper p-3 text-sm text-ink outline-none focus:border-violet-300"
              />
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => setView("q")} className={btnGhost} aria-label="Back">
                  ← Back
                </button>
                <button
                  onClick={sendThought}
                  disabled={!thought.trim()}
                  className={`${btnPrimary} ml-auto disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  Send to Lensy
                </button>
              </div>
            </div>
          )}

          {/* THANKS */}
          {view === "thanks" && (
            <div className="mt-3">
              <div className="rounded-2xl border-2 border-mist bg-paper p-3 text-sm text-ink/80">
                <p className="font-hand font-bold text-brand">Thank you! 📝</p>
                <p className="mt-1">I wrote that in my notebook. That helps my spaceship understand Earth a little better.</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={nextQuestion} className={`${btnOutline} flex-1`}>
                  Another question
                </button>
                <button onClick={close} className={btnGhost}>
                  Bye, Lensy
                </button>
              </div>
            </div>
          )}

          {/* MEET LENSY */}
          {view === "meet" && (
            <div className="mt-3">
              <div className="rounded-2xl border-2 border-mist bg-paper p-3">
                <p className="font-hand text-base font-extrabold text-brand">Meet Lensy</p>
                <dl className="mt-2 space-y-1.5">
                  {BIO.map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-xs">
                      <dt className="w-24 shrink-0 font-bold uppercase tracking-wide text-brandsoft">{k}</dt>
                      <dd className="text-ink/80">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <button onClick={() => setView("q")} className={`${btnGhost} mt-2`} aria-label="Back to questions">
                ← Back to questions
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
