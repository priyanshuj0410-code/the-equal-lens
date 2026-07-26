import { type NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { sanityEnabled } from "@/sanity/env";
import { sanityWriteEnabled, writeClient } from "@/sanity/writeClient";
import {
  FACILITATOR_SLOTS,
  FACILITATOR_SLOT_CAPACITY,
  SEX_OPTIONS,
  slotById,
} from "@/lib/facilitatorSlots";

export const dynamic = "force-dynamic";

// Non-CDN read so capacity counts are as fresh as possible (public dataset
// reads need no token). A rare race can let a slot reach 4 concurrent submits
// and over-book by one — acceptable for a 4-person volunteer slot.
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
    // Never block the form on a read error — POST re-checks capacity anyway.
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

  const str = (k: string) => String(body[k] ?? "").trim();
  const name = str("name").slice(0, 120);
  const email = str("email").toLowerCase().slice(0, 160);
  const phone = str("phone").slice(0, 40);
  const linkedinRaw = str("linkedin").slice(0, 300);
  const why = str("why").slice(0, 2000);
  const sex = str("sexAssignedAtBirth");
  const slotId = str("slotId");
  const age = Number.parseInt(str("age"), 10);
  const slot = slotById(slotId);

  const invalid =
    !name ||
    !email.includes("@") ||
    phone.length < 7 ||
    !why ||
    !(SEX_OPTIONS as readonly string[]).includes(sex) ||
    !Number.isFinite(age) ||
    age < 16 ||
    age > 100 ||
    !slot;

  if (invalid) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  if (!sanityWriteEnabled) {
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 503 });
  }

  const linkedin = linkedinRaw
    ? /^https?:\/\//i.test(linkedinRaw)
      ? linkedinRaw
      : `https://${linkedinRaw}`
    : undefined;

  try {
    const taken = await fresh.fetch<number>(
      'count(*[_type == "facilitatorApplication" && slotId == $slotId])',
      { slotId },
      { cache: "no-store" },
    );
    if ((taken || 0) >= FACILITATOR_SLOT_CAPACITY) {
      return NextResponse.json({ ok: false, error: "full" }, { status: 409 });
    }
    await writeClient.create({
      _type: "facilitatorApplication",
      name,
      age,
      sexAssignedAtBirth: sex,
      email,
      phone,
      ...(linkedin ? { linkedin } : {}),
      why,
      slotId,
      slotLabel: slot!.label,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
