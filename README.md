# BRAYROAI

Production website for **BRAYROAI**, a founder-led creative technology studio combining design, frontend engineering, digital product work, and useful AI systems.

## Experience

The public website is built as a restrained SaaS launch film rather than a stack of agency sections.

The opening animation and hero are a frozen visual contract. After the hero, one persistent **SIGNAL BECOMING FORM** system moves through:

1. **Thesis / potential → structure** — the studio point of view arrives one statement at a time.
2. **Services / interface → system** — Web Experiences, Product Design, Frontend Engineering, and AI Systems share one persistent stage.
3. **Work / proof** — the real FakhriMart client interface becomes the dominant visual proof; Lernio AI and B.R.A.C.E. are linked truthfully as product/system work.
4. **Plans / scope** — ₹2,599, ₹3,999, and ₹5,999+ become three decision thresholds rather than pricing cards.
5. **Contact / human → identity** — founder presence, WhatsApp, email, and the BRAYROAI wordmark close the film.

The reference quality study of ZEXVRO is used only for pacing, hierarchy, negative space, continuity, and responsive restraint. No ZEXVRO source, assets, wording, section structure, graphics, or brand styling are copied.

## Five public destinations

- `/` — cinematic homepage
- `/services` — detailed capabilities and fit
- `/work` — real proof and public product work
- `/plans` — exact starting prices, scope, and exclusions
- `/contact` — low-friction WhatsApp/email handoff

Legacy `/pricing` resolves to `/plans`. Old FakhriMart case-study routes resolve to `/work`.

`public/outbound-fresh/` remains separate from the public navigation because it contains independent prospect concepts used by outbound workflows; it is not part of the five-destination agency site.

## Runtime

- semantic multi-page Vite build
- native scrolling; no scroll hijacking
- frozen hero runtime protected by integrity hash/tokens
- one post-hero WebGL signal canvas with adaptive high/standard/mobile profiles
- deterministic semantic signal states: potential → structure → interface → system → proof → scope → human → identity
- static particle fallback when WebGL is unavailable
- reduced-motion editorial cut with no sticky cinematic scenes
- mobile/tablet direction that removes desktop pinning rather than shrinking it
- manual service controls and ambient-motion pause
- persisted theme preference
- shared editorial deep-page system

## Visual architecture

- `public/styles.css` — frozen/base system, including the protected hero contract
- `public/film.css` — the entire post-hero homepage film
- `public/pages.css` — Services, Work, Plans, and Contact
- `public/app.js` — hero contract + one signal/film runtime
- `public/pages.js` — deep-page navigation behavior

The former `site-fixes.css`, `experience.css`, `cinematic.css`, `commercial.css`, `clarity.css`, `plans.css`, and `plans.js` production layers have been removed.

## Verified public proof

- FakhriMart live client website: <https://fakhriyarns.vercel.app/>
- FakhriMart desktop/mobile captures live in `/public/assets/`
- Lernio AI public repository: <https://github.com/GYASH28/LERNIOAI>
- B.R.A.C.E. public repository: <https://github.com/GYASH28/B.R.A.C.E>

No fabricated testimonials, awards, client counts, or performance statistics are used.

## QA

```bash
npm run test:syntax
npm run test:integrity
npm run build
npm run test:browser
npm run test:stress
```

`npm run qa:static` protects the frozen hero, five-route architecture, pricing, truthful proof, responsive/accessibility cuts, bundle budgets, and removal of obsolete layers.

CI additionally runs:

- 320–1440px overflow/reflow checks
- forward + reverse scroll-state tests
- keyboard and automated WCAG checks
- forced WebGL fallback
- concurrent load testing
- desktop/tablet/mobile director-cut screenshots
- full-page deep-route screenshots
- mobile Lighthouse audits for all five destinations

A separate browser reference audit captures ZEXVRO at deterministic viewports/scroll states so comparison is evidence-based rather than impressionistic.
