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

The site is a Vite multi-page build using semantic HTML, CSS and vanilla JavaScript for its core routes. Rae uses one compact 2.5D illustration across the launcher, chat header and conversation stage, with a vector visor expression layer. The body artwork is 66 KiB WebP; a 12 KiB thumbnail keeps the immediate launcher responsive. Facial states and small body transforms use CSS; reduced-motion visitors receive the same art without continuous animation.

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

The homepage keeps the featured client work in the Work section, using WebP versions of the shipped desktop and mobile captures. It links to both the detailed case study and live website while keeping studio experiments separately labelled. The close offers direct WhatsApp and email contact, followed by a complete footer with section navigation and supporting pages.

## Rae project companion

Rae retains her streaming, page-aware chat and safe route actions. Her welcome screen now offers three useful paths without an AI provider: a guided project conversation, a comparison of published offers, and verified client work. Three guided answers produce a cautious starting option and an editable brief for WhatsApp or email. Guided answers remain in the browser session; a later freeform AI question sends relevant session context to Rae's server as before. Rae never automatically opens an external contact channel.

Rae uses the attached robot design sheet as character direction: ivory shell, deep visor, orange ear fins and readable expression changes. Her illustrated rig has readable idle, listening, thinking, speaking, happy, playful and resting expressions. A transparent WebP body and SVG visor layer avoid a render loop, so guidance, chat, keyboard controls and contact handoff work consistently across devices.

## Markets and published prices

The original routes remain the default India experience. A production build also emits English UAE at `/ae`, Arabic UAE at `/ae/ar`, and English Australia at `/au`, each with the same eight route families. Each generated page inlines only its own market and fixed price book, avoiding a blocking runtime request and keeping other currencies out of its HTML. Market switching preserves the current route and anchor. Prices come from fixed independent INR, AED and AUD books in `data/pricing.js`, rather than a live exchange conversion. The plans page presents market prices, WhatsApp and email enquiry drafts, and a stacked offer comparison on phones.

Arabic pages use RTL layout and translated conversion paths, including the AI offer interactions and Rae's guided flow. The terms page provides an Arabic summary while its detailed English contract text awaits specialist legal translation and review before any Arabic legal publication.

`public/market-events.js` emits consent-neutral in-page events for market selection, language selection, plan views, plan enquiries, Rae opens and lead starts. It forwards them to an existing `dataLayer` if one is configured; this repository does not install a remote analytics provider.

Run `npm run test:localization` and `npx playwright test tests/market-journeys.spec.mjs` to verify prices, leads, metadata and the key market journeys.

## Motion and mobile performance

The homepage uses progressive motion. Desktop keeps the cinematic opening and scene direction; phones enter the hero immediately, keep scroll-led chapter motion, and pause ambient decorative loops. Phone typography uses stable system font metrics to prevent a late web-font layout shift; the desktop keeps the brand font stack. The near-invisible hero background image is omitted from the phone composition while the real founder portrait remains. Reduced motion keeps all content and controls usable. Offscreen section decoration mounts as visitors approach it. Source captures ship as smaller WebP images with PNG fallbacks. New interactive capability art lives in the existing Services section, not in an added homepage section.

The shared navigation, chapter links, market controls and editorial footer are injected by `vite.config.mjs` for all route families. `docs/EXPERIENCE_BASELINE.md` records the route and viewport audit, and `docs/ART_DIRECTION.md` records the visual and motion decisions.

The homepage styles still contain legacy layers. Before adding a visual rule, update its owning source and check both mobile rendering and Lighthouse style/layout cost. Performance reports are local measurements, not production guarantees.

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
