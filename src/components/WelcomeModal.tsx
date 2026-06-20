"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Mascot from "@/components/Mascot";
import { Doodle } from "@/components/Doodles";

export default function WelcomeModal() {
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const [shown, setShown] = useState(false);

  // little entrance: fade + pop in on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(id);
    };
  }, []);

  function choose(a: "kid" | "adult") {
    document.cookie = `audience=${a};path=/;max-age=31536000`;
    setClosing(true);
    router.refresh();
  }

  // Esc / backdrop = "decide later" → friendly default (kid), still commits a
  // cookie so we don't nag on every page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") choose("kid");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (closing) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* backdrop */}
      <button
        aria-label="Decide later"
        onClick={() => choose("kid")}
        className="absolute inset-0 cursor-default bg-[#1a1030]/55 backdrop-blur-sm"
      />

      {/* card */}
      <div
        className={`relative w-full max-w-lg rounded-[2rem] border-[3px] border-[#221436] bg-paper p-7 shadow-[8px_10px_0_#221436] transition-transform duration-300 sm:p-9 ${
          shown ? "scale-100" : "scale-95"
        }`}
      >
        {/* mascots peeking over the top */}
        <div className="pointer-events-none absolute -top-16 left-1/2 flex -translate-x-1/2 items-end gap-1">
          <Mascot type="un" className="anim-bob h-24 w-auto drop-shadow-md" />
          <Mascot type="re" className="anim-float h-24 w-auto drop-shadow-md" />
        </div>

        <Doodle name="sparkle" className="anim-wobble absolute -left-3 top-10 w-7 text-sun" />
        <Doodle name="star" className="anim-float absolute -right-2 top-20 w-6 text-grow" />

        <div className="mt-10 text-center">
          <span className="inline-block rounded-full border-2 border-[#221436] bg-sun px-3 py-1 font-hand text-xs font-bold uppercase tracking-widest text-[#221436]">
            First time through the lens?
          </span>
          <h2
            id="welcome-title"
            className="mt-4 font-hand text-3xl font-extrabold text-ink sm:text-4xl"
          >
            How do you identify
            <br />
            today?
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink/70">
            No wrong answers - it just sets the vibe. You can switch any time from
            the toggle, top-right.
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {/* KID */}
          <button
            onClick={() => choose("kid")}
            className="hover-pop group flex flex-col items-start gap-3 rounded-2xl border-[3px] border-[#221436] bg-gradient-to-br from-[#FFF3D6] to-[#FFE3D0] p-5 text-left shadow-[4px_5px_0_#221436] transition-transform"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#221436] bg-sun text-[#221436]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            </span>
            <span className="font-hand text-2xl font-extrabold text-[#221436]">
              A kid 🧒
            </span>
            <span className="text-sm font-medium text-[#5a3d12]">
              Bright, playful, doodles everywhere - and a bit younger at heart.
            </span>
          </button>

          {/* ADULT - previews the dark theme */}
          <button
            onClick={() => choose("adult")}
            className="hover-pop group flex flex-col items-start gap-3 rounded-2xl border-[3px] border-[#221436] bg-gradient-to-br from-[#2b1d4d] to-[#181030] p-5 text-left text-white shadow-[4px_5px_0_#221436] transition-transform"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 text-sun">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            </span>
            <span className="font-hand text-2xl font-extrabold text-white">
              A grown-up 🫠
            </span>
            <span className="text-sm font-medium text-violet-200">
              Dark theme, grown-up myths - 18 and (mostly) over it.
            </span>
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-ink/45">
          psst - you&rsquo;re never locked in. Toggle whenever you like.
        </p>
      </div>
    </div>
  );
}
