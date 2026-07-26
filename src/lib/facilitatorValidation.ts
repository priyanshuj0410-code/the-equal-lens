import { SEX_OPTIONS, slotById } from "./facilitatorSlots";

// Shared by the registration form (client) and the /api/facilitator route
// (server) so both enforce the same rules — the server is the authority.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const LINKEDIN_RE = /^(https?:\/\/)?([\w-]+\.)?linkedin\.com\/.+$/i;

export function phoneDigits(v: string): string {
  return String(v || "").replace(/\D/g, "");
}

export type FacilitatorInput = {
  name?: string;
  age?: string | number;
  sexAssignedAtBirth?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  why?: string;
  slotId?: string;
};

// Returns a map of field → message. Empty map means valid. Keys match the form
// field names, with "slot" for the calendar picker.
export function validateFacilitator(v: FacilitatorInput): Record<string, string> {
  const e: Record<string, string> = {};
  const name = String(v.name || "").trim();
  const email = String(v.email || "").trim();
  const phone = String(v.phone || "").trim();
  const linkedin = String(v.linkedin || "").trim();
  const why = String(v.why || "").trim();
  const sex = String(v.sexAssignedAtBirth || "").trim();
  const slotId = String(v.slotId || "").trim();
  const age = Number.parseInt(String(v.age ?? ""), 10);

  if (!name) e.name = "Please enter your name.";
  if (!Number.isFinite(age) || age < 16 || age > 100) e.age = "Enter an age between 16 and 100.";
  if (!(SEX_OPTIONS as readonly string[]).includes(sex)) e.sexAssignedAtBirth = "Please select an option.";
  if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address.";
  const pd = phoneDigits(phone);
  if (pd.length < 10 || pd.length > 15) e.phone = "Enter a valid phone number.";
  if (linkedin && !LINKEDIN_RE.test(linkedin)) e.linkedin = "Enter a valid LinkedIn URL (linkedin.com/in/…).";
  if (!why) e.why = "Please tell us why you'd like to volunteer.";
  if (!slotId || !slotById(slotId)) e.slot = "Please pick a preferred day on the calendar.";
  return e;
}
