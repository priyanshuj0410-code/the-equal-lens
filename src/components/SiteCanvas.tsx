"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Mascot from "./Mascot";
import type { Myth } from "@/lib/knowledge";
import { mythsForPath } from "@/lib/pageMyths";

type Tool = "none" | "pen" | "eraser";
type Phase = "myth" | "erased" | "truth";
type Note = {
  id: string;
  x: number;
  y: number;
  text: string;
  truth: string;
  explanation: string;
  color: string;
  erase: number;
  reveal: number;
  phase: Phase;
};

const NOTE_COLORS = ["#FFF3C2", "#D7F5EC", "#FAD9CE", "#E4DAF7"];
const PEN_COLORS = ["#FF7A5C", "#553286", "#2DD4BF", "#4FB0E8", "#221436"];
const ERASER_R = 16;
const NOTE_W = 224;
const NOTE_H = 170;

export default function SiteCanvas({ seedMyths }: { seedMyths: Myth[] }) {
  const [tool, setTool] = useState<Tool>("none");
  const [color, setColor] = useState(PEN_COLORS[0]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [fine, setFine] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const toolRef = useRef<Tool>("none");
  const colorRef = useRef(color);
  const cursorRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; ox: number; oy: number; sx: number; sy: number } | null>(null);
  const seededMyth = useRef(0);
  const pageMythsRef = useRef<Myth[]>([]);
  const pathname = usePathname();

  const notesRef = useRef<Note[]>([]);
  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { notesRef.current = notes; }, [notes]);

  const makeNote = useCallback(
    (m: Myth, i: number, x: number, y: number): Note => ({
      id: `${m.id}-${i}`,
      x,
      y,
      text: m.myth,
      truth: m.truth,
      explanation: m.explanation,
      color: NOTE_COLORS[i % NOTE_COLORS.length],
      erase: 0,
      reveal: 0,
      phase: "myth",
    }),
    [],
  );

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
    const chosen = mythsForPath(seedMyths, pathname);
    pageMythsRef.current = chosen;
    seededMyth.current = chosen.length;
    const c = canvasRef.current;
    const ctx = ctxRef.current;
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
    // place after layout settles so we can measure real content boxes
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const spots = findSpots(chosen.length);
        setNotes(chosen.map((m, i) => makeNote(m, i, spots[i].x, spots[i].y)));
      }),
    );
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, seedMyths, makeNote]);

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = document.documentElement.clientWidth;
    const h = Math.max(document.body.scrollHeight, window.innerHeight);
    const prev = ctxRef.current?.getImageData(0, 0, c.width, c.height) ?? null;
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
    if (prev) {
      try { ctx.putImageData(prev, 0, 0); } catch { /* shrank */ }
    }
  }, []);

  useEffect(() => {
    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(document.body);
    window.addEventListener("resize", resize);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTool("none");
    window.addEventListener("keydown", onKey);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [resize]);

  function stroke(a: { x: number; y: number } | null, b: { x: number; y: number }) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const eraser = toolRef.current === "eraser";
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    ctx.strokeStyle = eraser ? "rgba(0,0,0,1)" : colorRef.current;
    ctx.fillStyle = eraser ? "rgba(0,0,0,1)" : colorRef.current;
    ctx.lineWidth = eraser ? ERASER_R * 2 : 5;
    ctx.beginPath();
    ctx.arc(b.x, b.y, eraser ? ERASER_R : 2.5, 0, Math.PI * 2);
    ctx.fill();
    if (a) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  function noteAt(px: number, py: number) {
    return notesRef.current.some(
      (n) => px >= n.x && px <= n.x + NOTE_W && py >= n.y && py <= n.y + NOTE_H,
    );
  }

  // rub out the myth / scribble in the truth on whichever note the tip touches
  function touchNotes(px: number, py: number) {
    const t = toolRef.current;
    if (t === "none") return;
    setNotes((prev) =>
      prev.map((n) => {
        const within = px >= n.x && px <= n.x + NOTE_W && py >= n.y && py <= n.y + NOTE_H;
        if (!within) return n;
        if (t === "eraser" && n.phase === "myth") {
          const erase = Math.min(1, n.erase + 0.09);
          return { ...n, erase, phase: erase >= 1 ? "erased" : n.phase };
        }
        if (t === "pen" && n.phase === "erased") {
          const reveal = Math.min(1, n.reveal + 0.09);
          return { ...n, reveal, phase: reveal >= 1 ? "truth" : n.phase };
        }
        return n;
      }),
    );
  }

  // find empty spots for the seeded notes so they don't cover content/scatter
  function findSpots(count: number): { x: number; y: number }[] {
    const W = document.documentElement.clientWidth;
    const docH = Math.max(document.body.scrollHeight, window.innerHeight);
    const sel =
      "main h1, main h2, main h3, main p, main li, main a, main button, main img, main input, main textarea, .tel-scatter";
    const obs = Array.from(document.querySelectorAll(sel))
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          l: r.left + window.scrollX,
          t: r.top + window.scrollY,
          r: r.right + window.scrollX,
          b: r.bottom + window.scrollY,
        };
      })
      .filter((o) => o.r > o.l && o.b > o.t && o.b - o.t < 600);
    const pad = 16;
    const free = (x: number, y: number) =>
      x >= 10 &&
      x + NOTE_W <= W - 10 &&
      y >= 120 &&
      y + NOTE_H <= docH - 12 &&
      !obs.some(
        (o) =>
          x < o.r + pad &&
          x + NOTE_W > o.l - pad &&
          y < o.b + pad &&
          y + NOTE_H > o.t - pad,
      );
    const chosen: { x: number; y: number }[] = [];
    for (let y = 130; y <= docH - NOTE_H - 12 && chosen.length < count; y += 56) {
      for (let x = 12; x <= W - NOTE_W - 12 && chosen.length < count; x += 64) {
        if (
          free(x, y) &&
          chosen.every(
            (c) => Math.abs(c.y - y) > NOTE_H + 8 || Math.abs(c.x - x) > NOTE_W + 8,
          )
        ) {
          chosen.push({ x, y });
        }
      }
    }
    let fy = 150;
    while (chosen.length < count) {
      chosen.push({ x: Math.max(12, W - NOTE_W - 14), y: fy });
      fy += NOTE_H + 24;
    }
    return chosen;
  }

  function onPointerDown(e: React.PointerEvent) {
    if (toolRef.current === "none") return;
    e.preventDefault();
    drawing.current = true;
    const p = { x: e.pageX, y: e.pageY };
    last.current = p;
    // RE only reveals on notes (no scribbles left behind); eraser still works
    if (!(toolRef.current === "pen" && noteAt(p.x, p.y))) stroke(null, p);
    touchNotes(p.x, p.y);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
    if (!drawing.current || toolRef.current === "none") return;
    const p = { x: e.pageX, y: e.pageY };
    if (!(toolRef.current === "pen" && noteAt(p.x, p.y))) stroke(last.current, p);
    touchNotes(p.x, p.y);
    last.current = p;
  }
  function onPointerUp() {
    drawing.current = false;
    last.current = null;
  }

  function noteDown(e: React.PointerEvent, n: Note) {
    if (toolRef.current !== "none") return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { id: n.id, ox: n.x, oy: n.y, sx: e.pageX, sy: e.pageY };
  }
  function noteMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === d.id ? { ...n, x: d.ox + (e.pageX - d.sx), y: d.oy + (e.pageY - d.sy) } : n,
      ),
    );
  }
  function noteUp() {
    drag.current = null;
  }
  function addMyth() {
    const list = pageMythsRef.current.length ? pageMythsRef.current : seedMyths;
    const m = list[seededMyth.current % list.length];
    seededMyth.current += 1;
    setNotes((p) => [
      ...p,
      makeNote(
        m,
        seededMyth.current + 100,
        window.scrollX + window.innerWidth / 2 - 110,
        window.scrollY + 150,
      ),
    ]);
  }
  function reset() {
    const c = canvasRef.current;
    const ctx = ctxRef.current;
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
    setNotes((p) => p.map((n) => ({ ...n, erase: 0, reveal: 0, phase: "myth" })));
  }

  const active = tool !== "none";

  return (
    <>
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="absolute left-0 top-0 z-30"
        style={{
          pointerEvents: active ? "auto" : "none",
          cursor: active && fine ? "none" : "default",
          touchAction: active ? "none" : "auto",
        }}
        aria-hidden="true"
      />

      <div className="absolute left-0 top-0 z-20 w-full" aria-hidden="true">
        {notes.map((n) => (
          <div
            key={n.id}
            onPointerDown={(e) => noteDown(e, n)}
            onPointerMove={noteMove}
            onPointerUp={noteUp}
            style={{
              left: n.x,
              top: n.y,
              background: n.color,
              pointerEvents: active ? "none" : "auto",
              transform: "rotate(-2deg)",
            }}
            className="group absolute flex min-h-36 w-56 flex-col rounded-xl border-2 border-ink p-4 shadow-[3px_3px_0_#221436] [touch-action:none] hover:z-40"
          >
            <div className="mb-2 flex items-center justify-between">
              <span
                className={`rounded-full bg-white/70 px-2 py-0.5 font-hand text-[11px] font-bold ${
                  n.phase === "myth" ? "text-[#993C1D]" : "text-[#0F6E56]"
                }`}
              >
                {n.phase === "truth" ? "truth ✓" : n.phase === "erased" ? "now relearn" : "myth"}
              </span>
            </div>

            {n.phase === "myth" ? (
              <>
                <p
                  className="font-hand text-lg font-bold leading-snug text-ink"
                  style={{ opacity: 1 - n.erase * 0.9, filter: `blur(${n.erase * 2.5}px)` }}
                >
                  {n.text}
                </p>
                <p className="mt-auto pt-2 font-hand text-xs text-ink/45">
                  rub me out with UN →
                </p>
              </>
            ) : n.reveal === 0 && n.phase !== "truth" ? (
              <p className="font-hand text-base text-ink/40">
                erased! now scribble the truth with RE →
              </p>
            ) : (
              <div style={{ opacity: n.phase === "truth" ? 1 : n.reveal }}>
                <p className="font-hand text-lg font-bold leading-snug text-violet-700">
                  {n.truth}
                </p>
                <div
                  className="mt-1 h-1 rounded-full bg-grow"
                  style={{ width: `${(n.phase === "truth" ? 1 : n.reveal) * 90}%` }}
                />
                {n.phase === "truth" && (
                  <p className="mt-2 text-xs text-ink/55">{n.explanation}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full border-2 border-ink bg-white/95 px-2.5 py-2 shadow-[4px_4px_0_#221436] backdrop-blur">
        <ToolButton active={tool === "none"} onClick={() => setTool("none")} label="Browse">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#221436" aria-hidden="true">
            <path d="M5 2 L5 20 L10 15 L13.5 22 L16 21 L12.5 14 L19 14 Z" />
          </svg>
        </ToolButton>
        <span className="mx-0.5 h-7 w-px bg-mist" />
        <ToolButton active={tool === "eraser"} onClick={() => setTool("eraser")} label="Unlearn">
          <Mascot type="un" className="h-9 w-auto" />
        </ToolButton>
        <ToolButton active={tool === "pen"} onClick={() => setTool("pen")} label="Relearn">
          <Mascot type="re" className="h-9 w-auto" />
        </ToolButton>

        {tool === "pen" && (
          <div className="ml-1 flex items-center gap-1">
            {PEN_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Pen colour ${c}`}
                className={`h-5 w-5 rounded-full border-2 ${color === c ? "border-ink" : "border-white"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        )}

        <span className="mx-1 h-7 w-px bg-mist" />
        <button onClick={addMyth} className="rounded-full border-2 border-ink bg-sun px-3 py-1.5 font-hand text-xs font-bold text-ink hover:-translate-y-0.5" title="Add a myth note">
          + myth
        </button>
        <button onClick={reset} className="rounded-full border-2 border-ink bg-white px-3 py-1.5 font-hand text-xs font-bold text-ink hover:bg-mist" title="Reset doodles & myths">
          reset
        </button>
      </div>

      {active && fine && (
        <div ref={cursorRef} className="pointer-events-none fixed left-0 top-0 z-[60]" style={{ transform: "translate(-300px,-300px)" }}>
          {tool === "eraser" ? (
            <span
              className="absolute rounded-full border-2 border-dashed border-ink/60 bg-white/30"
              style={{ width: ERASER_R * 2, height: ERASER_R * 2, transform: "translate(-50%,-50%)" }}
            />
          ) : (
            <span
              className="absolute rounded-full"
              style={{ width: 8, height: 8, background: color, transform: "translate(-50%,-50%)" }}
            />
          )}
          <Mascot type={tool === "eraser" ? "un" : "re"} className="absolute h-12 w-auto drop-shadow-lg" />
        </div>
      )}
    </>
  );
}

function ToolButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 transition-transform hover:-translate-y-0.5 ${
        active ? "border-ink bg-sun" : "border-transparent hover:border-mist"
      }`}
    >
      {children}
      <span className="hidden font-hand text-sm font-bold text-ink sm:inline">{label}</span>
    </button>
  );
}
