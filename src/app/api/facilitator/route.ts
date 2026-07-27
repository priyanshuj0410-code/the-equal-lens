import { type NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { sanityEnabled } from "@/sanity/env";
import { sanityWriteEnabled, writeClient } from "@/sanity/writeClient";
import {
  FACILITATOR_SLOTS,
  FACILITATOR_SLOT_CAPACITY,
  slotById,
} from "@/lib/facilitatorSlots";
import { validateFacilitator } from "@/lib/facilitatorValidation";
import { sendEmail } from "@/lib/email";
import { applicantConfirmationEmail, teamNotificationEmail } from "@/lib/facilitatorEmails";

export const dynamic = "force-dynamic";

const NOTIFY_EMAIL = process.env.FACILITATOR_NOTIFY_EMAIL || "rashi.khandelwal@theequallens.com";

// Non-CDN read so capacity counts are as fresh as possible (public dataset
// reads need no token). A rare race can let a slot reach 4 concurrent submits
// and over-book by one - acceptable for a 4-person volunteer slot.
const fresh = client.withConfig({ useCdn: false });

const allOpen = () =>
  FACILITATOR_SLOTS.map((s) => ({ id: s.id, remaining: FACILITATOR_SLOT_CAPACITY, full: false }));

async function slotCounts(): Promise<Record<string, number>> {
  const ids = await fresh.fetch<string[]>(
    '*[_type == "facilitatorApplication"].slotId',
    {},
    { cache: "no-store" },
  );
  const counts: Record<string, number> = {};
  for (const id of ids || []) counts[id] = (counts[id] || 0) + 1;
  return counts;
}

export async function GET() {
  if (!sanityEnabled) return NextResponse.json({ slots: allOpen() });
  try {
    const counts = await slotCounts();
    const slots = FACILITATOR_SLOTS.map((s) => {
      const remaining = Math.max(0, FACILITATOR_SLOT_CAPACITY - (counts[s.id] || 0));
      return { id: s.id, remaining, full: remaining === 0 };
    });
    return NextResponse.json({ slots });
  } catch {
    // Never block the form on a read error - POST re-checks capacity anyway.
    return NextResponse.json({ slots: allOpen() });
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  // Honeypot: a hidden field no human fills. Silently accept without storing
  // or emailing, so naive bots don't consume a slot or trigger mail.
  if (String(body.company ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const str = (k: string) => String(body[k] ?? "").trim();
  const input = {
    name: str("name").slice(0, 120),
    age: str("age"),
    sexAssignedAtBirth: str("sexAssignedAtBirth"),
    email: str("email").toLowerCase().slice(0, 160),
    phone: str("phone").slice(0, 40),
    linkedin: str("linkedin").slice(0, 300),
    why: str("why").slice(0, 2000),
    slotId: str("slotId"),
  };

  const errs = validateFacilitator(input);
  if (Object.keys(errs).length) {
    return NextResponse.json({ ok: false, error: "invalid", fields: errs }, { status: 400 });
  }

  const slot = slotById(input.slotId)!;
  const age = Number.parseInt(input.age, 10);

  if (!sanityWriteEnabled) {
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 503 });
  }

  const linkedin = input.linkedin
    ? /^https?:\/\//i.test(input.linkedin)
      ? input.linkedin
      : `https://${input.linkedin}`
    : undefined;

  try {
    const existing = await fresh.fetch<number>(
      'count(*[_type == "facilitatorApplication" && lower(email) == $email])',
      { email: input.email },
      { cache: "no-store" },
    );
    if ((existing || 0) > 0) {
      return NextResponse.json({ ok: false, error: "duplicate" }, { status: 409 });
    }

    const taken = await fresh.fetch<number>(
      'count(*[_type == "facilitatorApplication" && slotId == $slotId])',
      { slotId: input.slotId },
      { cache: "no-store" },
    );
    if ((taken || 0) >= FACILITATOR_SLOT_CAPACITY) {
      return NextResponse.json({ ok: false, error: "full" }, { status: 409 });
    }

    await writeClient.create({
      _type: "facilitatorApplication",
      name: input.name,
      age,
      sexAssignedAtBirth: input.sexAssignedAtBirth,
      email: input.email,
      phone: input.phone,
      ...(linkedin ? { linkedin } : {}),
      why: input.why,
      slotId: input.slotId,
      slotLabel: slot.label,
      createdAt: new Date().toISOString(),
    });

    // Best-effort - a mail failure must not fail the registration.
    const applicant = applicantConfirmationEmail({ name: input.name, slotLabel: slot.label });
    const team = teamNotificationEmail({
      name: input.name,
      age,
      sexAssignedAtBirth: input.sexAssignedAtBirth,
      email: input.email,
      phone: input.phone,
      linkedin,
      why: input.why,
      slotLabel: slot.label,
    });
    await Promise.allSettled([
      sendEmail({ to: input.email, subject: applicant.subject, html: applicant.html, replyTo: NOTIFY_EMAIL }),
      sendEmail({ to: NOTIFY_EMAIL, subject: team.subject, html: team.html, replyTo: input.email }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
