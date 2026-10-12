"use client";

import { useEffect, useRef, useState } from "react";
import BrandSelect from "./BrandSelect";
import {
  FACILITATOR_MONTHS,
  FACILITATOR_SLOTS,
  isSlotBookable,
  SEX_OPTIONS,
  slotById,
} from "@/lib/facilitatorSlots";
import { validateFacilitator } from "@/lib/facilitatorValidation";

const field =
  "w-full rounded-lg border bg-surface px-3 py-2 text-ink focus:border-violet-400 focus:outline-none";
const fieldOk = "border-mist";
const fieldErr = "border-error";
const label = "mb-1 block text-sm font-medium text-ink/80";
const errText = "mt-1 w-fit border-l-4 border-error pl-2 text-xs font-medium text-ink";
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const SLOT_IDS = new Set(FACILITATOR_SLOTS.map((s) => s.id));

type Status = "idle" | "sending" | "done" | "error";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M12.5 5 7.5 10 12.5 15" : "M7.5 5 12.5 10 7.5 15"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FacilitatorForm() {
  const [monthIdx, setMonthIdx] = useState(0);
  const [slotId, setSlotId] = useState("");
  const [sex, setSex] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // Resolve "today" on the client (avoids an SSR/hydration mismatch), then open
  // the picker on the first month that still has a bookable day.
  useEffect(() => {
    const d = new Date();
    const firstIdx = FACILITATOR_MONTHS.findIndex((m) =>
      FACILITATOR_SLOTS.some((s) => s.monthKey === m.key && isSlotBookable(s.id, d)),
    );
    const raf = requestAnimationFrame(() => {
      setNow(d);
      if (firstIdx > 0) setMonthIdx(firstIdx);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (status === "done") {
      doneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  function clearError(key: string) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) || "").trim();
    const input = {
      name: get("name"),
      age: get("age"),
      sexAssignedAtBirth: sex,
      email: get("email"),
      phone: get("phone"),
      linkedin: get("linkedin"),
      why: get("why"),
      slotId,
      company: get("company"),
    };
    const errs = validateFacilitator(input);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus("idle");
      return;
    }

    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/facilitator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("done");
        return;
      }
      if (data.error === "invalid" && data.fields) {
        setErrors(data.fields);
        setStatus("idle");
        return;
      }
      if (data.error === "duplicate") {
        setErrMsg("Looks like you've already registered with this email - we'll be in touch. To change anything, email support@theequallens.com.");
        setStatus("error");
        return;
      }
      if (data.error === "closed") {
        setSlotId("");
        setErrMsg("That day is closed for sign-ups now - we need at least a couple of days' notice. Please pick another day.");
        setStatus("error");
        return;
      }
      if (data.error === "disabled") {
        setErrMsg("Registrations aren't open just yet - please try again shortly.");
      } else {
        setErrMsg("Please check your details and try again.");
      }
      setStatus("error");
    } catch {
      setErrMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        ref={doneRef}
        className="rounded-2xl border-2 border-dashed border-brandsoft/40 bg-surface p-6 text-center"
      >
        <p className="font-hand text-xl font-bold text-brand">Thank you! 🎉</p>
        <p className="mx-auto mt-2 max-w-md text-ink/70">
          We&rsquo;ve got your details and sent a confirmation to your email. The next step is a
          conversation with our founders - we&rsquo;ll be in touch about your chosen day.
        </p>
      </div>
    );
  }

  const selected = slotById(slotId);
  const month = FACILITATOR_MONTHS[monthIdx];

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Full name *</label>
          <input name="name" onChange={() => clearError("name")} className={`${field} ${errors.name ? fieldErr : fieldOk}`} />
          {errors.name && <p className={errText}>{errors.name}</p>}
        </div>
        <div>
          <label className={label}>Age *</label>
          <input name="age" type="number" min={16} max={100} onChange={() => clearError("age")} className={`${field} ${errors.age ? fieldErr : fieldOk}`} />
          {errors.age && <p className={errText}>{errors.age}</p>}
        </div>
        <div>
          <label className={label}>Sex assigned at birth *</label>
          <BrandSelect
            options={SEX_OPTIONS}
            value={sex}
            invalid={Boolean(errors.sexAssignedAtBirth)}
            onChange={(v) => {
              setSex(v);
              clearError("sexAssignedAtBirth");
            }}
          />
          {errors.sexAssignedAtBirth && <p className={errText}>{errors.sexAssignedAtBirth}</p>}
        </div>
        <div>
          <label className={label}>Email *</label>
          <input name="email" type="email" autoComplete="email" onChange={() => clearError("email")} className={`${field} ${errors.email ? fieldErr : fieldOk}`} />
          {errors.email && <p className={errText}>{errors.email}</p>}
        </div>
        <div>
          <label className={label}>Phone *</label>
          <input name="phone" type="tel" autoComplete="tel" onChange={() => clearError("phone")} className={`${field} ${errors.phone ? fieldErr : fieldOk}`} />
          {errors.phone && <p className={errText}>{errors.phone}</p>}
        </div>
        <div>
          <label className={label}>LinkedIn</label>
          <input name="linkedin" placeholder="linkedin.com/in/…" onChange={() => clearError("linkedin")} className={`${field} ${errors.linkedin ? fieldErr : fieldOk}`} />
          {errors.linkedin && <p className={errText}>{errors.linkedin}</p>}
        </div>
      </div>

      <div>
        <label className={label}>Why do you want to volunteer? *</label>
        <textarea name="why" rows={4} onChange={() => clearError("why")} className={`${field} ${errors.why ? fieldErr : fieldOk}`} />
        {errors.why && <p className={errText}>{errors.why}</p>}
      </div>

      <div>
        <p className={label}>Pick your preferred day *</p>
        <p className="mb-3 text-xs text-ink/70">
          Weekend mornings in Mumbai, 22 Aug – 29 Nov 2026. Pick any morning you can help.
        </p>
        <div className="mx-auto max-w-sm rounded-2xl border border-mist bg-surface p-3">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
              disabled={monthIdx === 0}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-mist bg-surface text-ink transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Chevron dir="left" />
            </button>
            <p className="font-hand text-sm font-bold text-ink">{month.label}</p>
            <button
              type="button"
              onClick={() => setMonthIdx((i) => Math.min(FACILITATOR_MONTHS.length - 1, i + 1))}
              disabled={monthIdx === FACILITATOR_MONTHS.length - 1}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-mist bg-surface text-ink transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Chevron dir="right" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((d, i) => (
              <span key={i} className="pb-1 text-xs font-bold text-ink/70">
                {d}
              </span>
            ))}
            {Array.from({ length: month.firstWeekday }).map((_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: month.days }).map((_, i) => {
              const day = i + 1;
              const id = `${month.key}-${String(day).padStart(2, "0")}`;
              if (!SLOT_IDS.has(id)) {
                return (
                  <span key={id} className="py-2 text-xs text-ink/25">
                    {day}
                  </span>
                );
              }
              // A slot day is interactive only once "today" is resolved (client)
              // and the date is still open. Until then, or when closed, render a
              // non-clickable muted day (closed days get a strike-through) so a
              // closed day is never briefly shown as selectable.
              if (!now || !isSlotBookable(id, now)) {
                return (
                  <span
                    key={id}
                    aria-disabled="true"
                    className={`flex items-center justify-center rounded-lg py-2 text-xs font-bold text-ink/25${now ? " line-through" : ""}`}
                  >
                    {day}
                  </span>
                );
              }
              const isSelected = slotId === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSlotId(id);
                    clearError("slot");
                  }}
                  className={[
                    "flex items-center justify-center rounded-lg py-2 text-xs font-bold transition",
                    isSelected ? "bg-brand text-surface" : "bg-mist/60 text-ink hover:bg-brand/15",
                  ].join(" ")}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
        {selected && (
          <p className="mt-3 text-center text-sm text-ink/70">
            Selected: <strong>{selected.label}</strong> morning
          </p>
        )}
        {errors.slot && <p className={`${errText} mx-auto`}>{errors.slot}</p>}
      </div>

      <button type="submit" disabled={status === "sending"} className="btn btn--primary">
        {status === "sending" ? "Submitting…" : "Submit registration"}
      </button>

      {status === "error" && errMsg && <p className="border-l-4 border-error pl-2 text-sm font-medium text-ink">{errMsg}</p>}
    </form>
  );
}
