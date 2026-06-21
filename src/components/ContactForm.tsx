"use client";

import { useState } from "react";

const field =
  "w-full rounded-lg border border-mist bg-surface px-3 py-2 text-ink focus:border-violet-400 focus:outline-none";
const label = "mb-1 block text-sm font-medium text-ink/80";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "");
    const email = String(f.get("email") || "");
    const message = String(f.get("message") || "");
    const body = `From: ${name} (${email})\n\n${message}`;
    window.location.href = `mailto:support@theequallens.com?subject=${encodeURIComponent(
      `Message from ${name}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={label}>Name *</label>
        <input name="name" required className={field} />
      </div>
      <div>
        <label className={label}>Email *</label>
        <input name="email" type="email" required className={field} />
      </div>
      <div>
        <label className={label}>Message *</label>
        <textarea name="message" required rows={5} className={field} />
      </div>
      <button type="submit" className="btn btn--solid">
        Send message
      </button>
      {sent && (
        <p className="text-sm text-ink/60">
          Thanks! Your email app should have opened - hit send and we&rsquo;ll be
          in touch.
        </p>
      )}
    </form>
  );
}
