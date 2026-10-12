# Changelog: @equal-lens/brand

Versions follow semantic versioning: a patch fixes, a minor adds without breaking, a major can break consumers.
Each version is published to GitHub Packages as `@priyanshuj0410-code/equal-lens-brand` by pushing a tag
`brand-v<version>` (see `.github/workflows/publish-brand.yml`).

## 0.1.1 (unreleased)

Accessibility fixes from the cross-project design audit (Plane THEEQ-61, umbrella CLAUD-17). No class or token
was removed or renamed; one token value moved.

- `--color-brandsoft` light `#7F65A4` to `#735997`: 12px bubble text on `mist` went from 3.80 to 4.53, on paper 4.67 to 5.57.
  Dark `#B3A4D6` already passed (5.48 on mist) and is unchanged. The violet ramp (`violet-400 #7F65A4`) is unchanged.
- Added a global `:focus-visible` ring in `components.css`: 2px solid `brand`, 2px offset; white on `.bg-band` and `.on-dark`.
- Documented the accent rule: accents are fills only, always with `#221436` text, never white on grow, never a text colour.
  Fixed the `components.html` stat demo and the note hint opacity (4.09 to 6.5) to follow it.

## 0.1.0 (2026-10-01)

First published version. It is the package SwipeEd has used since 2026-09-01 as a vendored tarball
(`vendor/equal-lens-brand-0.1.0.tgz`): the same tokens, fonts, Tailwind theme, plain-CSS UI kit, React
components (`Button`, `Card`, `Note`, `Segmented`, `NavLink`, `Tabs`, `Toolbar`, `ShipDock`, `Popover`,
`Bubble`) and brand SVGs (logo, Lensy poses, UN and RE, the ship with its flame, doodles).
