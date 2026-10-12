"use client";

const field =
  "w-full rounded-lg border border-mist bg-surface px-3 py-2 text-ink focus:border-violet-400 focus:outline-none";
const label = "mb-1 block text-sm font-medium text-ink/80";

// Coming-soon donation form. The full UI (amount + name/email) is present so the
// design is complete, but the action is disabled until Razorpay is wired up.
export default function DonateForm({
  labels,
  comingSoon,
  secureNote,
}: {
  labels: { amount: string; name: string; email: string };
  comingSoon: string;
  secureNote: string;
}) {
  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className={label}>{labels.amount}</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/70">₹</span>
          <input
            name="amount"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="Enter an amount"
            aria-label={labels.amount}
            className={`${field} pl-7`}
          />
        </div>
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

      <p className="text-center text-xs text-ink/70">
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
