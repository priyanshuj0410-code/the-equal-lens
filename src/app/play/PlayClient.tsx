"use client";

// Surface Quest in the browser. Everything happens on this device: the camera feed, the face
// tracking, the compositing and the recording never leave the laptop. The server only ever
// served this page.
//
// The pipeline mirrors the Android app's: camera -> FaceLandmarker blendshapes -> the ported
// ExpressionAnalyzer -> the ported MythRound -> a 1080x1920 composite canvas that is both the
// preview and, via captureStream plus the mic, the recording. Chrome and Edge record mp4;
// others fall back to webm or just play.

import { useCallback, useEffect, useRef, useState } from "react";
import type { Myth } from "@/lib/knowledge";
import { ExpressionAnalyzer, type Emotion } from "@/lib/play/analyzer";
import { MythRound } from "@/lib/play/round";

const W = 1080;
const H = 1920;

type Stage = "intro" | "starting" | "live" | "denied" | "unsupported";

const EMOTION_ART: Record<Exclude<Emotion, "neutral">, string> = {
  joy: "/play/emojis/Joy.png",
  sadness: "/play/emojis/Sadness.png",
  surprise: "/play/emojis/Surprise.png",
  fear: "/play/emojis/Fear.png",
  anger: "/play/emojis/Anger.png",
  disgust: "/play/emojis/Disgust.png",
};

export default function PlayClient({ myths }: { myths: Myth[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<Stage>("intro");
  const [recording, setRecording] = useState(false);
  const [clipUrl, setClipUrl] = useState<string | null>(null);
  const [clipExt, setClipExt] = useState("mp4");
  const [busted, setBusted] = useState(0);

  const state = useRef({
    analyzer: new ExpressionAnalyzer(),
    round: null as MythRound | null,
    landmarker: null as import("@mediapipe/tasks-vision").FaceLandmarker | null,
    stream: null as MediaStream | null,
    recorder: null as MediaRecorder | null,
    chunks: [] as Blob[],
    emotion: "neutral" as Emotion,
    emotionAlpha: 0,
    forehead: null as { x: number; y: number } | null,
    faceWidth: 0,
    art: new Map<string, HTMLImageElement>(),
    raf: 0,
    lastT: 0,
  });

  useEffect(() => {
    state.current.round = new MythRound(myths);
    for (const [k, src] of Object.entries(EMOTION_ART)) {
      const img = new Image();
      img.src = src;
      state.current.art.set(k, img);
    }
  }, [myths]);

  const start = useCallback(async () => {
    setStage("starting");
    const s = state.current;
    try {
      const [{ FaceLandmarker, FilesetResolver }, stream] = await Promise.all([
        import("@mediapipe/tasks-vision"),
        navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        }),
      ]);

      const fileset = await FilesetResolver.forVisionTasks("/play/wasm");
      s.landmarker = await FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: "/play/face_landmarker.task", delegate: "GPU" },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: true,
      });

      s.stream = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setStage("live");
      s.lastT = performance.now();
      loop();
    } catch (e) {
      console.error("[play]", e);
      setStage(e instanceof DOMException && e.name === "NotAllowedError" ? "denied" : "unsupported");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loop = useCallback(() => {
    const s = state.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !s.landmarker || !s.round) return;

    const now = performance.now();
    const dt = Math.min(0.1, (now - s.lastT) / 1000);
    s.lastT = now;

    if (video.readyState >= 2) {
      const result = s.landmarker.detectForVideo(video, now);
      const shapes = result.faceBlendshapes?.[0]?.categories;
      if (shapes?.length) {
        const map = new Map<string, number>();
        for (const c of shapes) map.set(c.categoryName, c.score);
        s.emotion = s.analyzer.step(map).best;

        const lm = result.faceLandmarks?.[0];
        if (lm) {
          // Landmark 10 is the forehead; 234 and 454 span the face.
          s.forehead = { x: lm[10].x, y: lm[10].y };
          s.faceWidth = Math.hypot(lm[454].x - lm[234].x, lm[454].y - lm[234].y);
        }
      } else {
        s.emotion = s.analyzer.noFace().best;
        s.forehead = null;
      }

      s.round.step(dt, s.emotion);
      setBusted(s.round.mythsBusted);
      draw(canvas, video, s, dt);
    }

    s.raf = requestAnimationFrame(loop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => {
    const s = state.current;
    cancelAnimationFrame(s.raf);
    s.recorder?.state === "recording" && s.recorder.stop();
    s.stream?.getTracks().forEach((t) => t.stop());
    s.landmarker?.close();
  }, []);

  const toggleRecord = useCallback(() => {
    const s = state.current;
    if (!s.round) return;

    if (s.recorder?.state === "recording") {
      s.recorder.stop();
      s.round.stop();
      setRecording(false);
      return;
    }

    const mp4 = MediaRecorder.isTypeSupported("video/mp4");
    const mime = mp4 ? "video/mp4" : "video/webm";
    setClipExt(mp4 ? "mp4" : "webm");

    const stream = canvasRef.current!.captureStream(30);
    const mic = s.stream?.getAudioTracks()[0];
    if (mic) stream.addTrack(mic.clone());

    s.chunks = [];
    s.recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 10_000_000 });
    s.recorder.ondataavailable = (e) => e.data.size && s.chunks.push(e.data);
    s.recorder.onstop = () => {
      setClipUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(new Blob(s.chunks, { type: mime }));
      });
    };
    s.recorder.start(250);
    s.round.start();
    setClipUrl(null);
    setRecording(true);
  }, []);

  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
        <section className="w-full max-w-sm space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-brandsoft">
            the equal lens
          </p>
          <h1 className="font-hand text-4xl font-bold text-brand">Myth Buster</h1>
          <p className="text-ink/75">
            A myth sticks to your forehead. Read it out loud, pull a face at it, and watch the
            truth take its place. Bust five in one take.
          </p>

          {stage === "intro" && (
            <button onClick={start} className="btn sticker bg-sun font-semibold text-ink">
              Turn on my camera
            </button>
          )}
          {stage === "starting" && <p className="text-ink/60">Waking the camera up...</p>}
          {stage === "denied" && (
            <div className="note bg-[#FAD9CE] p-4">
              The camera said no. Allow camera access for this page in your browser bar, then
              try again.
            </div>
          )}
          {stage === "unsupported" && (
            <div className="note bg-[#FAD9CE] p-4">
              This browser could not start the game. Chrome or Edge on a laptop works best.
            </div>
          )}

          {stage === "live" && (
            <div className="space-y-3">
              <button
                onClick={toggleRecord}
                className={`btn sticker font-semibold ${recording ? "bg-[#FA383E] text-white" : "bg-brand text-white"}`}
              >
                {recording ? "Stop recording" : "Record a reel"}
              </button>
              <p className="text-sm text-ink/60">
                {busted > 0 ? `${busted} myth${busted === 1 ? "" : "s"} busted this take.` : ""}
              </p>
              {clipUrl && (
                <a
                  href={clipUrl}
                  download={`surface-quest.${clipExt}`}
                  className="btn sticker inline-block bg-[#D7F5EC] font-semibold text-ink"
                >
                  Save the clip
                </a>
              )}
              <p className="text-xs text-ink/50">
                Everything happens on this computer. The video never leaves it.
              </p>
            </div>
          )}
        </section>

        <section className="w-full max-w-sm">
          <div className="sticker overflow-hidden rounded-2xl bg-ink">
            <canvas ref={canvasRef} width={W} height={H} className="block h-auto w-full" />
          </div>
          <video ref={videoRef} muted playsInline className="hidden" />
        </section>
      </div>
    </main>
  );
}

