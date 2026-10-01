# BRAYRO AI studio site

Production: https://brayroai.vercel.app · Repository: GYASH28/BRAYROAI- · Main branch: main.

The Material Intelligence redesign uses a gallery of physical objects, real client screens and photographic founder features. It replaces the rejected Proof Mark design across all eight routes: home, plans, clients, FakhriMart case, founder, Workflow Audit, Company Second Brain and terms. India, UAE and Australia each use the original independent price book, in English.

## Architecture

Vite multi-page semantic HTML preserves direct routes and content without JavaScript. `src/site/studio.css` owns the coherent responsive design system. `src/site/app.js` initializes markets, plans, contact and opt-in Rae. `src/site/motion.js` orchestrates GSAP choreography and the unchanged Scrollcraft engine. Lazy React islands implement the procedural Three.js sculpture (`sculpture.jsx`), practice tabs (`workbench.jsx`) and interactive scope desk (`plan-desk.jsx`). Native cross-document view transitions enhance ordinary links and browser history.

The sculpture is instanced geometry with procedural studio reflections, no external models. Desktop loads it after the initial readable frame; mobile requests it through the range control. Its unequal elliptical core, grouped silver/ceramic collars and reflected lighting unfold on entry and respond to pointer, scroll and keyboard. It pauses offscreen/hidden/behind dialogs, handles context loss and retains a raster fallback. Reduced motion uses readable flow, stationary photography and operable controls.

The supplied tile brand kit and self-hosted Manrope/Space Grotesk fonts remain authoritative. Two original generated material photographs are studio art. All client screens and founder images remain first-party evidence; no generated image is presented as client work. Asset prompts and provenance are in `research/material-studio/`.

Rae keeps the prior expressive character and grounded provider-backed streaming API. It is opt-in, has honest error behavior and maps actions to a route allowlist. Contact drafts stay in browser session storage until the visitor chooses WhatsApp or email. Price facts come from `data/pricing.js`; markets from `data/markets.js`.

## Local work

```bash
npm ci
npm run dev
```

## Release verification

```bash
npm run qa:static
npm run preview -- --host 127.0.0.1 --port 4173
npm run test:browser
npm run test:stress
npm run test:lighthouse
```

GitHub Actions additionally confirms the canonical Vercel meta commit marker matches the pushed SHA, then runs production browser/load/Lighthouse gates. A local build or screenshot alone is not deployment evidence. `research/material-studio/VERIFICATION.md` records this revision's actual results and limits.

The original 50-project award study remains in `research/premium-rebuild/`, including inaccessible/loading-only reference limits. New brief, grammar, fingerprint comparison, sources, asset prompts and refinement evidence are in `research/material-studio/`. The brief is self-authored because the owner directed autonomous execution. Old rebuild notes describe historical versions.
