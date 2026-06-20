import type { Myth } from "./knowledge";

// Which myths appear on which page — keeps every page's facts & myths distinct.
export const ROUTE_MYTHS: Record<string, string[]> = {
  "/": ["m-pink-is-for-girls", "m-leaders-can-be-anyone"],
  "/about": ["m-boys-dont-cry", "m-scared-is-weak"],
  "/programs": ["m-girls-bad-at-maths", "m-some-kids-cant-learn"],
  "/blog": ["m-heroes-are-boys", "m-girls-care-about-looks"],
  "/join": ["m-nursing-is-for-women", "m-girls-cant-be-engineers"],
  "/contact": ["m-body-belongs-to-you", "m-asking-before-hug"],
  "/games": ["m-toys-have-no-gender", "m-everyone-can-play"],
};

export function mythsForPath(all: Myth[], path: string): Myth[] {
  const key =
    Object.keys(ROUTE_MYTHS).find(
      (k) => path === k || (k !== "/" && path.startsWith(k)),
    ) ?? "/";
  const ids = ROUTE_MYTHS[key];
  const chosen = all.filter((m) => ids.includes(m.id));
  return chosen.length ? chosen : all.slice(0, 2);
}
