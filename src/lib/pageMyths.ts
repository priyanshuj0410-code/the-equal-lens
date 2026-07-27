import type { Myth } from "./knowledge";

type Audience = "kid" | "adult";

// Which myths become the interactive sticky notes on each page - all distinct.
const ROUTE_MYTHS_KID: Record<string, string[]> = {
  "/": ["m-pink-is-for-girls", "m-leaders-can-be-anyone", "m-sports-no-gender"],
  "/about": ["m-boys-dont-cry", "m-scared-is-weak", "m-all-feelings-ok"],
  "/programs": ["m-girls-bad-at-maths", "m-some-kids-cant-learn", "m-mistakes-are-good"],
  "/blog": ["m-heroes-are-boys", "m-girls-care-about-looks", "m-looks-dont-equal-bad"],
  "/careers": ["m-nursing-is-for-women", "m-girls-cant-be-engineers", "m-dads-can-care"],
  "/contact": ["m-body-belongs-to-you", "m-asking-before-hug", "m-teasing-not-joke"],
  "/games": ["m-toys-have-no-gender", "m-everyone-can-play", "m-games-for-everyone"],
};

const ROUTE_MYTHS_ADULT: Record<string, string[]> = {
  "/": ["a-pay-gap", "a-ambition", "a-too-emotional"],
  "/about": ["a-men-feelings", "a-therapy", "a-childfree"],
  "/programs": ["a-bossy", "a-credit", "a-breadwinner"],
  "/blog": ["a-body-standards", "a-men-body", "a-ageing-women"],
  "/careers": ["a-paternity", "a-mental-load", "a-single-dad-adopt"],
  "/contact": ["a-unmarried-woman", "a-ageing-women", "a-childfree"],
  "/games": ["a-single-dad-adopt", "a-childfree", "a-breadwinner"],
};

export const ROUTE_MYTHS = ROUTE_MYTHS_KID;

const ROUTE_ORDER = ["/", "/about", "/programs", "/blog", "/careers", "/contact", "/games"];

function routeIndex(path: string): number {
  const i = ROUTE_ORDER.findIndex(
    (k) => path === k || (k !== "/" && path.startsWith(k)),
  );
  return i < 0 ? 0 : i;
}

export function mythsForPath(all: Myth[], path: string, audience: Audience = "kid"): Myth[] {
  const map = audience === "adult" ? ROUTE_MYTHS_ADULT : ROUTE_MYTHS_KID;
  const ids = map[ROUTE_ORDER[routeIndex(path)]];
  const chosen = ids
    .map((id) => all.find((m) => m.id === id))
    .filter((m): m is Myth => Boolean(m));
  if (chosen.length) return chosen;
  return all.filter((m) => (m.audience ?? "kid") === audience).slice(0, 3);
}

// Short ambient phrases scattered on the canvas - never the same as the sticky myths.
export type Scrap = { t: string; strike: boolean };

const SCATTER_KID: Scrap[] = [
  { t: "throw like a girl", strike: true },
  { t: "everyone belongs", strike: false },
  { t: "act your age", strike: true },
  { t: "be yourself", strike: false },
  { t: "that's so girly", strike: true },
  { t: "kindness counts", strike: false },
  { t: "stop being bossy", strike: true },
  { t: "share the credit", strike: false },
  { t: "don't be dramatic", strike: true },
  { t: "all feelings welcome", strike: false },
  { t: "be a good girl", strike: true },
  { t: "different is good", strike: false },
  { t: "tough it out", strike: true },
  { t: "ask first", strike: false },
  { t: "that's not ladylike", strike: true },
  { t: "stay curious", strike: false },
  { t: "grow a thick skin", strike: true },
  { t: "speak up", strike: false },
];

const SCATTER_ADULT: Scrap[] = [
  { t: "boys don't cry", strike: true },
  { t: "rest is productive", strike: false },
  { t: "she's too bossy", strike: true },
  { t: "ambition has no gender", strike: false },
  { t: "man up", strike: true },
  { t: "care is strength", strike: false },
  { t: "smile more", strike: true },
  { t: "your timeline is yours", strike: false },
  { t: "leave it to the wife", strike: true },
  { t: "share the load", strike: false },
  { t: "settle down already", strike: true },
  { t: "ask, don't assume", strike: false },
  { t: "real men don't quit", strike: true },
  { t: "speak up anyway", strike: false },
  { t: "act your age", strike: true },
  { t: "age isn't a flaw", strike: false },
];

export function scatterForPath(path: string, audience: Audience = "kid"): Scrap[] {
  const pool = audience === "adult" ? SCATTER_ADULT : SCATTER_KID;
  const start = (routeIndex(path) * 5) % pool.length;
  return Array.from({ length: 4 }, (_, i) => pool[(start + i) % pool.length]);
}
