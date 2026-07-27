---
type: playbook
title: Blog interactive HTML embed - authoring guidelines
description: How to author self-contained interactive HTML data visualisations for the blog embed block (sandbox rules, responsive/self-contained constraints, brand palette, starter template, checklist).
plane_issues:
  - https://app.plane.so/the-equal-lens/  # THEEQ-34
---

# Blog interactive HTML embed - authoring guidelines

How to build an interactive data visualisation for a blog post using the
**Body → Interactive embed** block in Sanity.

## How it works

- In a post's **Body**, add an **Interactive embed** block. Fields: **HTML / code**,
  **Caption** (optional), **Initial height** (optional, px, default 480).
- Your code runs inside a **sandboxed `<iframe srcdoc>`** with
  `sandbox="allow-scripts allow-popups"`. It is a separate, isolated document.
- The frame **auto-resizes** to your content's height - a height reporter is injected
  automatically, so you do not add one.
- The frame is **full width**, white background, ink border, rounded corners.

## Must (hard constraints)

1. **Self-contained.** Everything in one snippet: markup + inline `<style>` + inline
   `<script>`. No build step, no importing project files/components.
2. **No storage or cookies.** `localStorage`, `sessionStorage` and `document.cookie`
   throw inside the sandbox. Keep all state in JS variables (in memory).
3. **No access to the page.** The embed cannot read or change the blog page, its
   cookies, or scroll/navigate the top window. This isolation is the security
   guarantee - design as if the embed is a standalone mini-page.
4. **Responsive, mobile-first.** The frame is 100% wide and can be as narrow as
   ~320px on phones. Use `%`/`rem`/`vw` and `max-width:100%`; never a fixed pixel
   width wider than the frame. Test at 320px and at desktop.
5. **Don't hard-set a tall body height.** Let content flow so the auto-resize can
   measure it. Set **Initial height** to roughly your expected height so there is no
   jump on load.

## Should (quality)

- **Hardcode brand colours.** The site's CSS variables and fonts are **not** available
  inside the frame. Use the hex values below and a system font stack (or load your own
  web font inside the embed).
- **Embed data inline** (a JSON object in your script) rather than fetching it - it
  always works, with no network or CORS risk.
- **External libraries** (D3, Chart.js from a CDN) do load over the network, but pin a
  version and know they can be slow or blocked. Prefer plain SVG/canvas for simple charts.
- **Accessibility.** Readable contrast, `alt`/`aria-label` on meaningful elements,
  keyboard-operable controls, and honour `prefers-reduced-motion` for animation.
- **One clear message per viz.** A direct title, labels on the data (not only a
  legend), and a small colour set.
- **Dark mode (optional).** The frame background is white; if you want it to adapt,
  handle `@media (prefers-color-scheme: dark)` yourself.

## Brand palette (hardcode these)

| Role | Hex |
|---|---|
| Ink (text, borders) | `#221436` |
| Brand violet | `#553286` |
| Soft violet (muted text) | `#7F65A4` |
| Deep violet (headings) | `#44288B` |
| Paper (soft bg) | `#FBF9FF` |
| Mist (fills, tracks) | `#E7E0F1` |
| Sun (highlight / act) | `#FFC94D` |
| Coral | `#FF7A5C` |
| Sky | `#4FB0E8` |
| Teal | `#2DD4BF` |

Font stack: `font-family: 'Poppins', system-ui, -apple-system, sans-serif;` (Poppins
only renders if you load it inside the embed; otherwise it falls back to system-ui).

## Starter template (dependency-free, responsive, animated)

```html
<style>
  :root { --ink:#221436; --brand:#553286; --soft:#7F65A4; --sun:#FFC94D; --mist:#E7E0F1; }
  body { margin:0; padding:20px; font-family:system-ui,-apple-system,sans-serif; color:var(--ink); background:#fff; }
  h3 { margin:0 0 4px; font-size:18px; }
  p.sub { margin:0 0 16px; color:var(--soft); font-size:13px; }
  .row { display:flex; align-items:center; gap:10px; margin:8px 0; }
  .label { width:64px; font-size:13px; }
  .track { flex:1; background:var(--mist); border-radius:6px; overflow:hidden; }
  .bar { height:22px; background:var(--brand); width:0; transition:width .8s ease, background .2s; }
  .val { width:36px; text-align:right; font-size:13px; font-weight:700; }
  @media (prefers-reduced-motion: reduce) { .bar { transition:none; } }
</style>
<h3>Example chart</h3>
<p class="sub">Illustrative - hover a bar</p>
<div id="chart" role="img" aria-label="Example bar chart"></div>
<script>
  var data = [{k:'2019',v:70},{k:'2020',v:82},{k:'2021',v:88},{k:'2022',v:95}];
  var max = Math.max.apply(null, data.map(function(d){ return d.v; }));
  var c = document.getElementById('chart');
  data.forEach(function(d){
    var row = document.createElement('div'); row.className = 'row';
    row.innerHTML = '<span class="label">'+d.k+'</span>'
      + '<span class="track"><span class="bar"></span></span>'
      + '<span class="val">'+d.v+'</span>';
    c.appendChild(row);
    var bar = row.querySelector('.bar');
    requestAnimationFrame(function(){ bar.style.width = (d.v/max*100)+'%'; });
    row.addEventListener('mouseenter', function(){ bar.style.background = '#FFC94D'; });
    row.addEventListener('mouseleave', function(){ bar.style.background = '#553286'; });
  });
</script>
```

## Before publishing - checklist

- [ ] Renders at 320px wide **and** on desktop
- [ ] No console errors (no `localStorage`/`sessionStorage`/`cookie` use)
- [ ] Data is inline (or the CDN dependency is pinned and acceptable)
- [ ] Contrast and labels are readable; interactions work with a keyboard
- [ ] **Initial height** set close to the real height
- [ ] Caption added
- [ ] Brand colours hardcoded (no reliance on site CSS variables/fonts)
