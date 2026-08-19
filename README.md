# BRAYROAI

Production website for **BRAYROAI**, a founder-led creative technology studio combining design, frontend engineering, digital product work and useful AI systems.

## Brand

**Design. Engineering. AI.**

Hero promise: **Digital, designed to feel different.**

Core idea: **INTELLIGENT CRAFT.**

## Experience architecture

The opening animation and hero are intentionally locked. Below the hero, the homepage is authored as one connected experience rather than a stack of agency sections:

1. **Three Forces** — one interface transforms through Design → Engineering → Intelligence → Convergence.
2. **Work Immersion** — the real FakhriMart desktop/mobile experience moves into the viewport and becomes the environment.
3. **Deconstruction** — that same shipped interface is opened into strategy, system, interaction, engineering and shipping decisions.
4. **BRAYROAI / LAB** — functional micro-experiments demonstrate responsive UI systems, useful intelligence and deliberate motion.
5. **Studio** — the founder-led identity appears only after the work has already demonstrated the point of view.
6. **Resolution** — previously separated ideas converge into a calm commercial close.

The scroll timeline is native browser scrolling. A single `ExperienceController` schedules scene updates through one shared `requestAnimationFrame` path. Each scene owns normalized progress and remains readable without animation.

## Stack

- semantic HTML
- CSS
- vanilla JavaScript
- Vite
- Playwright + axe for browser/accessibility QA
- Lighthouse launch guardrails
- GitHub Actions
- Vercel

No GSAP, Lenis, React or Three.js is added simply for effect. The current experience uses DOM/CSS transforms and persisted real project captures so the work remains fast, reliable and progressively enhanced.

## Commercial routes preserved

- `/plans.html`
- `/case-studies/fakhrimart.html`
- FakhriMart live project destination
- Lernio and B.R.A.C.E. product destinations
- direct project email/contact paths

## Quality gates

`npm run qa:static` checks syntax, architecture/integrity and the production build.

CI additionally runs browser interaction tests, accessibility checks, the requested desktop/mobile viewport matrix, stress/load checks and Lighthouse budgets.

## Outbound concept system

`public/outbound-fresh/` contains private, `noindex` BRAYROAI sales concepts used for researched prospect outreach. Every concept is explicitly marked as an independent BRAYROAI demonstration and must not be represented as the prospect's official website.

The personal portfolio repository and `ykg.vercel.app` are separate projects and are not part of this codebase.
