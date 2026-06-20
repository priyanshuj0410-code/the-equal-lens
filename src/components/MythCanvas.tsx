"use client";

import { useEffect, useRef, useState } from "react";
import Mascot from "./Mascot";
import type { Myth } from "@/lib/knowledge";

type Tool = "un" | "re" | null;
type Phase = "myth" | "erased" | "truth";
type Item = Myth & { phase: Phase; erase: number; reveal: number; rot: number };

const ROT = [-4, 3, -2, 4, -3, 2];

export default function MythCanvas({ myths }: { myths: Myth[] }) {
  const [items, setItems] = useState<Item[]>(() =>
    myths.slice(0, 6).map((m, i) => ({
      ...m,
      phase: "myth" as Phase,
      erase: 0,
      reveal: 0,
      rot: ROT[i % ROT.length],
    })),
  );
  const [tool, setTool] = useState<Tool>(null);
  const [fine, setFine] = useState(false);
  const toolRef = useRef<Tool>(null);
  const downRef = useRef(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
    const onDown = () => (downRef.current = true);
    const onUp = () => (downRef.current = false);
    const onMove = (e: PointerEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  function bump(idx: number, amount: number) {
    const t = toolRef.current;
    if (!t) return;
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== idx) return it;
        if (t === "un" && it.phase === "myth") {
          const erase = Math.min(1, it.erase + amount);
          return { ...it, erase, phase: erase >= 1 ? "erased" : it.phase };
        }
        if (t === "re" && it.phase === "erased") {
          const reveal = Math.min(1, it.reveal + amount);
          return { ...it, reveal, phase: reveal >= 1 ? "truth" : it.phase };
        }
        return it;
      }),
    );
  }

  const unlearned = items.filter((it) => it.phase !== "myth").length;
  const relearned = items.filter((it) => it.phase === "truth").length;

  const hint =
    tool === "un"
      ? "Now rub over a myth to erase it"
      : tool === "re"
        ? "Scribble over an erased card to reveal the truth"
        : "Pick up UN to erase a myth — then RE to scribble the truth";

  return (
    <div className={tool ? "cursor-none" : ""}>
      {/* tool dock */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ToolButton
          label="Unlearn"
          sub="eraser"
          active={tool === "un"}
          onClick={() => setTool(tool === "un" ? null : "un")}
        >
          <Mascot type="un" className="h-12 w-auto" />
        </ToolButton>
        <ToolButton
          label="Relearn"
          sub="pencil"
          active={tool === "re"}
          onClick={() => setTool(tool === "re" ? null : "re")}
        >
          <Mascot type="re" className="h-12 w-auto" />
        </ToolButton>
        {tool && (
          <button
            onClick={() => setTool(null)}
            className="rounded-full border-2 border-ink bg-white px-4 py-2 font-hand text-sm font-bold text-ink hover:bg-mist"
          >
            put down
          </button>
        )}
      </div>

      <p className="mt-3 text-center font-hand text-lg text-violet-600">{hint}</p>

      {/* cards */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <div
            key={it.id}
            onPointerDown={() => bump(i, 0.34)}
            onPointerMove={() => downRef.current && bump(i, 0.08)}
            onClick={() => bump(i, 0.34)}
            style={{ transform: `rotate(${it.rot}deg)`, touchAction: "none" }}
            className={`sticker relative min-h-36 touch-none select-none rounded-2xl bg-white p-5 ${
              tool ? "" : "hover-pop"
            }`}
          >
            {it.phase === "myth" ? (
              <div
                style={{
                  opacity: 1 - it.erase * 0.85,
                  filter: `blur(${it.erase * 2.2}px)`,
                }}
              >
                <span className="inline-block rounded-full bg-grow/15 px-2.5 py-0.5 font-hand text-xs font-bold text-[#993C1D]">
                  myth
                </span>
                <p className="mt-3 font-hand text-xl font-bold text-violet-400">
                  {it.myth}
                </p>
              </div>
            ) : (
              <div>
                <span className="inline-block rounded-full bg-insight/20 px-2.5 py-0.5 font-hand text-xs font-bold text-[#0F6E56]">
                  {it.phase === "truth" ? "truth ✓" : "now relearn"}
                </span>
                {it.reveal === 0 && it.phase !== "truth" ? (
                  <p className="mt-3 font-hand text-lg text-violet-300">
                    erased! grab RE and scribble the truth
                  </p>
                ) : (
                  <div style={{ opacity: it.phase === "truth" ? 1 : it.reveal }}>
                    <p className="mt-3 font-hand text-xl font-bold text-violet-600">
                      {it.truth}
                    </p>
                    <div
                      className="mt-1 h-1 rounded-full bg-grow"
                      style={{
                        width: `${(it.phase === "truth" ? 1 : it.reveal) * 90}%`,
                      }}
                    />
                    {it.phase === "truth" && (
                      <p className="mt-2 text-sm text-ink/60">{it.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* progress */}
      <p className="mt-6 text-center font-hand text-sm text-ink/60">
        myths erased: {unlearned}/{items.length} · truths drawn: {relearned}/
        {items.length}
      </p>

      {/* custom mascot cursor */}
      {tool && fine && (
        <div
          ref={cursorRef}
          className="pointer-events-none fixed left-0 top-0 z-50"
          style={{ transform: "translate(-200px,-200px)" }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <Mascot type={tool} className="h-14 w-auto drop-shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

function ToolButton({
  label,
  sub,
  active,
  onClick,
  children,
}: {
  label: string;
  sub: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2 transition-transform hover:-translate-y-0.5 ${
        active
          ? "border-ink bg-sun shadow-[3px_3px_0_#221436]"
          : "border-ink bg-white shadow-[3px_3px_0_#C5B6DE]"
      }`}
    >
      {children}
      <span className="text-left font-hand leading-tight">
        <span className="block text-base font-bold text-ink">{label}</span>
        <span className="block text-xs text-ink/60">{sub}</span>
      </span>
    </button>
  );
}
