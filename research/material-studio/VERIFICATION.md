# Make your mark — current refinement qualification

2 October 2026. This section records the current changes before their main release. Earlier sections are historical evidence for earlier designs.

## Delivered design

Large centred Space Grotesk “Make your MARK.” with four responsive letterforms, brighter authored particle ribbons and the preserved full-screen BR assembly/paper handoff. The four rejected homepage scenes are replaced by a native website/monthly/AI project choice with useful scope, price and next action. Inset glass navigation and regional dialog, nine full-plan pop-ups, a new Rae conversation workspace and the complete founder/studio body are integrated. Genuine client proof, approved identity/footer, independent prices, working terms, contact drafts and all routes remain.

## Visual evidence

`artifacts/mark-studio/` contains inspected desktop 1440×900, phone 390×844/320×568 and landscape 667×375 states; opening, pointer response, formed mark, paper transition, reverse, homepage choice, market, plans, Rae and studio captures. The reviewed layouts have no horizontal overflow and keep the opening action within the viewport. Source room estimates were corrected using measured rendered heights. Reduced motion and failed enhancement retain readable content; the homepage choice also works with HTML/CSS alone.

## Actual fixes found during qualification

- The shared glass stylesheet was initially absent from the production bundle. The Vite shell now runs before HTML asset processing; the built pages use the compiled stylesheet.
- An entry animation completion reset a stationary pointer's type response. Remeasurement now retains that pointer and repaints the four letters.
- Full-plan muted labels had contrast 4.46:1. They now use a darker colour and pass the open-dialog audit.
- A strict global exception fixture exposed a saved-market redirect abandoning the incoming native transition before reveal. The initial rendering-callback delay passed four local journeys but proved insufficient in CI. Country changes now use a controlled 180ms fade/blur and opt out of the competing native snapshot for that context replacement. Preference redirects wait for the actual head-observed `pagereveal` readiness. The existing exception assertion and specific native readiness handling remain intact.
- Rae request ownership now guards every asynchronous continuation and terminal history commit. Cancelled text/actions cannot contaminate a later reply; only completed history and allowlisted metadata survive.

## Local qualification

- Syntax, API contract/provider fallback/security, source integrity, distribution and all regional routes/prices: passed.
- All JavaScript, including lazy modules: 276,637 compressed bytes, below the unchanged 350KB budget.
- Mobile Lighthouse: **97 performance / 100 accessibility / 100 best practices / 100 SEO**. LCP **2439ms**, TBT **83ms**, CLS **0**; unchanged budgets passed. This report precedes the redirect scheduling fix, which does not execute for the audited fresh default-market opening. The exact released source is audited again by both workflows.
- Five affected integrated browser journeys passed with zero retries: particles/reverse/footer/mobile/reduced motion, native choice without JavaScript, studio keyboard controls, shared market accessibility and all 27 full-plan/market combinations including native dismissal, scope, enquiry and focus return.
- The full 14-test strict exception run then passed 13 journeys and exposed the early market-transition rejection. After its fix, all four affected redirect/history/draft journeys passed with zero retries and no uncaught exceptions. The Rae cancellation/new-thread/history/open-dialog audit passed in the full run.
- Route stress: **240 requests across 20 routes passed**.

## Release audit investigation

