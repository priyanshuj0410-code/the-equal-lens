// Walk a Mile, the suite's third game. The ground-AR concept re-built for a laptop: the
// runner rides the player's head bob, hurdles scroll in from the right, and the empathy
// beat is structural - you run the track once with everyday hurdles, then run the SAME
// track as Sam, who gets stereotype hurdles added for the same finish line. Nothing ever
// fails: hitting a hurdle smashes through it and still counts. The game never grades.

import { W, H } from "./frame";

export const GROUND_Y = H * 0.84;
export const RUNNER_X = W * 0.24;
export const RUNNER_SIZE = 170;

const SPEED = W * 0.3; // px per second, right to left
const GAP = W * 0.62; // distance between hurdle spawns
const HOP_SCALE = H * 1.7; // head offset (normalized) -> runner lift (px)
const MAX_LIFT = 430;
const BASELINE_ALPHA = 0.6; // per-second pull of the head baseline toward the current head
const TOPPLE_SECONDS = 0.8;
const FLASH_SECONDS = 1.6;

type HurdleSpec = { label: string; stereotype: boolean };

// Your run: everyday bumps every kid knows. Sam's run: the same track with the
// made-up rules added (the kid re-theme the concept doc called for).
const YOU_TRACK: HurdleSpec[] = [
  { label: "muddy puddle", stereotype: false },
  { label: "monday morning", stereotype: false },
  { label: "homework pile", stereotype: false },
];
const SAM_TRACK: HurdleSpec[] = [
  { label: "muddy puddle", stereotype: false },
  { label: "boys don't cry", stereotype: true },
  { label: "monday morning", stereotype: false },
  { label: "girls do the dishes", stereotype: true },
  { label: "homework pile", stereotype: false },
  { label: "pink is for girls", stereotype: true },
];

export type Hurdle = {
  label: string;
  stereotype: boolean;
  x: number; // left edge, canvas px
  w: number;
  h: number;
  /** 0 while standing; counts up while toppling after a smash-through. */
  toppleT: number;
  passed: boolean;
  smashed: boolean;
};

export type WalkBeat = "idle" | "intro" | "runYou" | "between" | "runSam" | "finish" | "done";

export class WalkRound {
  beat: WalkBeat = "idle";
  headline = "";
  subline = "";
  score = 0;
  haloOn = false;
  hurdles: Hurdle[] = [];
  /** Runner bottom edge in canvas px; the painter draws the sprite on it. */
  runnerBottom = GROUND_Y;
  airborne = false;

  private beatTime = 0;
  private baseline: number | null = null;
  private elevatedT = 0;
  private flashT = 0;
  private spawnQueue: HurdleSpec[] = [];

  get playing() {
    return this.beat !== "idle";
  }

  get total() {
    return YOU_TRACK.length + SAM_TRACK.length;
  }

  start() {
    this.beat = "intro";
    this.beatTime = 0;
    this.score = 0;
    this.haloOn = false;
    this.hurdles = [];
    this.baseline = null;
    this.elevatedT = 0;
    this.flashT = 0;
    this.headline = "walk a mile!";
    this.subline = "hop the hurdles with your head";
  }

  stop() {
    this.beat = "idle";
    this.headline = "";
    this.subline = "";
    this.hurdles = [];
    this.haloOn = false;
    this.runnerBottom = GROUND_Y;
    this.airborne = false;
  }

  /** headY is the forehead's normalized y (0..1) or null when no face is tracked. */
  step(headY: number | null, dt: number) {
    if (this.beat === "idle") return;
    this.beatTime += dt;
    if (this.flashT > 0) {
      this.flashT = Math.max(0, this.flashT - dt);
      // During a run every headline is a flash; it clears itself when its time is up.
      if (this.flashT === 0 && (this.beat === "runYou" || this.beat === "runSam")) {
        this.headline = "";
      }
    }

    this.moveRunner(headY, dt);

    switch (this.beat) {
      case "intro":
        if (this.beatTime >= 3.2) this.startRun("runYou", YOU_TRACK);
        break;

      case "runYou":
      case "runSam":
        this.advanceTrack(dt);
        // A run ends only when the track is truly clear: hopped cards slide off-screen
        // and smashed ones finish toppling before the next beat begins.
        if (!this.spawnQueue.length && this.hurdles.length === 0) {
          if (this.beat === "runYou") {
            this.beat = "between";
            this.beatTime = 0;
            this.headline = "now run it as sam";
            this.subline = "same track. same finish line.";
          } else {
            this.beat = "finish";
            this.beatTime = 0;
            this.headline = "same track. double the hurdles.";
            this.subline = "the extra ones were made up - unfair, right?";
          }
        }
        break;

      case "between":
        if (this.beatTime >= 3.6) this.startRun("runSam", SAM_TRACK);
        break;

      case "finish":
        if (this.beatTime >= 4.2) {
          this.beat = "done";
          this.beatTime = 0;
          this.headline = "you ran it for sam!";
          this.subline = "equality champion!";
          this.haloOn = true;
        }
        break;

      case "done":
        break;
    }
  }

