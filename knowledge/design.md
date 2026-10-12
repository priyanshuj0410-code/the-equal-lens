---
type: design-system
title: Design system reference
description: Visual language, component patterns, token usage and the Equal Lens family rule for The Equal Lens website. Feature specs live in specs/site-features.md.
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/fad4697c-b7e8-44f4-9976-1feb67c1a7b9
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/8556ff32-8b15-4eaa-bcd7-0a7bdb147c59
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/1cd87d2c-bfd2-4f5e-b34b-e7afa1247107
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/0bc71a77-fc5d-4725-ba22-cf1333f84670
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/85b1e374-6638-408e-a0fe-edd5dbba1f8d  # THEEQ-55
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/ef8e57fd-1d05-4d18-bb70-3df06aed59f0  # THEEQ-63
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/bef1ea95-31e5-4954-a27c-3ee9cb2166cc  # THEEQ-64 (decision)
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/13c4989f-5160-4de9-8202-66a2cf497cd2  # THEEQ-61 (P1 accessibility gaps, CLAUD-17)
  - https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/a2255819-9c27-4992-9440-1fd577afa1f0  # THEEQ-65 (wave 3: family rule, danger red, feature specs, voice rules)
---

> **Source of truth:** the installable package `@equal-lens/brand` at
> [`brand/design-system/`](../brand/design-system/) (`tokens.css`, `components.css`,
> React components). This doc summarises it - when they disagree, the package wins.
> Update this doc whenever the package changes.
>
> **Versions:** the package is versioned with semantic versioning and published to GitHub Packages as
> `@priyanshuj0410-code/equal-lens-brand` on a `brand-v<version>` tag ([THEEQ-55](https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/85b1e374-6638-408e-a0fe-edd5dbba1f8d));
> the changelog is [`brand/design-system/CHANGELOG.md`](../brand/design-system/CHANGELOG.md). Apps outside this
> repo, such as SwipeEd, install a pinned version from there; the site keeps the workspace link.

## Brand palette

**Equal Violet `#553286`** leads; neutrals carry; accents appear in small doses.
Surface/text tokens flip in dark ("adult") mode; the violet ramp and accents do not.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-brand` | `#553286` | `#C9B8E6` | Primary violet - accents, active states |
| `--color-brandsoft` | `#735997` | `#B3A4D6` | Muted violet - secondary text, labels (5.57 on paper, 4.53 on mist; dark 8.17 and 5.48) |
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
| `--color-grow` | `#FF7A5C` | Coral - "relearn" |
| `--color-sun` | `#FFC94D` | Yellow - CTA on dark bands |
| `--color-sky` | `#4FB0E8` | Blue - support / info |

**Accents are fills only.** They fail as text on paper (insight 1.78, grow 2.45, sky 2.31, sun 1.47) and
white on grow is 2.56. Rules: (1) never set an accent as a text colour; (2) text on an accent fill is
deep indigo `#221436` (`text-violet-900`, or the literal hex), never white, and never the flipping `ink`
(light ink on an accent is 1.61 to 2.21 in dark mode): insight 9.24, grow 6.71, sky 7.13, sun 11.23;
(3) accent as a status or emphasis cue uses a fill (a disc, a dot, a `border-b-4` or `border-l-4` bar) next to
`ink` text. Decorative doodles and strike-through lines (`aria-hidden`) may use accent colours.

