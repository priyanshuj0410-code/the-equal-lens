"use client";

import { useEffect, useState } from "react";
import type { BlogSlide } from "@/lib/knowledge";

const INTERVAL_MS = 6000;

export default function BlogCarousel({
  images,
  className = "",
}: {
  images: BlogSlide[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Natural aspect ratio (w/h) per image, filled in on load, so the frame can
  // hug each image instead of cropping it to a fixed box.
  const [ratios, setRatios] = useState<number[]>([]);
  const count = images.length;

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
    <figure
      className={`not-prose ${className}`}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border-2 border-ink bg-surface shadow-[4px_4px_0_var(--color-ink)]">
        <div
          className="relative w-full transition-[aspect-ratio] duration-500"
          style={{ aspectRatio: String(ratios[current] ?? 3 / 2), maxHeight: "78vh" }}
        >
          {images.map((img, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={i}
              src={img.url}
              alt={img.alt ?? ""}
              onLoad={(e) => {
                const el = e.currentTarget;
                if (!el.naturalHeight) return;
                const r = el.naturalWidth / el.naturalHeight;
                setRatios((prev) => {
                  if (prev[i] === r) return prev;
                  const next = [...prev];
                  next[i] = r;
                  return next;
                });
              }}
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={i !== current}
            />
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(current - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink shadow-[2px_2px_0_var(--color-ink)] transition-transform hover:scale-110"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink shadow-[2px_2px_0_var(--color-ink)] transition-transform hover:scale-110"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {images[current].caption && (
        <figcaption className="mt-3 text-center text-sm text-ink/60">
          {images[current].caption}
        </figcaption>
      )}

      {count > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === current}
              className={`h-2.5 rounded-full border-2 border-ink transition-all ${
                i === current ? "w-6 bg-brand" : "w-2.5 bg-surface"
              }`}
            />
          ))}
        </div>
      )}
    </figure>
  );
}
