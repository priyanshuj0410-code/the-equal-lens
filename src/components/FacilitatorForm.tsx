"use client";

import { useEffect, useState } from "react";
import {
  FACILITATOR_MONTHS,
  FACILITATOR_SLOTS,
  SEX_OPTIONS,
  slotById,
} from "@/lib/facilitatorSlots";

const field =
  "w-full rounded-lg border border-mist bg-surface px-3 py-2 text-ink focus:border-violet-400 focus:outline-none";
const label = "mb-1 block text-sm font-medium text-ink/80";
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const SLOT_IDS = new Set(FACILITATOR_SLOTS.map((s) => s.id));

type Avail = { id: string; remaining: number; full: boolean };
type Status = "idle" | "sending" | "done" | "error" | "full";

async function fetchAvail(): Promise<Record<string, Avail>> {
  try {
    const res = await fetch("/api/facilitator", { cache: "no-store" });
    const data = await res.json();
    const map: Record<string, Avail> = {};
    for (const s of data.slots || []) map[s.id] = s;
    return map;
  } catch {
    return {};
  }
}

export default function FacilitatorForm() {
  const [avail, setAvail] = useState<Record<string, Avail> | null>(null);
  const [slotId, setSlotId] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let active = true;
    fetchAvail().then((map) => {
      if (active) setAvail(map);
    });
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!slotId) {
      setErrMsg("Please pick a preferred day on the calendar.");
      setStatus("error");
      return;
    }
    const f = new FormData(e.currentTarget);
    const payload = {
      name: f.get("name"),
      age: f.get("age"),
      sexAssignedAtBirth: f.get("sexAssignedAtBirth"),
      email: f.get("email"),
      phone: f.get("phone"),
      linkedin: f.get("linkedin"),
      why: f.get("why"),
      slotId,
    };
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/facilitator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("done");
        return;
      }
      if (data.error === "full") {
        setSlotId("");
        fetchAvail().then(setAvail);
        setStatus("full");
        return;
      }
      if (data.error === "disabled") {
        setErrMsg("Registrations aren't open just yet — please try again shortly.");
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
      <div className="rounded-2xl border-2 border-dashed border-brandsoft/40 bg-surface p-6 text-center">
        <p className="font-hand text-xl font-bold text-brand">Thank you! 🎉</p>
        <p className="mx-auto mt-2 max-w-md text-ink/70">
          We&rsquo;ve got your details. The next step is a conversation with our founders —
          we&rsquo;ll be in touch about your chosen day.
        </p>
      </div>
    );
  }

  const selected = slotById(slotId);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Full name *</label>
          <input name="name" required className={field} />
        </div>
        <div>
          <label className={label}>Age *</label>
          <input name="age" type="number" min={16} max={100} required className={field} />
        </div>
        <div>
          <label className={label}>Sex assigned at birth *</label>
          <select name="sexAssignedAtBirth" required defaultValue="" className={field}>
            <option value="" disabled>
              Select…
            </option>
            {SEX_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Email *</label>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </div>
        <div>
          <label className={label}>Phone *</label>
          <input name="phone" type="tel" required autoComplete="tel" className={field} />
        </div>
        <div>
          <label className={label}>LinkedIn</label>
          <input name="linkedin" placeholder="linkedin.com/in/…" className={field} />
        </div>
      </div>

      <div>
        <label className={label}>Why do you want to volunteer? *</label>
        <textarea name="why" required rows={4} className={field} />
      </div>

      <div>
        <p className={label}>Pick your preferred day *</p>
        <p className="mb-3 text-xs text-ink/50">
          Weekend mornings in Mumbai, 22 Aug – 11 Oct 2026. Each day takes up to four facilitators.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {FACILITATOR_MONTHS.map((m) => (
            <div key={m.key} className="rounded-2xl border border-mist bg-surface p-3">
              <p className="mb-2 text-center font-hand text-sm font-bold text-ink">{m.label}</p>
              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((d, i) => (
                  <span key={i} className="pb-1 text-[10px] font-bold text-ink/40">
                    {d}
                  </span>
                ))}
                {Array.from({ length: m.firstWeekday }).map((_, i) => (
                  <span key={`blank-${i}`} />
                ))}
                {Array.from({ length: m.days }).map((_, i) => {
                  const day = i + 1;
                  const id = `${m.key}-${String(day).padStart(2, "0")}`;
                  if (!SLOT_IDS.has(id)) {
                    return (
                      <span key={id} className="py-1 text-xs text-ink/25">
                        {day}
                      </span>
                    );
                  }
                  const a = avail?.[id];
                  const loaded = Boolean(avail);
                  const full = a?.full ?? false;
                  const isSelected = slotId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={!loaded || full}
                      aria-pressed={isSelected}
                      onClick={() => setSlotId(id)}
                      className={[
                        "flex flex-col items-center justify-center rounded-lg py-1 text-xs font-bold transition",
                        isSelected
                          ? "bg-brand text-surface"
                          : full
                            ? "cursor-not-allowed bg-mist/40 text-ink/30"
                            : "bg-mist/60 text-ink hover:bg-brand/15",
                      ].join(" ")}
                    >
                      <span className={full && !isSelected ? "line-through" : ""}>{day}</span>
                      <span className="text-[9px] font-semibold leading-tight">
                        {!loaded ? "…" : full ? "Full" : `${a?.remaining} left`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {selected && (
          <p className="mt-3 text-sm text-ink/70">
            Selected: <strong>{selected.label}</strong> morning
          </p>
        )}
      </div>

      <button type="submit" disabled={status === "sending"} className="btn btn--primary">
        {status === "sending" ? "Submitting…" : "Submit registration"}
      </button>

      {status === "full" && (
        <p className="text-sm font-medium text-grow">
          That day just filled up — please choose another on the calendar.
        </p>
      )}
      {status === "error" && errMsg && (
        <p className="text-sm font-medium text-grow">{errMsg}</p>
      )}
    </form>
  );
}
