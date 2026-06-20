"use client";

import { useState } from "react";

type Channel = {
  key: string;
  label: string;
  tint: string;
  stroke: string;
  body: string;
  example: string;
  icon: React.ReactNode;
};

const CHANNELS: Channel[] = [
  {
    key: "playground",
    label: "Playground",
    tint: "#FAD9CE",
    stroke: "#993C1D",
    body: "On the playground, kids sort themselves into who plays what and who gets to join. Games, teams, and teasing quietly teach who belongs where.",
    example: "“You can’t play — that’s a boys’ game.”",
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: "media",
    label: "Media",
    tint: "#DCEEFB",
    stroke: "#185FA5",
    body: "Cartoons, ads, and games repeat the same patterns — who’s the hero, who’s the helper, who’s left out — until they start to feel like the truth.",
    example: "“The hero saves the day; the girl waits to be saved.”",
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="m17 2-5 5-5-5" />
      </svg>
    ),
  },
  {
    key: "family",
    label: "Family",
    tint: "#FCEFCB",
    stroke: "#8A5A00",
    body: "Home is where children first observe roles, responsibilities, and expectations. The division of tasks, the language used, and praise patterns all shape their sense of fairness.",
    example: "“Girls tidy up, boys take out the bins.”",
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5 12 3l9 6.5" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    key: "language",
    label: "Language",
    tint: "#D7F5EC",
    stroke: "#0F6E56",
    body: "Everyday phrases pack big assumptions into small words — ones kids repeat without ever stopping to question them.",
    example: "“Don’t cry like a girl.” · “Man up.”",
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l1.9-5.5A8.5 8.5 0 1 1 21 11.5Z" />
      </svg>
    ),
  },
  {
    key: "classroom",
    label: "Classroom",
    tint: "#E5E0ED",
    stroke: "#553286",
    body: "Who gets called on, who’s praised for being neat versus clever, who’s picked to lead — small classroom habits add up to big expectations.",
    example: "“Can I get a couple of strong boys to help?”",
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
  },
];

export default function BiasChannels() {
  const [open, setOpen] = useState(0);
  const c = CHANNELS[open];

  return (
    <div>
      {/* button-styled tabs — same visual language as the clickable toolbar */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {CHANNELS.map((ch, i) => {
          const on = i === open;
          return (
            <button
              key={ch.key}
              onClick={() => setOpen(i)}
              aria-pressed={on}
              style={on ? { background: ch.tint, color: ch.stroke } : undefined}
              className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 font-hand text-sm font-bold transition-all ${
                on
                  ? "-translate-y-0.5 border-ink shadow-[3px_3px_0_#221436]"
                  : "border-mist bg-white text-ink/70 hover:-translate-y-0.5 hover:border-ink hover:text-ink"
              }`}
            >
              <span className="h-5 w-5">{ch.icon}</span>
              {ch.label}
            </button>
          );
        })}
      </div>

      {/* the stage */}
      <div className="mt-7 overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-[6px_7px_0_#C5B6DE] md:grid md:grid-cols-[38%_1fr]">
        <div
          className="relative flex items-center justify-center overflow-hidden p-12 transition-colors duration-300"
          style={{ background: c.tint }}
        >
          <span
            className="anim-bob flex h-28 w-28 items-center justify-center rounded-[28px] border-2 border-ink bg-white transition-colors duration-300"
            style={{ color: c.stroke }}
          >
            <span className="h-14 w-14">{c.icon}</span>
          </span>
          <span
            className="absolute right-5 top-5 font-hand text-5xl font-extrabold opacity-20"
            style={{ color: c.stroke }}
          >
            {open + 1}
          </span>
        </div>

        <div className="p-7 sm:p-9">
          <p className="font-hand text-xs font-bold uppercase tracking-widest text-violet-400">
            Where bias sneaks in
          </p>
          <h3
            className="mt-1 font-hand text-3xl font-extrabold transition-colors duration-300"
            style={{ color: c.stroke }}
          >
            {c.label}
          </h3>
          <p className="mt-3 leading-relaxed text-ink/75">{c.body}</p>
          <div
            className="mt-5 rounded-2xl border-2 border-dashed p-4 transition-colors duration-300"
            style={{ borderColor: c.stroke }}
          >
            <p className="font-hand text-xs font-bold uppercase tracking-wide" style={{ color: c.stroke }}>
              a kid might hear…
            </p>
            <p className="mt-1 font-hand text-xl font-bold text-ink">{c.example}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
