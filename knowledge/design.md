---
type: reference
title: Design system reference
description: Visual language, component patterns, and token usage for The Equal Lens website.
---

## Brand tokens

| Token | Value | Usage |
|---|---|---|
| `--color-ink` | `#221436` | Primary text, borders, shadows |
| `--color-surface` | `#F4F1FA` | Page background, card fills |
| `--color-mist` | `#E7E0F1` | Lensy chat bubbles, subtle fills |
| `--color-brand` | `#7C3AED` | Accent, highlights, active states |
| `--color-brandsoft` | `#A78BCC` | Secondary text, muted labels |
| `--color-sun` | `#F59E0B` | CTA buttons on dark bands |
| `--color-band` | `#4C1D95` | Dark CTA section background |
| `--color-grow` | `#10B981` | Stats, positive indicators |
| `--color-sky` | `#3B82F6` | Stats, informational |
| `--color-insight` | `#8B5CF6` | Doodles, decorative accents |

## Typography

- **Font hand** (`font-hand`): Fredoka One / handwritten — all headings, labels, UI copy
- **Font body**: system sans — body paragraphs, descriptions
- Heading scale: `text-4xl` (h2 sections), `text-5xl–6xl` (hero h1)
- Eyebrow: `.eyebrow` utility — small caps, `text-brand`, letter-spaced

## Sticker / card pattern

All interactive cards use the "sticker" treatment:
- `border-2 border-ink`
- `box-shadow: 4px 4px 0 var(--color-ink)` (`.sticker` or `shadow-[4px_4px_0_var(--color-ink)]`)
- Slight rotation (`rotate-[-2deg]` to `rotate-[2deg]`) for hand-placed feel
- `hover-pop`: lifts card on hover via `translateY(-3px)` + shadow increase

## Lensy bubble

`.bubble` class (from `brand/design-system/components.css`):
- `border-radius: 1rem; border-bottom-left-radius: 0.25rem` — flat bottom-left corner = chat tail
- `background: var(--color-mist)`
- `padding: 0.5rem 0.75rem; font-size: 0.75rem`
- No border, no shadow — intentionally soft/lightweight vs card stickers

## Gallery (testimonial carousel)

Section heading is **"Gallery"** (was "Testimonials"). Backed by Testimonial documents; the Sanity object/field key stays `testimonials`.

- Polaroid card: `border-2 border-ink bg-white shadow-[5px_5px_0_var(--color-ink)]`, `aspect-[4/3]` photo, white strip at bottom
- Chat bubble: Lensy `.bubble` style, overlaps top-right corner of polaroid (`bottom: calc(100% - 32px)`)
- Bubble contains: sender name (top, `text-xs text-brand`), quote (`text-sm font-bold`), role (`text-xs text-brandsoft`)
- **Name and quote are optional.** Each bubble line renders only if present; a photo-only item (no name/quote/role) renders **no bubble at all** — just the polaroid. Slide top-padding (`pt-48`) stays uniform so carousel height never jumps.
- Polaroid strip: centered `tag` caption (`text-xs italic text-ink/40`)
- Parallax: bubble `translateX(dist * 5px)`, polaroid `translateX(dist * -4px) rotate(tilt)`
- Animation: `550ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` on track + inner elements

## Canvas myth interaction

- The `+ myth` toolbar button appends a sticky-note card. On desktop it floats at a free spot on the canvas; on mobile it flows into the "Bust these myths" section above the footer.
- **Mobile feedback rule:** because the toolbar is fixed at the bottom and the myth section is usually off-screen, adding a myth on mobile smooth-scrolls the new card into view (`block: center`, respects `prefers-reduced-motion`). Without this the tap reads as a no-op. Guarded so route-change seeding never auto-scrolls.

## Button variants

| Class | Usage |
|---|---|
| `.btn--primary` | Main CTAs — brand fill, ink shadow |
| `.btn--sun` | CTAs on dark band — yellow |
| `.btn--outline` | Secondary CTAs — transparent + border |
| `.btn--band` | Ghost on dark background |
| `.btn--solid` | Flat, no shadow |

## Blog carousel

Optional image carousel on a blog post, rendered between the `<h1>` heading and the body (`src/components/BlogCarousel.tsx`).
- Framed sticker container: `rounded-2xl border-2 border-ink bg-mist shadow-[4px_4px_0_var(--color-ink)]`, `aspect-[3/2]` image.
- Crossfade between slides (stacked, opacity), round ink nav arrows (`border-2 border-ink bg-surface shadow-[2px_2px_0]`), pill dots (active = `w-6 bg-brand`).
- Autoplays every 6s, pauses on hover/focus, respects `prefers-reduced-motion`.
- Optional per-image `caption` shown centered below; optional `alt`.
- Data: Sanity `post.carousel` (image array with `alt`/`caption`) → resolved to `BlogSlide[]` (`{ url, alt?, caption? }`) in `getPost`.

## Blog interactive embed

Authors can drop a self-contained interactive HTML data-viz into a post body (Sanity `post.body` gets an `htmlEmbed` block: `code` + optional `caption`/`height`).
- Rendered by the `htmlEmbed` serializer (`src/sanity/portableText.ts`) into an `<iframe srcdoc>` with `sandbox="allow-scripts allow-popups"` — the embed's JS runs but is isolated from the page (no same-origin), safe for arbitrary HTML.
- Frame styling: `border-2 border-ink`, `rounded-2xl` (1rem), white background, full width.
- A height-reporter script is injected into each embed; `EmbedResizer` (client, mounted on the post page) listens for its `postMessage` and sizes the iframe to fit — no cropping/scroll.
- Embeds must be self-contained (inline `<style>`/`<script>`); the sandbox has no page access.

## Component library

`@equal-lens/brand` package at `brand/design-system/`. Exports: `Button`, `Card`, `Note`, `Segmented`, `NavLink`, `Tabs`, `Toolbar`, `ShipDock`, `Popover`, `Bubble`.
