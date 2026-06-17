# Scroll-driven Interpolated Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the portfolio's per-section opaque backgrounds with one continuous page background that eases between section colors as the user scrolls.

**Architecture:** A fixed root layer (`.bg-root`, `z-index:-1`) holds the page background color via a CSS custom property `--page-bg`. A single IntersectionObserver (1px band at viewport center) detects the active section and writes its color to `--page-bg`; a CSS `transition: background-color` eases the blend. Sections become transparent so the root shows through. Config is a single editable array.

**Tech Stack:** React 18, TypeScript, Vite, GSAP/ScrollTrigger + Lenis (already present), Playwright (devDependency, for verification).

## Global Constraints

- Reuse existing color values verbatim: plum `#280822`, cream `#ddc8c5`, green `#013300`, sand `#ede4d3`, hero sky `#9fbac9`.
- No new runtime dependencies.
- No scroll-event handler for the background; only IntersectionObserver + one CSS variable write per change.
- Respect `prefers-reduced-motion: reduce` (instant color change, no transition).
- The project has **no unit-test runner** installed. Verification is via TypeScript build (`npm run build`), the dev server, and a Playwright script. Do not scaffold a unit-test framework (YAGNI).
- Existing section ids already present (do not duplicate): `home` (Banner), `about`, `capabilities`, `works`, `experience`, `services`.

---

### Task 1: Config + missing section ids

**Files:**
- Create: `src/lib/sectionBackgrounds.ts`
- Modify: `src/components/Sections.tsx` (add ids to `.crafting`, `.phil`, `.playbook`)
- Modify: `src/components/Footer.tsx:30` (add id to `.footer`)

**Interfaces:**
- Produces: `type SectionBg = { sectionId: string; color: string }` and `export const SECTION_BACKGROUNDS: SectionBg[]`. Consumed by Task 3's hook and Task 2's App wiring.

- [ ] **Step 1: Create the config file**

`src/lib/sectionBackgrounds.ts`:
```ts
export type SectionBg = { sectionId: string; color: string };

/**
 * Ordered list of sections that participate in the interpolated page
 * background. `sectionId` must match the `id` attribute on the section's
 * root element. `color` is the page background while that section is active.
 * Edit this array to add/remove/recolor sections — nothing else needs to change.
 */
export const SECTION_BACKGROUNDS: SectionBg[] = [
  { sectionId: "home",         color: "#9fbac9" }, // hero sky (Banner stays opaque)
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

- [ ] **Step 2: Add id to the Crafting section**

In `src/components/Sections.tsx`, change:
```tsx
      <section className="crafting">
```
to:
```tsx
      <section className="crafting" id="crafting">
```

- [ ] **Step 3: Add id to the Philosophy section**

In `src/components/Sections.tsx`, change:
```tsx
    <section className="phil">
```
to:
```tsx
    <section className="phil" id="philosophy">
```

- [ ] **Step 4: Add id to the Playbook section**

In `src/components/Sections.tsx`, change:
```tsx
    <section className="playbook">
```
to:
```tsx
    <section className="playbook" id="playbook">
```

- [ ] **Step 5: Add id to the Footer**

In `src/components/Footer.tsx`, change:
```tsx
    <footer className="footer">
```
to:
```tsx
    <footer className="footer" id="footer">
```

- [ ] **Step 6: Typecheck**

Run: `npm run build`
Expected: build succeeds (no TS errors). `SECTION_BACKGROUNDS` is unused for now — that is fine because `export`ed module members do not trigger unused errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/sectionBackgrounds.ts src/components/Sections.tsx src/components/Footer.tsx
git commit -m "feat: add section-background config and missing section ids"
```

---

### Task 2: Root background layer

**Files:**
- Modify: `src/styles/global.css` (body background → transparent; add `.bg-root`)
- Modify: `src/App.tsx` (render `<div className="bg-root" aria-hidden />`)

**Interfaces:**
- Produces: a `.bg-root` element reading `background-color: var(--page-bg)`. Task 3 sets `--page-bg` on `document.documentElement`.

- [ ] **Step 1: Make the page background transparent so the fixed layer shows**

In `src/styles/global.css`, in the `html, body` rule, change:
```css
  background: var(--plum);
```
to:
```css
  background: transparent;
```

- [ ] **Step 2: Add the root background layer styles**

In `src/styles/global.css`, immediately after the `.app { ... }` rule (around line 101), add:
```css
/* Fixed page-background layer. Sits behind all content; its color is driven
   by --page-bg (set per active section in useBackgroundColor) and eased via
   the CSS transition. Transparent sections let this show through. */
.bg-root {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-color: var(--page-bg, var(--plum));
  transition: background-color 0.6s var(--ease);
}
@media (prefers-reduced-motion: reduce) {
  .bg-root {
    transition: none;
  }
}
```

