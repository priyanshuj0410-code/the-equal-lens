"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A scratch-off card: the children (the reward) sit underneath a canvas cover
// the user erases by dragging - the same erase mechanic as the myth cards.
export default function ScratchCard({
  children,
  coverLabel = "Scratch to reveal",
  className = "",
  onRevealed,
}: {
  children: React.ReactNode;
  coverLabel?: string;
  className?: string;
  onRevealed?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [revealed, setRevealed] = useState(false);

  // Paint the cover once, sized to the card.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = wrap.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#553286"; // brand violet
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    for (let i = 0; i < 48; i++) {
      ctx.beginPath();
      ctx.arc((i * 61) % rect.width, (i * 103) % rect.height, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "700 16px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(coverLabel, rect.width / 2, rect.height / 2);
  }, [coverLabel]);

  const reveal = useCallback(() => {
    setRevealed(true);
    onRevealed?.();
  }, [onRevealed]);

  const eraseAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    // context keeps its dpr scale, so draw in CSS-pixel coordinates
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(clientX - rect.left, clientY - rect.top, 24, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const checkProgress = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 20) {
      total++;
      if (data[i] === 0) cleared++;
    }
    if (total && cleared / total > 0.5) reveal();
  }, [reveal]);

  return (
    <div className={className}>
      <div
        ref={wrapRef}
        className="relative select-none overflow-hidden rounded-2xl border-2 border-ink shadow-[4px_4px_0_var(--color-ink)]"
      >
        <div>{children}</div>
        {!revealed && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-pointer touch-none"
            onPointerDown={(e) => {
              drawing.current = true;
              e.currentTarget.setPointerCapture?.(e.pointerId);
              eraseAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (drawing.current) eraseAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              drawing.current = false;
              checkProgress();
            }}
            onPointerLeave={() => {
              if (drawing.current) {
                drawing.current = false;
                checkProgress();
              }
            }}
          />
        )}
      </div>
      {!revealed && (
        <button
          type="button"
          onClick={reveal}
          className="mt-2 block w-full text-center text-xs text-ink/50 underline"
        >
          Can&rsquo;t scratch? Tap to reveal
        </button>
      )}
    </div>
  );
}
