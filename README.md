# BRAYRO AI studio site

Production: https://brayroai.vercel.app · Repository: GYASH28/BRAYROAI- · Main branch: main.

The Material Intelligence redesign combines a scroll-driven particle opening, tactile studio imagery, real client screens and photographic founder features. It replaces the rejected Proof Mark design across all eight routes: home, plans, clients, FakhriMart case, founder, Workflow Audit, Company Second Brain and terms. India, UAE and Australia each use the original independent price book, in English.

## Architecture

Vite multi-page semantic HTML preserves direct routes and content without JavaScript. `src/site/studio.css` owns the coherent responsive design system. `src/site/app.js` initializes markets, plans, contact and opt-in Rae. `src/site/entry.js` provides native opening motion and the responsive particle-field loader. It loads `src/site/motion.js` on the first scroll or arrival at the second section for GSAP choreography and the unchanged Scrollcraft engine. Pinned exhibit space is reserved before that engine arrives. Lazy React islands implement the procedural Three.js particle field (`sculpture.jsx`), practice tabs (`workbench.jsx`) and interactive scope desk (`plan-desk.jsx`). Native cross-document view transitions enhance ordinary links and browser history.

The hero is a 9,600-point authored field with an open nucleus, asymmetric orbital filaments and restrained amber/cobalt light. Fine particles breathe and travel coherently; pointer, scroll and the keyboard-accessible calm-to-orbit range change its pose. A two-beat sticky opening hands into the real client exhibit. The initial SVG comes from the same seeded field and animates without WebGL. Desktop enhances after the readable opening; mobile enhances on first scroll or range input. Rendering pauses offscreen, in hidden tabs and behind dialogs; context loss keeps the SVG fallback. Reduced motion preserves ordinary flow and a stationary field.

The footer enhances the owner's actual mosaic wordmark on approach: nearby tiles react to the pointer, a warm/cool ink gradient follows it, and keyboard focus gets visible feedback. Its native link returns to the top. The original SVG image remains the fallback; reduced motion keeps stable tile geometry.

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