- [ ] **Step 3: Render the layer once in App**

In `src/App.tsx`, change the opening of the returned tree:
```tsx
  return (
    <div className="app">
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
```
to:
```tsx
  return (
    <div className="app">
      <div className="bg-root" aria-hidden />
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
```

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`
Open the served URL. Expected: the page still renders; sections that are still opaque look unchanged. With DevTools, inspect `.bg-root` — it exists, is `position: fixed`, and its background falls back to plum (`--page-bg` not set yet).

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/App.tsx
git commit -m "feat: add fixed root background layer"
```

---

### Task 3: useBackgroundColor hook + wiring

**Files:**
- Create: `src/hooks/useBackgroundColor.ts`
- Modify: `src/App.tsx` (import + call the hook)

**Interfaces:**
- Consumes: `SECTION_BACKGROUNDS`, `SectionBg` from `src/lib/sectionBackgrounds.ts`.
- Produces: `export function useBackgroundColor(sections: SectionBg[], enabled: boolean): void`. Writes `--page-bg` on `document.documentElement`.

- [ ] **Step 1: Write the hook**

`src/hooks/useBackgroundColor.ts`:
```ts
import { useEffect } from "react";
import type { SectionBg } from "../lib/sectionBackgrounds";

/**
 * Drives the page background color from the section currently crossing the
 * vertical center of the viewport. Uses a single IntersectionObserver with a
 * 1px center band, so exactly one section is "intersecting" at a time. The
 * only DOM write is one CSS variable (--page-bg) per active-section change;
 * the easing is done in CSS (see .bg-root).
 *
 * @param sections ordered { sectionId, color } config
 * @param enabled  gate so it runs only after content has mounted
 */
export function useBackgroundColor(sections: SectionBg[], enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    const colorById = new Map(sections.map((s) => [s.sectionId, s.color]));

    // Initialize to the first section's color so there is no flash.
    if (sections.length > 0) {
      root.style.setProperty("--page-bg", sections[0].color);
    }

    const elements = sections
      .map((s) => {
        const el = document.getElementById(s.sectionId);
        if (!el && import.meta.env.DEV) {
          console.warn(`useBackgroundColor: no element with id "${s.sectionId}"`);
        }
        return el;
      })
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const color = colorById.get(entry.target.id);
          if (color) root.style.setProperty("--page-bg", color);
        }
      },
      // Collapse the root to a 1px band at the vertical center of the viewport.
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections, enabled]);
}
```

- [ ] **Step 2: Wire it into App**

In `src/App.tsx`, add the import near the other imports:
```tsx
import { useBackgroundColor } from "./hooks/useBackgroundColor";
import { SECTION_BACKGROUNDS } from "./lib/sectionBackgrounds";
```
Then, immediately after the existing `useSmoothScroll(loaded);` line, add:
```tsx
  useBackgroundColor(SECTION_BACKGROUNDS, loaded);
```

- [ ] **Step 3: Typecheck**

Run: `npm run build`
Expected: build succeeds with no TS errors.

- [ ] **Step 4: Verify the variable updates on scroll**