**Error and danger** (site token in `src/app/globals.css`, not in the brand package): `--color-error` is the [family danger red](#danger-red): `#A9442F` on light grounds and `#FF8A6E` in the dark theme, so it clears 4.5:1 as text on every site surface (light 5.65 paper, 5.91 surface, 4.59 mist; dark 8.09, 7.24, 5.43). The site pattern is unchanged: the message is `ink` text beside an error bar or border, so colour is never the only cue (see Accessibility). A fill in the light value carries white text (5.91); a fill in the dark value carries `#221436` text (7.46).

**Violet ramp:** `--color-violet-50 #F3F0F6 · 100 #E5E0ED · 200 #C5B6DE · 400 #7F65A4 · 600 #553286 (brand) · 700 #44288B · 800 #331E50 · 900 #221436 (Deep Indigo)`.

**Dark theme:** put `data-audience="adult"` on a parent (usually `<html>`); default is light ("kid"). Only `paper, surface, mist, ink, brand, brandsoft, error, band, dot` flip.

**Dotted paper:** the body carries `.canvas-dots` (radial `--dot` grid, 28px, over `bg-paper`), so the texture is the site-wide ground in both audiences. A page section that wants plain paper paints its own background; /play deliberately stays transparent.

## Typography

Three families (loaded via the package `fonts.css`):
- `--font-display` **Poppins** - wordmark, UI labels
- `--font-body` **Nunito Sans** - body paragraphs, descriptions
- `--font-hand` **Baloo 2** - headlines + playful / mascot voice
- Eyebrow: `.eyebrow` utility - uppercase, `brandsoft`, letter-spaced
- Sizes, leading, weights and the 12px floor: see Scales below.
- Latin only today: `layout.tsx` loads the `latin` subset of all three families, and the site has no Hindi copy, so nothing falls back to the system font. When Hindi copy is added, the [family rule](#devanagari-pairings) applies: add the `devanagari` subset of Baloo 2 and Poppins, which carry the glyphs, and Mukta for body text (the canon pairing with Baloo 2), since Nunito Sans has none. Load them with `unicode-range` so Latin pages do not pay for them.
- Baloo 2 headlines (`font-hand`) are the site's playful voice for children. The canon skill reserves Baloo 2 for Lensy and says never a headline, so the site departs from it: see Open decisions.

## Scales: type, space, radius (THEEQ-63)

Sizes are Tailwind's rem scale, so they follow the reader's browser text size and reflow at 200% zoom. Every type size is `font-body` unless the table names a face.

| Role | Classes | Size / leading | Face and weight |
|---|---|---|---|
| Hero h1 (home only) | `text-4xl sm:text-6xl leading-[1.05]` | 36/40 then 60/60 | `font-hand` 800. The Discovery deck hero is `font-display` 800 on the dark band and goes to `lg:text-7xl` (72/72) |
| Page h1 | `text-4xl sm:text-5xl` | 36/40 then 48/48 | `font-hand` 800 |
| Section h2 | `text-4xl` (`text-3xl` or `text-2xl` for a sub-section) | 36/40, 30/36, 24/32 | `font-hand` 800 |
| Card h3 | `text-2xl` or `text-xl` (dense cards: `font-display text-lg` or `text-base`) | 24/32, 20/28, 18/28, 16/24 | `font-hand` 700, or `font-display` 700 |
| Lead paragraph | `text-lg text-ink/70` | 18/28 | 400 |
| Body | `text-base` (the default) | 16/24, `leading-relaxed` (1.625) for long reads | 400 |
| Secondary | `text-sm text-ink/70` | 14/20 | 400 |
| Caption, date, chip, field error | `text-xs` | 12/16 | 400 body face, 700 labels |
| Eyebrow | `.eyebrow` | 14px, uppercase, 0.1em tracking | `font-hand` 700, `brandsoft` |

- **Floor: 12px.** Paragraph text is 14px or more; 12px is for captions, dates, chips, calendar labels and field errors. Nothing is set below 12px except the myth and truth chip on a note (11px, in `SiteCanvas` and the package `.note__chip`).
- Uppercase and `tracking-widest` are for labels only, and only at 12px or more. Strings are typed in sentence case; capitals come from CSS.
- Line length: body copy sits in `max-w-xl` to `max-w-3xl` (36 to 48rem, about 60 to 75 characters).
- Weights: Baloo 2 loads 500 to 800 (800 for h1 and h2, 700 for h3 and UI labels); Nunito Sans loads 400, 600 and 700, so `font-medium` renders as 400.

**Space** is Tailwind's 4px scale; use these steps and no others for layout.

| Use | Step |
|---|---|
| Page gutter | `px-5` (20px) |
| Section rhythm | `py-16` (64px); `py-20` around a hero, `py-10` compact |
| Between cards | `gap-6` or `gap-8` |
| Inside a card, grid cells | `gap-3` or `gap-4`; card padding `p-5` or `p-6` (`.card` is 2rem) |
| Chip, dot and icon rows | `gap-2` |
| Control hit area | 44px (`h-11 w-11`) for anything new. Today the carousel arrows are 40px and the calendar month arrows 32px, over WCAG 2.5.8's 24px minimum |
| Page width | `max-w-5xl` (64rem); article text `max-w-3xl`; forms and lead text `max-w-xl`; the voucher and modal forms `max-w-sm` |

**Radius** says what a shape is.

| Radius | Class | Used for |
|---|---|---|
| Pill | `rounded-full` | buttons, tags, dots, chips, avatars |
| 24px | `rounded-3xl` | `.card`, `.popover`, the biggest panels |
| 16px | `rounded-2xl` | sticker cards, frames, embeds, the carousel, `.bubble` (with a 4px tail corner) |
| 12px | `rounded-xl` | tiles, thumbnails, `.note` |
| 8px | `rounded-lg` | form fields, the select menu, calendar days |

The /play stage card is the one custom value (`rounded-[28px]`, an Instagram card). Do not mix two radii on one edge.

## Voice

Curious, warm, brave; playful, not preachy. Sentence case. Decided 12 October 2026: this section, Reading level and Sensitive topics are the owner's accepted voice rules for the site and its docs.

- **Spelling is British** (colour, behaviour, organise, programme). Vocabulary is plain Indian English (see Reading level).
- **One dash rule: no em dash (U+2014) and no en dash (U+2013), anywhere.** This covers product copy, UI strings, these docs and commit messages. A range takes a hyphen (3-6, 2-4px, 18-35s); a date range with month names is written with "to". Elsewhere reword, or use a comma, colon, full stop or parentheses. `knowledge/contrast.py` fails on either character in the design docs and the site copy.
- One line summary lives in the package: `@equal-lens/brand` README "Voice".

### Reading level (THEEQ-63)

Adopted from SwipeEd's UX copy standard (`swipeed-equal-lens/knowledge/playbooks/ux-copy-standard.md`, word limits by age band), Spot the Stereotype's `knowledge/design-system/writing.md` (clear, crisp, concise; reading for second-language readers) and Even Ground's voice section (`knowledge/design.md` section 2, Year 8 target). The public site is read by children, parents, teachers, funders and volunteers, many for whom English is a second language.

| Page or audience | Reading level | Words a sentence, at most |
|---|---|---|
| Kid mode, ages 9-12 | Everything explained in the same line; no idiom | 14 |
| Kid mode, ages 12-18 | About Grade 6 | 20 |
| Adult mode: parents, teachers, partners, funders, volunteers | About Year 8, plain English | 25 |

- One idea a sentence, the point first, the reason after. Everyday, literal Indian English: "lakh" and "crore" for big figures, no British or American product words and no idiom.
- Buttons are a verb and its object, one to three words, naming the result ("Join as a volunteer"), never "Click here" or "Learn more".
- One word for one thing, on every page. Numbers are digits. No `&`, `+`, `/` or `·` in running text. Strings are typed in sentence case; capitals come from CSS.
- Errors say what happened and what to do, in one sentence, with no blame and no "oops", "invalid" or "wrong".
- Read a line aloud. If it needs a breath in the middle, split it.

### Sensitive topics (THEEQ-63)

The site is the public face of an organisation whose subjects include gender-based violence, abuse, consent and body safety, and part of its audience is under 18. These rules come from SwipeEd's safety rules, the "heavy" register in Spot the Stereotype's tone table, Even Ground's refusal list and the house `child-safe-content` rules. They apply to every page, blog post, social post and form, and they outrank every other voice rule.

1. **Facts, never invitations.** Give facts, stories and figures. Never ask a reader about their own life ("Has this happened to you?"). Put scenarios on a character. Ask where a feeling is, never why.
2. **Harm belongs to whoever caused it.** Never imply a person could have prevented it. Freezing, going along or staying silent is never the wrong answer. Wherever a harm scenario appears, say it is never the person's fault.
3. **Words that carry no shame.** "Safe touch" and "unsafe touch", never "good touch" or "bad touch". Feelings are "hard" or "uh-oh", never "bad". Say anatomical words plainly.
4. **The heavy register is plain, slow and warm.** No joke, pun, emoji, exclamation mark or playful line in or beside content about violence, abuse or body safety. Lensy wonders and asks; Lensy is never the authority, a counsellor or a lecturer. The Tone by moment table in Spot the Stereotype's `writing.md` is the model.
5. **No verdicts.** Never "wrong", "incorrect", "fail" or "oops". Replace a myth with the truth, never just negate it. Praise the action, never the person.
6. **Never promise privacy without its limit.** "Private unless someone is being hurt." Never promise confidentiality the organisation cannot keep.
7. **Refer, do not treat.** No medical, legal or clinical advice, and no claim of treatment, counselling or cure. Name where to go.
8. **Helplines are exact.** A helpline line uses only a number from `child-safe-content` `references/helplines.md`, re-verified by web search before publishing, says who the line is for and when to call, and has one number a sentence. Childline 1098 is for under-18s only; say so. No page may name a help control that is not visible at every width.
9. **Claim only what is true.** No statistic, law or organisation unless it is grounded and attributed on the page.
10. **No identifiable child.** No photograph, name, school or quote that could identify a child.

Decided 12 October 2026: the owner accepted these ten rules. Where they apply today: the site shows no helpline, so rule 8 applies the day one is added; Gallery photos live in Sanity, so rule 10 applies to every photo published there.

## Sticker / card pattern

All interactive cards use the "sticker" treatment:
- `border-2 border-ink`
- `box-shadow: 4px 4px 0 var(--color-ink)` (`.sticker` or `shadow-[4px_4px_0_var(--color-ink)]`)
- Slight rotation (`rotate-[-2deg]` to `rotate-[2deg]`) for hand-placed feel
- `hover-pop`: lifts card on hover via `translateY(-3px)` + shadow increase

## Lensy bubble

`.bubble` class (from `brand/design-system/components.css`; 12px text, so every colour on it must reach 4.5:1 on `mist`):
- `border-radius: 1rem; border-bottom-left-radius: 0.25rem` - flat bottom-left corner = chat tail
- `background: var(--color-mist)`
- `padding: 0.5rem 0.75rem; font-size: 0.75rem`
- No border, no shadow - intentionally soft/lightweight vs card stickers

## Autoplay control

Every auto-advancing carousel (the Gallery and the Blog carousel, specified in [site-features](specs/site-features.md)) uses the shared `useAutoplay` hook (`src/components/Autoplay.tsx`) and the `AutoplayToggle` button.
- Three things stop it: the visible pause button (stays stopped until pressed again, WCAG 2.2.2), a hold while the pointer, touch or focus is inside the carousel (lifts on leave), and `prefers-reduced-motion` (never starts, no button).
- **Pause button** (`AutoplayToggle`): 44px round sticker (`h-11 w-11 border-2 border-ink bg-surface shadow-[2px_2px_0_var(--color-ink)]`), first in the dots row. Pause bars while playing, play triangle when stopped; label "Pause slide show" / "Play slide show". Pressing Play resumes at once, even with the pointer or focus on the carousel.
- Checked against real products (Lazyweb, 2026-10-12): the Canva design studio (a play button beside a thumbnail strip) and the Airbnb photo viewer (play and pause in a control bar next to a "1 / 19" counter). Lazyweb holds few carousel-pause screens, so the pattern also follows the WAI-ARIA Authoring Practices carousel (a rotation control, rotation held while focus is inside).

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

## States (THEEQ-63)

What each interactive component does in each state today. A dash means the state is not styled, on purpose.
Hover and press motion turns off under `prefers-reduced-motion` (`transition: none !important`).

| Component | Hover | Focus | Selected or pressed | Disabled | Loading | Error | Empty |
|---|---|---|---|---|---|---|---|
| Button `.btn` | Lifts `translateY(-2px)`. `--solid` darkens to `violet-800`, `--ghost` text goes to `brand`; neither lifts | Ring (below) | - | `opacity: .4`, `cursor: not-allowed`, no lift | Label changes ("Submitting...", "Checking...") and the button is `disabled`; no spinner | - | - |
| Field (input, textarea, `BrandSelect`) | - | `border-violet-400` plus the ring | - | Not used | - | `border-error` and a message (below) | Placeholder at `ink` 70% |
| Sticker card (`hover-pop`) | `translateY(-4px) rotate(-1.5deg) scale(1.03)` | Ring on the card or its link | - | - | - | - | - |
| Nav link `.nav-link` | `mist` fill, `brand` text | Ring | `aria-current`: `violet-100` fill, `violet-800` text | - | - | - | - |
| Tab `.tab` | Ink border, lifts 2px | Ring | `.is-active` (BiasChannels also sets `aria-pressed`): ink border, 3px ink shadow, lifts 2px, tint from the channel | - | - | - | - |
| Toolbar button | Lifts 2px, `mist` border | Ring | `aria-pressed`: `sun` fill, ink border, `#221436` text | - | - | - | - |
| Carousel arrow, dot, pause | Arrows scale 1.1; blog arrows show on hover, focus-within or touch | Ring; blog arrows become visible | Current dot is `w-6 bg-brand`, `aria-current`; pause button swaps its glyph | Calendar month arrows only (`disabled:opacity-40`) | - | - | No slides: nothing renders |
| Calendar day (volunteer form) | `brand` at 15% fill | Ring | `bg-brand text-surface`, `aria-pressed` | Closed day: `aria-disabled`, `ink` 25%, struck through | - | Message under the grid | - |
| Donate submit | - | Ring | - | Always `disabled` until Razorpay is wired | - | - | - |

- **Focus** is one global rule (see Accessibility). No component removes it; `outline-none` is not used.
- **Pressed** has no style beyond what the table shows: there is no `:active` rule. The hover lift is the only motion cue.
- **Disabled** controls are exempt from the contrast rule, so `opacity` is fine, but nothing a reader needs may sit in a disabled control: say why in text beside it.
- **Error**: the field swaps `border-mist` for `border-error`; the message sits below it as `ink` text (`text-xs`) with a `border-l-4 border-error pl-2` bar. A form-level message is the same at `text-sm`. The message says what to do, in the Voice register, never "invalid" or "wrong". Known gap: field errors are not linked to their field (`aria-describedby`) and are not announced (`role="alert"`); only `BrandSelect` sets `aria-invalid`.
- **Loading**: forms and the /play camera are the only things that load. Content pages are static, read from `knowledge/` at build time, so there are no skeletons.
- **Empty**: the blog list shows `emptyState` centred in `ink` 70%; no testimonials means no Gallery section; a photo-only Gallery item renders no bubble; a carousel with no images renders nothing. An empty state says what is missing and what happens next.

## Accessibility (THEEQ-61, CLAUD-17)

Targets: text 4.5:1 on every surface it sits on; control boundaries and focus indicators 3:1 against adjacent colours.
Ratios below are computed in sRGB with any alpha composited over its real ground. Run `python3 knowledge/contrast.py` after changing any colour: it checks every token pair below on paper, surface and mist in both themes, and the dash rule (no U+2013 or U+2014 in the design docs and site copy), and exits 1 on a failure. The `design-checks` workflow runs it on every pull request.

**Secondary text.** Use `brandsoft` (4.53 on mist, 5.57 on paper, 5.83 on surface; dark 5.48 to 8.17) or
`ink` at 70% (light 6.29 on paper, 6.42 on surface, 5.68 on mist; dark 8.23, 7.65, 6.17). Never `ink` at
50% or below (light 3.31). `ink` at 60% clears 4.5 only on paper and surface (4.51, 4.58), not on `mist` (4.19), so use 70%: the site has no `text-ink/60` or `text-ink/65` left (THEEQ-63). Stronger text uses 80% or `ink`.
On a band, `white` at 70% (5.61 on the light band, 8.56 on the dark band); 50% fails (3.67).
On a literal-white ground (polaroid strip) use `violet-900` at 70%, because `ink` flips light in dark mode.
Placeholder text is `ink` at 70% too, set once by the global `::placeholder` rule in `globals.css`; Tailwind's default (50% of the text colour) is 3.35 on white.

**Accents** are fills only (see Brand palette). Patterns in use:
- Stat number (home): `text-ink` with a `border-b-4` bar in the accent (`border-grow`, `border-sky`, `border-insight`).
- Form and status errors: `text-ink` with a `border-l-4 border-error pl-2` bar; the message text carries the meaning.
- Invalid field: the border swaps from `border-mist` to `border-error` (`FacilitatorForm`, `BrandSelect`). The two classes are alternatives, never both: `border-mist` wins the cascade and hid the error border on every text input before THEEQ-63. The focus colour (`border-violet-400` plus the ring) still wins while the field has focus.
- List markers (careers, programs): a `bg-insight` disc with a `text-violet-900` check, or a `bg-grow` dot.
- Check icon inside a proof chip: `text-brand`.

**Focus ring.** `components.css` (package 0.1.1) sets `:focus-visible { outline: 2px solid var(--focus-ring, var(--color-brand)); outline-offset: 2px }`.

| Ground | Ring | Ratio |
|---|---|---|
| paper / surface / mist (light) | `brand` `#553286` | 9.19 / 9.60 / 7.47 |
| paper / surface / mist (dark) | `brand` `#C9B8E6` | 10.20 / 9.12 / 6.84 |
| `bg-band` light `#553286` | white | 9.60 |
| `bg-band` dark `#241B38` | white | 16.29 |
| pinned dark stage `#221436` (`.on-dark`) | white | 17.19 |

Add `.bg-band` or `.on-dark` on any container whose ground does not flip (the /play stage and reel modal carry
`.on-dark`; a `.card` or `.popover` inside one resets the ring to violet). Do not add `outline-none` to interactive elements: the unlayered package rule outranks Tailwind's
`focus:outline-none`, so form fields show the ring plus the violet border.

**Pinned dark.** A surface that stays dark in both themes (the /play stage and reel modal) uses the literal `#221436` and white text, never `ink`, `paper` or `bg-ink`, which flip in the dark theme. Danger on such a surface uses the literal light value `#A9442F` with white text.

## Equal Lens family rule

Decided 12 October 2026 by the owner ([THEEQ-64](https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/bef1ea95-31e5-4954-a27c-3ee9cb2166cc)). It binds every Equal Lens product: this site, SwipeEd, Spot the Stereotype, The Keepers, Surface Quest AR, Nivel and Sexism in Movies. A fixed core keeps them one family. Everything else each product chooses and explains in its own `knowledge/design.md`.

### Fixed core

| Fixed | The rule |
|---|---|
| Equal Violet | `#553286` is the brand anchor. A product may add accents but does not swap in another violet. |
| Ink | `#221436` for text and borders on light grounds ([Brand palette](#brand-palette)). |
| Sentence case | Headings, buttons and labels are typed in sentence case; capitals come from CSS. |
| One dash rule | No em dash and no en dash. A range takes a hyphen (3-6). See [Voice](#voice). |
| Lensy's rules | Lensy asks and wonders. Lensy is never a teacher, superhero, activist, counsellor or voice of authority, and never in or beside heavy content ([Sensitive topics](#sensitive-topics-theeq-63), rule 4). Whether a product shows Lensy at all is its choice: Spot keeps Lensy silent and The Keepers has no cartoons. |
| Devanagari | A product with Hindi readers loads a Devanagari face, with `unicode-range` ([pairings](#devanagari-pairings)). |
| One danger red | `#A9442F` on light grounds, `#FF8A6E` on dark ([why](#danger-red)). |

### Chosen per product, with a written reason

Each product picks four things and writes the reason for each in its own `design.md`: its register, its ground and theme, its type pairing and its depth model. A choice with no written reason is a defect. The pairings in this table are the approved list; a product that wants another adds a row here, with the reason, in the same change.

| Product | Register | Ground | Latin type | Depth |
|---|---|---|---|---|
| The Equal Lens site | Sticker | Lavender paper `#FBF9FF`, adult dark | Poppins, Nunito Sans, Baloo 2 headlines | 2px ink border, hard 4px offset shadow, tilt |
| SwipeEd | Sticker | Brand paper, adult dark | Baloo 2 headings, Nunito, Poppins labels | 2.5px ink border, "lip" elevation |
| Spot the Stereotype | Reflective | Cream `#FAF2E4`, no dark | Gloock, Instrument Sans | 2px ink outline, hard 4px shadow |
| The Keepers | Ceremonial | Dark only | Cormorant Garamond, Inter | None |
| Surface Quest AR | Camera chrome | Dark only `#15101F` | Inter | Glass cells, pills |
| Nivel | Minimal | Warm paper, dark theme | Poppins, Nunito Sans | None |
| Sexism in Movies | Evidence essay | Lavender paper | Baloo 2 | 1px line borders, sparing shadow |

This is the position on 12 October 2026, taken from the design-systems audit; each product's own `design.md` is the authority for its choices.

**This site's reasons.**
- **Register: sticker.** The site is a canvas the visitor draws on (Unlearn erases a myth, Relearn writes the truth), so surfaces read as hand-placed paper objects: an ink border, a hard offset shadow and a slight tilt.
- **Ground: lavender paper, with a dark theme for adults.** Visitors choose Kids mode or Adult mode on arrival. Adult mode runs dark: the same brand on flipped surfaces, so one site serves children and adults without a second design.
- **Type: Poppins, Nunito Sans, Baloo 2.** Poppins is the display and UI face, Nunito Sans the body, Baloo 2 the playful voice (see Open decisions for headlines).
- **Depth: hard offset shadow.** The shadow is a hard offset, not a blur, so a card reads the same at any size and in both themes.

### Danger red

One red for error and destructive states: **`#A9442F`** on light grounds and **`#FF8A6E`** on dark grounds. Chosen from the reds the products already use, by computing each as text on the family's light grounds:

| Red | Where it is used | White | Paper | Mist | Spot cream | 4.5:1 on all four |
|---|---|---|---|---|---|---|
| `#A9442F` | Nivel `--bad`; now this site | 5.91 | 5.65 | 4.59 | 5.31 | Yes |
| `#C2553F` | Sexism in Movies coral | 4.50 | 4.31 | 3.50 | 4.05 | No |
| `#E64520` | This site, until 12 October 2026 | 4.01 | 3.84 | 3.12 | 3.61 | No |
| `#FA383E` | `/play`, until 12 October 2026 | 3.68 | 3.53 | 2.86 | 3.31 | No |
| `#FF453A` | Surface Quest AR | 3.41 | 3.26 | 2.65 | 3.06 | No |
| `#B56B72` | The Keepers `--danger` | 3.95 | 3.78 | 3.07 | 3.56 | No |

- **Why this one.** It is the only red in use that carries a short error line as text, not only a border, on every light ground. The true reds (`#FA383E`, `#FF453A`, hue near 0 degrees) fail as text, and darkening them until they pass turns them maroon. `#A9442F` keeps the hue (about 10 degrees) of this site's old `#E64520` and Sexism in Movies' `#C2553F`, only darker.
- **Why it flips.** No one red reaches 4.5:1 on both white and a dark ground: it would need a luminance of at most 0.18 against white and at least 0.20 against `#15101F`. So the red flips with the theme, as `brand` does. `#FF8A6E` (Nivel's dark `--bad`) gives 8.09 on `#15101F`, 7.24 on `#221A30` and 5.43 on `#3A2E4D`. A dark-only product uses `#FF8A6E` alone.
- **How to use it.** Red marks an error or a destructive action, and always sits beside text or an icon, never alone. A fill in the light value carries white text (5.91); a fill in the dark value carries `#221436` text (7.46). `knowledge/contrast.py` checks each pair.

### Devanagari pairings

| Product | Latin faces | Devanagari display | Devanagari UI and body | Devanagari labels |
|---|---|---|---|---|
| Spot the Stereotype | Gloock, Instrument Sans | Rozha One (with Gloock) | Hind 400, 500, 700 | |
| The Keepers | Cormorant Garamond, Inter, Plex Mono labels | Halant 600 (with Cormorant) | Hind 400, 600 (with Inter) | IBM Plex Sans Devanagari (with Plex Mono) |
| Surface Quest AR | Inter | | Hind, after a one-screen Unity shaping spike | |
| Sexism in Movies | Baloo 2 | Mukta (canon pairing with Baloo 2) | Mukta | |
| This site (no Hindi copy yet) | Poppins, Nunito Sans, Baloo 2 | Baloo 2 and Poppins, which carry the glyphs | Mukta | |

- Load every Devanagari face with `unicode-range` (the Devanagari block, U+0900 to U+097F), so a Latin-only page downloads nothing extra.
- Test each stack with conjuncts and top marks (for example क्ष, ज्ञ and द्वारा) before shipping: a line box that suits Latin clips them.
- Surface Quest AR renders text in Unity. Prove Hind there on one screen with conjuncts and vowel signs before committing to it.

### Not in the family

- **RUMOAR** is not a family product. It has its own brand (volt `#6152F0`) and takes its own design decisions.
- **PhD** is not a family product. It follows the owner's portfolio system (IMPJ: Gloock with Instrument Sans, monochrome, scholar accent `#FFC46A`), not the family violet.

## Feature specs

The Gallery, the blog carousel and embed, the myth canvas and the /play capture surface are specified in [`specs/site-features.md`](specs/site-features.md). They use the tokens, scales and patterns in this doc and do not define them.

## Open decisions

- **Baloo 2 headlines on this site.** The site sets headlines in Baloo 2 (`font-hand`) for the children's register. The canon skill reserves Baloo 2 for Lensy and says never a headline. The owner has ruled on SwipeEd's Baloo 2 headings, not on this site's, so the site stays as built until the owner decides.

## Component library

`@equal-lens/brand` package at `brand/design-system/`. Exports: `Button`, `Card`, `Note`, `Segmented`, `NavLink`, `Tabs`, `Toolbar`, `ShipDock`, `Popover`, `Bubble`.
