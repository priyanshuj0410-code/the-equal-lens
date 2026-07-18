import { type NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { sanityEnabled } from "@/sanity/env";

// Checks a registered email against the published voucherRecipient list.
// Read-only, server-side (the recipient list is never exposed to the browser).
export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  if (!sanityEnabled) return NextResponse.json({ valid: false });

  try {
    const rec = await client.fetch<{ name?: string } | null>(
      '*[_type == "voucherRecipient" && lower(email) == $email][0]{ name }',
      { email },
      { cache: "no-store" },
    );
    if (rec) return NextResponse.json({ valid: true, name: rec.name || "" });
    return NextResponse.json({ valid: false });
  } catch (err) {
    return NextResponse.json({ valid: false, error: (err as Error).message }, { status: 500 });
  }
}
