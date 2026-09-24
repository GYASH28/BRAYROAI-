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
| Mobile Lighthouse, homepage | Two current isolated runs scored 81 and 70; LCP 2.72 s and 3.78 s; TBT 478 ms and 397 ms; CLS 0; accessibility, best practices and SEO 100 | `artifacts/lighthouse-inline-last.json`, `artifacts/lighthouse-inline-last-b.json` |
| Mobile Lighthouse, Arabic plans | One current isolated run scored 55; LCP 4.25 s, TBT 825 ms, CLS 0.014, accessibility 100. The Arabic webfont stylesheet no longer loads on phones; the system Arabic face remains. | `artifacts/lighthouse-arabic-plans-font.json` |
| Country runtime smoke | All 24 generated pages returned 200 and initialized the correct market, route and fixed price book without page errors; seven representative browser journeys passed after the inline runtime change | Current Chromium smoke and Playwright runs |
| Rae chat and visual states | 30 Chromium journeys passed; illustrated neutral, happy, thinking, listening and speaking states captured; 320–1920px responsive and reduced motion checks passed. Focused Firefox checks passed after a test-only timer race was corrected. | `artifacts/experience/after/rae-expression-*.png`, current Playwright runs |

The route audit is a layout/link/error check, not a complete accessibility or speed certification. Browser journeys include Rae’s guided brief, comparison, provider-safe rendering, keyboard interactions, responsive layout and reduced-motion behavior. The illustrated Rae previews are `artifacts/experience/after/rae-final-stage-1440.png` and `artifacts/experience/after/rae-final-390.png`; artwork source and asset details are in `docs/ART_DIRECTION.md`.

## Delivery and release constraints

- No production push or deployment was made.
- The live AI provider needs deployment credentials and a production conversation check. Local tests cover the API contract, streaming/fallback behavior and safe rendering with mocks.
- Arabic service/marketing copy and fixed AED/AUD offers are present; Arabic legal terms need specialist review before public use.
- The mobile Lighthouse launch budget still fails. It requires performance 90, LCP at most 3 s, CLS below 0.05 and TBT at most 300 ms. Homepage lab runs vary materially with local style/layout timing, even on the same build. Inlining the small market context at the end of the head reduced blocking time relative to the earlier 979 ms trial, but neither current homepage run passes the full budget; Arabic plans is slower. These scores are local lab measurements, not production field data, and the build is not release-qualified.
