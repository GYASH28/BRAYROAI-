# BRAYROAI

Production website for **BRAYROAI**, a founder-led creative technology studio combining design, frontend engineering, digital product work, and useful AI systems.

## Five-scene experience

The homepage is intentionally reduced to one continuous minimalist scroll film. The opening animation and hero remain a frozen visual contract; everything after the hero uses one visual language and one motion system.

1. **Home / Identity** — the frozen BRAYROAI hero establishes the studio.
2. **Services / System** — Web Experiences, Product Design, Frontend Engineering, and AI Systems live inside one focused interactive player.
3. **Work / Proof** — the real FakhriMart desktop and mobile experience becomes the dominant visual scene.
4. **Plans / Scope** — three clear starting prices are shown without turning the homepage into a pricing dashboard.
5. **Contact / Human** — founder presence, one clear proposition, and direct WhatsApp/email actions close the film.

The previous duplicate narrative chapters and standalone founder section were removed or merged. The homepage no longer loads the former stacked post-hero visual layers; it uses `styles.css` for the frozen/base system and `minimal-film.css` for the authored five-scene experience.

## Runtime

- semantic HTML and a complete no-JavaScript baseline
- native scrolling; no scroll hijacking or smooth-scroll dependency
- sticky viewport-sized scenes that progress like a SaaS product film
- one existing custom WebGL particle renderer used as a restrained connective layer
- one shared `requestAnimationFrame` scheduler
- scroll-directed service state changes with manual controls still available
- real FakhriMart desktop and mobile proof
- adaptive desktop, tablet, and mobile direction
- explicit WebGL fallback, reduced-motion mode, hidden-tab pause, and manual ambient-motion pause
- persisted light/dark theme
- keyboard-operable navigation and capability controls

## Commercial routes

The public scroll experience has five primary destinations: `#top`, `#services`, `#work`, `#plans`, and `#contact`.

`/plans` remains a detail utility route for visitors who deliberately want exact plan boundaries, support scopes, the plan finder, and pre-filled WhatsApp handoffs. It is not an additional homepage chapter.

Legacy pricing routes continue to resolve toward the current plan experience, while `public/outbound-fresh/` remains a separate private, noindex concept system and is not part of the public homepage film.

## Verified public facts

- FakhriMart is the only public client proof.
- Live project: <https://fakhriyarns.vercel.app/>
- Labels: Yarn wholesaler; Catalogue-led browsing; Desktop + mobile experience; Enquiry-led flow.
- Founder image: `/assets/about-yash.webp`.

## Commands

```bash
npm run test:syntax
npm run test:integrity
npm run build
npm run test:browser
npm run test:stress
```

`npm run qa:static` runs syntax, five-scene integrity, and the production build. CI additionally installs Chromium and runs browser interaction tests, responsive captures, concurrent-load checks, and a Lighthouse mobile audit.
