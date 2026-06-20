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
  moved: boolean;
};

const NOTE_COLORS = ["#FFF3C2", "#D7F5EC", "#FAD9CE", "#E4DAF7"];
const PEN_COLORS = ["#FF7A5C", "#553286", "#2DD4BF", "#4FB0E8", "#221436"];
const ERASER_R = 16;
const NOTE_W = 224;
const NOTE_H = 170;
const MOBILE = 768;

export default function SiteCanvas({ seedMyths }: { seedMyths: Myth[] }) {
  const [tool, setTool] = useState<Tool>("none");
  const [color, setColor] = useState(PEN_COLORS[0]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [hideNotes, setHideNotes] = useState(false);
  const [fine, setFine] = useState(false);
  const [mobile, setMobile] = useState(false);

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
  const notesRef = useRef<Note[]>([]);
  const hideRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { notesRef.current = notes; }, [notes]);
  useEffect(() => { hideRef.current = hideNotes; }, [hideNotes]);

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
      moved: false,
    }),
    [],
  );

  // find empty spots so desktop notes don't cover content / scatter / footer
  const findSpots = useCallback((count: number): { x: number; y: number }[] => {
    const W = document.documentElement.clientWidth;
    const docH = Math.max(document.body.scrollHeight, window.innerHeight);
    const tags = ["h1", "h2", "h3", "p", "li", "a", "button", "img", "input", "textarea"];
    const sel =
      tags.flatMap((t) => [`main ${t}`, `footer ${t}`]).join(",") + ", .tel-scatter";
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
        (o) => x < o.r + pad && x + NOTE_W > o.l - pad && y < o.b + pad && y + NOTE_H > o.t - pad,
      );
    const chosen: { x: number; y: number }[] = [];
    for (let y = 130; y <= docH - NOTE_H - 12 && chosen.length < count; y += 56) {
      for (let x = 12; x <= W - NOTE_W - 12 && chosen.length < count; x += 64) {
        if (
          free(x, y) &&
          chosen.every((c) => Math.abs(c.y - y) > NOTE_H + 8 || Math.abs(c.x - x) > NOTE_W + 8)
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
  }, []);

  // seed page-specific notes whenever the route changes
  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
    const chosen = mythsForPath(seedMyths, pathname);
    pageMythsRef.current = chosen;
    seededMyth.current = chosen.length;
    const ctx = ctxRef.current;
    const c = canvasRef.current;
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const isM = window.innerWidth < MOBILE;
        const spots = isM ? [] : findSpots(chosen.length);
        setNotes(
          chosen.map((m, i) =>
            makeNote(m, i, isM ? 0 : spots[i].x, isM ? 0 : spots[i].y),
          ),
        );
      }),
    );
    return () => cancelAnimationFrame(raf);
  }, [pathname, seedMyths, makeNote, findSpots]);

  // size the drawing canvas to the whole document
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

  // track viewport width + re-place un-dragged desktop notes when it changes
  useEffect(() => {
    const apply = () => {
      const isM = window.innerWidth < MOBILE;
      setMobile(isM);
      if (isM) return;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setNotes((prev) => {
            const movable = prev.filter((n) => !n.moved);
            if (!movable.length) return prev;
            const spots = findSpots(movable.length);
            let si = 0;
            return prev.map((n) => (n.moved ? n : { ...n, x: spots[si].x, y: spots[si++].y }));
          });
        }),
      );
    };
    apply();
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(apply, 180);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, [findSpots]);

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
    if (hideRef.current) return false;
    return notesRef.current.some(
      (n) => px >= n.x && px <= n.x + NOTE_W && py >= n.y && py <= n.y + NOTE_H,
    );
  }

  function touchNotes(px: number, py: number) {
    const t = toolRef.current;
    if (t === "none" || hideRef.current) return;
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

  // mobile: tap a card with the active tool to erase / reveal
  function tapNote(id: string) {
    const t = toolRef.current;
    if (t === "none") return;
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        if (t === "eraser" && n.phase === "myth") return { ...n, erase: 1, phase: "erased" };
        if (t === "pen" && n.phase === "erased") return { ...n, reveal: 1, phase: "truth" };
        return n;
      }),
    );
  }

  function onPointerDown(e: React.PointerEvent) {
    if (toolRef.current === "none") return;
    e.preventDefault();
    drawing.current = true;
    const p = { x: e.pageX, y: e.pageY };
    last.current = p;
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
        n.id === d.id
          ? { ...n, x: d.ox + (e.pageX - d.sx), y: d.oy + (e.pageY - d.sy), moved: true }
          : n,
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
    const spot = mobile
      ? { x: 0, y: 0 }
      : findSpots(notes.length + 1)[notes.length] ?? {
          x: window.scrollX + 40,
          y: window.scrollY + 150,
        };
    setNotes((p) => [
      ...p,
      { ...makeNote(m, seededMyth.current + 100, spot.x, spot.y), moved: mobile ? false : true },
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

      {/* desktop: floating draggable notes */}
      {!mobile && (
        <div
          className="absolute left-0 top-0 z-20 w-full"
          style={{ display: hideNotes ? "none" : undefined }}
          aria-hidden="true"
        >
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
              <NoteContent n={n} />
            </div>
          ))}
        </div>
      )}

      {/* mobile: notes flow into a reserved gap above the footer */}
      {mobile && !hideNotes && notes.length > 0 && (
        <section className="relative z-40 mx-auto max-w-md px-5 py-12">
          <h2 className="text-center font-hand text-2xl font-extrabold text-ink">
            Bust these myths
          </h2>
          <p className="mt-1 text-center text-sm text-ink/60">
            Tap <strong className="text-violet-600">UN</strong> below, then a card to
            erase it — then <strong className="text-violet-600">RE</strong> to reveal
            the truth.
          </p>
          <div className="mt-6 space-y-4">
            {notes.map((n, i) => (
              <button
                key={n.id}
                onClick={() => tapNote(n.id)}
                style={{ background: n.color, transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}
                className="flex min-h-[140px] w-full flex-col rounded-xl border-2 border-ink p-4 text-left shadow-[3px_3px_0_#221436]"
              >
                <NoteContent n={n} />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* toolbar */}
      <div className="fixed bottom-4 left-1/2 z-50 flex max-w-[96vw] -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-full border-2 border-ink bg-white/95 px-3 py-2 shadow-[4px_4px_0_#221436] backdrop-blur">
        <ToolButton active={tool === "none"} onClick={() => setTool("none")} label="Browse">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#221436" aria-hidden="true">
            <path d="M5 2 L5 20 L10 15 L13.5 22 L16 21 L12.5 14 L19 14 Z" />
          </svg>
        </ToolButton>
        <ToolButton active={tool === "eraser"} onClick={() => setTool("eraser")} label="Unlearn">
          <Mascot type="un" className="h-7 w-auto" />
        </ToolButton>
        <ToolButton active={tool === "pen"} onClick={() => setTool("pen")} label="Relearn">
          <Mascot type="re" className="h-7 w-auto" />
        </ToolButton>

        {tool === "pen" && (
          <div className="flex shrink-0 items-center gap-1.5">
            {PEN_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Pen colour ${c}`}
                className={`h-5 w-5 shrink-0 rounded-full border-2 ${color === c ? "border-ink" : "border-white"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        )}

        <span className="mx-0.5 h-8 w-px shrink-0 bg-mist" />

        <button
          onClick={() => setHideNotes((v) => !v)}
          title={hideNotes ? "Show the sticky notes" : "Hide the sticky notes"}
          aria-label={hideNotes ? "Show sticky notes" : "Hide sticky notes"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white text-ink transition-transform hover:-translate-y-0.5"
        >
          {hideNotes ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3l18 18" />
              <path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.4 4M6.2 6.2A17.6 17.6 0 0 0 2 12s4 7 10 7a9.8 9.8 0 0 0 3.9-.8" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>

        <PillButton onClick={addMyth} title="Add a myth note" tone="sun" label="myth">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </PillButton>
        <PillButton onClick={reset} title="Reset doodles & myths" label="reset">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </PillButton>
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

function NoteContent({ n }: { n: Note }) {
  return (
    <>
      <div className="mb-2">
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
          <p className="mt-auto pt-2 font-hand text-xs text-ink/45">rub me out with UN →</p>
        </>
      ) : n.reveal === 0 && n.phase !== "truth" ? (
        <p className="font-hand text-base text-ink/40">reveal the truth with RE →</p>
      ) : (
        <div style={{ opacity: n.phase === "truth" ? 1 : n.reveal }}>
          <p className="font-hand text-lg font-bold leading-snug text-violet-700">{n.truth}</p>
          <div
            className="mt-1 h-1 rounded-full bg-grow"
            style={{ width: `${(n.phase === "truth" ? 1 : n.reveal) * 90}%` }}
          />
          {n.phase === "truth" && <p className="mt-2 text-xs text-ink/55">{n.explanation}</p>}
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
      className={`flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-full border-2 transition-transform hover:-translate-y-0.5 sm:w-auto sm:justify-start sm:px-2.5 ${
        active ? "border-ink bg-sun" : "border-transparent hover:border-mist"
      }`}
    >
      <span className="flex h-7 w-7 items-center justify-center">{children}</span>
      <span className="hidden font-hand text-sm font-bold text-ink sm:inline">{label}</span>
    </button>
  );
}

function PillButton({
  onClick,
  title,
  tone,
  label,
  children,
}: {
  onClick: () => void;
  title: string;
  tone?: "sun";
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-full border-2 border-ink font-hand text-xs font-bold text-ink transition-transform hover:-translate-y-0.5 sm:w-auto sm:px-3 ${
        tone === "sun" ? "bg-sun" : "bg-white hover:bg-mist"
      }`}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
