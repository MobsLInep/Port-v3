# Premium Scroll Mechanism — Design

Date: 2026-06-17

## Goal
Give the portfolio a premium, tactile scroll feel through four coordinated
effects, while keeping the banner oval ring perfectly fixed.

## Decisions (confirmed)
- Letter reveal: **scrub-linked** (tied to scroll position, retracts on scroll up).
- Scope: **all major section headings** + banner infobox title.
- Parallax strength: **subtle & refined**.
- The banner oval SVGs are **excluded** from all motion.

## Components

### 1. Smooth scroll engine — `src/hooks/useSmoothScroll.ts`
Retune Lenis for a weighted glide: longer `duration`, `lerp`-based momentum,
refined easing, gentler wheel/touch multipliers. Foundation for everything else.

### 2. Letter-by-letter title reveal — new `src/lib/scrollFx.ts`
- `splitToLetters(el)`: walks child nodes, wraps each character of text nodes in
  `<span class="char">`, preserves `<br>` and whitespace. Idempotent.
- `initLetterReveals(scope)`: for every `[data-letters]` element, split it then
  build a GSAP timeline with `scrub` ScrollTrigger that reveals chars one-by-one
  (opacity + yPercent + blur, staggered, ease none) as the heading crosses the
  viewport.
- Applied to: banner infobox title, `.about__head`, `.crafting__title`,
  `.works__title`, the `.services__list` words, `.playbook__title`.
- Replaces `data-reveal` on those headings (avoid double animation). Body text
  and images keep `data-reveal`.

### 3. Site-wide parallax (subtle) — `initParallax(scope)` in `scrollFx.ts`
- For every `[data-parallax="<n>"]` element, `gsap.to` a `yPercent` of `n` driven
  by a `scrub` ScrollTrigger spanning the element's travel. Transform-only (GPU).
- Targets: `.works__watermark`, `.about__torn`, `.phil__motif`, work media images.
- The oval SVGs carry no attribute, so they never move.

### 4. Flower model parallax (3D, scroll-driven) — `src/three/Scene3D.tsx`
- Flower keeps mouse tilt + bob. Add scroll-driven drift: read scroll progress
  through the banner in `useFrame` (no React re-render) and lerp a vertical
  offset + slight recede (scale) into the flower group. Contained inside the
  canvas so it never overflows. Oval ring stays pinned.

## Accessibility
All scrub/parallax setup guarded by `prefers-reduced-motion`: reduced users get
fully-visible static headings and no parallax.

## Files touched
- `src/hooks/useSmoothScroll.ts` (tune)
- `src/lib/scrollFx.ts` (new)
- `src/App.tsx` (wire up letter reveals + parallax in gsap.context)
- `src/three/Scene3D.tsx` (flower scroll drift)
- `src/components/Banner.tsx`, `src/components/Sections.tsx` (add `data-letters` /
  `data-parallax` attributes)
- `src/styles/global.css` (`.char` base state)
