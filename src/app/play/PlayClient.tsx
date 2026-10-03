"use client";

// Surface Quest on the web, now the primary product. Three views in one client: the landing
// (how to play, in the site's sticker language), the fullscreen capture stage (the app's
// Instagram-style shooting surface: rounded card, shutter riding its bottom edge, timer,
// counter, game switcher strip, last-reel thumbnail), and the reels library (IndexedDB, so
// takes survive reloads without a byte leaving the machine).

import { useCallback, useEffect, useRef, useState } from "react";
import type { Myth } from "@/lib/knowledge";
import { ExpressionAnalyzer, type Emotion } from "@/lib/play/analyzer";
import { MythRound } from "@/lib/play/round";
import { ShakeRound, SHAKE_PROPS } from "@/lib/play/shake";
import { WalkRound } from "@/lib/play/walk";
import { paint, setHandFont, W, H, type PaintState } from "@/lib/play/draw";
import { saveReel, listReels, deleteReel, reelDate, type Reel } from "@/lib/play/reels";

type View = "landing" | "capture" | "reels";
type CameraStage = "idle" | "starting" | "live" | "denied" | "failed";
type Game = "myth" | "shake" | "walk";

const GAMES: { id: Game; label: string }[] = [
  { id: "myth", label: "MYTH BUSTER" },
  { id: "shake", label: "SHAKE IT OFF" },
  { id: "walk", label: "WALK A MILE" },
];

