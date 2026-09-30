# Design and implementation plan

## Objective and constraints

Rebuild the full public BRAYROAI site from the current GitHub `main` history into a distinct premium creative studio experience. Preserve the existing founder-first homepage hero's subject and controls: Yash's real portrait, original brand line, working monochrome/color control, and custom hand-drawn arrow. Recompose it with the owner's new tile-fracture wordmark and brand kit. Give the site a visible, purposeful opening sequence. Keep every live page, market variant, contact path, Rae behavior, service fact, client claim and approved price correct.

The hero enters immediately behind a lightweight animation. The page will never wait for a preloader or hide its basic information while scripts settle. Do not promise an award outcome. Use the award studies as reference for craft, composition, pace and specificity, not as templates.

## Proposed site identity: *A Studio in Layers*

An editorial digital workshop photographed and constructed from real material. Ink and warm white hold the field; the existing BRAYROAI signal orange draws the route through the screen. Real interface captures sit inside measured frames, like finished work placed on a proof table. The screen, founder and Rae are the subjects. Grain, hardware and interface lines supply depth; neither generic glass cards nor decorative neon particles carry the meaning.

| Role | Direction |
| --- | --- |
| Ground | Charcoal/ink; selected pages use warm white only as a clear reading surface. Transitions keep a legible dark-light relationship. |
| Brand accent | BRAYROAI's actual signal orange, reserved for the hand-drawn mark, active route, selected details and calls to act. |
| Typography | Keep the real self-hosted Manrope family for display/prose, with the existing monospaced face treatment for factual meta. Establish a stronger editorial scale and deliberate line breaks; do not add a remote font. |
| Imagery | Existing portrait, studio process table, Rae character and real FakhriMart captures. Generate one new premium still-life process photograph with no fake website screens, people, lettering, logo or client evidence. |
| Geometry | 16:10 and 9:16 real work frames, measured rules, oversized typesetting, asymmetrical but balanced composition. Deep corners only for actual controls. No default bento, testimonial row, stat counters or generic icon cloud. |

UI/UX Pro Max gave a useful Scroll-Triggered Storytelling pattern, including complete non-motion reading order, mobile simplification and a legible reduced-motion final state. Two rounds returned mismatched Brutalist styles, off-brand pink/cyan colors and a GSAP example; those were checked and deliberately rejected. Its accessibility and responsiveness guidance is accepted. Taste dials are 9 variance, 9 motion and 3 density, constrained by BRAYROAI's existing type, color, content and access needs.

## Homepage grammar and journey

**Grammar: Filmic one-shot.** This is one linear studio story, with the first screen already recognizable, one main project action, no permanent chapter counter, no forced snap-scroll, and no unrelated pages interleaved with the case. It differs from all three registered BRAYROAI builds by grammar, navigation, scene sequence, close and bespoke move. The recurring arrow is shared brand identity; its new action differs from the previous screen-assembly effect.

| Scene | Feeling | Screen event / purpose | Interaction and truth |
| --- | --- | --- | --- |
| Opening / founder | Recognition | Retained Yash portrait, backdrop, headline and color affordance. The approved tile wordmark anchors a clean header; the portrait arrives inside a framed photographic field; a light sweep and the custom orange arrow draw mark the entrance. The hero is visible immediately, with a quiet resting state already styled. | Three.js is not a startup prerequisite. The hero still explains the studio with JavaScript off and under reduced motion. The initial expensive image matte and scripted title sequence were removed after Lighthouse showed blocking-time regressions. |
| Work comes into focus | Curiosity | The frame tightens on the one verifiable client project, which supplies practical evidence rather than gallery filler. | Real FakhriMart desktop/mobile captures link to `/clients/fakhrimart`; no invented business outcome. |
| Responsive proof / peak | Surprise | The two real captures become one framed viewport. Under scroll and hand input, the outer 16:10 screen compresses and turns into the actual 9:16 phone screen. The custom orange arrow is the interaction handle, not a decorative cursor. One calm hold follows the alignment. | Click, pointer drag, keyboard arrows and an ordinary desktop/mobile toggle reach the same states. Both images have precise labels. The peak sentence is: “I dragged BRAYROAI's hand-drawn arrow and the real website changed from the whole desktop to the phone.” It gets the longest held span. |
| The decisions | Clarity | The physical studio-table still life and one real interface crop provide a slow macro view of `Find → Choose → Enquire`. Type and callouts stay in HTML; this does not claim invisible technical work or create fake app chrome. | Link to the published case details. |
| Rae, in her role | Delight | The existing Rae face/body opens from idle into an attentive expression; an accurately-labelled companion entry explains what she can help compare or find. | The existing opt-in assistant remains real and grounded. Its panel opens, streams/handles provider fallback, dismisses, and exposes link actions through proper anchors. |
| Return to Yash | Intimacy | The founder stays legible and human. Real portrait and a short direct introduction make the one-person production model clear. Quiet stretch after the animated steps. | Link to the founder route. |
| Start / site map | Resolve | A genuine brief is the ending. The page lands on a quiet ink departure plate, one clear project action, direct email/WhatsApp, a compact complete route map, and the restored custom arrow. No bright end card competes with it. | The form has normal labels/feedback and a no-script/direct-contact path. All inner routes remain one click away. |

**Pacing budget:** seven scenes, about 11 viewport-heights desktop (peak materially longer, admin/links short). Use one opening beat, one 3D scroll instrument, and sparse light/hover work. Other content reads in normal flow. Only one dramatic peak. A stopping visitor sees the result of the motion, never a content gap.

## Motion, image and software choices

