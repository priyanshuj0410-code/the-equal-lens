// The in-recording painter. Everything drawn here ends up in the reel, so it is styled to
// the Equal Lens design system exactly: the myth card is the site's .note (tone fill, 2.5px
// ink border, hard unblurred offset shadow, chip pill, slight tilt), text is Baloo 2, and
// the chip colours are the published myth and truth chips.

import type { MythRound } from "./round";
import type { ShakeRound } from "./shake";
import type { Emotion } from "./analyzer";
import { GROUND_Y, RUNNER_X, RUNNER_SIZE, type WalkRound, type Hurdle } from "./walk";
import { W, H } from "./frame";

export { W, H };

// next/font registers Baloo 2 under a hashed family name; the client resolves it from a
// probe element and hands it to us so canvas text really is the site's hand font.
let HAND = '"Baloo 2", system-ui, sans-serif';
export function setHandFont(family: string) {
  if (family) HAND = family;
}

// tokens.css, verbatim.
const INK = "#221436";
const NOTE_YELLOW = "#FFF3C2";
const NOTE_MINT = "#D7F5EC";
const NOTE_TEXT = "#2E1B4A";
const CHIP_MYTH = "#993C1D";
const CHIP_TRUTH = "#0F6E56";

export type PaintState = {
  game: "myth" | "shake" | "walk";
  mythRound: MythRound;
  shakeRound: ShakeRound;
  walkRound: WalkRound;
  emotion: Emotion;
  emotionAlpha: number;
  forehead: { x: number; y: number } | null;
  faceWidth: number;
  art: Map<string, HTMLImageElement>;
};