  private startRun(beat: "runYou" | "runSam", track: HurdleSpec[]) {
    this.beat = beat;
    this.beatTime = 0;
    this.hurdles = [];
    this.spawnQueue = [...track];
    this.subline = "";
    this.flash(beat === "runYou" ? "your run - go!" : "sam's run - go!");
  }

  private moveRunner(headY: number | null, dt: number) {
    if (headY === null) {
      // No face: glide back to the ground, and drop the baseline so the position jump
      // on reacquisition can never read as a hop (same tradeoff as ShakeDetector.noHead).
      this.baseline = null;
      this.elevatedT = 0;
      this.runnerBottom += (GROUND_Y - this.runnerBottom) * Math.min(1, dt * 8);
      this.airborne = false;
      return;
    }
    // The baseline is where this player's head naturally sits; lift is the bob above it.
    // Two-rate chase: a quick hop held high is not absorbed, but a sustained rise (the
    // player sat up straighter) is re-anchored after a grace period so they do not fly.
    if (this.baseline === null) this.baseline = headY;
    if (headY >= this.baseline) {
      this.elevatedT = 0;
      this.baseline += (headY - this.baseline) * Math.min(1, dt * BASELINE_ALPHA * 4);
    } else {
      this.elevatedT += dt;
      const rate = this.elevatedT > 1.2 ? BASELINE_ALPHA * 4 : BASELINE_ALPHA * 0.4;
      this.baseline += (headY - this.baseline) * Math.min(1, dt * rate);
    }
    const lift = Math.min(MAX_LIFT, Math.max(0, (this.baseline - headY) * HOP_SCALE));
    const target = GROUND_Y - lift;
    this.runnerBottom += (target - this.runnerBottom) * Math.min(1, dt * 14);
    this.airborne = lift > 60;
  }

  private advanceTrack(dt: number) {
    if (this.spawnQueue.length) {
      const last = this.hurdles[this.hurdles.length - 1];
      if (!last || last.x < W - GAP) {
        const spec = this.spawnQueue.shift()!;
        this.hurdles.push({
          label: spec.label,
          stereotype: spec.stereotype,
          x: W + 40,
          w: spec.stereotype ? 300 : 250,
          h: spec.stereotype ? 210 : 165,
          toppleT: 0,
          passed: false,
          smashed: false,
        });
      }
    }

    for (const h of this.hurdles) {
      h.x -= SPEED * dt;
      if (h.toppleT > 0) {
        h.toppleT = Math.min(TOPPLE_SECONDS, h.toppleT + dt);
        continue;
      }
      const runnerFront = RUNNER_X + RUNNER_SIZE * 0.35;
      const runnerBack = RUNNER_X - RUNNER_SIZE * 0.35;
      const overlaps = h.x < runnerFront && h.x + h.w > runnerBack;
      if (!h.passed && overlaps) {
        const hurdleTop = GROUND_Y - h.h;
        if (this.runnerBottom > hurdleTop - 12) {
          // Smash-through: celebrated, never a fail.
          h.passed = true;
          h.smashed = true;
          h.toppleT = 0.0001;
          this.score++;
          this.flash(
            h.stereotype ? "smashed! that rule was made up" : "splat! keep going!",
          );
        }
      } else if (!h.passed && h.x + h.w < runnerBack) {
        h.passed = true;
        this.score++;
        if (h.stereotype) this.flash("hopped it! that rule was made up");
      }
    }

    this.hurdles = this.hurdles.filter(
      (h) => h.x + h.w > -80 && !(h.smashed && h.toppleT >= TOPPLE_SECONDS),
    );
  }

  private flash(text: string) {
    this.headline = text;
    this.flashT = FLASH_SECONDS;
  }
}
