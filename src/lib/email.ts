import "server-only";

// Transactional email via the Resend REST API (no SDK dependency). Sending
// stays disabled until RESEND_API_KEY is set, so features that email never
// break before it is configured - they just skip the send.
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

export const emailEnabled = Boolean(RESEND_API_KEY);

// Must be a domain verified in Resend. Until theequallens.com is verified,
// Resend only delivers from onboarding@resend.dev to the account owner.
const FROM = process.env.EMAIL_FROM || "The Equal Lens <onboarding@resend.dev>";

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<boolean> {
  if (!emailEnabled) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
