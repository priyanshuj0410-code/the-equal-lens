---
type: design-system
title: Design system reference
description: Visual language, component patterns, and token usage for The Equal Lens website.
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/fad4697c-b7e8-44f4-9976-1feb67c1a7b9
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/8556ff32-8b15-4eaa-bcd7-0a7bdb147c59
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/1cd87d2c-bfd2-4f5e-b34b-e7afa1247107
---

> **Source of truth:** the installable package `@equal-lens/brand` at
> [`brand/design-system/`](../brand/design-system/) (`tokens.css`, `components.css`,
> React components). This doc summarises it - when they disagree, the package wins.
> Update this doc whenever the package changes.

## Brand palette

**Equal Violet `#553286`** leads; neutrals carry; accents appear in small doses.
Surface/text tokens flip in dark ("adult") mode; the violet ramp and accents do not.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-brand` | `#553286` | `#C9B8E6` | Primary violet - accents, active states |
| `--color-brandsoft` | `#7F65A4` | `#B3A4D6` | Muted violet - secondary text, labels |
| `--color-paper` | `#FBF9FF` | `#15101F` | Page background |
| `--color-surface` | `#FFFFFF` | `#221A30` | Cards / notes |
| `--color-mist` | `#E7E0F1` | `#3A2E4D` | Hairlines, hover fills, Lensy bubbles |
| `--color-ink` | `#221436` | `#F1ECFA` | Text, borders, sticker shadows |
| `--color-band` | `#553286` | `#241B38` | Dark CTA / footer band |
| `--dot` | `#ECE6F6` | `#2A2140` | Dotted-paper texture |

**Accents** (shared by both themes, used sparingly):

| Token | Value | Usage |
|---|---|---|
| `--color-insight` | `#2DD4BF` | Teal - "unlearn" |
| `--color-grow` | `#FF7A5C` | Coral - "relearn" / CTA |
| `--color-sun` | `#FFC94D` | Yellow - CTA on dark bands (always with `ink` text) |
| `--color-sky` | `#4FB0E8` | Blue - support / info |

**Violet ramp:** `--color-violet-50 #F3F0F6 · 100 #E5E0ED · 200 #C5B6DE · 400 #7F65A4 · 600 #553286 (brand) · 700 #44288B · 800 #331E50 · 900 #221436 (Deep Indigo)`.

**Dark theme:** put `data-audience="adult"` on a parent (usually `<html>`); default is light ("kid"). Only `paper, surface, mist, ink, brand, brandsoft, band, dot` flip.

## Typography

Three families (loaded via the package `fonts.css`):
- `--font-display` **Poppins** - wordmark, UI labels
- `--font-body` **Nunito Sans** - body paragraphs, descriptions
- `--font-hand` **Baloo 2** - headlines + playful / mascot voice
- Heading scale: `text-4xl` (h2 sections), `text-5xl-6xl` (hero h1)
- Eyebrow: `.eyebrow` utility - small caps, `text-brand`, letter-spaced

## Voice

Curious, warm, brave; playful, not preachy. Sentence case.

- **Hyphens, not em dashes** (and not en dashes). This applies to all product copy, UI
  strings, and these docs. Reword, or use a comma / period / colon, instead of a dash.
- One line summary lives in the package: `@equal-lens/brand` README "Voice".

## Sticker / card pattern

All interactive cards use the "sticker" treatment:
- `border-2 border-ink`
- `box-shadow: 4px 4px 0 var(--color-ink)` (`.sticker` or `shadow-[4px_4px_0_var(--color-ink)]`)
- Slight rotation (`rotate-[-2deg]` to `rotate-[2deg]`) for hand-placed feel
- `hover-pop`: lifts card on hover via `translateY(-3px)` + shadow increase

## Lensy bubble

`.bubble` class (from `brand/design-system/components.css`):
- `border-radius: 1rem; border-bottom-left-radius: 0.25rem` - flat bottom-left corner = chat tail
- `background: var(--color-mist)`
- `padding: 0.5rem 0.75rem; font-size: 0.75rem`
- No border, no shadow - intentionally soft/lightweight vs card stickers

## Gallery (testimonial carousel)

Section heading is **"Gallery"** (was "Testimonials"). Backed by Testimonial documents; the Sanity object/field key stays `testimonials`.

- Polaroid card: `border-2 border-ink bg-white shadow-[5px_5px_0_var(--color-ink)]`, `aspect-[4/3]` photo, white strip at bottom
- Chat bubble: Lensy `.bubble` style, overlaps top-right corner of polaroid (`bottom: calc(100% - 32px)`)
- Bubble contains: sender name (top, `text-xs text-brand`), quote (`text-sm font-bold`), role (`text-xs text-brandsoft`)
- **Name and quote are optional.** Each bubble line renders only if present; a photo-only item (no name/quote/role) renders **no bubble at all** - just the polaroid. Slide top-padding (`pt-48`) stays uniform so carousel height never jumps.
- Polaroid strip: centered `tag` caption (`text-xs italic text-ink/40`)
- Parallax: bubble `translateX(dist * 5px)`, polaroid `translateX(dist * -4px) rotate(tilt)`
- Animation: `550ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` on track + inner elements

## Canvas myth interaction

