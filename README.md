# BRAYROAI

Production website for **BRAYROAI**, a founder-led creative technology studio combining web experiences, product design, frontend engineering and practical AI systems.

**Positioning:** Design. Engineering. AI.  
**Hero promise:** Digital, designed to feel different.  
**Design principle:** Intelligent craft — visual ambition with commercial usefulness.

## Public routes

| Route | Purpose |
| --- | --- |
| `/` | Main studio experience |
| `/clients` | Future-proof client work archive |
| `/clients/fakhrimart` | Verified FakhriMart case study |
| `/plans` | Website + AI offers |
| `/ai-workflow-audit` | AI Workflow Audit detail |
| `/company-second-brain` | Company Second Brain detail |
| `/founder` | Founder page |
| `/terms` | Terms & Conditions |

Legacy `/case-studies/fakhrimart` URLs redirect to `/clients/fakhrimart` through `vercel.json`.

## Current architecture

The site is a Vite multi-page build using semantic HTML, CSS and vanilla JavaScript. React, GSAP, Lenis and Three.js are intentionally not runtime dependencies.

The homepage has accumulated several visual/runtime layers over the life of the project. Their **source files remain modular for maintenance**, but production no longer ships a long CSS request waterfall. `vite.config.mjs` combines the active homepage layers in their exact cascade order into:

`/assets/brayro-home.css`

That keeps the existing V20 experience intact while reducing render-blocking network work. Secondary pages still use their page-specific CSS and the legacy V6→V11 enhancement chain where it is genuinely still required.

### Active homepage runtime

- `brayro-v12.js` — capability ledger, project preview, utility interactions
- `brayro-v14.js` — cinematic capability treatment
- `brayro-v15.js` — playful capability layer
- `experience-motion-v16.js` — shared page transition / pointer motion
- `cinematic-v18.js` — continuous homepage scroll direction
- `cinematic-v20.js` — current polish/components

Do not delete an older numbered runtime simply because a higher number exists. Verify references and behavior first; some secondary pages still mount the older enhancement chain intentionally.

## Client work system

`/clients` is the permanent work index, not a one-off portfolio page. Client entries are driven from the registry in `public/client-work.js` and support statuses such as **Live**, **In progress** and **Upcoming**.

The portfolio follows an evidence rule:

- verified client work is labelled as client work;
- BRAYROAI internal studies are not presented as client projects;
- no invented revenue/conversion uplift;
- no fabricated testimonials;
- live destinations and real project captures are preferred over mock proof.

FakhriMart is the first full case study and documents the actual catalogue/discovery/enquiry system rather than presenting a generic redesign story.

## Stack

- Vite multi-page build
- semantic HTML
- CSS
- vanilla JavaScript
- Playwright
- axe-core
- Lighthouse
- GitHub Actions
- Vercel

## Local development

```bash
npm ci
npm run dev
```

Production-equivalent build:

```bash
npm run build
npm run preview
```

## Quality gates

```bash
npm run qa:static
npm run test:browser
npm run test:stress
npm run test:lighthouse
```

GitHub Actions additionally verifies:

- syntax + architecture integrity;
- the generated homepage CSS bundle;
- clean routes;
- client archive + FakhriMart case-study behavior;
- accessibility;
- horizontal overflow at phone/tablet/desktop widths;
- reduced-motion behavior;
- concurrent load;
- Lighthouse launch budgets;
- canonical Vercel production serving the exact Git commit.

Every production build receives an `x-brayro-commit` meta tag. Production Smoke reads that tag from `https://brayroai.vercel.app` so deployment verification checks the actual live code rather than relying on GitHub Deployment-status metadata.

## Repository rules

1. Keep source layers only while they are referenced by a current page/runtime.
2. Do not add another numbered “fix” stylesheet for a tiny override if the owning source can be corrected safely.
3. Update tests when architecture changes; do not weaken a failing gate to hide a regression.
4. Keep `/clients` data-driven so future client work does not require a page redesign.
5. Preserve real client evidence and label experiments clearly.
6. Reduced motion and keyboard access are release requirements, not optional polish.

## Private outbound concepts

`public/outbound-fresh/` contains `noindex` BRAYROAI prospect concepts. They are independent demonstrations and must never be represented as a prospect's official site or verified client work.

The personal portfolio and other BRAYROAI/BRACE projects are separate repositories unless explicitly linked here.
