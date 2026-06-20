"use client";

import { useState } from "react";

const field =
  "w-full rounded-lg border border-mist bg-surface px-3 py-2 text-ink focus:border-violet-400 focus:outline-none";
const label = "mb-1 block text-sm font-medium text-ink/80";

export default function VolunteerForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) || "");
    const name = get("name");
    const body = [
      `Name: ${name}`,
      `Email: ${get("email")}`,
      `Phone: ${get("phone")}`,
      `City: ${get("city")}`,
      "",
      `Why volunteer: ${get("why")}`,
      `Skills & experience: ${get("skills")}`,
      `Availability: ${get("availability")}`,
    ].join("\n");
    window.location.href = `mailto:support@theequallens.com?subject=${encodeURIComponent(
      `Volunteer application — ${name}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Full name *</label>
          <input name="name" required className={field} />
        </div>
        <div>
          <label className={label}>Email *</label>
          <input name="email" type="email" required className={field} />
        </div>
        <div>
          <label className={label}>Phone</label>
          <input name="phone" className={field} />
        </div>
        <div>
          <label className={label}>City</label>
          <input name="city" className={field} />
        </div>
      </div>
      <div>
        <label className={label}>Why do you want to volunteer? *</label>
        <textarea name="why" required rows={3} className={field} />
      </div>
      <div>
        <label className={label}>Skills &amp; experience</label>
        <textarea name="skills" rows={2} className={field} />
      </div>
      <div>
        <label className={label}>Availability</label>
        <input name="availability" className={field} />
      </div>
      <button
        type="submit"
        className="rounded-full bg-violet-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-violet-800"
      >
        Submit application
      </button>
      {sent && (
        <p className="text-sm text-ink/60">
          Thanks! Your email app should have opened — hit send and we&rsquo;ll be
          in touch.
        </p>
      )}
    </form>
  );
}
