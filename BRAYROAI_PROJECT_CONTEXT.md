# BRAYROAI Project Context

This file is intentionally **state-based instead of commit-based**. Do not hard-code a “latest commit” here; use Git history and CI for that.

## Identity

- Repository: `GYASH28/BRAYROAI-`
- Default branch: `main`
- Canonical production origin: `https://brayroai.vercel.app`
- Framework: Vite multi-page site
- Runtime: semantic HTML + CSS + vanilla JavaScript
- Output: `dist/`

## Public information architecture

- `/` — studio homepage
- `/clients` — client archive
- `/clients/fakhrimart` — FakhriMart case study
- `/plans` — commercial offers
- `/ai-workflow-audit` — AI Workflow Audit
- `/company-second-brain` — Company Second Brain
- `/founder` — founder page
- `/terms` — terms

Legacy FakhriMart case-study URLs redirect to the current client route.

## Homepage architecture

The homepage is the current V20 experience. Its active CSS source remains split across the historical visual layers because cascade order still matters, but Vite emits those files as **one production stylesheet**: `/assets/brayro-home.css`.

Active homepage runtime responsibilities:

- `brayro-v12.js`: capability ledger, project preview and utility interactions
- `brayro-v14.js`: cinematic capability treatment
- `brayro-v15.js`: playful capability layer
- `experience-motion-v16.js`: shared motion/page transitions
- `cinematic-v18.js`: continuous scroll direction
- `cinematic-v20.js`: current component/polish layer

`motion-v5.js` intentionally isolates the homepage from its legacy V6→V11 enhancement chain. That older chain is still mounted by secondary pages, so it must not be removed until those pages are migrated and re-tested.

## Client work

The client archive is data-driven from `public/client-work.js` and is designed to accept future **Live**, **In progress** and **Upcoming** work without redesigning `/clients`.

Current verified full case study:

- **FakhriMart** — catalogue-led yarn/craft discovery + responsive enquiry experience
- Live destination: `https://fakhriyarns.vercel.app/`
- Proof assets: `fakhrimart-case-desktop.png`, `fakhrimart-case-mobile.png`

Evidence policy:

- never fabricate metrics;
- never fabricate testimonials;
- distinguish internal studio experiments from verified client work;
- use real screenshots/live destinations wherever possible.

## Commercial product routes

Current AI offers include:

- AI Workflow Audit — ₹9,999
- Company Second Brain — from ₹29,999
- Knowledge Care — ongoing support

Website offer/pricing copy lives in the current homepage and `/plans`; tests are the source of truth for required public amounts and labels.

## Deployment verification

Every Vite build injects:

`<meta name="x-brayro-commit" content="…">`

On Vercel, the value comes from `VERCEL_GIT_COMMIT_SHA`. GitHub Production Smoke polls the canonical origin and requires that value to equal the GitHub SHA under test before running production load/browser/Lighthouse checks.

This intentionally avoids depending on Vercel creating a GitHub Deployments API record.

## QA

Static gate:

- JavaScript syntax
- architecture/integrity tests
- Vite production build
- production bundle contract

Browser gate:

- homepage/current V20 interaction regression tests
- dedicated client archive + FakhriMart tests
- axe serious/critical accessibility checks
- 320 / 390 / 768 / 1440 / 1920 overflow checks
- reduced motion
- 900-request concurrent stress test
- Lighthouse mobile launch budget

Production Smoke repeats the meaningful browser/load/Lighthouse checks against the exact deployed Git commit.

## Asset / repository hygiene

Keep:

- current client proof assets;
- founder/hero assets;
- current page CSS/JS;
- the secondary-page enhancement chain while it remains referenced;
- `public/outbound-fresh/` prospect concepts as `noindex` independent BRAYROAI demos.

Do not reintroduce removed pre-V12 `styles.css`, `experience.css`, `site-fixes.css`, obsolete migration notes, or superseded browser suites.

## Current cleanup priorities

1. Keep Lighthouse mobile at or above the launch performance budget without sacrificing accessibility/motion fallbacks.
2. Migrate secondary pages away from the V6→V11 enhancement chain before deleting that chain.
3. Add future clients through the client registry and a case-study template/pattern rather than bespoke archive markup.
4. Keep CI deterministic: dependencies come from `npm ci`; do not install arbitrary `latest` QA packages inside workflows.
