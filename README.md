# BRAYROAI

Production website for **BRAYROAI**, a founder-led creative technology studio combining design, frontend engineering, digital product work, and useful AI systems.

## Public architecture

The public experience has exactly five primary destinations:

1. **Home** — one authored scroll film: **SIGNAL BECOMING FORM**.
2. **Services** — the four connected studio disciplines and how they move from intent to implementation.
3. **Work** — real proof only: FakhriMart as the public client build, with Lernio AI and B.R.A.C.E. clearly identified as product/system work.
4. **Plans** — transparent one-time starting scopes at ₹2,599, ₹3,999, and ₹5,999+, plus explicit exclusions.
5. **Contact** — a low-friction founder-led handoff to WhatsApp or email.

The homepage does not behave like five stacked marketing sections. After the frozen hero, one persistent signal changes state as the visitor scrolls: potential → structure → interface → system → proof → scope → human → identity. Native scrolling remains authoritative; there is no smooth-scroll hijacking.

## Frozen opening contract

The intro loader and `#top` hero are intentionally protected. See `FROZEN-HERO.md`.

The exact hero markup SHA-256 remains:

`4adaa5b58fd6373a1d7fa467299a71d667d96a8a8a6d068c2ceed1fa45df9528`

The post-hero rebuild begins after that boundary. CI fails if the protected hero markup or controller contract changes unexpectedly.

## Production styling and runtime

The previous stack of overlapping production layers has been removed. The current public site uses:

- `public/styles.css` — critical base plus frozen hero contract
- `public/film.css` — the complete homepage film system
- `public/app.js` — hero, navigation, scroll-film, interaction, theme, and adaptive WebGL signal runtime
- `public/pages.css` — shared editorial system for Services, Work, Plans, and Contact
- `public/pages.js` — lightweight deep-page navigation behavior

Old `site-fixes.css`, `experience.css`, `cinematic.css`, `commercial.css`, `clarity.css`, `plans.css`, and `plans.js` are forbidden from the production bundle by the integrity gate.

## Motion and resilience

- native scrolling drives every narrative state
- desktop uses bounded sticky scenes and one persistent WebGL signal field
- mobile/tablet resolve into ordinary readable document flow where spatial pinning would hurt comprehension
- reduced motion removes sticky choreography and WebGL while preserving the final art direction
- explicit non-WebGL fallback is browser-tested
- ambient motion can be paused without disabling navigation or content
- theme preference persists
- no content or action depends on hover

## Verified public facts

- FakhriMart is the only public client proof.
- Live project: <https://fakhriyarns.vercel.app/>
- Product/system repositories used truthfully in Work:
  - <https://github.com/GYASH28/LERNIOAI>
  - <https://github.com/GYASH28/B.R.A.C.E>
- Founder image: `/assets/about-yash.webp`.
- No invented testimonials, awards, conversion metrics, client logos, or scarcity claims are used.

## Commercial boundaries

Homepage and Plans preserve the current starting scopes:

- Website Starter — `₹2,599`
- Business Website — `₹3,999`
- Custom Experience — `₹5,999+`

Hosting, domains, paid tools, ecommerce, large content work, and advanced integrations are scoped separately.

## QA

```bash
npm run test:syntax
npm run test:integrity
npm run build
npm run test:browser
npm run test:stress
```

`npm run qa:static` runs syntax, frozen-contract/architecture integrity, and the five-entry production build.

Pull-request CI additionally runs:

- 1,000-request concurrent stress testing at concurrency 45
- 16 Playwright browser/interaction tests
- automated serious/critical accessibility checks on Home and all deep destinations
- exact mobile reflow checks down to 320px
- bidirectional scroll-state, reduced-motion, motion-pause, theme-persistence, and WebGL-fallback tests
- responsive visual captures at 1440, 1280, 768, 430, 390, 360, and 320 widths
- desktop/mobile deep-page visual evidence that deliberately scrolls through lazy proof media before capture
- mobile Lighthouse audits for all five routes

The accepted rebuild gate reached 90+ homepage performance and 99–100 performance on the four deep destinations, with 98–100 accessibility and 100 Best Practices / SEO in the final pre-merge audit.

## Reference discipline

ZEXVRO was browser-audited as a reference for pacing, hierarchy, negative space, fixed/sticky behavior, and responsive simplification. BRAYROAI deliberately does **not** copy its branding, layouts, assets, Web3 styling, wording, or card catalogue. The transferable lesson is restraint and spatial consistency, expressed through BRAYROAI's own signal system.

`public/outbound-fresh/` remains a separate private/noindex concept system and is not part of the five-destination public experience.