- Continue the repository's Scrollcraft runtime: flow, reveal, one intentional pinned proof and one project-specific layout behavior. Do not edit the shared engine while the new page is expressed through markup and local CSS/JS. Keep genuine wheel/touch/keyboard behavior.
- Anime.js 4.5.0 (MIT) was evaluated and initially implemented, then removed after a Lighthouse run showed its opening choreography drove mobile blocking time far above the release guardrail. The same visible entrance uses lightweight CSS transforms, with an immediate readable first frame and reduced-motion final state.
- **Three.js (MIT)** is limited to the real Fakhri desktop/mobile proof instrument: two project screenshots on actual image planes in a shallow virtual camera rig, a few code-authored alignment particles and one scroll/drag-driven rotation/reframe. It is not loaded until the proof stage enters, uses a pixel-ratio cap and demand rendering, and yields to a real-image version on mobile, WebGL loss and reduced motion. No 3D chatbot, dummy dashboard or fabricated UI.
- Use browser view transitions only as progressive enhancement after official compatibility is checked. A multi-page route must remain directly addressable and work on Vercel with or without the transition.
- One original process still life fills the art gap around genuine assets. It is an atmosphere/photo only. No generated user identity, client logo, screen text, fake testimonials or product imagery.
- Do not add Lenis (native scrolling and history/hash navigation remain authoritative), GSAP (overlaps Scrollcraft and Anime.js), Lottie, paid asset SDKs or remote autoplay scenes. No image embeds are fetched at runtime except existing site assets.

## Sitewide art and behavior

- Rework shared header, mobile menu, active-route mark, market selector and Rae/quick-contact placements around the earlier premium BRAYROAI shell. Preserve functional destination URLs and data semantics. Header is compact, deliberate and touch-safe; mobile has a real dismissible menu and visible Escape/focus handling.
- Rebuild the footer from the earlier fuller version: clear large editorial close, three route/contact columns, links to the complete site/terms and all true direct actions. Link targets come from a verified route manifest.
- Inner pages get individual entrances and compositions rather than copies of a single generic split hero or card grid. Shared type, rules, primary action and focus system bind them:

| Route | Art direction / purpose |
| --- | --- |
| `/plans` | Scope selector and differentiated work/care/AI offerings; build fees and monthly care are separate choices. Exact items, prices, caveats and category behavior continue to come from `data/pricing.js`. No sales math animation. |
| `/clients` | Honest one-project folio, clearly labelled as verified client work. FakhriMart's real responsive images give the page its composition. |
| `/clients/fakhrimart` | Custom editorial case history: need, decisions, working desktop/mobile screenshots, destination link and the truthful scope. A deliberate media shift instead of a grid. |
| `/founder` | Yash's real portraits and written principles; less image overlap than the homepage, measured fact line, clear way to the studio. |
| `/ai-workflow-audit` | Audit boundaries and real steps in a legible technical sheet. Explain checks and deliverables without an invented report/dashboard or scores. |
| `/company-second-brain` | Original service concept, scope and limits. Avoid language that implies sync, privacy guarantees or a released product not supported by the page. |
| `/terms` | Quiet, keyboard-friendly reading layout. No forced reveals, animations, desktop sidebar trap or tiny legal type. |
| `/ae`, `/au` and generated market variants | Market selector, route prefixes and approved local price books stay consistent. Never calculate converted prices. Existing clean routes, `.html` redirects and legacy Arabic handling remain intact. |

## Implementation order

1. Capture and document the baseline against clean GitHub `main`, then establish route and copy inventories. Confirm working tree changes belong to this task and keep `main` the primary branch.
2. Finish the award review and this project skill before changing production-site code. (Done: 50 official project records, live-state inspection with documented access limits, and validated local skill.)
3. Generate/inspect the single custom studio image and map it to a specific process-page need. (Done: background-only table still, with asset provenance recorded.)
4. Write the exact verified journey and design tokens, then implement the global responsive shell and preserved hero.
5. Build the homepage story/peak, with measured fallbacks for no JS, touch, low GPU, no WebGL, slow image decode, and reduced motion.
6. Give all route families the art-directed, fact-preserving page treatments above; recheck sitemap, locale, anchors, redirects, Rae and form action mappings.
7. Run an iterative local visual pass: screenshot the initial frame, the route peak before/during/after interaction, the final contact close, the same waypoints at 390 and 768px, and representative inner pages. Review at slow scroll, fast scroll and reverse scroll. Correct image crop, dwell, cue order, marker legibility, pointer/keyboard parity, text contrast and real motion judder from evidence.
8. At the very end run existing CI/static checks, full Playwright, accessibility/integrity/localization/stress, production build and Lighthouse at agreed breakpoints. Fix all reproducible defects and rerun only the affected gates.
9. Commit and push to the existing GitHub `main`. Wait for its Vercel deployment, verify the exact commit/build state and smoke every real route group/asset/interaction on the deployed domain before reporting live status.

## Release acceptance

- Hero identity and original content are preserved, now with the visible opening sequence.
- At least four distinct useful motion behaviors appear (opening, transform/perspective/parallax, scroll reveal, authentic viewport orbit, hand-drawn line/pointer), varied by emotional purpose rather than applied to every heading.
- The full route inventory, market books, return navigation, quick-contact controls, Rae, forms and direct links work; no placeholders or broken `#` targets.
- The handmade arrow feels like BRAYROAI across the journey. At the work peak, its knob drives the real large/small screen pair through pointer, keyboard and touch fallback.
- Reduced-motion, non-WebGL and offline-poster states remain polished and understandable. Text and controls are still real DOM.
- Large screen and narrow mobile crops are both composed intentionally. Scroll is not trapped, content is never unreachable and CLS/console/request/runtime failures are removed.
- No fabricated project results, testimonials or measurements. No award/outcome promise.
- The live deployment matches the commit pushed to `main` and each route group loads its expected assets.
