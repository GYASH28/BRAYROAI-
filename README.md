# BRAYRO AI website

The public studio site is a Vite multi-page build with semantic HTML, CSS, small JavaScript modules, and a Vercel serverless endpoint for Rae. The original GitHub `main` hero remains the opening scene: Yash's monochrome portrait, “Digital, designed to feel different.” headline, and working colour toggle. Its entrance and the following scenes form the Proof Mark scroll experience.

## Routes

| Route | Content |
| --- | --- |
| `/` | Studio story, verified FakhriMart work, process, founder, starting points, contact |
| `/plans` | Website builds, monthly support, and practical AI scopes |
| `/clients` | Verified client archive |
| `/clients/fakhrimart` | Verified case study and live destination |
| `/founder` | Yash's founder story, principles, and method |
| `/ai-workflow-audit` | The audit process, deliverables, and limits |
| `/company-second-brain` | The proposed knowledge-system scope and limits |
| `/terms` | Terms and conditions |

English UAE and Australia variants use `/ae` and `/au` prefixes. Prices come from the fixed market books in `data/pricing.js`; there is no exchange-rate conversion. Old Arabic URLs redirect to English UAE. Legacy `.html` URLs redirect to the corresponding clean route.

## Architecture

- Top-level HTML pages: content that remains readable before enhancements load.
- `src/site/site.css`: shared design system, page compositions, responsive and reduced-motion rules.
- `src/site/proof-mark.css` and `experience.js`: the original hero's opening animation, Scrollcraft scenes, scroll-index states, and custom-arrow motion.
- `src/site/scrollcraft.js` and `scrollcraft.css`: the Scrollcraft runtime used by the homepage.
- `src/site/inner-experience.css` and `inner-motion.js`: dedicated founder, client, and AI page art direction and entry/scroll motion.
- `src/site/app.js`: entry point; `market.js`, `plans.js`, `contact.js`, and `rae.js` own separate interactions. Rae loads on demand.
- `vite.config.mjs`: shared shell injection, multi-page configuration, and local preview route parity.
- `scripts/materialize-clean-routes.mjs` and `scripts/build-locales.mjs`: produce static clean routes and regional variants.
- `api/rae-chat.js` and `api/_rae-knowledge.js`: Rae's provider-backed, grounded streaming API and safe route/plan knowledge.
- `static/`: only assets shipped to the public site. `public/outbound-fresh/` contains older prospect material and is retained in source, but not copied into the build.

Rae is an opt-in companion. Her full-body vector character and expression styles come from the previous BRAYROAI award-experience branch; the grounded streaming transport and route allowlist remain from current `main`. The chat UI does not invent an answer when the provider fails. Existing provider configuration is required for real AI responses. Message drafts remain in the browser session. Route actions from the API are mapped to a local allowlist before becoming links.

The site self-hosts Manrope under its SIL Open Font License (see `static/fonts/OFL-Manrope.txt`). The founder-process images and Rae actor were recovered from the previous BRAYROAI site. The homepage uses real shipped FakhriMart screen assets as proof rather than generated client work.

## Work locally

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run qa:static
npm run preview -- --host 127.0.0.1 --port 4173
npm run test:browser
npm run test:stress
npm run test:lighthouse
node scripts/capture-preview.mjs
```

`test:lighthouse` is a local lab guardrail, not field Core Web Vitals. Screenshots and the JSON report are written under ignored `artifacts/`. `docs/REBUILD_NOTES.md` records the source comparison, creative decisions, migrations, and verification limits. Older files in `docs/` document previous iterations and are historical.
