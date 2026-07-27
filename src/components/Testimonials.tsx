"use client";

import { useEffect, useState } from "react";
import { Bubble } from "@equal-lens/brand";
import type { Testimonial } from "@/lib/knowledge";

const CAP = 10;
const INTERVAL_MS = 5500;
const MAX_QUOTE = 160;
const TILTS = [-2, 1.5, -1, 2.5, -1.5, 1, -2, 1.5, -1, 2];

// Shared easing - same curve on track + inner elements so everything
// moves as one unit and the "push" reads correctly.
const EASE = "550ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";

function initials(name?: string) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export default function Testimonials({
  items,
  eyebrow,
  heading,
  className = "",
}: {
  items: Testimonial[];
  eyebrow: string;
  heading: string;
  className?: string;
}) {
  const shown = items.slice(0, CAP);
  const count = shown.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || count <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;

  const current = Math.min(index, count - 1);
  const go = (i: number) => setIndex((i + count) % count);

  return (
    <section className={`mx-auto max-w-5xl px-5 py-16 ${className}`}>
      <div className="text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 font-hand text-4xl font-extrabold text-ink">{heading}</h2>
      </div>

      <div
        className="relative mt-4"
        aria-roledescription="carousel"
        aria-label={heading}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onTouchCancel={() => setPaused(false)}
      >
        <div className="overflow-hidden">
          {/* Track - same EASE as inner elements so the whole card moves as one unit */}
          <div
            className="flex"
            style={{ transform: `translateX(-${current * 100}%)`, transition: `transform ${EASE}` }}
          >
            {shown.map((t, i) => {
              const dist = i - current;
              const tilt = TILTS[i % TILTS.length];
              const quote = t.quote ? truncate(t.quote, MAX_QUOTE) : "";
              // Photo-only gallery items skip the chat bubble entirely.
              const hasBubble = Boolean(t.name || quote || t.role);

              return (
                <div
                  key={t.id}
                  // pt-48 = 192px - headroom for any 160-char quote at 14px text
                  className="w-full shrink-0 px-4 pb-6 pt-48"
                  aria-hidden={i !== current}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                >
                  <div className="relative mx-auto max-w-[392px]">

                    {/* ── MOBILE BUBBLE ───────────────────────────────────────────
                        Full-width, no right overhang - stays within polaroid bounds.
                        bottom: calc(100% - 18px) = mostly above polaroid, 18px overlap. */}
                    {hasBubble && (
                      <Bubble
                        className="absolute right-2 left-2 z-20 block sm:hidden"
                        style={{
                          bottom: "calc(100% - 18px)",
                          transform: `translateX(${dist * 5}px)`,
                          transition: `transform ${EASE}`,
                        }}
                      >
                        {t.name && (
                          <p className="mb-1 font-hand text-sm font-bold text-brand">{t.name}</p>
                        )}
                        {quote && (
                          <p className="font-hand text-sm font-semibold leading-snug text-ink">
                            &ldquo;{quote}&rdquo;
                          </p>
                        )}
                        {t.role && (
                          <p className="mt-1 font-hand text-xs text-brandsoft">{t.role}</p>
                        )}
                      </Bubble>
                    )}

                    {/* Desktop - 75% polaroid width, -right-10 hangs 40px beyond right edge */}
                    {hasBubble && (
                      <Bubble
                        className="absolute -right-10 z-20 hidden w-[75%] sm:block"
                        style={{
                          bottom: "calc(100% - 32px)",
                          transform: `translateX(${dist * 5}px)`,
                          transition: `transform ${EASE}`,
                        }}
                      >
                        {t.name && (
                          <p className="mb-1 font-hand text-sm font-bold text-brand">{t.name}</p>
                        )}
                        {quote && (
                          <p className="font-hand text-sm font-semibold leading-snug text-ink">
                            &ldquo;{quote}&rdquo;
                          </p>
                        )}
                        {t.role && (
                          <p className="mt-1 font-hand text-xs text-brandsoft">{t.role}</p>
                        )}
                      </Bubble>
                    )}

                    {/* Polaroid */}
                    <div
                      className="relative z-10 overflow-hidden rounded-sm border-2 border-ink bg-white shadow-[5px_5px_0_var(--color-ink)]"
                      style={{
                        transform: `translateX(${dist * -4}px) rotate(${tilt}deg)`,
                        transition: `transform ${EASE}`,
                      }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink">
                        {t.photo ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={t.photo}
                            alt={t.name ? `${t.name} at an Equal Lens workshop` : "An Equal Lens workshop moment"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-violet-50">
                            <span className="font-hand text-6xl font-extrabold text-brand/30">
                              {initials(t.name) || initials(t.tag) || "EL"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center px-5 py-4">
                        {t.tag && (
                          <span className="font-hand text-xs italic text-ink/40">{t.tag}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(current - 1)}
              aria-label="Previous testimonial"
              className="absolute left-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink shadow-[2px_2px_0_var(--color-ink)] transition-transform hover:scale-110 sm:-left-3"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              aria-label="Next testimonial"
              className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink shadow-[2px_2px_0_var(--color-ink)] transition-transform hover:scale-110 sm:-right-3"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {shown.map((_, i) => (
            <button
              key={shown[i].id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === current}
              className={`h-2.5 rounded-full border-2 border-ink transition-all ${
                i === current ? "w-6 bg-brand" : "w-2.5 bg-surface"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
