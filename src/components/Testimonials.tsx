"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/knowledge";

const CAP = 10;
const INTERVAL_MS = 5500;
const TILTS = [-2, 1.5, -1, 2.5, -1.5, 1, -2, 1.5, -1, 2];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
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
        className="relative mt-12"
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
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {shown.map((t, i) => {
              const dist = i - current;
              const tilt = TILTS[i % TILTS.length];

              return (
                <div
                  key={t.id}
                  // pt-40 gives 160px above the polaroid — enough for any quote length
                  className="w-full shrink-0 px-4 pb-6 pt-40"
                  aria-hidden={i !== current}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                >
                  {/* Centering wrapper — 40% larger than before (280→392px).
                      The bubble at -right-8 extends 32px beyond the polaroid right
                      edge so it floats over the corner, not the full top edge. */}
                  <div className="relative mx-auto max-w-[392px]">

                    {/* Lensy-style bubble — narrow (44% of polaroid = ~172px) so it
                        covers only the top-right corner. Moves faster for parallax. */}
                    <div
                      className="absolute -right-8 z-20 w-[44%] rounded-2xl rounded-bl-[0.25rem] bg-mist px-3 py-2.5"
                      style={{
                        bottom: "calc(100% - 18px)",
                        transform: `translateX(${dist * 14}px)`,
                        transition: "transform 500ms ease-out",
                      }}
                    >
                      <p className="font-hand text-xs font-bold leading-snug text-ink">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      {t.role && (
                        <p className="mt-1 font-hand text-[10px] text-brandsoft">{t.role}</p>
                      )}
                    </div>

                    {/* Polaroid — moves slightly slower for parallax depth */}
                    <div
                      className="relative z-10 overflow-hidden rounded-sm border-2 border-ink bg-white shadow-[5px_5px_0_var(--color-ink)]"
                      style={{
                        transform: `translateX(${dist * -12}px) rotate(${tilt}deg)`,
                        transition: "transform 500ms ease-out",
                      }}
                    >
                      {/* Photo area */}
                      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink">
                        {t.photo ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={t.photo}
                            alt={`${t.name} at an Equal Lens workshop`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-violet-50">
                            <span className="font-hand text-6xl font-extrabold text-brand/30">
                              {initials(t.name)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Polaroid strip — name left, handwritten tag right */}
                      <div className="flex items-baseline justify-between px-5 py-4">
                        <span className="font-hand text-sm font-bold text-ink">{t.name}</span>
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
