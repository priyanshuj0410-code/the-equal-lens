// The expression analyzer, ported line for line from the Surface Quest Android app
// (Assets/Scripts/Expression/ExpressionAnalyzer.cs). The web FaceLandmarker returns the same
// 52 ARKit-style blendshape names, so the whole FACS mapping carries over unchanged.
//
// The shape of it: weak channels get a gain, everything is EMA-smoothed, action units are
// combined with a weighted geometric mean (all required cues must fire), contradictory cues
// multiply the score down, a softmax against a constant neutral logit turns scores into a
// probability, and hysteresis keeps the answer from flickering.

export type Emotion =
  | "neutral"
  | "joy"
  | "sadness"
  | "surprise"
  | "fear"
  | "anger"
  | "disgust";

export type Reading = {
  hasFace: boolean;
  best: Emotion;
  confidence: number;
};

const GAIN: Record<string, number> = {
  noseSneerLeft: 4.0,
  noseSneerRight: 4.0,
  cheekSquintLeft: 2.5,
  cheekSquintRight: 2.5,
  mouthFrownLeft: 1.8,
  mouthFrownRight: 1.8,
  eyeWideLeft: 2.0,
  eyeWideRight: 2.0,
};

const EPS = 0.05;
const SMOOTHING_ALPHA = 0.393;
const TEMPERATURE = 0.12;
const NEUTRAL_LOGIT = 0.12;
const ENTER_PROBABILITY = 0.35;
const EXIT_PROBABILITY = 0.18;
const DWELL_FRAMES = 2;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type ActionUnits = {
  au01: number; au02: number; au04: number; au05: number; au06: number;
  au07: number; au09: number; au10: number; au12: number; au15: number;
  au17: number; au20: number; au24: number; au26: number;
};

export class ExpressionAnalyzer {
  private smoothed = new Map<string, number>();
  private probabilities = new Map<Emotion, number>();
  private current: Emotion = "neutral";
  private candidate: Emotion = "neutral";
  private dwell = 0;

  reset() {
    this.smoothed.clear();
    this.current = "neutral";
    this.candidate = "neutral";
    this.dwell = 0;
  }

  /** Feed one frame of blendshapes, keyed by ARKit-style names. */
  step(raw: ReadonlyMap<string, number>): Reading {
    this.smooth(raw);
    const au = this.extractActionUnits();
    const scores = this.score(au);
    this.softmax(scores);
    const best = this.applyHysteresis();
    return {
      hasFace: true,
      best,
      confidence: this.probabilities.get(best) ?? 0,
    };
  }

  noFace(): Reading {
    this.current = "neutral";
    this.candidate = "neutral";
    this.dwell = 0;
    return { hasFace: false, best: "neutral", confidence: 0 };
  }

  private smooth(raw: ReadonlyMap<string, number>) {
    for (const [key, rawValue] of raw) {
      const gain = GAIN[key];
      const value = gain ? clamp01(rawValue * gain) : rawValue;
      const prev = this.smoothed.get(key);
      this.smoothed.set(
        key,
        prev === undefined ? value : prev + SMOOTHING_ALPHA * (value - prev),
      );
    }
  }

  private get(name: string): number {
    return this.smoothed.get(name) ?? 0;
  }

  private mean(a: string, b: string) {
    return (this.get(a) + this.get(b)) * 0.5;
  }

  // Left and right can differ by up to 40 percent on weak channels, so take the max there
  // rather than halving a real signal.
  private max(a: string, b: string) {
    return Math.max(this.get(a), this.get(b));
  }

  private extractActionUnits(): ActionUnits {
    return {
      au01: this.get("browInnerUp"),
      au02: this.mean("browOuterUpLeft", "browOuterUpRight"),
      au04: this.mean("browDownLeft", "browDownRight"),
      au05: this.max("eyeWideLeft", "eyeWideRight"),
      au06: this.max("cheekSquintLeft", "cheekSquintRight"),
      au07: this.mean("eyeSquintLeft", "eyeSquintRight"),
      au09: this.max("noseSneerLeft", "noseSneerRight"),
      au10: this.mean("mouthUpperUpLeft", "mouthUpperUpRight"),
      au12: this.mean("mouthSmileLeft", "mouthSmileRight"),
      au15: this.max("mouthFrownLeft", "mouthFrownRight"),
      au17: Math.max(this.get("mouthShrugUpper"), this.get("mouthShrugLower")),
      au20: this.mean("mouthStretchLeft", "mouthStretchRight"),
      au24: this.mean("mouthPressLeft", "mouthPressRight"),
      au26: this.get("jawOpen"),
    };
  }

