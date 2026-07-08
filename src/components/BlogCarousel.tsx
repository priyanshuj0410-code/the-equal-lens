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
  const frameRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const count = images.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  // Track the frame's width so the height can be derived from the current
  // image's aspect ratio (deterministic — the height changes the instant the
  // slide changes, so the CSS transition fires reliably instead of snapping).
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (count === 0) return null;

  const current = Math.min(index, count - 1);
  const go = (i: number) => setIndex((i + count) % count);

  // Record each image's ratio when it loads — checking `complete` first so
  // cache-loaded images (which fire `load` before React attaches) still count.
  const recordRatio = (i: number) => (img: HTMLImageElement | null) => {
    if (!img) return;
    const set = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      if (w && h) setRatios((prev) => (prev[i] === w / h ? prev : { ...prev, [i]: w / h }));
    };
    if (img.complete) set();
    else img.addEventListener("load", set, { once: true });
  };

  const ratio = ratios[current];
  const frameHeight = width > 0 && ratio ? Math.round(width / ratio) : undefined;

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
        {/* Frame hugs the current image (no crop, no letterbox) and animates its
            height smoothly between differently shaped slides. */}
        <div
          ref={frameRef}
          className="relative w-full"
          style={{
            height: frameHeight,
            aspectRatio: frameHeight ? undefined : "3 / 2",
            transition: "height 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {images.map((img, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={i}
              ref={recordRatio(i)}
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
