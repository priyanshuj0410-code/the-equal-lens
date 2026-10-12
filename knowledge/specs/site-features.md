---
type: spec
title: Site feature specs
description: How the interactive features of The Equal Lens site behave: the Gallery, the blog carousel and embed, the myth canvas and the /play capture surface. Moved out of the design system so design.md holds tokens and patterns only.
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/a2255819-9c27-4992-9440-1fd577afa1f0  # THEEQ-65
---

# Site feature specs

These specs were part of [`design.md`](../design.md) until THEEQ-65. They describe what each feature does and how it is built. The tokens, scales, patterns and rules they rely on stay in `design.md`: the [sticker card](../design.md#sticker--card-pattern), the [Lensy bubble](../design.md#lensy-bubble), the [button variants](../design.md#button-variants), [states](../design.md#states-theeq-63), the [autoplay control](../design.md#autoplay-control) and [accessibility](../design.md#accessibility-theeq-61-claud-17). Change a feature here; change a token or a pattern there.

## Gallery (testimonial carousel)

Section heading is **"Gallery"** (was "Testimonials"). Backed by Testimonial documents; the Sanity object/field key stays `testimonials`.

- Polaroid card: `border-2 border-ink bg-white shadow-[5px_5px_0_var(--color-ink)]`, `aspect-[4/3]` photo, white strip at bottom
- Chat bubble: Lensy `.bubble` style, overlaps top-right corner of polaroid (`bottom: calc(100% - 32px)`)
- Bubble contains: sender name (top, `text-xs text-brand`), quote (`text-sm font-bold`), role (`text-xs text-brandsoft`). All three read on `mist` in both themes (brand 7.47 and 6.84, ink 13.37 and 10.80, brandsoft 4.53 and 5.48)
- **Name and quote are optional.** Each bubble line renders only if present; a photo-only item (no name/quote/role) renders **no bubble at all** - just the polaroid. Slide top-padding (`pt-48`) stays uniform so carousel height never jumps.
- Polaroid strip: centered `tag` caption (`text-xs italic text-violet-900/70`, 6.42 on the strip). The strip is literal white in both themes, so the caption uses the non-flipping `violet-900`, not `ink`
- Parallax: bubble `translateX(dist * 5px)`, polaroid `translateX(dist * -4px) rotate(tilt)`
- Animation: `550ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` on track + inner elements
- Autoplays every 5.5s under the [autoplay control](../design.md#autoplay-control) rules; the pause button sits first in the dots row.

## Blog carousel

Optional image carousel on a blog post, rendered between the `<h1>` heading and the body (`src/components/BlogCarousel.tsx`).
- Framed sticker container: `rounded-2xl border-2 border-ink bg-mist shadow-[4px_4px_0_var(--color-ink)]`, `aspect-[3/2]` image.
- Crossfade between slides (stacked, opacity), round ink nav arrows (`border-2 border-ink bg-surface shadow-[2px_2px_0]`), pill dots (active = `w-6 bg-brand`).
- Autoplays every 6s under the [autoplay control](../design.md#autoplay-control) rules (shared `useAutoplay` hook, visible pause button, hold on pointer, touch or focus, `prefers-reduced-motion`). The slide area is `aria-live="off"` while playing and `polite` otherwise.
- Optional per-image `caption` shown centered below; optional `alt`.
- Data: Sanity `post.carousel` (image array with `alt`/`caption`) → resolved to `BlogSlide[]` (`{ url, alt?, caption? }`) in `getPost`.

## Blog interactive embed

Authors can drop a self-contained interactive HTML data-viz into a post body (Sanity `post.body` gets an `htmlEmbed` block: `code` + optional `caption`/`height`).
- Rendered by the `htmlEmbed` serializer (`src/sanity/portableText.ts`) into an `<iframe srcdoc>` with `sandbox="allow-scripts allow-popups"` - the embed's JS runs but is isolated from the page (no same-origin), safe for arbitrary HTML.
- Frame styling: `border-2 border-ink`, `rounded-2xl` (1rem), white background, full width.
- A height-reporter script is injected into each embed; `EmbedResizer` (client, mounted on the post page) listens for its `postMessage` and sizes the iframe to fit - no cropping/scroll.
- Embeds must be self-contained (inline `<style>`/`<script>`); the sandbox has no page access.

## Canvas myth interaction

- The `+ myth` toolbar button appends a sticky-note card. On desktop it floats at a free spot on the canvas; on mobile it flows into the "Bust these myths" section above the footer.
- **Mobile feedback rule:** because the toolbar is fixed at the bottom and the myth section is usually off-screen, adding a myth on mobile smooth-scrolls the new card into view (`block: center`, respects `prefers-reduced-motion`). Without this the tap reads as a no-op. Guarded so route-change seeding never auto-scrolls.
- **Content-aware placement (THEEQ-43):** desktop cards re-place whenever `main` mutates or resizes (async loads, same-route view switches), not just on route change. Dragged cards stay put and count as obstacles. Cards never layer over content or each other; when the page has no free spot, the extras hide (`hidden` flag) until room opens. There is no overflow stack fallback.

## Surface Quest capture surface (/play)

- **Logo (THEEQ-59)**: the camera-aperture mark with the leaping figure (ink outline,
  violet iris, coral swoosh, sun spark). Masters in `Solutions/` (`Surface - Logo*.svg/png`,
  transparent / white bg / black bg). Deployed: `src/app/play/icon.svg` + `apple-icon.png`
  (route-scoped favicon, Next convention), `/play/logo.png` (landing header, 80px beside
  the title), `/play/og.png` (OG image from the Lensy-out-of-the-phone hero), and the five
  PWA icons in `surface-quest-ar/web/public/icons/`. Use the transparent variant on paper
  tones, the white-bg variant wherever the surface is opaque or maskable.

The browser game's shooting UI (THEEQ-42). Three views in `src/app/play/PlayClient.tsx`;
the in-recording graphics live in `src/lib/play/draw.ts`.

- **Stage**: fixed fullscreen overlay `z-[70]` on `bg-ink` (site toolbar and Lensy launcher
  are `z-50`; anything on the capture stage must sit above them). Reel modal is `z-[80]`.
  `requestFullscreen` is progressive - declined/unsupported still gets the fixed overlay.
- **Card**: the 9:16 composite canvas as a floating `rounded-[28px]` card, Instagram idiom.
  Chrome rides its edges: close (`h-11 w-11` black/40 disc, top-left), counter pill
  ("n of m", black/40, top-right), timer pill (`#A9442F`, `font-mono`, canvas-bottom-16),
  shutter (72px white disc riding the bottom edge via `translate-y-1/2`; recording state
  is a 28px `#A9442F` rounded square), last-reel thumbnail (56px, `rounded-xl`,
  `border-white/60`, bottom-left on the shutter's line, opens reels).
- **Game switcher**: label strip below the card (`tracking-[0.2em]`, active white,
  inactive white/45), locked while recording. Scales to future games. Entries: MYTH
  BUSTER, SHAKE IT OFF, WALK A MILE.
- **Walk a Mile (THEEQ-48)**: side-scrolling track band (white with ink top edge) at
  canvas y=0.84H; the runner is Party Lensy riding the player's head bob (rolling
  baseline, lift-only, tips -12 degrees airborne). Hurdles are standing mini sticker
  cards: everyday ones in mint with note text, stereotype ones larger in peach
  (`#FAD9CE`) with myth-chip rust text. Hitting one is never a fail - it topples and
  fades, the flash celebrates, and the counter advances either way. Structure carries
  the message: your run (3 everyday hurdles), then Sam's run = the same track with
  stereotype hurdles added, finish copy "same track. double the hurdles." The corner
  reaction Lensy is suppressed in this game - the runner is the Lensy.
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
- **Danger red**: the timer pill and the record square use the literal light value of the [family danger red](../design.md#equal-lens-family-rule), `#A9442F`, not the `error` token, because `error` flips to `#FF8A6E` in adult mode and white text sits on the pill (5.91 on `#A9442F`; 3.7 on the old `#FA383E`).
- **Dark pinning**: the stage and modal backdrops use the literal `#221436`, never `bg-ink`
  - ink flips light in adult mode and a camera surface stays dark in both. Same rule for
  on-stage text (white, not `text-paper`). Both carry `.on-dark` so the focus ring is white.
