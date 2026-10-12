"use client";

import { useEffect, useRef, useState } from "react";
import ScratchCard from "./ScratchCard";

type Content = {
  gateLabel: string;
  gateButton: string;
  notFound: string;
  amount: number;
  voucherLabel: string;
  scratchLabel: string;
  revealedTitle: string;
  instructions: string;
};

export default function VoucherClient({ content }: { content: Content }) {
  const [status, setStatus] = useState<"idle" | "loading" | "valid" | "invalid" | "error">("idle");
  const [name, setName] = useState("");
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "valid") {
      revealRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "");
    setStatus("loading");
    try {
      const res = await fetch("/api/voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.valid) {
        setName(data.name || "");
        setStatus("valid");
      } else if (res.ok) {
        setStatus("invalid");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "valid") {
    return (
      <div ref={revealRef} className="text-center">
        <p className="font-hand text-lg font-bold text-brand">
          {name ? `Hi ${name}! 🎉` : "You're on the list! 🎉"}
        </p>
        <p className="mx-auto mt-1 max-w-sm text-ink/70">{content.revealedTitle}</p>

        <div className="mx-auto mt-6 max-w-sm">
          <ScratchCard coverLabel={content.scratchLabel}>
            <div className="flex min-h-[190px] flex-col items-center justify-center gap-1 bg-mist px-6 py-8 text-center">
              <p className="font-hand text-xs font-bold uppercase tracking-widest text-brandsoft">
                {content.voucherLabel}
              </p>
              <p className="font-hand text-6xl font-extrabold leading-none text-brand">
                ₹{content.amount}
              </p>
              <p className="mt-1 font-hand text-sm font-bold text-ink/70">voucher</p>
            </div>
          </ScratchCard>
        </div>

        <div className="mx-auto mt-6 max-w-sm rounded-xl border-2 border-dashed border-brandsoft/40 bg-surface p-4">
          <p className="text-sm font-medium text-ink/80">{content.instructions}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4 text-left">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink/80">{content.gateLabel}</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-mist bg-surface px-3 py-2 text-ink focus:border-violet-400 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn--primary w-full justify-center"
      >
        {status === "loading" ? "Checking…" : content.gateButton}
      </button>
      {status === "invalid" && <p className="border-l-4 border-error pl-2 text-sm font-medium text-ink">{content.notFound}</p>}
      {status === "error" && (
        <p className="border-l-4 border-error pl-2 text-sm font-medium text-ink">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
