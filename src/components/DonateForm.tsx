"use client";

import { useState } from "react";

const field =
  "w-full rounded-lg border border-mist bg-surface px-3 py-2 text-ink focus:border-violet-400 focus:outline-none";
const label = "mb-1 block text-sm font-medium text-ink/80";

// Coming-soon donation form. The full UI (amount chips + custom + name/email) is
// present so the design is complete, but the action is disabled until the
// Razorpay checkout is wired up.
export default function DonateForm({
  presetAmounts,
  labels,
  comingSoon,
  secureNote,
}: {
  presetAmounts: number[];
  labels: { amount: string; custom: string; name: string; email: string };
  comingSoon: string;
  secureNote: string;
}) {
  const [amount, setAmount] = useState<number | "custom" | null>(presetAmounts[0] ?? "custom");

  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className={label}>{labels.amount}</label>
        <div className="flex flex-wrap gap-2">
          {presetAmounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
              aria-pressed={amount === a}
              className={`btn btn--sm ${amount === a ? "btn--primary" : "btn--outline"}`}
            >
              ₹{a.toLocaleString("en-IN")}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount("custom")}
            aria-pressed={amount === "custom"}
            className={`btn btn--sm ${amount === "custom" ? "btn--primary" : "btn--outline"}`}
          >
            Custom
          </button>
        </div>
        {amount === "custom" && (
          <input
            type="number"
            min={1}
            inputMode="numeric"
            placeholder={labels.custom}
            aria-label={labels.custom}
            className={`${field} mt-3`}
          />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className={label}>{labels.name}</label>
          <input name="name" className={field} />
        </div>
        <div>
          <label className={label}>{labels.email}</label>
          <input name="email" type="email" className={field} />
        </div>
      </div>

      <div className="rounded-xl border-2 border-dashed border-brandsoft/40 bg-mist/40 p-4">
        <p className="text-sm font-medium text-ink/80">{comingSoon}</p>
      </div>

      <button type="submit" disabled className="btn btn--solid w-full justify-center">
        Donations opening soon
      </button>

      <p className="text-center text-xs text-ink/50">
        Want to give now?{" "}
        <a
          href="mailto:support@theequallens.com?subject=I%20want%20to%20donate"
          className="text-brand underline"
        >
          Email us
        </a>{" "}
        · {secureNote}
      </p>
    </form>
  );
}
