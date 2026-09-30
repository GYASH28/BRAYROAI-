---
name: brayroai-award-studio
description: Redesign the BRAYROAI multi-page studio site using its verified client proof, owner-approved tile brand kit and research-backed motion direction. Use for substantive BRAYROAI visual/experience work; for an isolated bug fix, use the smaller relevant skill instead.
---

# BRAYROAI Award-Informed Studio Design

Use this skill when a change materially affects BRAYROAI's visual identity, story, main site, case pages or responsive experience. The aim is an original, expressive creative-studio site with credible proof, clear routes and crafted motion. This skill does not promise an award outcome or transfer another studio's visual identity.

## Begin with the actual repository

1. Read the root `README.md`, `DESIGN.md`, `BRAYROAI_PROJECT_CONTEXT.md`, `docs/REBUILD_NOTES.md` and the current clean-GitHub comparison when available. Check the working-tree state before editing. Do not carry changes into a dirty unrelated checkout.
2. For the research trail and exact sample, read the project's `research/premium-rebuild/award-study.md`, `award-records.json`, `interaction-notes.md`, `live-audit-summary.json`, `library-review.md`, and `PLAN.md`. They document 50 distinct projects selected from the three official result galleries, visual notes, scripted live desktop/mobile evidence, explicit access limits, checked implementation choices and the latest implementation agreement.
3. Use the official project references in [`references/study-guide.md`](references/study-guide.md) for principles and primary-source links. A screenshot of a loader or an official highlight label is not proof that the full live interaction worked. Project names and Awwwards captures are evidence only; don't transplant their source assets, layout, copy, characters or motion.

The public site uses Vite multi-page HTML, CSS and vanilla JavaScript. It is intentionally not a React design system. Preserve semantic markup, direct paths, Vercel route generation, existing language/market behavior and deep links. Verify volatile branch/remote state from GitHub when working on it; never infer the deployment from an old rollout note.

## Art direction and story

- Keep BRAYROAI's founder-led, photographic identity and its working custom orange arrow. On the homepage retain the recognisable Yash portrait, original brand line, color control, name treatment and direct project action unless the user explicitly changes them.
- Apply the owner's 30 September 2026 tile-fracture brand system. Its source is `/home/yashg/Documents/Codex/2026-09-30/cr/outputs/brayro-ai-brand-system/brand-guide.html`; selected web assets are in `static/brand/`. Use the compact reverse wordmark in the ink header, full reverse lockup in the dark footer, the supplied favicon and sharing card, ink/bone fields, electric blue for primary interaction and restrained orange for impact. Do not distort the mark, loop its motion, or publish stationery templates with placeholder contact details.
- Use real assets first: `/static/assets/yash-cutout*.webp`, existing founder/process photos, `rae-face.svg` and the original structured Rae character, plus actual FakhriMart desktop/mobile screens and its case study. Before adding a new image, check the repository's first-party assets.
- Keep visible client proof early. Call FakhriMart completed client work and distinguish real case facts from design concepts. Never fabricate performance outcomes, other clients, figures or testimonials.
- Work from an emotional journey with a single readable peak and a resolved ending. Pick a Scrollcraft page grammar before scene details and compare it with `scrollcraft/FINGERPRINTS.md`; a new build must differ from each registered row on four of six dimensions. The hero can remain shared at the user's request.
- Use the hand-drawn arrow consistently as the brand's navigation mark. A bespoke arrow interaction must perform a genuinely different job from the archived arrow that assembled screen fragments into a complete site.
- Build motion from meaning: an immediate, distinct entry with readable copy already present, visible state changes, parallax that communicates depth, one legible focal interaction, varied holds, then a quieter close. The live study repeatedly found long loaders obscuring the first message; do not gate the studio's proposition behind one. Avoid repeated reveals, decorative counter values, card grids, blanket cursor tricks and anything that competes with the real screens.
- Use an added animation library or 3D only when the motion has a clear purpose. The initially tried Anime.js opening missed the mobile blocking-time budget, so the current entrance uses lightweight CSS and native observers; do not reintroduce a startup timeline without measuring it. Reuse the existing Scrollcraft engine. Keep 3D local and focused, code-authored where practical, rendered on demand, and backed by an image/DOM version. Evaluate package footprint and current license from its official source before adding a dependency.

## Page and content contracts

- Tailor layouts to these existing page purposes: studio home, plans, client archive, FakhriMart case, founder, AI Workflow Audit, Company Second Brain, and readable Terms. Preserve clean routes, legacy redirects, generated locale paths and sitemap entries.
- Prices and market-specific offer details come from `data/pricing.js`; capabilities come from their current source modules. Never calculate a new market price or duplicate editable facts into animation code.
- Preserve the real Rae flow. The visible launcher is opt-in; opening, sending, provider fallback, focus, dismissal and mapped link actions must still work. Do not make the mascot a decoration that obscures text or contact controls.
- Keep a full useful footer with the page map, current-page contacts, Rae option, terms and back-to-top behavior. Existing WhatsApp, email, forms, maps and linked client destinations must keep their destinations.

## Motion, responsive and release gates

Treat the first frame and primary action as available on load; no long logo gate. Respect `prefers-reduced-motion`: render the final readable state without animated entrances, parallax or video scrubbing, but leave every image, route and control available. Give mobile its own image crops and control positions. All drag gestures need keyboard-equivalent input; touch targets and focus remain visible on every backdrop.

Review composed screenshots and live scroll states instead of judging source CSS only: opening at rest and after entry, beginning/middle/end of the focal device, reversed scroll, closing contact state, representative secondary pages, 390px phone and desktop. Look specifically for dead scroll, caught half-fades, cropping, text over media, canvas startup errors, unresponsive controls and route loss. Use direct-route refresh and Vercel preview/deployment checks as relevant. Run the repository's full existing QA suite once the art direction has settled and before release; keep all original release gates.

The 2026 project plan prioritizes research, implementation and visual refinement before browser/CI/Lighthouse work. If the request sets a different order, follow the request.