Run: `npm run dev`
In DevTools, watch `document.documentElement.style` (or inspect `<html>`'s inline style). Scroll the page slowly. Expected: `--page-bg` changes value as each section crosses the viewport center (e.g. `#280822` → `#013300` → `#ddc8c5` …). Sections are still opaque, so the visible change is limited for now — the variable updating is what matters here.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useBackgroundColor.ts src/App.tsx
git commit -m "feat: drive --page-bg from active section via IntersectionObserver"
```

---

### Task 4: Make sections transparent

**Files:**
- Modify: `src/components/Sections.css` (`.about`, `.crafting`, `.works`, `.phil`, `.services`, `.playbook`)
- Modify: `src/components/Capabilities.css` (`.caps`)
- Modify: `src/components/Experience.css` (`.xp`)
- Modify: `src/components/Footer.css` (`.footer`)

**Interfaces:** none (CSS only).

- [ ] **Step 1: About — remove solid background**

In `src/components/Sections.css`, in the `.about` rule, delete the line:
```css
  background: var(--plum);
```

- [ ] **Step 2: Crafting — remove solid background**

In `.crafting`, delete:
```css
  background: var(--cream);
```

- [ ] **Step 3: Works — remove solid background**

In `.works`, delete:
```css
  background: #013300;
```

- [ ] **Step 4: Philosophy — remove solid background**

In `.phil`, delete:
```css
  background: var(--cream);
```

- [ ] **Step 5: Services — remove solid background**

In `.services`, delete:
```css
  background: var(--cream);
```

- [ ] **Step 6: Playbook — remove solid background**

In `.playbook`, delete:
```css
  background: var(--sand);
```

- [ ] **Step 7: Capabilities — keep overlay, drop solid base**

In `src/components/Capabilities.css`, change the `.caps` background from:
```css
  background:
    radial-gradient(ellipse at top, rgba(239, 204, 146, 0.08), transparent 60%),
    #013300;
```
to:
```css
  background:
    radial-gradient(ellipse at top, rgba(239, 204, 146, 0.08), transparent 60%);
```

- [ ] **Step 8: Experience — keep overlay, drop solid base**

In `src/components/Experience.css`, change the `.xp` background from:
```css
  background:
    radial-gradient(ellipse at 80% 0%, rgba(224, 108, 143, 0.1), transparent 55%),
    var(--plum);
```
to:
```css
  background:
    radial-gradient(ellipse at 80% 0%, rgba(224, 108, 143, 0.1), transparent 55%);
```

- [ ] **Step 9: Footer — remove solid background**

In `src/components/Footer.css`, in the `.footer` rule, delete:
```css
  background: var(--plum);
```

- [ ] **Step 10: Verify the continuous blend**

Run: `npm run dev`
Scroll from top to bottom. Expected: after the Banner hero, the page background eases between plum → green → cream → green → plum → cream → cream → sand → plum with no hard edges at section boundaries. Capabilities/Experience still show their subtle radial glows on top of the green/plum root. No layout shift; scrolling stays smooth.

- [ ] **Step 11: Commit**

```bash
git add src/components/Sections.css src/components/Capabilities.css src/components/Experience.css src/components/Footer.css
git commit -m "feat: make sections transparent so root background shows through"
```

---

### Task 5: Playwright verification + reduced-motion check

**Files:**
- Create: `scripts/verify-bg.mjs`

**Interfaces:**
- Consumes: a running preview server and `SECTION_BACKGROUNDS` colors (asserted by literal value).

- [ ] **Step 1: Write the verification script**

`scripts/verify-bg.mjs`:
```js
// Verifies that --page-bg changes as sections scroll through the viewport
// center. Run against a built preview build. Usage:
//   npm run build && npm run preview & (note the URL) then:
//   node scripts/verify-bg.mjs http://localhost:4173
import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:4173";
const ids = ["about", "capabilities", "works", "experience", "playbook", "footer"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(url, { waitUntil: "networkidle" });

const seen = new Set();
for (const id of ids) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(900); // allow the 0.6s CSS transition to settle
  const value = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--page-bg").trim()
  );
  console.log(`${id} -> --page-bg = ${value}`);
  seen.add(value);
}

await browser.close();

if (seen.size < 3) {
  console.error(`FAIL: expected several distinct background colors, saw ${seen.size}`);
  process.exit(1);
}
console.log(`PASS: ${seen.size} distinct background colors observed`);
```

- [ ] **Step 2: Run the verification**

Run:
```bash
npm run build
npm run preview &
sleep 2
node scripts/verify-bg.mjs http://localhost:4173
kill %1
```
Expected: lines printing a `--page-bg` value per section, with at least 3 distinct values, ending in `PASS`.

- [ ] **Step 3: Manual reduced-motion check**

In the browser DevTools, enable "Emulate CSS prefers-reduced-motion: reduce" (Rendering tab). Scroll. Expected: background colors switch instantly at center crossings (no eased transition) and no console errors.

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-bg.mjs
git commit -m "test: add Playwright script verifying scroll background transitions"
```

---

## Self-Review notes

- **Spec coverage:** config array (Task 1), root layer (Task 2), IntersectionObserver hook with center band + CSS var (Task 3), transparent sections incl. overlay-preserving Capabilities/Experience (Task 4), reduced-motion + verification (Tasks 2 & 5). Banner kept opaque (no transparency edit for `.banner`) per spec. "Add a section later" is documented in the spec and supported by the config-only design.
- **Correction vs. spec:** Banner's id is `home` (pre-existing), and `capabilities`/`experience` ids already exist — so only `crafting`, `philosophy`, `playbook`, `footer` get new ids. Config uses `home` for the hero entry.
- **Type consistency:** `SectionBg`/`SECTION_BACKGROUNDS` defined in Task 1 and consumed unchanged in Tasks 2–3; `useBackgroundColor(sections, enabled)` signature matches its call site.
- **No unit tests:** intentional — no runner in the project; verification is build + browser + Playwright script (Global Constraints).
