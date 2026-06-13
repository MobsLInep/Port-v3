# Portfolio Elevation — Design Spec

**Date:** 2026-06-13
**Owner:** Shreyansh Samaddar
**Goal:** Elevate the existing editorial portfolio (React + Vite + GSAP + Three.js) with richer, on-brand sections sourced from real resume data. Intent: *polish & elevate* — keep the plum/cream/pink/gold palette and `thunder`/`editorial`/`playground` fonts.

## Approach (decided)

**Adapt, don't import.** Use 21st.dev magic MCP for component structure & motion ideas, then hand-port each into the project's existing conventions:
- Per-component `Component.tsx` + `Component.css` files.
- Design tokens from `src/styles/global.css` (`--plum #280822`, `--cream #ddc8c5`, `--pink #e06c8f`, `--gold #efcc92`, `--gold-2`, `--sand`, `--brown`, `--ease`).
- GSAP + ScrollTrigger for reveals via the existing `[data-reveal]` pattern in `App.tsx`.
- **No Tailwind, no framer-motion** added — bundle stays lean, look stays consistent.

Section color rhythm to preserve: plum → green(#013300) → cream → green → cream → cream → sand → plum.

## Work Items

### A. Skills / Tech grid (replaces plain `WhatIDo` list)
Green (#013300) section. Two parts:
- **Capabilities bento**: Deep Learning, Reinforcement Learning, Computer Vision, Generative AI, Diffusion Models, RAG, LLM Fine-Tuning, Agentic AI — each a card with a one-line descriptor + hover state.
- **Tech marquee**: Python, C++, SQL, JavaScript, PyTorch, TensorFlow, Scikit-Learn, Gymnasium, Hugging Face, Pandas, NumPy, Git, Linux, Docker, FastAPI, Apache Superset.
- Keep the `Crafting` ("Building Intelligence") block as-is.

### B. Project cards (upgrade `Works`)
Keep section + real project data, add:
- **Tech-tag chips** per project.
- **Metric badges**: Plant Disease Diffusion → FID 43.2 / LPIPS 0.14 / IoU 94.7%; others get model/method tags.
- Real dates (Jan–Feb 2026, Dec 2025–Feb 2026, Dec 2025–Jan 2026; SSH Honeypot = ARES 2026).
- Refined hover (image zoom already present; add tag/metric reveal).

### C. Experience & Recognition (new section, after Works)
Plum (dark) background, gold accents. Contains:
- **Timeline** (most recent first):
  - Cybersecurity AI/ML Research Intern — SwiftSafe, Hyderabad (Mar–May 2026)
  - Business Analysis & Data Analytics Intern — Piramal Swasthya (Jun–Jul 2025)
  - B.Tech Data Science & AI — IIIT Naya Raipur (Aug 2024–Present, CGPA 9/10)
- **Recognition highlight cards**: ARES 2026 publication (SSH Honeypot); Indian Patent Granted No. 589285 (Quantum-Secured IoT/Blockchain air-pollution monitoring, 13 May 2026, Co-Inventor).
- **GSAP count-up stats**: CGPA 9/10, FID 43.2, lesion IoU 94.7%, 1 granted patent.
- Small footer row: extracurricular (Society of Coders — Core Member; T&P Cell — Jr. Placement Coordinator) + Codeforces Pupil.

### D. Contact form / footer CTA (elevate `Footer`)
- On-brand **contact form** (name / email / message) that composes a `mailto:` to shreyanshoct@gmail.com (no backend).
- Keep/improve motion on the existing "Send an email" block.

## Verification
- `npm run build` (tsc + vite) passes.
- `node shot.mjs` screenshots reviewed per section.

## Assets to request from user AFTER first build
- Patent PDF / certificate (No. 589285).
- Real GitHub repo links per project (currently all point to profile root).
- Piramal internship certificate link (have a Google Drive link in resume).
- ARES 2026 paper link if public.
