/* The Equal Lens — design tokens as typed data (for JS/TS, theming, design tools). */

export const violet = {
  50: "#F3F0F6",
  100: "#E5E0ED",
  200: "#C5B6DE",
  400: "#7F65A4",
  600: "#553286", // Equal Violet — the brand colour
  700: "#44288B",
  800: "#331E50",
  900: "#221436", // Deep Indigo
} as const;

/** shared accents (same in light + dark). Fills only: put #221436 text on them, never white on grow, never as a text colour. */
export const accent = {
  insight: "#2DD4BF", // teal · "unlearn"
  grow: "#FF7A5C", // coral · "relearn"
  sun: "#FFC94D", // yellow · highlight / CTA
  sky: "#4FB0E8", // blue · support
} as const;

/** semantic tokens that flip between themes */
export const light = {
  paper: "#FBF9FF",
  surface: "#FFFFFF",
  mist: "#E7E0F1",
  ink: "#221436",
  brand: "#553286",
  brandsoft: "#735997",
  band: "#553286",
  dot: "#ECE6F6",
} as const;

export const dark = {
  paper: "#15101F",
  surface: "#221A30",
  mist: "#3A2E4D",
  ink: "#F1ECFA",
  brand: "#C9B8E6",
  brandsoft: "#B3A4D6",
  band: "#241B38",
  dot: "#2A2140",
} as const;

export const fonts = {
  display: "Poppins", // wordmark / UI labels
  body: "Nunito Sans", // body copy
  hand: "Baloo 2", // headlines / playful / mascot voice
} as const;

export const tokens = { violet, accent, light, dark, fonts } as const;
export default tokens;