export function paint(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  s: PaintState,
  dt: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Mirrored cover-crop of the landscape camera into the portrait frame.
  const vw = video.videoWidth || 1280;
  const vh = video.videoHeight || 720;
  const scale = Math.max(W / vw, H / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  ctx.save();
  ctx.translate(W, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, (W - dw) / 2, (H - dh) / 2, dw, dh);
  ctx.restore();

  const round =
    s.game === "myth" ? s.mythRound : s.game === "shake" ? s.shakeRound : s.walkRound;
  const idle =
    s.game === "myth"
      ? s.mythRound.beat === "idle"
      : s.game === "shake"
        ? !s.shakeRound.playing
        : !s.walkRound.playing;
  // The capsule band starts below the on-card chrome row (close and counter live in the
  // top ~200 canvas px of the live view).
  if (round.headline) capsule(ctx, round.headline, W / 2, 265, 54);
  else if (idle) capsule(ctx, "press the round button to play!", W / 2, 265, 54);
  if (round.subline) capsule(ctx, round.subline, W / 2, 372, 42);

  if (s.game === "myth") paintMyth(ctx, s);
  else if (s.game === "shake") paintShake(ctx, s, dt);
  else paintWalk(ctx, s, dt);

  // Lensy reacts in the corner - except on the track, where the runner IS the Lensy and
  // a second one would read as a bug.
  if (s.game !== "walk") paintReaction(ctx, s, dt);
}

function paintMyth(ctx: CanvasRenderingContext2D, s: PaintState) {
  const round = s.mythRound;
  const show = round.beat === "mythShown" || round.beat === "truthShown";
  if (!show || !round.current) return;

  const truth = round.beat === "truthShown";
  const text = truth ? round.current.truth : round.current.myth;
  const fx = s.forehead ? (1 - s.forehead.x) * W : W / 2;
  const fy = s.forehead ? s.forehead.y * H : H * 0.3;
  noteCard(ctx, text, truth, fx, Math.min(Math.max(fy - 280, H * 0.25), H * 0.42));
}

function paintShake(ctx: CanvasRenderingContext2D, s: PaintState, dt: number) {
  const round = s.shakeRound;
  if (!round.playing) return;

  const headX = s.forehead ? (1 - s.forehead.x) * W : null;
  const headY = s.forehead ? s.forehead.y * H : H * 0.35;
  const face = s.faceWidth * W;
  const size = Math.min(Math.max(face * 0.9, 260), 560);
  const propX = headX ?? W / 2;
  const propY = headY - size * 0.72;

  round.step(headX, face, propX, propY, dt);

  if (round.fling) {
    const img = s.art.get(`prop${round.index}`);
    if (img?.complete) {
      ctx.save();
      ctx.translate(round.fling.x, round.fling.y);
      ctx.rotate((round.fling.rotation * Math.PI) / 180);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
    return;
  }

  const prop = round.currentProp;
  if (prop && headX !== null) {
    const img = s.art.get(`prop${round.index}`);
    if (img?.complete) {
      const wobble = Math.sin(performance.now() / 38) * 14 * round.detector.energy;
      ctx.save();
      ctx.translate(propX, propY);
      ctx.rotate((wobble * Math.PI) / 180);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }

  if (round.haloOn && headX !== null) {
    const halo = s.art.get("halo");
    if (halo?.complete) {
      const hw = size * 0.9;
      const hh = hw * (halo.naturalHeight / halo.naturalWidth);
      ctx.drawImage(halo, propX - hw / 2, headY - size * 0.95, hw, hh);
    }
  }
}

function paintWalk(ctx: CanvasRenderingContext2D, s: PaintState, dt: number) {
  const round = s.walkRound;
  if (!round.playing) return;

  round.step(s.forehead ? s.forehead.y : null, dt);

  // The track: a paper band with an ink top edge.
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillRect(0, GROUND_Y, W, 16);
  ctx.fillStyle = INK;
  ctx.fillRect(0, GROUND_Y, W, 5);

  for (const h of round.hurdles) hurdleCard(ctx, h);

  // The runner: Lensy riding the player's head bob, tipped forward mid-hop.
  const runner = s.art.get("runner");
  if (runner?.complete && runner.naturalWidth > 0) {
    const rw = RUNNER_SIZE;
    const rh = (runner.naturalHeight / runner.naturalWidth) * rw;
    ctx.save();
    ctx.translate(RUNNER_X, round.runnerBottom);
    if (round.airborne) ctx.rotate((-12 * Math.PI) / 180);
    ctx.drawImage(runner, -rw / 2, -rh, rw, rh);
    if (round.haloOn) {
      const halo = s.art.get("halo");
      if (halo?.complete && halo.naturalWidth > 0) {
        const hw = rw * 1.1;
        const hh = (halo.naturalHeight / halo.naturalWidth) * hw;
        ctx.drawImage(halo, -hw / 2, -rh - hh * 0.7, hw, hh);
      }
    }
    ctx.restore();
  }
}

/** A hurdle as a standing mini sticker card; smashed ones topple over and fade. */
function hurdleCard(ctx: CanvasRenderingContext2D, h: Hurdle) {
  const topple = h.toppleT / 0.8;
  ctx.save();
  if (topple > 0) {
    ctx.globalAlpha = Math.max(0, 1 - topple);
    ctx.translate(h.x + h.w, GROUND_Y);
    ctx.rotate((topple * 105 * Math.PI) / 180);
    ctx.translate(-(h.x + h.w), -GROUND_Y);
  }
  const y = GROUND_Y - h.h;
  ctx.fillStyle = INK;
  roundRect(ctx, h.x + 7, y + 7, h.w, h.h, 18);
  ctx.fill();
  ctx.fillStyle = h.stereotype ? "#FAD9CE" : NOTE_MINT;
  roundRect(ctx, h.x, y, h.w, h.h, 18);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  roundRect(ctx, h.x, y, h.w, h.h, 18);
  ctx.stroke();

  ctx.font = `600 ${h.stereotype ? 42 : 38}px ${HAND}`;
  ctx.fillStyle = h.stereotype ? CHIP_MYTH : NOTE_TEXT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = wrap(ctx, h.label, h.w - 36);
  const lh = h.stereotype ? 48 : 44;
  const cy = y + h.h / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => ctx.fillText(line, h.x + h.w / 2, cy + i * lh));
  ctx.restore();
}

function paintReaction(ctx: CanvasRenderingContext2D, s: PaintState, dt: number) {
  const target = s.emotion !== "neutral" && s.art.has(s.emotion) ? 1 : 0;
  s.emotionAlpha += (target - s.emotionAlpha) * Math.min(1, dt * 8);
  if (s.emotionAlpha <= 0.02 || s.emotion === "neutral") return;
  const img = s.art.get(s.emotion);
  if (!img?.complete || img.naturalWidth === 0) return;
  const h = H * 0.3;
  const w = (img.naturalWidth / img.naturalHeight) * h;
  ctx.globalAlpha = s.emotionAlpha;
  ctx.drawImage(img, W - w - 40, H - h - 90, w, h);
  ctx.globalAlpha = 1;
}

function capsule(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, size: number) {
  ctx.font = `600 ${size}px ${HAND}`;
  const w = ctx.measureText(text).width + 64;
  const h = size + 40;
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  roundRect(ctx, cx - w / 2, cy - h / 2, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cx, cy + 2);
}

/** The site's .note, drawn in canvas: tone fill, ink border, hard offset shadow, chip. */
function noteCard(
  ctx: CanvasRenderingContext2D,
  text: string,
  truth: boolean,
  cx: number,
  cy: number,
) {
  const w = W * 0.68;
  const pad = 40;
  ctx.font = `600 52px ${HAND}`;
  const lines = wrap(ctx, text, w - pad * 2);
  const h = 120 + lines.length * 62 + pad * 0.6;
  const x = Math.min(Math.max(cx - w / 2, 40), W - w - 40);

  ctx.save();
  ctx.translate(x + w / 2, cy + h / 2);
  ctx.rotate((-2 * Math.PI) / 180);
  ctx.translate(-(x + w / 2), -(cy + h / 2));

  // Hard unblurred offset shadow, then fill, then the ink border: the .sticker rule.
  ctx.fillStyle = INK;
  roundRect(ctx, x + 9, cy + 9, w, h, 24);
  ctx.fill();

  ctx.fillStyle = truth ? NOTE_MINT : NOTE_YELLOW;
  roundRect(ctx, x, cy, w, h, 24);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 7;
  roundRect(ctx, x, cy, w, h, 24);
  ctx.stroke();

  // The chip pill.
  ctx.font = `600 34px ${HAND}`;
  const chipText = truth ? "truth" : "myth";
  const chipW = ctx.measureText(chipText).width + 52;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, x + pad - 8, cy + 30, chipW, 58, 29);
  ctx.fill();
  ctx.fillStyle = truth ? CHIP_TRUTH : CHIP_MYTH;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(chipText, x + pad + 18, cy + 61);

  ctx.font = `600 52px ${HAND}`;
  ctx.fillStyle = NOTE_TEXT;
  ctx.textBaseline = "alphabetic";
  lines.forEach((line, i) => ctx.fillText(line, x + pad, cy + 158 + i * 62));
  ctx.restore();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const probe = line ? `${line} ${word}` : word;
    if (ctx.measureText(probe).width > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = probe;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
