# BRAYRO AI website

The public studio site is a Vite multi-page build with semantic HTML, CSS, small JavaScript modules, and a Vercel serverless endpoint for Rae. The original GitHub `main` hero remains the opening scene: Yash's monochrome portrait, “Digital, designed to feel different.” headline, and working colour toggle. The pages after it follow the Living Sketchbook direction.

## Routes

| Route | Content |
| --- | --- |
| `/` | Studio story, verified FakhriMart work, process, founder, starting points, contact |
| `/plans` | Website builds, monthly support, and practical AI scopes |
| `/clients/fakhrimart` | Verified case study and live destination |
| `/terms` | Terms and conditions |

English UAE and Australia variants use `/ae` and `/au` prefixes. Prices come from the fixed market books in `data/pricing.js`; there is no exchange-rate conversion. Old Arabic URLs redirect to English UAE. Retired page URLs redirect to their closest current destination.

## Architecture

- `index.html`, `plans.html`, `fakhrimart-case-study.html`, `terms.html`: content that remains readable before enhancements load.
- `src/site/site.css`: shared design system, page compositions, responsive and reduced-motion rules.
- `src/site/app.js`: entry point; `market.js`, `plans.js`, `contact.js`, `story.js`, and `rae.js` own separate interactions. Story and Rae code load when needed.
- `vite.config.mjs`: shared shell injection, multi-page configuration, and local preview route parity.
- `scripts/materialize-clean-routes.mjs` and `scripts/build-locales.mjs`: produce static clean routes and regional variants.
- `api/rae-chat.js` and `api/_rae-knowledge.js`: Rae's provider-backed, grounded streaming API and safe route/plan knowledge.
- `static/`: only assets shipped to the public site. `public/outbound-fresh/` contains older prospect material and is retained in source, but not copied into the build.

Rae is an opt-in companion. The chat UI does not invent an answer when the provider fails. Existing provider configuration is required for real AI responses. Her small vector face is derived from the original robot's shell, ears, visor and eyes; it replaces the heavy 3D runtime. Message drafts remain in the browser session. Route actions from the API are mapped to a local allowlist before becoming links.

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
