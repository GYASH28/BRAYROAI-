# BRAYROAI

**Design. Engineering. AI.**

BRAYROAI is a founder-led creative technology studio building premium websites, digital experiences, frontend systems, and useful AI products.

## Production

**Live:** https://brayroai.vercel.app

The production surface is validated independently from the build pipeline with route smoke tests, concurrent-load checks, cross-viewport browser tests, accessibility checks, reduced-motion coverage, and Lighthouse launch guardrails.

## Stack
- Vite
- Semantic HTML
- CSS
- Vanilla JavaScript

## Local development
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

## Quality gates
```bash
npm run qa:static
npm run test:stress
```

Browser/accessibility and Lighthouse coverage is automated in GitHub Actions.

## Structure
- `index.html` — agency homepage
- `work.html` — selected work archive
- `work/fakhrimart.html` — FakhriMart case study
- `brayroai-*.css` — visual system and responsive art direction
- `brayroai.js` — motion and interaction layer
- `DESIGN.md` — canonical BRAYROAI design source of truth
- `assets/` — agency/project imagery actually used by the site
- `tests/` — integrity, stress, browser, accessibility, and Lighthouse guardrails

This repository is intentionally separate from the personal Yash Ganesh portfolio.
