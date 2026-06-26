import { type NextRequest, NextResponse } from "next/server";
import { sanityWriteEnabled, writeClient } from "@/sanity/writeClient";

const MAX_ANSWER = 2000;
const MAX_META = 300;

// Stores a visitor's Lensy popover answer. Deliberately data-minimised: only the
// audience, which question was shown, and the answer text — no name, email, IP,
// user-agent, or any identifier, and nothing is logged. Returns { stored: false }
// (not an error) when no write token is configured, so the popover UX never
// depends on this succeeding.
export async function POST(req: NextRequest) {
  let body: {
    audience?: string;
    question?: string;
    questionBody?: string;
    answer?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ stored: false, error: "bad request" }, { status: 400 });
  }

  const answer = (body.answer || "").trim().slice(0, MAX_ANSWER);
  if (!answer) {
    return NextResponse.json({ stored: false, error: "empty" }, { status: 400 });
  }

  if (!sanityWriteEnabled) {
    return NextResponse.json({ stored: false });
  }

  const audience = body.audience === "adult" ? "adult" : "kid";

  try {
    await writeClient.create({
      _type: "lensyResponse",
      audience,
      question: (body.question || "").slice(0, MAX_META),
      questionBody: (body.questionBody || "").slice(0, MAX_META),
      answer,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ stored: true });
  } catch (err) {
    return NextResponse.json(
      { stored: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
