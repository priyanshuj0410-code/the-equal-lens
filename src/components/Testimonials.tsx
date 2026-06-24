"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/knowledge";

const CAP = 10;
const INTERVAL_MS = 5500;

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

  // auto-rotate, unless paused, single item, or reduced-motion
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
        className="relative mt-10"
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
            {shown.map((t, i) => (
              <div
                key={t.id}
                className="w-full shrink-0 px-2 pb-2"
                aria-hidden={i !== current}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
              >
                <figure className="card mx-auto flex max-w-2xl flex-col text-center">
                  <span aria-hidden="true" className="font-hand text-6xl leading-none text-brand/30">
                    &ldquo;
                  </span>
                  <blockquote className="-mt-3 font-hand text-xl font-bold leading-snug text-ink sm:text-2xl">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center justify-center gap-3">
                    {t.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={t.photo}
                        alt=""
                        className="h-11 w-11 rounded-full border-2 border-ink object-cover"
                      />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-violet-100 font-hand text-sm font-extrabold text-brand">
                        {initials(t.name)}
                      </span>
                    )}
                    <span className="text-left">
                      <span className="block font-hand text-sm font-bold text-ink">{t.name}</span>
                      {t.role && <span className="block text-xs text-brandsoft">{t.role}</span>}
                    </span>
                  </figcaption>
                </figure>
              </div>
            ))}
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