export default function PlayClient({ myths }: { myths: Myth[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<View>("landing");
  const [camera, setCamera] = useState<CameraStage>("idle");
  const [game, setGame] = useState<Game>("myth");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState<{ done: number; total: number | null }>({
    done: 0,
    total: null,
  });
  const [reels, setReels] = useState<Reel[]>([]);
  const [openReel, setOpenReel] = useState<{ reel: Reel; url: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const s = useRef({
    analyzer: new ExpressionAnalyzer(),
    landmarker: null as import("@mediapipe/tasks-vision").FaceLandmarker | null,
    stream: null as MediaStream | null,
    recorder: null as MediaRecorder | null,
    chunks: [] as Blob[],
    mime: "video/mp4",
    startedAt: 0,
    raf: 0,
    lastT: 0,
    gen: 0,
    frameFails: 0,
    paint: {
      game: "myth",
      mythRound: new MythRound(myths),
      shakeRound: new ShakeRound(),
      walkRound: new WalkRound(),
      emotion: "neutral" as Emotion,
      emotionAlpha: 0,
      forehead: null,
      faceWidth: 0,
      art: new Map<string, HTMLImageElement>(),
    } as PaintState,
  });

  useEffect(() => {
    const st = s.current;
    const load = (key: string, src: string) => {
      const img = new Image();
      img.src = src;
      st.paint.art.set(key, img);
    };
    for (const e of ["joy", "sadness", "surprise", "fear", "anger", "disgust"]) {
      load(e, `/play/emojis/${e[0].toUpperCase()}${e.slice(1)}.png`);
    }
    SHAKE_PROPS.forEach((p, i) => load(`prop${i}`, p.src));
    load("halo", "/play/props/prop_halo.png");
    load("runner", "/play/emojis/Party.png");

    // Resolve the hashed next/font family for the canvas painter.
    const probe = document.createElement("span");
    probe.className = "font-hand";
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    document.body.appendChild(probe);
    setHandFont(getComputedStyle(probe).fontFamily);
    probe.remove();

    listReels().then(setReels).catch(() => {});
  }, []);

  // Named function expression: the frame callback re-schedules itself via its own name,
  // which is in scope inside the function (self-reference through `loop` is a lint error).
  const loop = useCallback(function tick() {
    const st = s.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !st.landmarker) return;

    const now = performance.now();
    const dt = Math.min(0.1, (now - st.lastT) / 1000);
    st.lastT = now;

    // A single bad frame must not end the take: detectForVideo can throw transiently
    // (GPU context loss is the real case), and rescheduling only happens further down.
    try {
      if (video.readyState >= 2) {
        const result = st.landmarker.detectForVideo(video, now);
        const shapes = result.faceBlendshapes?.[0]?.categories;
        if (shapes?.length) {
          const map = new Map<string, number>();
          for (const c of shapes) map.set(c.categoryName, c.score);
          st.paint.emotion = st.analyzer.step(map).best;

          const lm = result.faceLandmarks?.[0];
          if (lm) {
            // Landmark 10 is the forehead; 234 and 454 span the face.
            st.paint.forehead = { x: lm[10].x, y: lm[10].y };
            st.paint.faceWidth = Math.hypot(lm[454].x - lm[234].x, lm[454].y - lm[234].y);
          }
        } else {
          st.paint.emotion = st.analyzer.noFace().best;
          st.paint.forehead = null;
        }

        st.paint.mythRound.step(dt, st.paint.emotion);
        paint(canvas, video, st.paint, dt);

        if (st.recorder?.state === "recording") {
          setElapsed(Math.floor((now - st.startedAt) / 1000));
        }
        // Myth Buster is endless (never graded against a target); Shake It Off and Walk a
        // Mile have real denominators (props and hurdles on the track).
        const g = st.paint.game;
        const done =
          g === "myth"
            ? st.paint.mythRound.mythsBusted
            : g === "shake"
              ? st.paint.shakeRound.score
              : st.paint.walkRound.score;
        const total =
          g === "myth" ? null : g === "shake" ? st.paint.shakeRound.total : st.paint.walkRound.total;
        setScore((p) => (p.done === done && p.total === total ? p : { done, total }));
      }
      st.frameFails = 0;
    } catch (e) {
      // Log once per failure streak, not sixty times a second.
      st.frameFails++;
      if (st.frameFails === 1) console.error("[play] frame skipped", e);
      if (st.frameFails >= 60) {
        // A full second of dead frames: salvage the take (chunks flush on stop) instead
        // of silently recording a frozen frame, and stop the loop until a retry.
        if (st.recorder?.state === "recording") {
          st.recorder.stop();
          st.paint.mythRound.stop();
          st.paint.shakeRound.stop();
          st.paint.walkRound.stop();
          setRecording(false);
        }
        setCamera("failed");
        return;
      }
    }

    st.raf = requestAnimationFrame(tick);
  }, []);

  const enterCapture = useCallback(async () => {
    setView("capture");
    const st = s.current;

    // Fullscreen is progressive: declined or unsupported still leaves the fixed overlay.
    // The stage node exists only after the capture view commits, hence the frame hop.
    const goFullscreen = () =>
      requestAnimationFrame(() => {
        stageRef.current?.requestFullscreen?.().catch(() => {});
      });

    // An init is already in flight: just re-show the stage and let it land.
    if (camera === "starting") {
      goFullscreen();
      return;
    }

    // Stale-init token: leaveCapture bumps it, so an init that lands after the user
    // closed the stage releases the camera instead of resurrecting the view.
    const gen = ++st.gen;
    setCamera("starting");
    try {
      const visionP = import("@mediapipe/tasks-vision");
      visionP.catch(() => {});
      // Own the tracks the moment they exist, so every failure path can release them.
      st.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });

      const { FaceLandmarker, FilesetResolver } = await visionP;
      if (!st.landmarker) {
        // Cached across sessions: the landmarker holds no camera data, only the model.
        const fileset = await FilesetResolver.forVisionTasks("/play/wasm");
        st.landmarker = await FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: "/play/face_landmarker.task", delegate: "GPU" },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: true,
        });
      }

      const video = videoRef.current!;
      video.srcObject = st.stream;
      await video.play();
      await document.fonts.ready;

      if (gen !== st.gen) {
        // Closed while waking up: release the camera, keep the landmarker cache.
        st.stream?.getTracks().forEach((t) => t.stop());
        st.stream = null;
        return;
      }
      setCamera("live");
      goFullscreen();
      st.lastT = performance.now();
      st.frameFails = 0;
      cancelAnimationFrame(st.raf);
      loop();
    } catch (e) {
      console.error("[play]", e);
      st.stream?.getTracks().forEach((t) => t.stop());
      st.stream = null;
      if (gen === st.gen) {
        setCamera(e instanceof DOMException && e.name === "NotAllowedError" ? "denied" : "failed");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera]);

  const startRecording = useCallback(() => {
    const st = s.current;
    if (st.recorder?.state === "recording") return;

    const mp4 = MediaRecorder.isTypeSupported("video/mp4");
    st.mime = mp4 ? "video/mp4" : "video/webm";

    // Both captured in the closure: onstop fires after the stage may have unmounted, and a
    // detached canvas still holds its last composited bitmap for the poster.
    const recCanvas = canvasRef.current!;
    const stream = recCanvas.captureStream(30);
    const mic = st.stream?.getAudioTracks()[0];
    if (mic) stream.addTrack(mic.clone());

    st.chunks = [];
    st.recorder = new MediaRecorder(stream, {
      mimeType: st.mime,
      videoBitsPerSecond: 10_000_000,
    });
    st.recorder.ondataavailable = (e) => e.data.size && st.chunks.push(e.data);
    st.recorder.onstop = async () => {
      // Release the recording's own tracks: the cloned mic would otherwise keep the
      // microphone hot for the life of the tab.
      stream.getTracks().forEach((t) => t.stop());
      // Poster from the last composited frame, so the tile shows the moment.
      const small = document.createElement("canvas");
      small.width = 270;
      small.height = 480;
      small.getContext("2d")!.drawImage(recCanvas, 0, 0, 270, 480);
      const poster = small.toDataURL("image/jpeg", 0.7);
      const reel: Reel = {
        id: `reel-${Date.now()}`,
        createdAt: Date.now(),
        mime: st.mime,
        blob: new Blob(st.chunks, { type: st.mime }),
        poster,
      };
      try {
        await saveReel(reel);
        setReels(await listReels());
      } catch (err) {
        console.error("[play] save failed", err);
      }
    };
    st.recorder.start(250);
    st.startedAt = performance.now();
    setElapsed(0);
    setRecording(true);

    if (st.paint.game === "myth") st.paint.mythRound.start();
    else if (st.paint.game === "shake") st.paint.shakeRound.start();
    else st.paint.walkRound.start();
  }, []);

  const stopRecording = useCallback(() => {
    const st = s.current;
    if (st.recorder?.state !== "recording") return;
    st.recorder.stop();
    st.paint.mythRound.stop();
    st.paint.shakeRound.stop();
    st.paint.walkRound.stop();
    setRecording(false);
  }, []);

  const leaveCapture = useCallback(() => {
    const st = s.current;
    stopRecording();
    // Full camera teardown on close: the light goes off the moment the stage does.
    // Re-entry re-acquires without a prompt (the permission grant persists).
    st.gen++;
    cancelAnimationFrame(st.raf);
    st.stream?.getTracks().forEach((t) => t.stop());
    st.stream = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setCamera("idle");
    setView("landing");
  }, [stopRecording]);

  const switchGame = useCallback(
    (g: Game) => {
      if (recording) return; // a reel is one game
      setGame(g);
      s.current.paint.game = g;
      s.current.paint.mythRound.stop();
      s.current.paint.shakeRound.stop();
      s.current.paint.walkRound.stop();
    },
    [recording],
  );

  useEffect(
    () => () => {
      const st = s.current;
      cancelAnimationFrame(st.raf);
      if (st.recorder?.state === "recording") st.recorder.stop();
      st.stream?.getTracks().forEach((t) => t.stop());
      st.landmarker?.close();
    },
    [],
  );

  const openReelModal = useCallback((reel: Reel) => {
    setConfirmDelete(false);
    setOpenReel({ reel, url: URL.createObjectURL(reel.blob) });
  }, []);

  const closeReelModal = useCallback(() => setOpenReel(null), []);

  // The URL's lifecycle belongs to the modal: revoked on close, on switching reels, and on
  // unmount (browser Back with the modal open included).
  useEffect(() => {
    if (!openReel) return;
    const url = openReel.url;
    return () => URL.revokeObjectURL(url);
  }, [openReel]);

  // A hidden tab freezes rAF compositing while the mic keeps rolling; end the take cleanly
  // instead of recording a frozen frame with live audio.
  useEffect(() => {
    if (!recording) return;
    const onVis = () => {
      if (document.hidden) stopRecording();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [recording, stopRecording]);

  const removeReel = useCallback(
    async (reel: Reel) => {
      await deleteReel(reel.id);
      setReels(await listReels());
      closeReelModal();
    },
    [closeReelModal],
  );

  const shareReel = useCallback(async (reel: Reel) => {
    const ext = reel.mime.includes("mp4") ? "mp4" : "webm";
    const file = new File([reel.blob], `surface-quest.${ext}`, { type: reel.mime });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "Surface Quest" }).catch(() => {});
    }
  }, []);

  const latest = reels[0];

  return (
    // Transparent main: the body's dotted paper texture is the page background.
    <main className="min-h-screen text-ink">
      {view === "landing" && (
        <Landing onPlay={enterCapture} onReels={() => setView("reels")} reelCount={reels.length} />
      )}

      {view === "reels" && (
        <ReelsGrid reels={reels} onBack={() => setView("landing")} onOpen={openReelModal} />
      )}

      {view === "capture" && (
        <div ref={stageRef} className="fixed inset-0 z-[70] bg-[#221436]">
          <div className="flex h-full flex-col items-center justify-center py-4">
            {/* The recorded frame as a rounded floating card; chrome rides its edges. */}
            <div className="relative">
              <div className="overflow-hidden rounded-[28px]">
                <canvas
                  ref={canvasRef}
                  width={W}
                  height={H}
                  className="block h-[min(78vh,160vw)] w-auto"
                />

                {camera !== "live" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 px-8 text-center text-white">
                    {camera === "starting" && <p>Waking the camera up...</p>}
                    {camera === "denied" && (
                      <p>The camera said no. Allow it in the browser bar, then try again.</p>
                    )}
                    {camera === "failed" && (
                      <p>
                        The camera stopped. If you were recording, your reel so far is
                        saved. Chrome or Edge on a laptop works best.
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={leaveCapture}
                  aria-label="Close"
                  className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-lg text-white"
                >
                  ✕
                </button>
                {camera === "live" && (
                  <span className="absolute right-4 top-4 rounded-full bg-black/40 px-4 py-1.5 text-sm font-semibold text-white">
                    {score.total == null ? `${score.done} busted` : `${score.done} of ${score.total}`}
                  </span>
                )}
                {recording && (
                  <span className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-[#FA383E] px-4 py-1 font-mono text-sm font-bold text-white">
                    {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
                    {String(elapsed % 60).padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* Shutter riding the card's bottom edge; last reel on the same line. */}
              <button
                onClick={recording ? stopRecording : startRecording}
                disabled={camera !== "live"}
                aria-label={recording ? "Stop recording" : "Start recording"}
                className="absolute bottom-0 left-1/2 flex h-[72px] w-[72px] -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg disabled:opacity-40"
              >
                {recording ? (
                  <span className="h-7 w-7 rounded-lg bg-[#FA383E]" />
                ) : (
                  <span className="h-16 w-16 rounded-full border-4 border-black/15 bg-white" />
                )}
              </button>
              {latest && !recording && (
                <button
                  onClick={() => {
                    leaveCapture();
                    setView("reels");
                  }}
                  aria-label="Open reels"
                  className="absolute bottom-0 left-5 h-14 w-14 translate-y-1/2 overflow-hidden rounded-xl border-2 border-white/60 bg-black/40"
                >
                  {latest.poster && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={latest.poster} alt="" className="h-full w-full object-cover" />
                  )}
                </button>
              )}
            </div>

            {/* The game switcher strip: Instagram's mode row as the suite's scaling hook. */}
            <div className="mt-16 flex gap-8">
              {GAMES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => switchGame(g.id)}
                  className={`text-sm font-bold tracking-[0.2em] transition-colors ${
                    game === g.id ? "text-white" : "text-white/45"
                  } ${recording ? "cursor-default" : ""}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {openReel && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#221436]/95 p-4">
          <div className="flex max-h-full flex-col items-center gap-4">
            <video src={openReel.url} controls autoPlay loop playsInline className="max-h-[70vh] rounded-2xl" />
            <p className="text-sm text-white/70">{reelDate(openReel.reel)}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={openReel.url}
                download={`surface-quest.${openReel.reel.mime.includes("mp4") ? "mp4" : "webm"}`}
                className="btn btn--sun"
              >
                Save
              </a>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button onClick={() => shareReel(openReel.reel)} className="btn btn--primary">
                  Share
                </button>
              )}
              {!confirmDelete ? (
                <button onClick={() => setConfirmDelete(true)} className="btn btn--band">
                  Delete
                </button>
              ) : (
                <span className="sticker note--peach flex items-center gap-3 rounded-xl px-4 py-2">
                  <span className="font-hand text-sm font-bold text-ink">Really delete?</span>
                  <button
                    onClick={() => removeReel(openReel.reel)}
                    className="font-hand font-bold text-[#993C1D]"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="font-hand font-bold text-ink/70"
                  >
                    Keep it
                  </button>
                </span>
              )}
              <button onClick={closeReelModal} className="btn btn--band">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <video ref={videoRef} muted playsInline className="hidden" />
    </main>
  );
}

function Landing({
  onPlay,
  onReels,
  reelCount,
}: {
  onPlay: () => void;
  onReels: () => void;
  reelCount: number;
}) {
  const steps = [
    {
      art: "/play/emojis/Investigative.png",
      head: "Read the myth out loud",
      sub: "It sticks right on your forehead.",
      tone: "note--mint",
    },
    {
      art: "/play/emojis/LOL.png",
      head: "Play it your way",
      sub: "Pull a face, shake a stereotype off your head, or hop the hurdles - there is no wrong move.",
      tone: "note--peach",
    },
    {
      art: "/play/emojis/Party.png",
      head: "Watch the truth take over",
      sub: "Every take lands in your reels, saved on this computer only.",
      tone: "note--violet",
    },
  ];
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/play/logo.png" alt="Surface Quest" className="h-24 w-24 shrink-0 object-contain" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brandsoft">the equal lens</p>
          <h1 className="mt-1 font-hand text-5xl font-bold text-brand">Surface Quest</h1>
        </div>
      </div>
      <p className="mt-2 text-lg text-ink/75">Pull a face. Bust a myth. Keep the clip.</p>

      {/* .sticker + note tone, not .note: the brand .note pins width/column layout, and
          the tone classes carry the adult-mode flip on their own. */}
      <div className="sticker note--yellow mt-8 -rotate-1 rounded-xl p-5">
        <div className="flex items-center gap-4">
          <div className="sticker rotate-2 rounded-2xl bg-white p-4">
            <p className="text-xs font-bold uppercase text-[#993C1D]">myth</p>
            <p className="font-hand text-lg font-semibold text-[#2E1B4A]">
              Girls aren&apos;t good at maths.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/play/emojis/Mindblown.png" alt="" className="h-24 w-24 shrink-0 object-contain" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <div
            key={step.head}
            className={`sticker flex items-center gap-4 rounded-xl p-4 ${i % 2 ? "rotate-1" : "-rotate-1"} ${step.tone}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={step.art} alt="" className="h-16 w-16 shrink-0 object-contain" />
            <div>
              <p className="font-hand text-xl font-semibold text-ink">{step.head}</p>
              <p className="text-ink/70">{step.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button onClick={onPlay} className="btn btn--sun text-lg">
          Start playing
        </button>
        <button onClick={onReels} className="btn btn--outline">
          My reels{reelCount > 0 ? ` (${reelCount})` : ""}
        </button>
      </div>
      <p className="mt-6 text-xs text-ink/50">
        Everything happens on this computer. Your clips - picture and sound - stay here unless
        you choose to save or share them.
      </p>
    </div>
  );
}

function ReelsGrid({
  reels,
  onBack,
  onOpen,
}: {
  reels: Reel[];
  onBack: () => void;
  onOpen: (r: Reel) => void;
}) {
  const tones = ["note--yellow", "note--mint", "note--violet", "note--peach"];
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <button onClick={onBack} className="btn btn--outline">
        Back
      </button>
      <h1 className="mt-6 font-hand text-4xl font-bold text-brand">My reels</h1>
      <p className="mt-1 text-ink/70">
        {reels.length === 0
          ? "Nothing here yet. Play a round and your first reel lands right here."
          : `${reels.length} clip${reels.length === 1 ? "" : "s"}, stored on this computer only.`}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {reels.map((reel, i) => (
          <button
            key={reel.id}
            onClick={() => onOpen(reel)}
            className={`sticker overflow-hidden rounded-xl p-2 text-left ${i % 2 ? "rotate-1" : "-rotate-1"} ${tones[i % 4]}`}
          >
            {reel.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={reel.poster} alt="" className="aspect-[9/16] w-full rounded-lg object-cover" />
            ) : (
              <span className="block aspect-[9/16] w-full rounded-lg bg-ink/15" />
            )}
            <p className="mt-2 px-1 text-center font-hand text-sm font-semibold text-ink/80">
              {reelDate(reel)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

