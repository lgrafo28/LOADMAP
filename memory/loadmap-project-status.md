---
name: loadmap-project-status
description: Status and architecture of the Neuroway Interaktive LoadMap project (3-prompt roadmap)
metadata:
  type: project
---

"Interaktive LoadMap" (package `neuroway-loadmap`) is a Next.js 16 / React 19 / TS / Tailwind 3 app: an ergonomic strain self-assessment that produces a "Load Passport" (activity → body regions → adaptive questions → score → tech recommendation).

Architecture (clean separation, already modular): `types/loadmap.ts` (rich domain types), `data/loadmap-data.ts` (activities, regions, adaptive questions, matching rules ~800 lines), `lib/loadmap-engine.ts` (scoring, region severities, load path, rule matching), `lib/loadmap-flow.ts` (step copy/validation), `components/loadmap/*` (split into hero, progress-bar, activity/region/questions/result-step, recommendation-card, cta-panel, diagnostic-path, score-breakdown, technology-match-list). Tests in `tests/loadmap-engine.test.ts` (node --test + tsx).

Roadmap = 3 Codex prompts. As of 2026-06-16 all three are DONE (build/typecheck/lint/tests green). Prompt 1 (structure) & Prompt 2 (UX/scoring/adaptive questions/load passport/a11y) were already complete on review. Prompt 3 ("Ergonomic Mission Control" visual design) was implemented this session: `body-load-map.tsx` (interactive SVG silhouette, select + heatmap modes, accessible region buttons), `load-radar.tsx` (animated hero radar), dark animated `diagnostic-path.tsx` decision tree, functional CTAs in `cta-panel.tsx` (context-rich mailto + window.print), tailwind keyframes (radar-sweep/load-pulse/reveal-up/scan/ping) + prefers-reduced-motion. Contact email placeholder: `beratung@neuroway.de`.

Quality gates: `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm test`.
