"use client";

import { useState } from "react";

type Channel = {
  key: string;
  label: string;
  tint: string;
  stroke: string;
  body: string;
  icon: React.ReactNode;
};

const CHANNELS: Channel[] = [
  {
    key: "playground",
    label: "Playground",
    tint: "#FAD9CE",
    stroke: "#993C1D",
    body: "On the playground, kids sort themselves into 'who plays what' and 'who gets to join.' Games, teams, and teasing quietly teach who belongs where.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    body: "Cartoons, ads, and games repeat the same patterns — who's the hero, who's the helper, who's left out — until they start to feel like the truth.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    body: "Home is where children first observe roles, responsibilities, and expectations. The division of tasks, language used, and praise patterns all shape their understanding of fairness.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    body: "Everyday phrases — 'man up', 'throw like a girl' — pack big assumptions into small words that kids repeat without thinking.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l1.9-5.5A8.5 8.5 0 1 1 21 11.5Z" />
      </svg>
    ),
  },
  {
    key: "classroom",
    label: "Classroom",
    tint: "#E5E0ED",
    stroke: "#553286",
    body: "Who gets called on, who's praised for being neat versus clever, who's picked to lead — small classroom habits add up to big expectations.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
  },
];

export default function BiasChannels() {
  const [open, setOpen] = useState(0);
  const active = CHANNELS[open];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CHANNELS.map((c, i) => {
          const on = i === open;
          return (
            <button
              key={c.key}
              onClick={() => setOpen(i)}
              aria-expanded={on}
              style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
              className={`flex flex-col items-center rounded-2xl border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-0.5 ${
                on ? "shadow-[3px_3px_0_#221436]" : "shadow-none"
              }`}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: c.tint, color: c.stroke }}
              >
                {c.icon}
              </span>
              <span className="mt-3 font-hand text-base font-bold text-ink">{c.label}</span>
              <span className="mt-1 text-ink/40">{on ? "▲" : "▼"}</span>
            </button>
          );
        })}
      </div>

      <div
        className="mt-5 rounded-2xl border-2 border-ink bg-white p-6 shadow-[4px_4px_0_#C5B6DE]"
        style={{ borderLeftWidth: 8, borderLeftColor: active.stroke }}
      >
        <p className="font-hand text-lg font-bold" style={{ color: active.stroke }}>
          {active.label}
        </p>
        <p className="mt-1 text-ink/75">{active.body}</p>
      </div>
    </div>
  );
}
