// Branded, table-based HTML emails for facilitator signups (email clients need
// inline CSS + tables). User-supplied values are HTML-escaped before interpolation.

function esc(v: string): string {
  return String(v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const shell = (inner: string) => `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
</head><body style="margin:0;padding:0;background:#FBF9FF;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF9FF;"><tr>
<td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border:2px solid #221436;border-radius:16px;overflow:hidden;">
<tr><td align="center" style="background:#553286;padding:26px 32px;">
<div style="font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:.5px;">The Equal Lens</div>
<div style="font-size:12px;font-weight:bold;letter-spacing:1.5px;color:#FFC94D;margin-top:5px;">UNLEARN &middot; RELEARN &middot; GROW</div>
</td></tr>
${inner}
<tr><td align="center" style="background:#221436;padding:18px 32px;">
<div style="font-size:13px;color:#C5B6DE;">The Equal Lens &middot; <a href="mailto:support@theequallens.com" style="color:#FFC94D;text-decoration:none;">support@theequallens.com</a></div>
</td></tr>
</table></td></tr></table></body></html>`;

export function applicantConfirmationEmail(args: { name: string; slotLabel: string }): {
  subject: string;
  html: string;
} {
  const name = esc(args.name);
  const slot = esc(args.slotLabel);
  const inner = `
<tr><td style="padding:32px 32px 6px;"><div style="font-size:15px;line-height:1.65;color:#4b4160;">
Hi <strong>${name}</strong>,<br><br>
Thank you for registering to become a <strong>workshop facilitator</strong> for The Discovery Program in Mumbai - we&rsquo;re so glad you want to help.
</div></td></tr>
<tr><td style="padding:16px 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E7E0F1;border:2px dashed #553286;border-radius:14px;"><tr>
<td align="center" style="padding:20px;">
<div style="font-size:12px;font-weight:bold;letter-spacing:1px;color:#553286;text-transform:uppercase;">Your preferred day</div>
<div style="font-size:20px;font-weight:bold;color:#221436;margin-top:6px;">${slot} &middot; morning</div>
</td></tr></table></td></tr>
<tr><td style="padding:6px 32px 8px;"><div style="font-size:15px;line-height:1.7;color:#4b4160;">
<strong>What happens next</strong><br>
The next step is a short <strong>conversation with our founders</strong>. We&rsquo;ll be in touch to arrange it. Sessions run on weekend mornings and last about 1 hour 40 minutes, using a trauma-informed, safeguarding-first approach - we&rsquo;ll walk you through everything.
</div></td></tr>
<tr><td style="padding:16px 32px 30px;"><div style="font-size:15px;line-height:1.6;color:#4b4160;">
Warmly,<br><strong>The Equal Lens team</strong>
</div></td></tr>`;
  return {
    subject: "You're registered - The Equal Lens facilitator program",
    html: shell(inner),
  };
}

export function teamNotificationEmail(args: {
  name: string;
  age: number;
  sexAssignedAtBirth: string;
  email: string;
  phone: string;
  linkedin?: string;
  why: string;
  slotLabel: string;
}): { subject: string; html: string } {
  const row = (label: string, value: string) =>
    `<tr>
<td style="padding:8px 0;font-size:13px;color:#735997;width:150px;vertical-align:top;">${label}</td>
<td style="padding:8px 0;font-size:14px;color:#221436;">${value}</td></tr>`;
  const linkedin = args.linkedin
    ? `<a href="${esc(args.linkedin)}" style="color:#553286;">${esc(args.linkedin)}</a>`
    : "-";
  const inner = `
<tr><td style="padding:30px 32px 4px;"><div style="font-size:17px;font-weight:bold;color:#221436;">
New facilitator application</div>
<div style="font-size:14px;color:#735997;margin-top:2px;">${esc(args.slotLabel)} &middot; morning</div></td></tr>
<tr><td style="padding:12px 32px 30px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E7E0F1;">
${row("Name", esc(args.name))}
${row("Age", esc(String(args.age)))}
${row("Sex assigned at birth", esc(args.sexAssignedAtBirth))}
${row("Email", `<a href="mailto:${esc(args.email)}" style="color:#553286;">${esc(args.email)}</a>`)}
${row("Phone", esc(args.phone))}
${row("LinkedIn", linkedin)}
${row("Preferred day", `${esc(args.slotLabel)} morning`)}
${row("Why volunteer", esc(args.why).replace(/\n/g, "<br>"))}
</table></td></tr>`;
  return {
    subject: `New facilitator application - ${args.name} (${args.slotLabel})`,
    html: shell(inner),
  };
}
