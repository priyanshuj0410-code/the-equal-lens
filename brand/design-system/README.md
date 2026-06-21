# The Equal Lens — brand / design-system package

A self-contained, copy-anywhere version of The Equal Lens look: the colour
palette, fonts, the kid/adult (light/dark) theme, and the playful UI kit
(dotted paper, "sticker" cards, tasteful motion). No build step or dependency
required for the plain-CSS version.

## What's in here
| File | Use |
|---|---|
| `equal-lens.css` | **One-file plain-CSS bundle** — imports the four below. Start here. |
| `fonts.css` | Google Fonts import (Poppins, Nunito Sans, Baloo 2 — all free) |
| `tokens.css` | the colour + font CSS variables (+ the dark-theme flip) |
| `utilities.css` | dotted-paper bg, `.sticker`, motion classes |
| `components.css` | **the atoms & molecules** — buttons, tags, cards, sticky notes, segmented toggle, nav pills, tabs, bottom toolbar, ship dock (see below) |
| `tailwind.css` | **Tailwind v4 version** — registers the palette as `bg-brand`, `text-ink`, `font-hand`, … |
| `tokens.json` / `tokens.ts` | the tokens as data (for JS/TS, theming, design tools) |
| `assets/` | **the brand SVGs** — logo, mascots, Lensy poses, ship, doodles (see below) |
| `preview.html` | palette + type + the sticker look + assets + the light/dark toggle |
| `components.html` | **every atom & molecule rendered live** — open this to see the UI kit |

## Quick start

**Plain CSS (any project, any framework):**
```html
<link rel="stylesheet" href="equal-lens.css" />
```
Then use the tokens and classes:
```html
<div class="sticker hover-pop" style="background: var(--color-surface); border-radius: 24px; padding: 24px;">
  <h2 style="font-family: var(--font-hand); color: var(--color-brand);">Unlearn. Relearn. Grow.</h2>
  <button style="background: var(--color-sun); color: var(--color-ink); font-family: var(--font-hand);">Get started</button>
</div>
```

**Tailwind v4:** in your entry CSS, after `@import "tailwindcss";`, paste/import
`tailwind.css`. You then get utilities: `bg-paper text-ink border-mist bg-brand
bg-sun text-brandsoft font-hand font-display` plus `.sticker`, `.anim-*`, `.hover-pop`.

**JS/TS tokens:**
```ts
import tokens from "./tokens.ts";
tokens.light.brand;  // "#553286"
tokens.dark.paper;   // "#15101F"
```

## Light / dark (the "kid / adult" theme)
The palette ships light by default. To switch to dark, put `data-audience="adult"`
on a parent (usually `<html>`):
```html
<html data-audience="adult">   <!-- dark -->
<html>                          <!-- light (default) -->
```
Only a handful of tokens flip (`paper`, `surface`, `mist`, `ink`, `brand`,
`brandsoft`, `band`, `dot`); the violet ramp and accents stay. Prefer a
different convention? Find-and-replace `[data-audience="adult"]` with `.dark`
or `[data-theme="dark"]` in `tokens.css` / `tailwind.css`.

## Palette
**Equal Violet `#553286`** leads; neutrals carry; accents appear in small doses.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-brand` | `#553286` | `#C9B8E6` | primary violet |
| `--color-brandsoft` | `#7F65A4` | `#B3A4D6` | muted violet |
| `--color-paper` | `#FBF9FF` | `#15101F` | page background |
| `--color-surface` | `#FFFFFF` | `#221A30` | cards |
| `--color-mist` | `#E7E0F1` | `#3A2E4D` | lines / hover |
| `--color-ink` | `#221436` | `#F1ECFA` | text + outlines |
| `--color-band` | `#553286` | `#241B38` | footer / CTA band |
| `--dot` | `#ECE6F6` | `#2A2140` | dotted-paper texture |
| `--color-insight` | `#2DD4BF` | — | teal · "unlearn" |
| `--color-grow` | `#FF7A5C` | — | coral · "relearn" / CTA |
| `--color-sun` | `#FFC94D` | — | yellow · CTA (always with `ink` text) |
| `--color-sky` | `#4FB0E8` | — | blue · support |

Full violet ramp: `--color-violet-50…900`.

## Type
- `--font-display` **Poppins** — wordmark, UI labels
- `--font-body` **Nunito Sans** — body copy
- `--font-hand` **Baloo 2** — headlines + playful / mascot voice

