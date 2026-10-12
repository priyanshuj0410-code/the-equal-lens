#!/usr/bin/env python3
"""WCAG 2.x contrast check for The Equal Lens site tokens.

Run: python3 knowledge/contrast.py
Exit code 1 if any pair under a target fails. Targets: text 4.5, graphics (control
boundaries, focus ring, meaningful icons) 3.0. Alpha is composited over the real
ground before the ratio is taken, as the browser paints it.

Keep the values in step with brand/design-system/tokens.css and src/app/globals.css.
Modelled on the AI Crew contrast script.
"""
import sys
from pathlib import Path

def hx(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def lum(rgb):
    r, g, b = rgb
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

def ratio(fg, bg, alpha=1.0):
    f, b = hx(fg), hx(bg)
    f = tuple(alpha * x + (1 - alpha) * y for x, y in zip(f, b))
    hi, lo = sorted((lum(f), lum(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)

LIGHT = {
    "paper": "#FBF9FF", "surface": "#FFFFFF", "mist": "#E7E0F1",
    "ink": "#221436", "brand": "#553286", "brandsoft": "#735997", "band": "#553286",
    "error": "#A9442F",
}
DARK = {
    "paper": "#15101F", "surface": "#221A30", "mist": "#3A2E4D",
    "ink": "#F1ECFA", "brand": "#C9B8E6", "brandsoft": "#B3A4D6", "band": "#241B38",
    "error": "#FF8A6E",
}
# do not flip with the theme
FIXED = {
    "violet-100": "#E5E0ED", "violet-600": "#553286", "violet-800": "#331E50", "violet-900": "#221436",
    "deep-ink": "#221436", "white": "#FFFFFF",
    "insight": "#2DD4BF", "grow": "#FF7A5C", "sun": "#FFC94D", "sky": "#4FB0E8",
    "myth-rust": "#993C1D", "truth-green": "#0F6E56",
    "spot-cream": "#FAF2E4", "play-red": "#A9442F",
}

fails = []

def check(label, fg, bg, target, alpha=1.0):
    r = ratio(fg, bg, alpha)
    ok = r >= target
    print(f"{'PASS' if ok else 'FAIL'}  {r:5.2f}  (>= {target})  {label}")
    if not ok:
        fails.append(label)

def themed(name, T):
    print(f"\n=== {name} ===")
    for s in ("paper", "surface", "mist"):
        check(f"ink on {s}", T["ink"], T[s], 4.5)
        check(f"ink 80% on {s} (labels)", T["ink"], T[s], 4.5, 0.8)
        check(f"ink 70% on {s} (secondary text)", T["ink"], T[s], 4.5, 0.7)
        check(f"brand on {s} (accent text, links)", T["brand"], T[s], 4.5)
        check(f"brandsoft on {s} (labels, 12px bubble text)", T["brandsoft"], T[s], 4.5)
        check(f"focus ring brand on {s}", T["brand"], T[s], 3.0)
        check(f"ink border on {s}", T["ink"], T[s], 3.0)
        check(f"danger red as text and invalid border on {s}", T["error"], T[s], 4.5)
        check(f"chevron ink 50% on {s} (icon)", T["ink"], T[s], 3.0, 0.5)
    check("white on band", FIXED["white"], T["band"], 4.5)
    check("white 70% on band (secondary)", FIXED["white"], T["band"], 4.5, 0.7)
    check("focus ring white on band", FIXED["white"], T["band"], 3.0)
    check("white on violet-600 (btn--primary, btn--solid)", FIXED["white"], FIXED["violet-600"], 4.5)
    check("brand on surface (btn--outline)", T["brand"], T["surface"], 4.5)

def fixed():
    print("\n=== Fixed pairs (same in both themes) ===")
    for a in ("sun", "insight", "grow", "sky"):
        check(f"deep-ink on {a} (accent fills carry ink text)", FIXED["deep-ink"], FIXED[a], 4.5)
    check("myth-rust on white (note chip)", FIXED["myth-rust"], FIXED["white"], 4.5)
    check("truth-green on white (note chip)", FIXED["truth-green"], FIXED["white"], 4.5)
    check("violet-900 70% on white (polaroid caption)", FIXED["violet-900"], FIXED["white"], 4.5, 0.7)
    check("violet-800 on violet-100 (active tab, nav)", FIXED["violet-800"], FIXED["violet-100"], 4.5)
    check("pause button icon ink on surface (light)", LIGHT["ink"], LIGHT["surface"], 3.0)
    check("brandsoft dark on deep-ink (voucher email footer tagline)", DARK["brandsoft"], FIXED["deep-ink"], 4.5)
    print("\n=== Family danger red (light value is fixed; dark companion is for dark grounds) ===")
    check("danger red as text on white", LIGHT["error"], FIXED["white"], 4.5)
    check("danger red as text on Spot cream", LIGHT["error"], FIXED["spot-cream"], 4.5)
    check("white on danger red (/play timer pill, 14px bold)", FIXED["white"], FIXED["play-red"], 4.5)
    check("danger red on white (/play record square, graphic)", FIXED["play-red"], FIXED["white"], 3.0)
    check("deep-ink on dark danger fill", FIXED["deep-ink"], DARK["error"], 4.5)

def known_gaps():
    print("\n=== Known gaps, not yet fixed (reported, not counted) ===")
    for label, fg, bg, target in (
        ("default field border mist on surface (light), WCAG 1.4.11", LIGHT["mist"], LIGHT["surface"], 3.0),
        ("default field border mist on surface (dark)", DARK["mist"], DARK["surface"], 3.0),
    ):
        r = ratio(fg, bg)
        print(f"{'ok  ' if r >= target else 'GAP '}  {r:5.2f}  (>= {target})  {label}")

DASH_SCOPE = (
    "knowledge/design.md", "knowledge/specs", "knowledge/pages", "knowledge/programs", "knowledge/blog",
    "knowledge/myths", "knowledge/team", "knowledge/testimonials", "src", "voucher-email.html",
)

def dashes():
    print("\n=== Dash rule: no U+2013 or U+2014 in the design docs and site copy ===")
    root = Path(__file__).resolve().parent.parent
    found = 0
    for entry in DASH_SCOPE:
        p = root / entry
        for f in sorted([p] if p.is_file() else p.rglob("*")):
            if not f.is_file() or f.suffix not in (".md", ".json", ".ts", ".tsx", ".css", ".html"):
                continue
            for n, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
                if "\u2013" in line or "\u2014" in line:
                    print(f"FAIL  {f.relative_to(root)}:{n}")
                    fails.append(f"dash in {f.relative_to(root)}:{n}")
                    found += 1
    if not found:
        print("PASS  no en or em dashes")

themed("Light", LIGHT)
themed("Dark (data-audience=adult)", DARK)
fixed()
dashes()
known_gaps()

print()
if fails:
    print(f"{len(fails)} failing pair(s):")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("All checked pairs pass.")
