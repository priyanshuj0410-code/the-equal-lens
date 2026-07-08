"use client";

import { useEffect, useRef, useState } from "react";
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
  // The invisible sizer's rendered height drives the frame; we read it into
  // state so the frame height can transition (CSS can't animate height:auto).
  const sizerRef = useRef<HTMLImageElement>(null);
  const [frameHeight, setFrameHeight] = useState<number>();
  const count = images.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  useEffect(() => {
    const el = sizerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (el.offsetHeight) setFrameHeight(el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (count === 0) return null;

  const current = Math.min(index, count - 1);
  const go = (i: number) => setIndex((i + count) % count);

  return (
    <figure
      className={`group not-prose ${className}`}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border-2 border-ink bg-surface shadow-[4px_4px_0_var(--color-ink)]">
        {/* The frame hugs each image with no crop and no letterbox bars. The
            invisible in-flow copy of the current image is measured to drive the
            frame height, which transitions smoothly between differently shaped
            images; the stacked copies crossfade on top. */}
        <div
          className="relative w-full transition-[height] duration-500 ease-out"
          style={frameHeight ? { height: frameHeight } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={sizerRef}
            src={images[current].url}
            alt=""
            aria-hidden
            className="pointer-events-none block w-full opacity-0"
          />
          {images.map((img, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={i}
              src={img.url}
              alt={img.alt ?? ""}
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
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink shadow-[2px_2px_0_var(--color-ink)] opacity-0 transition-[transform,opacity] duration-200 hover:scale-110 focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink shadow-[2px_2px_0_var(--color-ink)] opacity-0 transition-[transform,opacity] duration-200 hover:scale-110 focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100"
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