## Utility classes
- `.sticker` — chunky 2.5px outline + hard 4px offset shadow (the cut-out card look). `.sticker-soft` is the violet variant.
- dotted-paper background is applied to `body`; `.canvas-dots` puts the same texture on any element.
- motion: `.anim-float` `.anim-wobble` `.anim-bob` `.anim-pop` and `.hover-pop` (lift + tilt on hover). All respect `prefers-reduced-motion`.

## Atoms & molecules — `components.css`
The website's UI kit as plain-CSS classes (in the `equal-lens.css` bundle).
**Open `components.html` to see them all rendered.** Active/selected states are
driven by ARIA (`aria-pressed`, `aria-selected`, `aria-current`) or an
`.is-active` class, so they work with any framework. Recolour via the tokens.

**Atoms**
- `.btn` + `.btn--primary` (violet) · `.btn--sun` · `.btn--outline` · `.btn--ghost`; add `.btn--sm` for compact. Pill shape, hand font, lift-on-hover, `:disabled` dims.
- `.tag` — the shadowed pill label that sits above headings. `.eyebrow` — the uppercase mini-label (no box).
- `.card` — the signature sticker card; `.card--soft` is the violet-shadow variant.
- `.note` — a sticky note; pair with a tone: `.note--yellow` `.note--mint` `.note--peach` `.note--violet` (each flips in dark). `.note__chip` / `.note__chip--truth` is the status chip.

**Molecules**
- `.segmented` + `.segmented__option` — the Kids / Adult (light/dark) toggle. Mark the on option `aria-pressed="true"` or `.is-active`.
- `.nav-link` — header nav pills; current page = `aria-current="page"` or `.is-active`.
- `.tabs` + `.tab` (+ `.tab__icon`) — the pill-tab row that switches a panel. Selected = `aria-selected="true"` or `.is-active`.
- `.toolbar` (+ `.toolbar--dock` to pin it bottom-centre) with `.toolbar__btn` and `.toolbar__sep` — the floating bottom tool pill.
- `.ship-bubble` — Lensy's round ship dock (drop a `ship-*.svg` inside).
- `.popover` + `.bubble` — Lensy's chat card and its speech bubble.

```html
<button class="btn btn--primary">Get started</button>
<div class="card hover-pop"> … </div>
<div class="toolbar toolbar--dock">
  <button class="toolbar__btn is-active">Browse</button>
  <button class="toolbar__btn"><img src="assets/mascots/un.svg" alt=""> Unlearn</button>
</div>
```

> **Using Tailwind instead?** These class names are plain CSS and don't depend on
> Tailwind — just also `@import "./components.css";` in your entry stylesheet
> (order doesn't matter; they read the same tokens). The live site builds these
> inline with Tailwind utilities; `components.css` reproduces the identical look.

## Brand assets — `assets/`
All SVG, transparent background, recolorable. Bundled here so the package is
self-contained (no need to reach back into the main site repo).

| Folder | Files | What |
|---|---|---|
| `assets/logo/` | `logo-primary.svg` · `logo-reversed.svg` · `logo-mono.svg` · `avatar-violet.svg` · `avatar-light.svg` | the **eQ mark** — violet, white (for dark bg), black, and two square avatar lockups |
| `assets/mascots/` | `un.svg` · `re.svg` | the **Unlearn / Relearn** character pair |
| `assets/lensy/` | `lensy-wave.svg` · `lensy-stand.svg` · `lensy-think.svg` · `lensy-idea.svg` · `lensy-icon.svg` | **Lensy**, the magnifying-glass mascot, in five poses (`-icon` is the compact face) |
| `assets/ship/` | `ship-closed.svg` · `ship-flying.svg` · `ship-front.svg` · `ship-diagonal.svg` | the **ship** illustration, four angles |
| `assets/doodles/` | `squiggle` · `sparkle` · `spiral` · `arrow` · `heart` · `star` · `zigzag` · `swirl` `.svg` | the hand-drawn **doodle set** (filled in brand violet `#553286` — change `fill`/`stroke` to recolor) |

Drop them in with a plain `<img>` (`<img src="assets/lensy/lensy-wave.svg" alt="" />`),
inline the markup, or import as a component. The doodles are also available as a
React component (`<Doodle name="star" />`) in the main site at
`src/components/Doodles.tsx` if you'd rather pass `color` as a prop.

Full brand guidelines (the PDF) live in the main repo at
`brand/The-Equal-Lens-Brand-Guidelines-v2.pdf`.

## Voice (one line)
Curious, warm, brave — playful not preachy. Sentence case, hyphens not em dashes.
