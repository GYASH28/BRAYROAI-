# Living Sketchbook rebuild — implementation notes

## Source comparison

The online GitHub `main` commit `4bee2824df47f508be2f5be83ffc984f3b43ae91` was the implementation base. The separate local checkout on `codex/cinematic-offer-rebuild` had uncommitted changes; it was not merged into this branch or overwritten. The GitHub baseline had a V20 portrait hero, many numbered CSS and JavaScript layers, React/Three islands, multiple old offer and founder routes, four regional/language paths including Arabic, and a streaming Rae API. A clean detached baseline build was rendered for visual and performance comparison.

The user specifically asked to keep the old hero. That later instruction overrides the attached creative brief's proposed opening-scene replacement. The hero still uses its original portrait assets, headline, composition and colour interaction. Subsequent scenes, inner pages, navigation, market flow, and asset delivery were rebuilt.

## Decisions and boundaries

- The home sequence puts real FakhriMart work immediately after the hero, then a custom three-state artboard for clarify/create/connect, founder context, starting points and a direct brief. The artwork uses authored CSS and SVG rather than third-party components.
- The plans page shows three clear categories and the original independent INR, AED and AUD prices. Scope notes keep starting prices from being mistaken for fixed all-in proposals.
- English is the only published language. Earlier `/ae/ar` URLs and stored `ae-ar` market preferences resolve to English UAE. Manual market selection persists; automatic detection runs only for a new India-root visit and yields to the manual choice.
- Rae's existing API still uses configured providers, source knowledge, bounded histories, security checks and streaming errors. The browser loads Rae only when opened and maps any suggested navigation to a local route allowlist. The character is a light SVG using the original Rae head geometry and colours.
- The original terms substance was retained and restyled; pricing references now point to current plans. No new legal claim was invented.
- No new animation, UI, icon or font package was installed. Native CSS and browser APIs cover the single scroll narrative and the small interactions. This avoids licensing and runtime overhead from an unused motion library.
- The previous `public/outbound-fresh/` prospect materials remain in source but are excluded from the public output by Vite's `static` public directory. Previous obsolete public layers, routes and tests were removed; current behavior and security tests replace the retired assumptions.

## Route map

| Earlier destination | Current destination |
| --- | --- |
| `/clients` | `/#work` |
| `/founder` | `/#studio` |
| `/ai-workflow-audit` | `/plans#ai-audit` |
| `/company-second-brain` | `/plans#second-brain` |
| `/case-studies/fakhrimart` | `/clients/fakhrimart` |
| `/ae/ar/*` | corresponding English `/ae/*` path |

The equivalent `/ae` and `/au` retired offer and founder paths also redirect. The published sitemap contains only current route families.

## Evidence and limits

The final branch checks should include `npm run qa:static`, the Playwright browser journey, stress test, and Lighthouse budget. The browser suite covers viewport widths 360, 390, 768 and 1440 px, direct and hash routes, manual/delayed markets, English regional prices, menu/dialog interaction, reduced motion, Rae error and draft behavior, accessibility, and route return. The API suite checks contract, provider fallback and security. Screenshots are generated in `artifacts/screenshots/` for desktop and mobile composition review.

Single-run local Lighthouse before this rebuild scored 63 performance / 100 accessibility / 100 best practices / 100 SEO on the GitHub baseline. Rebuilt-home local runs have scored from 84 to 90 performance, with 100 on the other categories. The CPU-throttled test varies on this desktop, and the latest run did not meet the 90 performance / 300 ms blocking-time guardrail. CI on a clean runner is the next qualification point. These lab observations are not real-user Web Vitals or a production traffic result. The Rae provider, Vercel runtime, live redirects, and post-deployment behavior need validation on the deployed environment. No conversion uplift, customer metric, or live AI availability is claimed.
