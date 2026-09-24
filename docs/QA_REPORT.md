# Experience and localization QA — 24 September 2026

This report covers the isolated `codex/brayroai-site-rae-redesign` worktree. It is a local production preview review, not a deployment approval.

## What changed

- A shared global navigation, local chapter index, market switcher and redesigned footer now connect the existing routes. The client archive and FakhriMart case remain. The orange FakhriMart homepage display and Project Studio section remain removed.
- The homepage now has original visual plates for web experiences, product design, frontend engineering and grounded AI; stronger typography and section pacing; visibility-gated motion; and an immediate, readable mobile hero.
- Rae now offers a guided project brief with editable handoff, published-offer comparison, verified-work routes, page and market awareness, and a detailed 2.5D character based on the supplied design sheet. A compact transparent WebP body and live SVG visor give Rae distinct chat expressions across launcher, header and stage. Reduced motion preserves the artwork without continuous animation. The live AI path still needs a configured provider in deployment.
- India, UAE English, UAE Arabic and Australia have fixed price books, localized landing/offer pages, currency-aware lead links, market persistence, canonical/hreflang metadata and a generated sitemap. UAE Arabic is RTL. Terms are English pending legal review.
- FakhriMart proof images use compressed WebP derivatives. The real founder and client imagery remain the sources of visual claims.

## Evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Original-route audit | 8 routes returned 200; 7 viewports per route had zero horizontal overflow, no uncaught page errors and no missing local fragments | `artifacts/experience/after/report.json` |
| Before/after visual capture | First screens on all 8 original routes at desktop and phone widths | `artifacts/experience/before/` and `artifacts/experience/after/` |
| Static gate | Syntax, integrity, production build, clean-route distribution and 24-page localization checks passed | `artifacts/qa-static-final.log` |
| Chromium journeys | 81 of 81 passed in the final browser batches before the footer interaction refinement | Playwright run output in this task |
| Stress | 200 requests at concurrency 20 across 39 routes/assets, zero failures; p95 302 ms on local preview | `npm run test:stress` run in this task |
| Firefox journeys | 34 passed, 1 skipped, 2 interrupted by a concurrent `dist` rebuild; both affected routes passed again on a stable build | `artifacts/qa-firefox-final.log`, `artifacts/qa-firefox-routes-final.log` |
| Footer interaction | On the homepage and client archive at 390px, the floating Rae launcher clears the visible footer and its Ask Rae button opens the chat | Manual Chromium check in this task |
| Mobile Lighthouse, homepage | Latest full-category run scored 98; LCP 2.26 s, TBT 22 ms, CLS 0; accessibility, best practices and SEO 100. An independent performance-only repeat also scored 98. | `artifacts/lighthouse-home-final.json` |
| Mobile Lighthouse, Arabic plans | Latest full-category run scored 92; LCP 2.79 s, TBT 111 ms, CLS 0.014; accessibility, best practices and SEO 100. Two independent performance-only repeats scored 93 and 94. The Arabic webfont stylesheet does not load on phones; the system Arabic face remains. | `artifacts/lighthouse-arabic-final.json` |
| Earlier Lighthouse variation | Earlier homepage runs scored 81 and 70 and Arabic plans scored 55. The homepage does not run the section-index director, so its change between runs reflects local lab variability. | `artifacts/lighthouse-inline-last.json`, `artifacts/lighthouse-inline-last-b.json`, `artifacts/lighthouse-arabic-plans-font.json` |
| Mobile section motion | At 390px the hidden section indexes are not constructed; resizing to 1440px creates six visible desktop indexes; resizing back leaves zero visible and no horizontal overflow. | Current Chromium viewport check |
| Country runtime smoke | All 24 generated pages returned 200 and initialized the correct market, route and fixed price book without page errors; all 30 current browser journeys across the site and market suites passed after the section-motion optimization | Current Chromium smoke and Playwright runs |
| Rae chat and visual states | 30 Chromium journeys passed; illustrated neutral, happy, thinking, listening and speaking states captured; 320–1920px responsive and reduced motion checks passed. Focused Firefox checks passed after a test-only timer race was corrected. | `artifacts/experience/after/rae-expression-*.png`, current Playwright runs |

The route audit is a layout/link/error check, not a complete accessibility or speed certification. Browser journeys include Rae’s guided brief, comparison, provider-safe rendering, keyboard interactions, responsive layout and reduced-motion behavior. The illustrated Rae previews are `artifacts/experience/after/rae-final-stage-1440.png` and `artifacts/experience/after/rae-final-390.png`; artwork source and asset details are in `docs/ART_DIRECTION.md`.

## Delivery and release constraints

- The work is pushed to the `codex/brayroai-site-rae-redesign` branch. No production deployment was made.
- The live AI provider needs deployment credentials and a production conversation check. Local tests cover the API contract, streaming/fallback behavior and safe rendering with mocks.
- Arabic service/marketing copy and fixed AED/AUD offers are present; Arabic legal terms need specialist review before public use.
- The latest local Lighthouse runs pass the mobile budget: performance at least 90, LCP at most 3 s, CLS below 0.05 and TBT at most 300 ms on the homepage and Arabic plans. Earlier local runs varied materially, so these results need confirmation on the deployed build and real devices. They are lab measurements, not production field data or deployment approval.
