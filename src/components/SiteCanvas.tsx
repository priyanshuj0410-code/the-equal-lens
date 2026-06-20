"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Mascot from "./Mascot";
import type { Myth } from "@/lib/knowledge";

type Tool = "none" | "pen" | "eraser";
type Note = { id: string; x: number; y: number; text: string; color: string };

const NOTE_COLORS = ["#FFF3C2", "#D7F5EC", "#FAD9CE", "#E4DAF7"];
const PEN_COLORS = ["#FF7A5C", "#553286", "#2DD4BF", "#4FB0E8", "#221436"];
const ERASER_R = 16;

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

  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => { colorRef.current = color; }, [color]);

  // seed a couple of myth notes once
  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
    const wide = window.innerWidth > 760;
    setNotes(
      seedMyths.slice(0, 3).map((m, i) => ({
        id: m.id,
        x: wide ? (i === 1 ? window.innerWidth - 290 : 50) : 24,
        y: wide ? 210 + i * 150 : 540 + i * 140,
        text: m.myth,
        color: NOTE_COLORS[i % NOTE_COLORS.length],
      })),
    );
    seededMyth.current = Math.min(3, seedMyths.length);
  }, [seedMyths]);

  // size the canvas to the whole document, preserve drawing on resize
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
      try { ctx.putImageData(prev, 0, 0); } catch { /* size shrank */ }
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

  function applyStyle() {
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (toolRef.current === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = ERASER_R * 2;
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 5;
      ctx.strokeStyle = colorRef.current;
    }
  }
  function dab(x: number, y: number) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    applyStyle();
    ctx.beginPath();
    ctx.arc(x, y, toolRef.current === "eraser" ? ERASER_R : 2.5, 0, Math.PI * 2);
    if (toolRef.current === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = colorRef.current;
    }
    ctx.fill();
  }
  function seg(a: { x: number; y: number }, b: { x: number; y: number }) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    applyStyle();
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function onPointerDown(e: React.PointerEvent) {
    if (toolRef.current === "none") return;
    e.preventDefault();
    drawing.current = true;
    const p = { x: e.pageX, y: e.pageY };
    last.current = p;
    dab(p.x, p.y);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
    if (!drawing.current || toolRef.current === "none") return;
    const p = { x: e.pageX, y: e.pageY };
    if (last.current) seg(last.current, p);
    last.current = p;
  }
  function onPointerUp() {
    drawing.current = false;
    last.current = null;
  }

  // ---- notes ----
  function noteDown(e: React.PointerEvent, n: Note) {
    if (toolRef.current !== "none") return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { id: n.id, ox: n.x, oy: n.y, sx: e.pageX, sy: e.pageY };
  }
  function noteMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const nx = d.ox + (e.pageX - d.sx);
    const ny = d.oy + (e.pageY - d.sy);
    setNotes((prev) => prev.map((n) => (n.id === d.id ? { ...n, x: nx, y: ny } : n)));
  }
  function noteUp() {
    drag.current = null;
  }
  function addMyth() {
    const m = seedMyths[seededMyth.current % seedMyths.length];
    seededMyth.current += 1;
    const id = `${m.id}-${seededMyth.current}`;
    setNotes((p) => [
      ...p,
      {
        id,
        x: window.scrollX + window.innerWidth / 2 - 110,
        y: window.scrollY + 160,
        text: m.myth,
        color: NOTE_COLORS[p.length % NOTE_COLORS.length],
      },
    ]);
  }
  function removeNote(id: string) {
    setNotes((p) => p.filter((n) => n.id !== id));
  }
  function clearDrawing() {
    const c = canvasRef.current;
    const ctx = ctxRef.current;
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
  }

  const active = tool !== "none";

  return (
    <>
      {/* drawing surface (whole document) */}
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

      {/* sticky notes */}
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
            className="group absolute w-56 select-none rounded-xl border-2 border-ink p-4 shadow-[3px_3px_0_#221436] [touch-action:none] hover:z-40"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-white/70 px-2 py-0.5 font-hand text-[11px] font-bold text-[#993C1D]">
                myth
              </span>
              <button
                onClick={() => removeNote(n.id)}
                className="text-ink/40 hover:text-ink"
                aria-label="Remove note"
              >
                ✕
              </button>
            </div>
            <p className="font-hand text-lg font-bold leading-snug text-ink">
              {n.text}
            </p>
            <p className="mt-2 font-hand text-xs text-ink/45">
              erase me, then scribble the truth →
            </p>
          </div>
        ))}
      </div>

      {/* floating toolbar */}
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full border-2 border-ink bg-white/95 px-2.5 py-2 shadow-[4px_4px_0_#221436] backdrop-blur">
        <ToolButton active={tool === "eraser"} onClick={() => setTool(tool === "eraser" ? "none" : "eraser")} label="Unlearn">
          <Mascot type="un" className="h-9 w-auto" />
        </ToolButton>
        <ToolButton active={tool === "pen"} onClick={() => setTool(tool === "pen" ? "none" : "pen")} label="Relearn">
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
        <button onClick={clearDrawing} className="rounded-full border-2 border-ink bg-white px-3 py-1.5 font-hand text-xs font-bold text-ink hover:bg-mist" title="Clear doodles">
          clear
        </button>
      </div>

      {/* custom mascot cursor */}
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
