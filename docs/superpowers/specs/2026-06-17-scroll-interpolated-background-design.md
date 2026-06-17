# Scroll-driven Interpolated Background — Design

Date: 2026-06-17

## Goal

Convert the portfolio's per-section opaque backgrounds into a single continuous
page background that transitions smoothly from one section's color to the next
as the user scrolls. No hard edges between sections. The background lives on a
fixed root layer behind all content; section content sits on top of it.

## Constraints & decisions

- **Color source:** reuse the colors already in the codebase (no visual recolor,
  only smooth blending between existing colors).
- **Scope:** all sections participate (with one exception noted for Banner).
- **Transition model:** IntersectionObserver detects the active section; a CSS
  custom property (`--page-bg`) is updated; `transition: background-color` eases
  the change. No scroll-event handler, no per-frame JS, no layout reads — all
  work happens on the compositor. This is a snap-eased model, not a per-pixel
  blend (chosen deliberately for simplicity and performance).
- **Performance:** 60fps, no layout thrashing. The observer fires only at
  threshold crossings; the only DOM write is a single CSS variable.

## Architecture

### 1. Config — `src/lib/sectionBackgrounds.ts`

The single source of truth, easy to edit:

```ts
export type SectionBg = { sectionId: string; color: string };

export const SECTION_BACKGROUNDS: SectionBg[] = [
  { sectionId: "banner",       color: "#9fbac9" }, // hero sky (see Banner note)
  { sectionId: "about",        color: "#280822" }, // plum
  { sectionId: "capabilities", color: "#013300" }, // green
  { sectionId: "crafting",     color: "#ddc8c5" }, // cream
  { sectionId: "works",        color: "#013300" }, // green
  { sectionId: "experience",   color: "#280822" }, // plum
  { sectionId: "philosophy",   color: "#ddc8c5" }, // cream
  { sectionId: "services",     color: "#ddc8c5" }, // cream
  { sectionId: "playbook",     color: "#ede4d3" }, // sand
  { sectionId: "footer",       color: "#280822" }, // plum
];
```

Colors map to the existing tokens: `--plum #280822`, `--cream #ddc8c5`,
green `#013300`, `--sand #ede4d3`.

### 2. Root background layer

Rendered once in `App.tsx`:

```tsx
<div className="bg-root" aria-hidden />
```

CSS (in `global.css`):

```css
.bg-root {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-color: var(--page-bg, var(--plum));
  transition: background-color 0.6s var(--ease);
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .bg-root { transition: none; }
}
```

`html, body` background becomes `transparent` (currently `var(--plum)`) so the
fixed `z-index:-1` layer is visible. The existing `body::after` grain overlay
(z-index 9999) is unaffected and continues to sit above everything.

### 3. Hook — `src/hooks/useBackgroundColor.ts`

```
useBackgroundColor(sections: SectionBg[]): void
```

- On mount, initializes `--page-bg` on `document.documentElement` to
  `sections[0].color`.
- Creates one `IntersectionObserver` with
  `rootMargin: "-50% 0px -50% 0px"` and `threshold: 0`. This collapses the root
  to a 1px band at the vertical center of the viewport, so exactly one section
  is "intersecting" at a time — whichever currently crosses the midline.
- On each `isIntersecting` entry, looks up that element's color from the config
  and writes `document.documentElement.style.setProperty("--page-bg", color)`.
- Observes the element returned by `document.getElementById(sectionId)` for each
  config entry; warns (dev only) and skips any missing id.
- Cleans up the observer on unmount.

What it does: keeps `--page-bg` in sync with the section at the viewport center.
How to use it: call once from `App` after content mounts. Depends on: the config
array and the presence of matching element ids in the DOM.

### 4. Sections become transparent

Each participating section's solid base background is removed so the root layer
shows through:

- `Sections.css`: `.about`, `.crafting`, `.works`, `.phil`, `.services`,
  `.playbook` (and any `.whatido`-style green block) — drop the solid `background`.
- `Capabilities.css` (`.caps`) and `Experience.css` (`.xp`): keep the decorative
  semi-transparent `radial-gradient` overlay, drop only the solid base color
  (`#013300` / `var(--plum)`). The overlay layers correctly over the root color.
- `Footer.css` (`.footer`): drop the solid `var(--plum)` base.

Text colors stay per-section (unchanged).

### 5. Section ids

These section root elements already have ids: `about`, `works`, `services`.
Add stable ids to the rest:

- `Banner.tsx` → `banner`
- `Capabilities.tsx` → `capabilities`
- `Sections.tsx` → `crafting`, `philosophy`, `playbook`
- `Experience.tsx` → `experience`
- `Footer.tsx` → `footer`

## Notes / known limitations

- **Banner** is a full-viewport hero with a sky *gradient* plus a 3D scene, which
  a flat color cannot represent. Banner keeps its opaque gradient (it covers the
  root layer while in view). Its config entry exists for completeness and governs
  the root tone at its edges. All sections after it ride the interpolated root.
- **Text contrast during a blend:** text colors are per-section and are not
  interpolated. On cream↔plum transitions there is a brief (~0.6s) window where
  mid-blend contrast is imperfect. The snappy timing keeps this unobtrusive.
  Optional future enhancement: transition a `--page-fg` variable via the same
  mechanism so foreground tracks the background.

## Adding a section later

1. Add the section component with a unique `id` on its root element.
2. Add `{ sectionId: "<id>", color: "#hex" }` to `SECTION_BACKGROUNDS` in the
   correct scroll order.
3. Make the section's CSS background transparent (or keep only decorative
   semi-transparent overlays).

The observer picks up the new section automatically — no other code changes.

## Testing

- Manual: scroll the page; background eases between section colors at midline
  crossings with no hard edges. Verify at 60fps (no jank) via DevTools.
- Reduced motion: with `prefers-reduced-motion: reduce`, color changes are
  instant (no transition), no errors.
- Config edit: removing/reordering a config entry changes behavior with no other
  edits required (beyond the section's own transparency).
