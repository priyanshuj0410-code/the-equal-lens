// The Discovery Program runs on Saturday mornings in Mumbai for 8 weeks,
// starting Sat 22 Aug 2026. Each Saturday is its own slot, capped at 2
// facilitators - 8 slots total. Shared by the registration form (client) and
// the /api/facilitator route (server); no server-only imports, so it is safe
// to import from either side.

export const FACILITATOR_SLOT_CAPACITY = 2;

export const SEX_OPTIONS = ["Female", "Male", "Intersex", "Prefer not to say"] as const;

export type FacilitatorSlot = {
  id: string; // ISO date, e.g. "2026-08-22" - the stable id stored on each application
  day: number;
  monthKey: string; // "2026-08"
  weekday: "Sat";
  week: number; // 1–8
  label: string; // "Sat 22 Aug"
};

export type FacilitatorMonth = {
  key: string; // "2026-08"
  label: string; // "August 2026"
  firstWeekday: number; // weekday of the 1st, Sun=0 … Sat=6
  days: number;
};

// Verified against the 2026 calendar: Aug 1 = Sat, Sep 1 = Tue, Oct 1 = Thu.
export const FACILITATOR_MONTHS: FacilitatorMonth[] = [
  { key: "2026-08", label: "August 2026", firstWeekday: 6, days: 31 },
  { key: "2026-09", label: "September 2026", firstWeekday: 2, days: 30 },
  { key: "2026-10", label: "October 2026", firstWeekday: 4, days: 31 },
];

const MONTH_SHORT: Record<string, string> = {
  "2026-08": "Aug",
  "2026-09": "Sep",
  "2026-10": "Oct",
};

// [monthKey, day, weekday, week] - Saturdays only (Sundays disabled).
const RAW: [string, number, "Sat", number][] = [
  ["2026-08", 22, "Sat", 1],
  ["2026-08", 29, "Sat", 2],
  ["2026-09", 5, "Sat", 3],
  ["2026-09", 12, "Sat", 4],
  ["2026-09", 19, "Sat", 5],
  ["2026-09", 26, "Sat", 6],
  ["2026-10", 3, "Sat", 7],
  ["2026-10", 10, "Sat", 8],
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
