"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// public/ filenames have spaces + capitals - encode for the URL
const SHIP_CLOSED = "/Ship%20-%20Closed.svg";
const LENSY_WAVE = "/Lensy%20-%20Wave.svg";
const LENSY_IDEA = "/Lensy%20-%20Idea.svg";

const QUESTIONS = [
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

const BIO: [string, string][] = [
  ["Species", "Curious Alien"],
  ["Mission", "Understand Humans"],
  ["Special skill", "Asking questions that make stereotypes sound strange"],
  ["Favourite word", "“Why?”"],
  ["Current status", "Confused, but learning 🚀"],
];

const SEEN_KEY = "lensy-seen";
type View = "q" | "tell" | "meet" | "thanks";

export default function LensyPopup() {
  const [open, setOpen] = useState(false);
  const [knocking, setKnocking] = useState(false); // "knock knock" scribble
  const [view, setView] = useState<View>("q");
  const [qi, setQi] = useState(0);
  const [thought, setThought] = useState("");
  const [dock, setDock] = useState<HTMLElement | null>(null); // mobile slot next to the toolbar
  const knockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // grab the toolbar's mobile dock slot (rendered by SiteCanvas)
  useEffect(() => {
    setDock(document.getElementById("lensy-dock"));
  }, []);

  // first-visit auto-open (once per session); the ship bubble stays forever
  useEffect(() => {
    if (typeof window === "undefined") return;
    setQi(Math.floor(Math.random() * QUESTIONS.length));
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(SEEN_KEY);
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (knockTimer.current) clearTimeout(knockTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function markSeen() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }

  function close() {
    setOpen(false);
    setView("q");
    markSeen();
  }

  // tap the ship -> knock, knock -> Lensy comes out
  function knock() {
    if (knocking || open) return;
    setKnocking(true);
    setView("q");
    knockTimer.current = setTimeout(() => {
      setKnocking(false);
      setOpen(true);
      markSeen();
    }, 850);
  }

  function nextQuestion() {
    setQi((i) => (i + 1) % QUESTIONS.length);
    setView("q");
  }

  const btnPrimary =
    "rounded-full border-2 border-ink bg-sun px-3 py-2 font-hand text-sm font-bold text-[#221436] shadow-[2px_2px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5";
  const btnOutline =
    "rounded-full border-2 border-violet-300 bg-surface px-3 py-2 font-hand text-sm font-bold text-brand transition-colors hover:bg-mist";
  const btnGhost =
    "rounded-full px-3 py-2 font-hand text-sm font-bold text-brandsoft transition-colors hover:text-brand";

  const q = QUESTIONS[qi];

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
        onClick={open ? close : knock}
        aria-label={open ? "Close Lensy" : "Call Lensy"}
        title={open ? "Close Lensy" : "Call Lensy"}
        className="flex h-14 w-14 items-center justify-center overflow-visible rounded-full border-2 border-ink bg-surface/95 shadow-[4px_4px_0_var(--color-ink)] backdrop-blur transition-transform hover:-translate-y-0.5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SHIP_CLOSED} alt="Lensy's spaceship - tap to call Lensy" className="h-11 w-auto" />
      </button>
    </div>
  );

  return (
    <>
      {/* desktop: ship parked in the bottom-right corner */}
      <div className="fixed bottom-4 right-3 z-50 hidden sm:block sm:right-5">{launcher}</div>

      {/* mobile: ship docked next to the centered toolbar (portaled into SiteCanvas) */}
      {dock && createPortal(launcher, dock)}

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
            <div className="mb-1 rounded-2xl rounded-bl-sm bg-mist px-3 py-2 text-xs leading-snug text-ink">
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
                  onClick={() => setView("thanks")}
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
