# BRAYROAI experience audit — 27 September 2026

## Authority and scope

This audit starts from GitHub `main` at `4bee282` in an isolated worktree. The local checkout at `/home/yashg/Documents/ChatGPT/BRAYROAI AGENCY` has unrelated uncommitted work and was left untouched. The user directly authorized implementation and explicitly rejected the 3D Rae, so the attached brief's audit approval gate and GLB requirement do not apply to this pass. This audit records evidence and remaining work; it is not a claim that the transformation is finished.

The site is a Vite multi-page HTML application with targeted React islands. Its eight core routes and 24 generated market/locale pages remain. `data/markets.js` and `data/pricing.js` are the fixed price sources. Current production credentials and edge country detection have not been verified here.

## Measured and rendered evidence

- `npm run qa:static` passed after the SVG-only Rae and optional film changes: syntax, integrity, build, distribution/CSP, and localization. The localization check covers 24 pages, 24 offer placements, and 24 price-aware leads.
- The route audit in [report.json](audit-captures-2026-09-27/report.json) returned HTTP 200, no page errors, no missing local fragments, and zero **document** overflow at seven viewport shapes for each core route. This does not detect text clipped inside a component.
- First-fold captures for every core route at 390 and 1440 pixels are in [audit-captures-2026-09-27](audit-captures-2026-09-27). They use reduced motion so typography, hierarchy, and fallback quality can be reviewed without waiting for a choreography state. Full-page scroll, focus, touch, and performance recordings remain to be captured.
- A desktop browser inspection showed the shared header contracting from roughly 1393 × 64 px to 1080 × 52 px after scrolling 800 px; `is-compact` was active. This confirms the requested shrink behavior exists on current `main`, although menu, anchor-offset, and RTL review remain.
- The former desktop Rae experience lazily loaded a **541.10 kB minified / 135.26 kB gzip** WebGL chunk on open. The current build contains no Rae 3D chunk. This is an *on-open* savings, not an initial page-load savings. The homepage CSS bundle is still about 229 kB uncompressed / 44.4 kB gzip, and the shared client chunk is about 218.98 kB / 68.35 kB gzip.
- The first-visit desktop film formerly covered the entire usable hero with a black loading screen. The homepage now shows its real hero and actions immediately; the existing film is an optional, skippable action. The opt-in flow was tested in a browser.
- Focused Rae browser journeys passed (33 Chromium tests) before the optional film change; the SVG-only character and signature scenes then passed three focused Chromium tests. These are functional checks, not proof that every expression is visually finished.
- The V22 stress journey passed 800 local requests at concurrency 28, plus interactions on all eight pages: zero failures, 213 ms local median and 462 ms local p95. These are preview-server response times, not real-user latency.
- A local Lighthouse mobile run scored performance **42**, accessibility **100**, best practices **100**, SEO **100**. LCP was **5.30 s**, TBT **1.25 s**, CLS **0.000**. A repeat performance-only run scored **56** with materially different blocking time; controlled runs that blocked either the commercial bootstrap or Google Fonts scored **49** and **55** respectively. Those blocked runs diagnose possible contributors and are not valid release scores. All unblocked runs fail the 90 performance goal. In the first trace the hero portrait was LCP; its image request finished early, while paint waited on main-thread work. The first report attributed about 7.7 s of work to style/layout and recorded 20 long tasks. The 229 kB home CSS and sequential startup scripts remain primary areas for trace-led reduction. A modest physical phone and production RUM were not measured.
- The existing desktop-only font stylesheet was still being activated on phone widths by `layout-fonts.js`. A guarded activation removes that remote request on 390 px; a desktop visit still requests the font CSS and a phone-to-desktop resize activates it. One Lighthouse run after this change scored **50**, within the spread of earlier runs, so there is no defensible overall score improvement claim yet.
- A deliberately empty page on the same local preview host scored only **59** in the same mobile Lighthouse setup (LCP 4.11 s, TBT 723 ms). The host is adding substantial run-to-run noise; this does not erase the site's own startup costs. A trial using `content-visibility:auto` on later chapters scored 59 and 48 without a repeatable layout benefit, so that trial was removed.
- The `/clients` hero now shows an actual approved FakhriMart preview on desktop. The archive's only verified case is present in static HTML, including the case and live-site links; JavaScript enhances filtering without replacing the card. This preserves the evidence when JavaScript is unavailable and avoids a client-side card rebuild. The Arabic build translates the card in HTML, and an RTL capture confirms the hero preview does not collide with the title. Updated [English](audit-captures-2026-09-27/clients-desktop-1440.jpg) and [Arabic](audit-captures-2026-09-27/clients-arabic-desktop-1440.jpg) captures record the first fold.

## Route review from the current captures