  private score(au: ActionUnits) {
    const scores = new Map<Emotion, number>();
    scores.set("joy", combine([[au.au12, 1]], [[au.au06, 1]], au.au15, au.au04));
    scores.set(
      "sadness",
      combine(
        [[au.au01, 1]],
        [[au.au15, 1], [au.au17, 1], [au.au04, 0.5]],
        au.au12, au.au26, au.au02, au.au05,
      ),
    );
    scores.set(
      "surprise",
      combine(
        [[au.au26, 1]],
        [[au.au02, 1], [au.au01, 1], [au.au05, 1]],
        au.au04, au.au12,
      ),
    );
    scores.set(
      "fear",
      combine(
        [[au.au20, 1]],
        [[au.au26, 1], [au.au02, 1], [au.au05, 1]],
        au.au12,
      ),
    );
    scores.set(
      "anger",
      combine(
        [[au.au04, 1]],
        [[au.au24, 1], [au.au07, 1]],
        au.au12, au.au01, au.au02,
      ),
    );
    // Disgust: AU9 is the textbook signal and is effectively dead in the blendshape stream,
    // so lean on AU10 and treat AU9 as a bonus.
    scores.set(
      "disgust",
      combine([[au.au10, 1]], [[au.au09, 2], [au.au15, 1]], au.au12),
    );
    return scores;
  }

  private softmax(scores: Map<Emotion, number>) {
    let max = NEUTRAL_LOGIT;
    for (const v of scores.values()) max = Math.max(max, v);

    let sum = Math.exp((NEUTRAL_LOGIT - max) / TEMPERATURE);
    this.probabilities.clear();
    for (const [k, v] of scores) {
      const e = Math.exp((v - max) / TEMPERATURE);
      this.probabilities.set(k, e);
      sum += e;
    }
    this.probabilities.set("neutral", Math.exp((NEUTRAL_LOGIT - max) / TEMPERATURE));
    if (sum <= 0) return;
    for (const [k, v] of this.probabilities) this.probabilities.set(k, v / sum);
  }

  private applyHysteresis(): Emotion {
    let best: Emotion = "neutral";
    let bestP = 0;
    for (const [k, v] of this.probabilities) {
      if (k !== "neutral" && v > bestP) {
        best = k;
        bestP = v;
      }
    }

    if (this.current !== "neutral") {
      const currentP = this.probabilities.get(this.current) ?? 0;
      if (currentP < EXIT_PROBABILITY) {
        this.current = "neutral";
      } else if (best !== this.current && bestP >= ENTER_PROBABILITY) {
        this.advanceCandidate(best);
      }
      return this.current;
    }

    if (bestP >= ENTER_PROBABILITY) {
      this.advanceCandidate(best);
    } else {
      this.candidate = "neutral";
      this.dwell = 0;
    }
    return this.current;
  }

  private advanceCandidate(best: Emotion) {
    if (this.candidate === best) {
      this.dwell++;
      if (this.dwell >= DWELL_FRAMES) {
        this.current = best;
        this.dwell = 0;
      }
    } else {
      this.candidate = best;
      this.dwell = 1;
    }
  }
}

function conj(terms: [number, number][]): number {
  let num = 0;
  let den = 0;
  for (const [value, weight] of terms) {
    num += weight * Math.log(Math.max(value, EPS));
    den += weight;
  }
  return den <= 0 ? 0 : Math.exp(num / den);
}

function combine(
  required: [number, number][],
  optional: [number, number][],
  ...contradictors: number[]
): number {
  const core = conj(required);

  let bonus = 0;
  let bonusWeight = 0;
  for (const [value, weight] of optional) {
    bonus += weight * value;
    bonusWeight += weight;
  }
  if (bonusWeight > 0) bonus /= bonusWeight;

  let penalty = 0;
  for (const c of contradictors) penalty = Math.max(penalty, c);

  return clamp01(core * (1 + 0.5 * bonus)) * (1 - 0.85 * penalty);
}