function draw(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  s: {
    round: MythRound | null;
    emotion: Emotion;
    emotionAlpha: number;
    forehead: { x: number; y: number } | null;
    faceWidth: number;
    art: Map<string, HTMLImageElement>;
  },
  dt: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx || !s.round) return;

  // Mirrored cover-crop of the landscape camera into the portrait frame, exactly the
  // arrangement the phone app records.
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

  const round = s.round;

  // Prompt capsules, top centre.
  if (round.headline) capsule(ctx, round.headline, W / 2, 150, 56);
  if (round.subline) capsule(ctx, round.subline, W / 2, 260, 44);

  // The myth card, pinned near the forehead, clamped to a readable band.
  const showCard = round.beat === "mythShown" || round.beat === "truthShown";
  if (showCard && round.current) {
    const truth = round.beat === "truthShown";
    const text = truth ? round.current.truth : round.current.myth;
    const fx = s.forehead ? (1 - s.forehead.x) * W : W / 2;
    const fy = s.forehead ? s.forehead.y * H : H * 0.3;
    card(ctx, text, truth, fx, Math.min(Math.max(fy - 260, H * 0.16), H * 0.4));
  }

  // Lensy reacts in the corner.
  const target = s.emotion !== "neutral" && s.art.has(s.emotion) ? 1 : 0;
  s.emotionAlpha += (target - s.emotionAlpha) * Math.min(1, dt * 8);
  if (s.emotionAlpha > 0.02 && s.emotion !== "neutral") {
    const img = s.art.get(s.emotion);
    if (img?.complete && img.naturalWidth > 0) {
      const h = H * 0.3;
      const w = (img.naturalWidth / img.naturalHeight) * h;
      ctx.globalAlpha = s.emotionAlpha;
      ctx.drawImage(img, W - w - 40, H - h - 90, w, h);
      ctx.globalAlpha = 1;
    }
  }
}

function capsule(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, size: number) {
  ctx.font = `600 ${size}px "Baloo 2", system-ui, sans-serif`;
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

function card(
  ctx: CanvasRenderingContext2D,
  text: string,
  truth: boolean,
  cx: number,
  cy: number,
) {
  const w = W * 0.68;
  const pad = 36;
  ctx.font = `600 52px "Baloo 2", system-ui, sans-serif`;
  const lines = wrap(ctx, text, w - pad * 2);
  const h = 96 + lines.length * 62 + pad;
  const x = Math.min(Math.max(cx - w / 2, 40), W - w - 40);

  ctx.save();
  ctx.translate(x + w / 2, cy + h / 2);
  ctx.rotate((-1.5 * Math.PI) / 180);
  ctx.translate(-(x + w / 2), -(cy + h / 2));

  ctx.fillStyle = "#ffffff";
  roundRect(ctx, x, cy, w, h, 32);
  ctx.fill();

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 34px "Inter", system-ui, sans-serif`;
  ctx.fillStyle = truth ? "#31A24C" : "#FA383E";
  ctx.fillText(truth ? "TRUTH" : "MYTH", x + pad, cy + 62);

  ctx.font = `600 52px "Baloo 2", system-ui, sans-serif`;
  ctx.fillStyle = "#111114";
  lines.forEach((line, i) => ctx.fillText(line, x + pad, cy + 128 + i * 62));
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