The design release `5fdf074` reached READY canonical Vercel with the matching commit marker. Its [production workflow](https://github.com/GYASH28/BRAYROAI-/actions/runs/36990310611) passed all 14 strict browser journeys and 360 requests across 20 routes. Production Lighthouse was **99/100/100/100**, LCP **2004ms**, TBT **0ms**, CLS **0.00025**.

The separate [quality workflow](https://github.com/GYASH28/BRAYROAI-/actions/runs/36990310617) failed Lighthouse: **81/100/100/100**, LCP **2650ms**, TBT **445ms**. Its browser step did not run after that failure. Both saved traces used system Chrome 154. The failed trace spent 1546ms on style/layout versus 267ms in production, and included full-browser omnibox startup work; its longest renderer task was layout/paint, not the particle renderer. The mobile opening did not load the Three/React module.

A shared audit script now launches the headless Chromium bundled with the project lockfile through Playwright and gives Lighthouse that isolated CDP endpoint. The local, build and deployed audits use that same entry point. It retains Lighthouse's default mobile throttling, every category, saved report/trace assets, and the existing fail-fast budget checker. Launch failures and budget failures remain failures. This removes host-browser version selection and full-browser UI startup from the test setup; it does not establish a performance pass by itself.

Initial local verification of the pinned regular browser scored 69 (TBT1455ms), and the shared headless runner scored 79 (TBT746ms); neither qualifies performance. The host load average was approximately 4.7 with active desktop/browser rendering. The exact next GitHub run must qualify both workflows before completion. Reports are retained under `artifacts/mark-studio/`.

### Subsequent audit and navigation correction

On `f3b8750`, the shared pinned audits passed: build **98/100/100/100**, LCP2426ms/TBT0ms; production **100/100/100/100**, LCP1567ms/TBT3ms. Both browser suites passed 13 journeys and failed one: quality caught the market transition exception, while production's last popup dismissal check clicked the backdrop before its fresh lazy dialog was visible. The strict fixtures retained those failures.

The market error also reproduced in two of three local runs after waiting only for native reveal; the trace places it during the country choice before the later saved-preference redirect. That replacement now uses its own brief fade rather than racing a native snapshot with modal top-layer changes. Three consecutive manual-market runs then passed with zero retries. Market destinations also preserve search parameters before hash anchors; the existing journey now verifies `?ref=brief#monthly-support` reaches the selected UAE category. The popup dismissal test waits for the visible lazy dialog before clicking its backdrop. The screenshot script now targets the actual new project-path section and waits for Rae to open.

A real-provider browser check on canonical `f3b8750` completed via Gemini in6593ms with `done.finishReason=stop`, correct ₹9,999 website/₹2,599 monthly prices, and zero console/page errors. Desktop/mobile captures are in `artifacts/mark-studio/`. Final exact-commit qualification remains required after the navigation fixes.

The five affected navigation/dialog journeys passed with one worker and zero retries (1.1min), including the query/anchor case and all 27 offer/market combinations. Syntax/API/security/provider fallback/source/distribution/localization passed; current compressed JavaScript is276789bytes. The updated desktop/mobile capture workflow completed and its hero/project-path/Rae outputs were inspected. The initial particle surface now defaults to the same0.88 opacity as the authored opening, so it keeps its brightness before the scroll module loads.

## Release gate

Production is not asserted by this pre-release local report. The goal requires main to be pushed, a READY Vercel deployment, the canonical exact-commit marker, both full GitHub workflow results, and a complete real-provider Rae response. Their authoritative outputs and the ignored `RESUME.md` handoff record release qualification without changing the commit under test. The existing performance budgets and exception assertions remain in force.

---

## Historical qualification records

# Material Intelligence / particle revision verification

1 October 2026. Qualification applies to the current source and, after push, the exact commit served by Vercel. Earlier green builds do not qualify a later revision.

## Current design and preserved facts

The rejected physical hero has been replaced by an authored 9,600-point field: an open nucleus, six asymmetric orbital streams, amber/cobalt depth, coherent movement and a calm-to-orbit control. The two-beat sticky hero advances from “Ideas, with a pulse.” to “Then we make it real.” and hands into actual client work. The approved footer mosaic is a native return-to-top link; nearby tiles and a local ink gradient respond to pointer movement, while keyboard focus has visible feedback. The brand geometry returns to its exact original position.

Eight routes retain distinct compositions and English India/UAE/Australia variants. Nine approved offers and independent price books, original terms, actual FakhriMart screens, founder photographs, Rae transport/action allowlist and contact drafts remain. The dirty original checkout was left alone. Remote `main` was compared before this revision; GitHub has only `main`, also its default branch.

## Visual review and fixes

Desktop 1440×900 and mobile 390×844 opening, enhanced field, middle, closing, reverse scroll and interactive footer states were captured and inspected. There were no runtime errors or horizontal overflow in these captures. The dense white centre was replaced with a clearer aperture; fine orbital trails remain. The closing fade was shortened to avoid a lingering empty stage. The scroll cue and footer utility link were moved clear of Rae. The footer's top target was moved from the sticky header to the document body so native and keyboard navigation actually return to the document start.

The final browser journey checks cover 360/390/768/1440 widths, 320×568 and 667×375 resize, manual range and arrow keys, reversed hero/proof travel, tab return, mobile overflow, footer tile response/reset and keyboard activation. Switching to reduced motion after the hero closes restores the range's operability. Reduced motion and absent JavaScript retain the content and real navigation.

A rapid case-study/back-navigation check exposed an expected native transition rejection before the deferred module registered its listener. The same-origin lifecycle script now registers in the head before the first rendering opportunity. It observes only native skip/timeout states; unexpected defects still reach normal browser error reporting. The browser error assertion remains strict.

## Final local gates

The final run after the navigation repairs passed all local gates. Budgets have not been relaxed: performance ≥90; accessibility, best practices and SEO ≥98; LCP ≤3000ms; TBT ≤300ms; CLS <0.05; all compressed JavaScript <350KB.

- Source/API/security/build/distribution/localization: passed.
- All compressed JavaScript, including lazy chunks: approximately 269KB. Initial application: approximately 5.6KB compressed. Scroll choreography, React, WebGL, Rae and footer enhancement load separately.
- The particle field is one `Points` draw with 9,600 vertices, without physical meshes or bloom postprocessing. DPR caps and offscreen/tab/dialog/context-loss safeguards remain. This is an implementation count, not an FPS claim.
- Final mobile Lighthouse: 99 performance / 100 accessibility / 100 best practices / 100 SEO. LCP 1733ms, CLS 0, TBT 54ms; every existing budget passed.
- Browser suite: 11/11 passed with two workers and zero retries, including eight-route WCAG 2A/AA and 2.1A/AA checks at 390px.
- The previously intermittent new-visitor/case/back/hash journey also passed three consecutive isolated runs with zero retries.
- Concurrent route stress: 240 requests across 20 routes passed.

## Evidence and delivery

Local artifacts are ignored: `artifacts/particle-hero/` contains visual states and logs; `artifacts/lighthouse-particle-final.json` contains the final local mobile report; Playwright preserves failure traces and its report. The GitHub quality and production workflows upload their own exact-commit evidence. Production qualification verifies the canonical `x-brayro-commit` marker before Lighthouse, 360 requests across 20 routes, and browser/accessibility journeys. A separate real-provider Rae check verifies the deployed API rather than a browser mock.

## Historical releases

- `25e6b2f1f4a850818284794ad503cfe4dadd200c`: both [quality](https://github.com/GYASH28/BRAYROAI-/actions/runs/36865965949) and [production](https://github.com/GYASH28/BRAYROAI-/actions/runs/36865966192) passed; Vercel was READY with the exact marker. Production Lighthouse was 92/100/100/100, LCP 2112ms, CLS 0 and TBT 296ms. This release used the earlier physical hero.
- `e59ccee6831fb10e4247308d3145ab04e323c724`: Rae Google recovery was repaired and a real response returned the approved ₹9,999 starting build / ₹2,599 monthly context. Its [quality](https://github.com/GYASH28/BRAYROAI-/actions/runs/36867807511) and [production](https://github.com/GYASH28/BRAYROAI-/actions/runs/36867807604) Lighthouse gates failed. It is not described as a green release. The current revision removes startup reflow, defers scroll choreography, fixes real screenshot dimensions/delivery and replaces the hero.

## Practical limits

The initial particle SVG is authored from the same deterministic field and carries restrained composited image drift. Desktop enhances after the readable opening; mobile enhances on first scroll or range input. Reduced motion and failed WebGL retain a stationary field and usable routes. Document transitions depend on browser support; ordinary links and history continue to work. Rae depends on available production providers and reports complete provider outages honestly. Lab scores are not field measurements; visual review is not a claim of an award or universal frame-rate performance.

## Recovery revision, 2 October2026

The particle/footer release `5948c65` passed the [GitHub quality workflow](https://github.com/GYASH28/BRAYROAI-/actions/runs/36889533785), and canonical Vercel served its exact SHA. Both live viewport checks showed READY particle rendering,161 footer tiles, keyboard return-to-top, zero overflow and no page errors. Its [production workflow](https://github.com/GYASH28/BRAYROAI-/actions/runs/36889533821) failed at Lighthouse:79/100/100/100, LCP1916ms, CLS0 and TBT826ms. The production suite did not proceed after that failure.

The recovery removes the internally animated SVG raster and Gaussian filter from the initial image, and retains gentle native drift through the cached outer image layer. The live9,600-point field and scroll/pointer/range responses are preserved. A local production diagnostic overlapped another browser process and is not used as a performance qualification.

A real-provider smoke also returned a cut phrase before success metadata. Gemini's actual terminal reason had been overwritten, so token exhaustion was plausible but unproven. The recovery records terminal reasons for both provider formats, accepts only STOP, increases Gemini3.x output headroom to8192 without changing supported thinking levels, and preserves the four-attempt/8.5-second bounds. Nonempty MAX_TOKENS/length and missing terminal states emit an error without success metadata or a concatenated fallback. Visitor UI clears incomplete replies. Deterministic provider regressions and the browser partial-error regression passed; actual deployed completion remains an independent release requirement.

Recovery local gates passed: source/API/security/dist/localization;11/11 browser journeys with two workers and zero retries; Lighthouse98/100/100/100, LCP2031ms, CLS0, TBT61ms. Report: artifacts/lighthouse-particle-recovery.json. Production requalification is tied to the next pushed commit.

## Floating navigation follow-up, 2 October 2026

The owner's follow-up asks for a full-screen hero and a more refined blurred top bar. Home navigation now floats above a 100svh scene rather than reserving a separate header strip. The pinned stage and its ScrollTrigger both begin at viewport top; a browser assertion checks the stage's actual viewport geometry. The shared bar uses a translucent gradient, 28px backdrop blur, rounded rim and a restrained outlined project action. Its background deepens after scrolling. Home copy receives a safe top area, with a separate short landscape composition. Inner-page document flow and anchored navigation are preserved.

Local source/API/security/provider/dist/localization gates passed. The particle forward/reverse, pointer, resize and footer regression passed after correcting the inherited sticky offset. Desktop 1440×900, phone 390×844, compact 320×568 and landscape 667×375 captures show full viewport scene height, visible primary actions, no horizontal overflow and title below the navigation. Captures are in ignored artifacts/navigation. The initial geometry regression failed on an inherited 88px offset; that failure is retained in local artifacts and was fixed rather than bypassed. Exact release qualification follows the new commit in both GitHub workflows.

The full local browser pass completed 13/14 journeys. Its rapid regional navigation journey recorded a native AbortError (“Transition was skipped”) with no script stack; an isolated rerun of that same journey passed with zero retries. A dedicated probe of the actual navigation is saved under artifacts/navigation. No browser exception filtering or threshold relaxation was added. The new commit's complete CI and production suites are required before claiming release qualification.
