import type { Myth } from "./knowledge";

// Which myths become the interactive sticky notes on each page — all distinct.
export const ROUTE_MYTHS: Record<string, string[]> = {
  "/": ["m-pink-is-for-girls", "m-leaders-can-be-anyone", "m-sports-no-gender"],
  "/about": ["m-boys-dont-cry", "m-scared-is-weak", "m-all-feelings-ok"],
  "/programs": ["m-girls-bad-at-maths", "m-some-kids-cant-learn", "m-mistakes-are-good"],
  "/blog": ["m-heroes-are-boys", "m-girls-care-about-looks", "m-looks-dont-equal-bad"],
  "/join": ["m-nursing-is-for-women", "m-girls-cant-be-engineers", "m-dads-can-care"],
  "/contact": ["m-body-belongs-to-you", "m-asking-before-hug", "m-teasing-not-joke"],
  "/games": ["m-toys-have-no-gender", "m-everyone-can-play", "m-games-for-everyone"],
};

const ROUTE_ORDER = ["/", "/about", "/programs", "/blog", "/join", "/contact", "/games"];

function routeIndex(path: string): number {
  const i = ROUTE_ORDER.findIndex(
    (k) => path === k || (k !== "/" && path.startsWith(k)),
  );
  return i < 0 ? 0 : i;
}

export function mythsForPath(all: Myth[], path: string): Myth[] {
  const key = ROUTE_ORDER[routeIndex(path)];
  const ids = ROUTE_MYTHS[key];
  const chosen = ids
    .map((id) => all.find((m) => m.id === id))
    .filter((m): m is Myth => Boolean(m));
  return chosen.length ? chosen : all.slice(0, 3);
}

// Short ambient phrases scattered on the canvas — deliberately NOT the same as
// the sticky-note myths, so nothing is said twice on a page.
export type Scrap = { t: string; strike: boolean };

const SCATTER_POOL: Scrap[] = [
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

export function scatterForPath(path: string): Scrap[] {
  const start = (routeIndex(path) * 5) % SCATTER_POOL.length;
  return Array.from({ length: 4 }, (_, i) => SCATTER_POOL[(start + i) % SCATTER_POOL.length]);
}
