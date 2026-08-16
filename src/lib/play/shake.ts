// Shake It Off, ported from the Android app (ShakeDetector.cs and ShakeItOffRound.cs).
// A stereotype prop rides the head; a genuine head shake flings it away; three props, then
// the halo. Same rule as everything in this suite: nothing grades the player.

const MIN_SWING = 0.22;
const ENERGY_PER_REVERSAL = 0.3;
const DECAY = 0.9;

export class ShakeDetector {
  private lastX = 0;
  private swingStartX = 0;
  private direction = 0;
  private primed = false;

  energy = 0;

  reset() {
    this.energy = 0;
    this.primed = false;
    this.direction = 0;
  }

  /** Call on frames with no face: energy keeps decaying, anchors are dropped, so the
   *  position jump on reacquisition can never be counted as a swing. */
  noHead(dt: number) {
    this.energy = Math.max(0, this.energy - DECAY * dt);
    this.primed = false;
    this.direction = 0;
  }

  /** Head x each frame, any consistent unit; face width in the same unit. */
  step(headX: number, faceWidth: number, dt: number) {
    this.energy = Math.max(0, this.energy - DECAY * dt);
    if (faceWidth <= 1e-4) return;

    if (!this.primed) {
      this.primed = true;
      this.lastX = headX;
      this.swingStartX = headX;
      return;
    }

    const delta = headX - this.lastX;
    this.lastX = headX;
    const direction = delta > 0 ? 1 : delta < 0 ? -1 : 0;
    if (direction === 0) return;

    if (this.direction === 0) {
      this.direction = direction;
      return;
    }

    if (direction !== this.direction) {
      // Direction reversed: the swing that just ended must have been wide enough.
      const swing = Math.abs(headX - this.swingStartX);
      if (swing >= faceWidth * MIN_SWING) {
        this.energy = Math.min(1, this.energy + ENERGY_PER_REVERSAL);
      }
      this.swingStartX = headX;
      this.direction = direction;
    }
  }
}

export type ShakeProp = {
  src: string;
  line: string;
};

export const SHAKE_PROPS: ShakeProp[] = [
  { src: "/play/props/prop_duster.png", line: "Only girls do the cleaning?" },
  { src: "/play/props/prop_toolbox.png", line: "Only boys fix things?" },
  { src: "/play/props/prop_apron.png", line: "Cooking is just for girls?" },
];

type Fling = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  t: number;
};

export class ShakeRound {
  headline = "";
  subline = "";
  score = 0;
  playing = false;
  index = 0;
  haloOn = false;

  readonly detector = new ShakeDetector();
  fling: Fling | null = null;

  get total() {
    return SHAKE_PROPS.length;
  }

  get currentProp(): ShakeProp | null {
    return this.playing && !this.haloOn && !this.fling ? SHAKE_PROPS[this.index] : null;
  }

  start() {
    this.playing = true;
    this.score = 0;
    this.haloOn = false;
    this.fling = null;
    this.show(0);
  }

  stop() {
    this.playing = false;
    this.headline = "";
    this.subline = "";
    this.haloOn = false;
    this.fling = null;
  }

  private show(index: number) {
    this.index = index;
    this.headline = SHAKE_PROPS[index].line;
    this.subline = "shake it off!";
    this.detector.reset();
  }

  /** Advance with the head position; returns the fling state when a prop is airborne. */
  step(headX: number | null, faceWidth: number, propX: number, propY: number, dt: number) {
    if (!this.playing || this.haloOn) return;

    if (this.fling) {
      const f = this.fling;
      f.vy += 4800 * dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.rotation += f.spin * dt;
      f.t += dt;
      if (f.t >= 0.7) {
        this.fling = null;
        if (this.index + 1 < this.total) {
          this.show(this.index + 1);
        } else {
          this.headline = "you shook them all off!";
          this.subline = "equality champion!";
          this.haloOn = true;
        }
      }
      return;
    }

    if (headX === null) {
      this.detector.noHead(dt);
      return;
    }
    this.detector.step(headX, Math.max(faceWidth, 1), dt);

    if (this.detector.energy >= 1) {
      this.score++;
      this.headline = "off it flies!";
      this.subline = "";
      const side = Math.random() < 0.5 ? -1 : 1;
      this.fling = {
        x: propX,
        y: propY,
        vx: side * 1900,
        vy: -1700,
        rotation: 0,
        spin: -side * 680,
        t: 0,
      };
    }
  }
}