- The `+ myth` toolbar button appends a sticky-note card. On desktop it floats at a free spot on the canvas; on mobile it flows into the "Bust these myths" section above the footer.
- **Mobile feedback rule:** because the toolbar is fixed at the bottom and the myth section is usually off-screen, adding a myth on mobile smooth-scrolls the new card into view (`block: center`, respects `prefers-reduced-motion`). Without this the tap reads as a no-op. Guarded so route-change seeding never auto-scrolls.
- **Content-aware placement (THEEQ-43):** desktop cards re-place whenever `main` mutates or resizes (async loads, same-route view switches), not just on route change. Dragged cards stay put and count as obstacles. Cards never layer over content or each other; when the page has no free spot, the extras hide (`hidden` flag) until room opens. There is no overflow stack fallback.
- **Dotted paper:** the body carries `.canvas-dots` (radial `--dot` grid, 28px, over `bg-paper`), so the texture is the site-wide ground in both audiences. Page sections that want plain paper must paint their own background; /play deliberately stays transparent.

## Button variants

| Class | Usage |
|---|---|
| `.btn--primary` | Main CTAs - brand fill, ink shadow |
| `.btn--sun` | CTAs on dark band - yellow (ink text) |
| `.btn--outline` | Secondary CTAs - violet sticker outline |
| `.btn--band` | On dark bands - white outline |
| `.btn--solid` | Flat fill, no shadow (forms) |
| `.btn--ghost` | Text only, no box |

Add `.btn--sm` for the compact size. In React: `<Button variant size href>`.

## Blog carousel

Optional image carousel on a blog post, rendered between the `<h1>` heading and the body (`src/components/BlogCarousel.tsx`).
- Framed sticker container: `rounded-2xl border-2 border-ink bg-mist shadow-[4px_4px_0_var(--color-ink)]`, `aspect-[3/2]` image.
- Crossfade between slides (stacked, opacity), round ink nav arrows (`border-2 border-ink bg-surface shadow-[2px_2px_0]`), pill dots (active = `w-6 bg-brand`).
- Autoplays every 6s, pauses on hover/focus, respects `prefers-reduced-motion`.
- Optional per-image `caption` shown centered below; optional `alt`.
- Data: Sanity `post.carousel` (image array with `alt`/`caption`) → resolved to `BlogSlide[]` (`{ url, alt?, caption? }`) in `getPost`.

## Blog interactive embed

Authors can drop a self-contained interactive HTML data-viz into a post body (Sanity `post.body` gets an `htmlEmbed` block: `code` + optional `caption`/`height`).
- Rendered by the `htmlEmbed` serializer (`src/sanity/portableText.ts`) into an `<iframe srcdoc>` with `sandbox="allow-scripts allow-popups"` - the embed's JS runs but is isolated from the page (no same-origin), safe for arbitrary HTML.
- Frame styling: `border-2 border-ink`, `rounded-2xl` (1rem), white background, full width.
- A height-reporter script is injected into each embed; `EmbedResizer` (client, mounted on the post page) listens for its `postMessage` and sizes the iframe to fit - no cropping/scroll.
- Embeds must be self-contained (inline `<style>`/`<script>`); the sandbox has no page access.

## Surface Quest capture surface (/play)

The browser game's shooting UI (THEEQ-42). Three views in `src/app/play/PlayClient.tsx`;
the in-recording graphics live in `src/lib/play/draw.ts`.

- **Stage**: fixed fullscreen overlay `z-[70]` on `bg-ink` (site toolbar and Lensy launcher
  are `z-50`; anything on the capture stage must sit above them). Reel modal is `z-[80]`.
  `requestFullscreen` is progressive - declined/unsupported still gets the fixed overlay.
- **Card**: the 9:16 composite canvas as a floating `rounded-[28px]` card, Instagram idiom.
  Chrome rides its edges: close (`h-11 w-11` black/40 disc, top-left), counter pill
  ("n of m", black/40, top-right), timer pill (`#FA383E`, `font-mono`, canvas-bottom-16),
  shutter (72px white disc riding the bottom edge via `translate-y-1/2`; recording state
  is a 28px `#FA383E` rounded square), last-reel thumbnail (56px, `rounded-xl`,
  `border-white/60`, bottom-left on the shutter's line, opens reels).
- **Game switcher**: label strip below the card (`tracking-[0.2em]`, active white,
  inactive white/45), locked while recording. Scales to future games.
- **In-canvas note card** (recorded into the reel): the `.note`/`.sticker` recipe drawn in
  canvas at 1080x1920 - tone fill (`#FFF3C2` myth / `#D7F5EC` mint truth), 7px ink border
  (2.5px at CSS scale), hard 9px offset ink shadow, -2 degree tilt, white chip pill with
  `#993C1D` myth / `#0F6E56` truth text, body in Baloo 2 (family resolved from a `.font-hand`
  probe so canvas text uses the real next/font face).
- **Prompt capsules**: black/45 pills, white Baloo text, centred; the band starts at canvas
  y=265 so it clears the on-card chrome row. Idle hint: "press the round button to play!".
- **Reels library**: IndexedDB (`equal-lens-reels`), tiles are `.sticker rounded-xl` cards
  in the four `note--*` tones (never `.note` itself - it pins `width: 14rem` and column
  layout; `.sticker` + a tone class composes with utilities and keeps the adult flip) with
  9:16 posters and alternating `rotate-1`/`-rotate-1`. Modal player on `#221436`/95 with
  published button variants: Save `btn--sun`, Share `btn--primary`, Delete and Close
  `btn--band`, plus an inline `.sticker note--peach` "Really delete?" confirm.
- **Dark pinning**: the stage and modal backdrops use the literal `#221436`, never `bg-ink`
  - ink flips light in adult mode and a camera surface stays dark in both. Same rule for
  on-stage text (white, not `text-paper`).

## Component library

`@equal-lens/brand` package at `brand/design-system/`. Exports: `Button`, `Card`, `Note`, `Segmented`, `NavLink`, `Tabs`, `Toolbar`, `ShipDock`, `Popover`, `Bubble`.
