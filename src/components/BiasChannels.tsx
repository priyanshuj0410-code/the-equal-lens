"use client";

import { useState } from "react";

type Channel = {
  key: string;
  label: string;
  tint: string;
  stroke: string;
  darkTint: string;
  darkStroke: string;
  body: string;
  example: string;
  icon: React.ReactNode;
};

const icon = (paths: React.ReactNode) => (
  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const CHANNELS_KID: Channel[] = [
  {
    key: "playground", label: "Playground",
    tint: "#FAD9CE", stroke: "#993C1D", darkTint: "#3A2620", darkStroke: "#FF9C7A",
    body: "On the playground, kids sort themselves into who plays what and who gets to join. Games, teams, and teasing quietly teach who belongs where.",
    example: "“You can’t play - that’s a boys’ game.”",
    icon: icon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  },
  {
    key: "media", label: "Media",
    tint: "#DCEEFB", stroke: "#185FA5", darkTint: "#1E2E3E", darkStroke: "#7FC0F5",
    body: "Cartoons, ads, and games repeat the same patterns - who’s the hero, who’s the helper, who’s left out - until they start to feel like the truth.",
    example: "“The hero saves the day; the girl waits to be saved.”",
    icon: icon(<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="m17 2-5 5-5-5" /></>),
  },
  {
    key: "family", label: "Family",
    tint: "#FCEFCB", stroke: "#8A5A00", darkTint: "#3A2F18", darkStroke: "#F2C566",
    body: "Home is where children first observe roles, responsibilities, and expectations. The division of tasks, the language used, and praise patterns all shape their sense of fairness.",
    example: "“Girls tidy up, boys take out the bins.”",
    icon: icon(<><path d="M3 9.5 12 3l9 6.5" /><path d="M5 10v10h14V10" /></>),
  },
  {
    key: "language", label: "Language",
    tint: "#D7F5EC", stroke: "#0F6E56", darkTint: "#1B3A33", darkStroke: "#5FD6BD",
    body: "Everyday phrases pack big assumptions into small words - ones kids repeat without ever stopping to question them.",
    example: "“Don’t cry like a girl.” · “Man up.”",
    icon: icon(<path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l1.9-5.5A8.5 8.5 0 1 1 21 11.5Z" />),
  },
  {
    key: "classroom", label: "Classroom",
    tint: "#E5E0ED", stroke: "#553286", darkTint: "#2E2440", darkStroke: "#C9B8E6",
    body: "Who gets called on, who’s praised for being neat versus clever, who’s picked to lead - small classroom habits add up to big expectations.",
    example: "“Can I get a couple of strong boys to help?”",
    icon: icon(<><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></>),
  },
];

const CHANNELS_ADULT: Channel[] = [
  {
    key: "work", label: "Workplace",
    tint: "#FAD9CE", stroke: "#993C1D", darkTint: "#3A2620", darkStroke: "#FF9C7A",
    body: "Who gets hired, heard, promoted, and paid - a hundred small calls that quietly add up to a very uneven picture.",
    example: "“We need someone who’ll really commit - is she planning a family?”",
    icon: icon(<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>),
  },
  {
    key: "media", label: "Media",
    tint: "#DCEEFB", stroke: "#185FA5", darkTint: "#1E2E3E", darkStroke: "#7FC0F5",
    body: "Feeds, films, and ads keep selling the same 'ideal' - until it quietly becomes the standard we measure ourselves against.",
    example: "“Distinguished older man. Past-it older woman.”",
    icon: icon(<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="m17 2-5 5-5-5" /></>),
  },
  {
    key: "relationships", label: "Relationships",
    tint: "#FBEAF0", stroke: "#993556", darkTint: "#3A2030", darkStroke: "#F0A6C2",
    body: "Who plans, who pays, who 'should' propose, who handles the feelings - scripts we follow without ever choosing them.",
    example: "“So when are you two finally settling down?”",
    icon: icon(<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1Z" />),
  },
  {
    key: "family", label: "Family",
    tint: "#FCEFCB", stroke: "#8A5A00", darkTint: "#3A2F18", darkStroke: "#F2C566",
    body: "Whose career bends for the kids, who hosts the holidays, who's 'the emotional one' - roles handed down so quietly they feel natural.",
    example: "“She’ll take the leave, obviously.”",
    icon: icon(<><path d="M3 9.5 12 3l9 6.5" /><path d="M5 10v10h14V10" /></>),
  },
  {
    key: "online", label: "Online",
    tint: "#D7F5EC", stroke: "#0F6E56", darkTint: "#1B3A33", darkStroke: "#5FD6BD",
    body: "Algorithms reward the loudest takes and the harshest standards - and we scroll right past how much it shapes us.",
    example: "“Filter, compare, repeat.”",
    icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18" /></>),
  },
];

export default function BiasChannels({ audience }: { audience: "kid" | "adult" }) {
  const channels = audience === "adult" ? CHANNELS_ADULT : CHANNELS_KID;
  const [open, setOpen] = useState(0);
  const c = channels[open] ?? channels[0];
  const dark = audience === "adult";
  const sc = (ch: Channel) => (dark ? ch.darkStroke : ch.stroke);
  const tc = (ch: Channel) => (dark ? ch.darkTint : ch.tint);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {channels.map((ch, i) => {
          const on = i === open;
          return (
            <button
              key={ch.key}
              onClick={() => setOpen(i)}
              aria-pressed={on}
              style={on ? { background: tc(ch), color: sc(ch) } : undefined}
              className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 font-hand text-sm font-bold transition-all ${
                on
                  ? "-translate-y-0.5 border-ink shadow-[3px_3px_0_var(--color-ink)]"
                  : "border-mist bg-surface text-ink/70 hover:-translate-y-0.5 hover:border-ink hover:text-ink"
              }`}
            >
              <span className="h-5 w-5">{ch.icon}</span>
              {ch.label}
            </button>
          );
        })}
      </div>

      <div className="mt-7 overflow-hidden rounded-3xl border-2 border-ink bg-surface shadow-[6px_7px_0_#C5B6DE] md:grid md:grid-cols-[38%_1fr]">
        <div
          className="relative flex items-center justify-center overflow-hidden p-12 transition-colors duration-300"
          style={{ background: tc(c) }}
        >
          <span
            className="anim-bob flex h-28 w-28 items-center justify-center rounded-[28px] border-2 border-ink bg-surface transition-colors duration-300"
            style={{ color: sc(c) }}
          >
            <span className="h-14 w-14">{c.icon}</span>
          </span>
          <span
            className="absolute right-5 top-5 font-hand text-5xl font-extrabold opacity-20"
            style={{ color: sc(c) }}
          >
            {open + 1}
          </span>
        </div>

        <div className="p-7 sm:p-9">
          <p className="font-hand text-xs font-bold uppercase tracking-widest text-brandsoft">
            Where bias sneaks in
          </p>
          <h3
            className="mt-1 font-hand text-3xl font-extrabold transition-colors duration-300"
            style={{ color: sc(c) }}
          >
            {c.label}
          </h3>
          <p className="mt-3 leading-relaxed text-ink/75">{c.body}</p>
          <div
            className="mt-5 rounded-2xl border-2 border-dashed p-4 transition-colors duration-300"
            style={{ borderColor: sc(c) }}
          >
            <p className="font-hand text-xs font-bold uppercase tracking-wide" style={{ color: sc(c) }}>
              {audience === "adult" ? "you might hear…" : "a kid might hear…"}
            </p>
            <p className="mt-1 font-hand text-xl font-bold text-ink">{c.example}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
