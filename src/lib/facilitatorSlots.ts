// The Discovery Program runs on weekend mornings in Mumbai across the season,
// 22 Aug - 29 Nov 2026. Every weekend day (Sat and Sun) is a selectable slot;
// there is no per-slot cap. Shared by the registration form (client) and the
// /api/facilitator route (server); no server-only imports, so it is safe to
// import from either side.

export const SEX_OPTIONS = ["Female", "Male", "Intersex", "Prefer not to say"] as const;

export type FacilitatorSlot = {
  id: string; // ISO date, e.g. "2026-08-22" - the stable id stored on each application
  day: number;
  monthKey: string; // "2026-08"
  weekday: "Sat" | "Sun";
  week: number; // 1..15
  label: string; // "Sat 22 Aug"
};

export type FacilitatorMonth = {
  key: string; // "2026-08"
  label: string; // "August 2026"
  firstWeekday: number; // weekday of the 1st, Sun=0 … Sat=6
  days: number;
};

// Verified against the 2026 calendar.
export const FACILITATOR_MONTHS: FacilitatorMonth[] = [
  { key: "2026-08", label: "August 2026", firstWeekday: 6, days: 31 },
  { key: "2026-09", label: "September 2026", firstWeekday: 2, days: 30 },
  { key: "2026-10", label: "October 2026", firstWeekday: 4, days: 31 },
  { key: "2026-11", label: "November 2026", firstWeekday: 0, days: 30 },
];

const MONTH_SHORT: Record<string, string> = {
  "2026-08": "Aug",
  "2026-09": "Sep",
  "2026-10": "Oct",
  "2026-11": "Nov",
};

// [monthKey, day, weekday, week] - every Sat & Sun morning, 22 Aug - 29 Nov 2026.
const RAW: [string, number, "Sat" | "Sun", number][] = [
  ["2026-08", 22, "Sat", 1], ["2026-08", 23, "Sun", 1],
  ["2026-08", 29, "Sat", 2], ["2026-08", 30, "Sun", 2],
  ["2026-09", 5, "Sat", 3], ["2026-09", 6, "Sun", 3],
  ["2026-09", 12, "Sat", 4], ["2026-09", 13, "Sun", 4],
  ["2026-09", 19, "Sat", 5], ["2026-09", 20, "Sun", 5],
  ["2026-09", 26, "Sat", 6], ["2026-09", 27, "Sun", 6],
  ["2026-10", 3, "Sat", 7], ["2026-10", 4, "Sun", 7],
  ["2026-10", 10, "Sat", 8], ["2026-10", 11, "Sun", 8],
  ["2026-10", 17, "Sat", 9], ["2026-10", 18, "Sun", 9],
  ["2026-10", 24, "Sat", 10], ["2026-10", 25, "Sun", 10],
  ["2026-10", 31, "Sat", 11], ["2026-11", 1, "Sun", 11],
  ["2026-11", 7, "Sat", 12], ["2026-11", 8, "Sun", 12],
  ["2026-11", 14, "Sat", 13], ["2026-11", 15, "Sun", 13],
  ["2026-11", 21, "Sat", 14], ["2026-11", 22, "Sun", 14],
  ["2026-11", 28, "Sat", 15], ["2026-11", 29, "Sun", 15],
];

export const FACILITATOR_SLOTS: FacilitatorSlot[] = RAW.map(([monthKey, day, weekday, week]) => ({
  id: `${monthKey}-${String(day).padStart(2, "0")}`,
  day,
  monthKey,
  weekday,
  week,
  label: `${weekday} ${day} ${MONTH_SHORT[monthKey]}`,
}));

const BY_ID = new Map(FACILITATOR_SLOTS.map((s) => [s.id, s]));

export function slotById(id: string): FacilitatorSlot | undefined {
  return BY_ID.get(id);
}
