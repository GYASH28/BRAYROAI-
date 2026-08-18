# YKG Digital — agency website

Production source for the current **YKG Digital** creative-technology agency website. This repository is intentionally separate from the personal Yash Ganesh portfolio.

## Stack
Vite · semantic HTML · CSS · vanilla JavaScript

## Current source
- `index.html` — canonical one-page agency experience
- `public/styles.css` — canonical visual system
- `public/app.js` — primary interaction and scroll-motion system
- `public/site-fixes.css` / `public/site-fixes.js` — surgical QA/accessibility hardening
- `public/assets/` — current hero/founder imagery
- `tests/` — integrity, browser, accessibility, responsive, Lighthouse and load checks

## Run locally
```bash
npm ci
npm run dev
```

## Static production gate
```bash
npm run qa:static
```

CI additionally runs Chromium interaction tests, axe checks, seven viewport overflow checks, a 720-request concurrency test and mobile Lighthouse.
