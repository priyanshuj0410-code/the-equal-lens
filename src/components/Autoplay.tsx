"use client";

import { useEffect, useRef, useState } from "react";

// Shared autoplay for the site's carousels. Three things stop it: the visible
// pause button (stays stopped until pressed again, WCAG 2.2.2), a hold while the
// pointer, touch or keyboard focus is on the carousel (lifts on leave), and
// prefers-reduced-motion (never starts; the button is not shown).
export function useAutoplay(count: number, intervalMs: number, advance: () => void) {
  const [stopped, setStopped] = useState(false);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);
  const tick = useRef(advance);
  useEffect(() => {
    tick.current = advance;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const running = !stopped && !held && !reduced && count > 1;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => tick.current(), intervalMs);
    return () => window.clearInterval(id);
  }, [running, intervalMs]);

  return {
    running,
    stopped,
    showToggle: count > 1 && !reduced,
    // spread on the carousel root
    holdProps: {
      onMouseEnter: () => setHeld(true),
      onMouseLeave: () => setHeld(false),
      onFocusCapture: () => setHeld(true),
      onBlurCapture: () => setHeld(false),
      onTouchStart: () => setHeld(true),
      onTouchEnd: () => setHeld(false),
      onTouchCancel: () => setHeld(false),
    },
    // pressing Play must resume at once, even while the pointer or focus is on the carousel
    toggle: () => {
      setStopped((s) => !s);
      setHeld(false);
    },
  };
}

export function AutoplayToggle({
  stopped,
  onToggle,
  noun,
}: {
  stopped: boolean;
  onToggle: () => void;
  noun: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={stopped ? `Play ${noun}` : `Pause ${noun}`}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink shadow-[2px_2px_0_var(--color-ink)] transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
        {stopped ? <path d="M8 5.5v13l11-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
      </svg>
    </button>
  );
}