| Route | Strong current work | Next design and QA pass |
| --- | --- | --- |
| `/` | Founder portrait, direct offer, disciplined ink/ivory/orange. Film now leaves first paint usable. | Full scroll pacing and chapter handoffs; check film discoverability, compact header transitions, and low-end frame timing. |
| `/plans` | Clear need-first question, visible market context, interactive choice. | Review long-page scan speed, keyboard comparison, mobile action handoff, and all offer/price variants. |
| `/founder` | Real portrait and a readable mobile first fold. | Give process/story chapters distinct quiet interactions without competing with the portrait. |
| `/clients` | Honest split between one verified live project and studio work. The verified case is now visible in the desktop first fold and present in static HTML. | Check image crop and load cost on a physical phone and desktop; validate future archive entries against the same evidence standard. |
| `/clients/fakhrimart` | Actual client case, direct live-site and archive links, good mobile hierarchy. | Full-page image crops, external destination, keyboard/touch gallery, and evidence wording review. |
| `/ai-workflow-audit` | Offer and price are immediately legible; signal scene has a clear concept. | Check whether animated signal explains the process in motion, and profile its offscreen behavior. |
| `/company-second-brain` | Strong source-to-answer message, price, and mobile typography. | Test line wrapping and top rail at 320 px/Arabic; ensure sample data never implies a live connector. |
| `/terms` | Calm reading hierarchy, visible section index, restrained motion. | Manual long-form keyboard and RTL review; qualified review remains necessary before Arabic legal copy is authoritative. |

## Research and art direction

The research agent examined [Awwwards' agency gallery](https://www.awwwards.com/websites/design-agencies/), [shadcn/ui](https://ui.shadcn.com/docs/components), [21st.dev](https://docs.21st.dev/), [React Bits](https://reactbits.dev/get-started/index), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Motion](https://motion.dev/docs/react), and [MDN View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API). Awwwards conference material and a [creative-code talk by Bruno Imbrizi](https://www.classcentral.com/course/youtube-creative-code-merging-design-and-programming-bruno-imbrizi-430950) were identified as further study; the talk itself was not watched in this pass. [web.dev's animation guidance](https://web.dev/articles/animations-and-performance) supports testing transform/opacity motion and limiting expensive paint and layout work.

The research agent initially assessed an older checkout and thought the project had no React. The authoritative `main` checkout **does** have React 19 and four targeted islands. V42 already includes source-adapted shadcn-style toggle controls, a React Bits-inspired spotlight card, and a 21st.dev-inspired magnetic action; provenance is in `docs/component-manifest-v42.md`. Further libraries should be chosen for a specific scene after licensing, keyboard, touch, and bundle review. Dependency count is not a measure of craft.

Three directions remain viable:

1. **Signal Editorial — recommended.** Keep the current ink/bone/orange identity. An orange point becomes a rule, image aperture, decision path, and Rae light across chapters. Use restrained typography and whitespace between intense scenes. Lowest continuity and runtime risk.
2. **Tactile Product Gallery.** Frame real screens and case imagery like physical artifacts. Strongest for the FakhriMart case; use this as a secondary material treatment rather than replacing the identity.
3. **Architectural Light.** Sparse light planes and dark volumes could create a signature AI scene. Highest contrast and GPU risk; prototype only one bounded chapter if the first two directions cannot deliver the desired depth.

The motion grammar is one principal motion verb per chapter, a short feedback scale for controls, and stillness after each reveal. Preserve native scroll, let static states explain the content, pause offscreen effects, and avoid a second global frame loop. Use the existing React islands where interaction benefits; there is no current evidence justifying a wholesale React migration.

## Rae decision and remaining visual work

The 3D actor was visibly flatter and less faithful than the supplied character sheet. It also swapped the character's appearance between desktop and mobile. Rae now uses the same original full-body SVG in every placement, with additional ceramic, glass, joint, panel, boot, and lighting geometry. The former Three.js renderer, 2 MB of vendored source, its CSS host, and its load path were removed. Chat transport, guidance, safe actions, and provider fallback remain intact.

The user is right that the expression set needs deeper art direction. A twenty-state contact sheet was inspected. It exposed cheek shapes that could escape the visor and several mouths that lacked a distinct silhouette. The face is now clipped to the visor, with dedicated frown and open-mouth geometry rather than scaling one smile into every emotion. Legacy CSS was also overriding the SVG gradients and orange smile; the v3 rig now retains its own ceramic and light treatment. A subsequent body pass replaced mitten marks with drawn glove shells and finger geometry. Greeting uses a two-finger gesture, listening and speaking use an open hand, and celebration lifts both articulated arms. The [updated 21-state rendered sheet](audit-captures-2026-09-27/rae-svg-21-states.webp) records every current face and static pose with reduced motion enabled. The mobile chat stage was also inspected at 390 px. Character details remain small at that size; further work should refine the hand silhouette and rapid normal-motion transitions without making the SVG costly.

## Open work before a release claim

1. Inspect and refine every full-page scroll, not only first folds; deliver a distinctive, coherent signature moment on each nonlegal page. Preserve factual offers, prices, and client proof.
2. Complete Rae's art-direction pass against the original sheet, including 320 px/desktop states, rapid transitions, and chat-state honesty. Keep the complete SVG as the only character; do not restore WebGL Rae.
3. Profile and consolidate the remaining motion/CSS ownership where actual traces show cost. Capture modest-device frame pacing, memory, image decode, LCP, CLS, interaction latency, and repeated Lighthouse runs. No production performance score is claimed here.
4. Run the full Chromium and Firefox journey suite after final changes, plus market/RTL, keyboard, Axe, reduced-motion, Save-Data, and external link/contact checks. Verify the deployed edge country hint and the live AI provider only with real deployment configuration.
5. Obtain qualified review of Arabic legal copy and any changed factual marketing language. Maintain honest limitations in the final report.

The strongest next visual investment is the verified-work gallery and one connected home-to-capabilities handoff. More decorative components across every section would make the site slower and less authored.
