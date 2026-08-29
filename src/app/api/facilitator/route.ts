import { type NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { sanityWriteEnabled, writeClient } from "@/sanity/writeClient";
import { FACILITATOR_SLOTS, isSlotBookable, slotById } from "@/lib/facilitatorSlots";
import { validateFacilitator } from "@/lib/facilitatorValidation";
import { sendEmail } from "@/lib/email";
import { applicantConfirmationEmail, teamNotificationEmail } from "@/lib/facilitatorEmails";

export const dynamic = "force-dynamic";

const NOTIFY_EMAIL = process.env.FACILITATOR_NOTIFY_EMAIL || "rashi.khandelwal@theequallens.com";

// Non-CDN read so the per-email dedup check is as fresh as possible (public
// dataset reads need no token).
const fresh = client.withConfig({ useCdn: false });

// Slots are uncapped, so this just lists the selectable weekend days.
export async function GET() {
  return NextResponse.json({ slots: FACILITATOR_SLOTS.map((s) => ({ id: s.id })) });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  // Honeypot: a hidden field no human fills. Silently accept without storing
  // or emailing, so naive bots don't create a record or trigger mail.
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

  // Enforce the lead-time cutoff (defence in depth; the form also greys these out).
  if (!isSlotBookable(input.slotId, new Date())) {
    return NextResponse.json({ ok: false, error: "closed" }, { status: 409 });
  }

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
