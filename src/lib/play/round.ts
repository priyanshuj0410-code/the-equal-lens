// The Myth Buster round loop, ported from the Android app's RoundController. Same beats,
// same timings, same rule: the game names the feeling it saw and never grades the player.
// Every myth counts the moment the truth appears.

import type { Emotion } from "./analyzer";
import type { Myth } from "../knowledge";

export type Beat =
  | "idle"
  | "mythShown"
  | "naming"
  | "truthShown"
  | "askingForJoy"
  | "celebrating";

const MYTH_SECONDS = 3.5;
const NAMING_SECONDS = 1.8;
const TRUTH_SECONDS = 4.0;
const JOY_PATIENCE_SECONDS = 6.0;
const CELEBRATE_SECONDS = 2.2;

const FEELING_WORDS: Record<Emotion, string> = {
  neutral: "hmm, hard to read",
  joy: "that looked like joy!",
  sadness: "that looked like sadness",
  surprise: "that looked like surprise!",
  fear: "that looked like a scare!",
  anger: "that looked like anger!",
  disgust: "that looked like disgust!",
};

export class MythRound {
  beat: Beat = "idle";
  headline = "";
  subline = "";
  mythsBusted = 0;
  current: Myth | null = null;

  private deck: Myth[] = [];
  private bag: Myth[] = [];
  private beatTime = 0;
  private strongest: Emotion = "neutral";
  private smiled = false;

  constructor(myths: Myth[]) {
    this.deck = myths;
  }

  start() {
    this.mythsBusted = 0;
    this.nextMyth();
  }

  stop() {
    this.beat = "idle";
    this.headline = "";
    this.subline = "";
    this.current = null;
  }

  get isPlaying() {
    return this.beat !== "idle";
  }

  /** Advance the round. Call every frame with the current reading. */
  step(dt: number, best: Emotion) {
    if (this.beat === "idle") return;
    this.beatTime += dt;

    // Remember the strongest non-neutral feeling seen during the myth.
    if (this.beat === "mythShown" && best !== "neutral") this.strongest = best;
    if (this.beat === "askingForJoy" && best === "joy") this.smiled = true;

    switch (this.beat) {
      case "mythShown":
        this.headline = "how does that make you feel?";
        this.subline = "read it out loud";
        if (this.beatTime >= MYTH_SECONDS) this.enter("naming");
        break;

      case "naming":
        this.headline = FEELING_WORDS[this.strongest];
        this.subline = "there's no wrong face here";
        if (this.beatTime >= NAMING_SECONDS) this.enter("truthShown");
        break;

      case "truthShown":
        this.headline = "here's the truth";
        this.subline = "say it back";
        if (this.beatTime >= TRUTH_SECONDS) this.enter("askingForJoy");
        break;

      case "askingForJoy":
        this.headline = "now show me joy";
        this.subline = "big smile!";
        if (this.smiled || this.beatTime >= JOY_PATIENCE_SECONDS) {
          // The smile is never a gate: the myth is busted either way.
          this.mythsBusted++;
          this.enter("celebrating");
        }
        break;

      case "celebrating":
        // Copy never branches on smiled: "anyway" would grade the face that was pulled.
        this.headline = "myth busted!";
        this.subline = `${this.mythsBusted} down`;
        if (this.beatTime >= CELEBRATE_SECONDS) this.nextMyth();
        break;
    }
  }

  private nextMyth() {
    if (this.bag.length === 0) this.bag = shuffle([...this.deck]);
    this.current = this.bag.pop() ?? null;
    this.strongest = "neutral";
    this.smiled = false;
    if (this.current) this.enter("mythShown");
    else {
      this.headline = "no myths loaded";
      this.beat = "idle";
    }
  }

  private enter(beat: Beat) {
    this.beat = beat;
    this.beatTime = 0;
  }
}

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
