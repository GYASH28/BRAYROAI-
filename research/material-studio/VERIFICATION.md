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

## Navigation reading refinement, 2 October 2026

The owner's continuation prompted a live review of the floating bar on dark and bone backgrounds. The shared shell now marks Work, Plans and Studio from the actual build route, including all regional paths and the case-study parent location. Hover and keyboard states have restrained glass surfaces; the project arrow responds to hover, with reduced-motion equivalents. The home bar contracts from 1320px to 1180px after scrolling. A named native navigation transition keeps the bar anchored while the root page changes; reduced-motion rules also disable its group and snapshot animations. Browsers without backdrop-filter receive an opaque readable fallback.

Live review also identified an actual excess anchor gap: 105px root scroll padding plus 105px section scroll margin. Home anchors now use one responsive header inset plus 16px. The real-work journey asserts the settled section geometry, preserving room beneath the controls without the extra gap.

Local static/API/provider/security/build/dist/localization gates passed, followed by four targeted browser journeys with zero retries. After the final anchor correction, the new-visitor journey passed its geometry assertion and a live review verified 12 regional active-navigation states, compact glass, native link navigation and keyboard focus with no page errors. Screenshots and diagnostic logs are under ignored artifacts/navigation.

The previous native AbortError did not recur over 36 diagnostic document navigations followed by actual founder/client interactions. Chrome documents outgoing transition cancellation as part of the native lifecycle: https://developer.chrome.com/docs/web-platform/view-transitions/cross-document. This evidence does not prove the earlier intermittent error impossible. No global exception filter was added and the existing handler was retained; the exact new commit must pass both full workflows.


## Premium navigation and motion refinement, 2 October 2026

The new owner request extends the shared navigation and motion rather than replacing the approved particle formation/footer. Three separate glass control groups, mosaic corner accent, numbered destinations, a moving pointer/keyboard focus surface and rolling labels replace the previous capsule. Home groups settle inward through transforms; their layout width remains stable. Header and dialog glass retain real backdrop blur. Large narrative headings use word lift, offers/method/legal headings use horizontal arrival, and the person/studio/closing copy resolves from subtle depth. Labels, real images, project selections and direct actions receive corresponding transitions. Copy remains semantic and selectable; duplicated animation labels are aria-hidden. Reduced motion and native fallback remain supported.

Performance changes remove the interval-based frame skipping, move pointer work to animation frames, skip unchanged footer writes, watch actual dialog open attributes and interpolate hero/proof scroll poses. The complete 9,600-point field stays intact; raster resolution adapts only after sustained frame pressure with hysteresis. Expensive full-canvas blend/filter composition and moving halo Gaussian filters are replaced by normal composition and feathered gradients. The existing opening, reversible particle-to-BR sequence, paper portal, real work and approved footer remain.

A bounded local cursor profile at 1440×900 records baseline rAF median216.7ms/p95 416.7ms and final median66.8ms/p95 200ms. The latter has no page errors and normal/no-filter canvas composition. This busy local headless Chromium uses ANGLE SwiftShader software rendering. The timings indicate improvement in this particular workload, not universal60fps, field data or an award claim. Sequential isolation (drawing disabled, then control glass disabled, then halos removed) showed substantial atmospheric filter cost; diagnostic conditions are not shipped. Captures, original failures and profiles remain under ignored artifacts/navigation.

Initial local full browser qualification completed12/14. Its new runtime reduced-motion assertion read innerText before a content-visibility section had painted; the saved screenshot showed the correct single label. The assertion now waits for that actual rendered label with the same exact expected text. Accessibility separately found genuine1.47:1 contrast on partially opaque waiting words in the orange closing heading. Awaiting words/labels now start fully transparent and arrive at full contrast; no accessibility exclusions or error filters were introduced. Final source/API/provider/security/build/dist/localization gates passed (277828 gzip JavaScript bytes under the unchanged350K total budget). Both affected browser journeys then passed with one worker and zero retries, covering particle forward/reverse/pointer/resize/footer, runtime reduced motion, keyboard dialogs and eight-route WCAG checks. Other12 journeys passed the initial run; both full exact-commit GitHub workflows remain required release gates.

## Native mosaic opening and performance brief, 2 October 2026

The owner requests an elaborate implemented opening before a detailed60fps optimization prompt. A finite native Web Animations sequence uses38 actual BR mosaic rectangles from the brand asset: convergence through different depths, a short exact-mark hold, outward release, alternating-plane MARK typography and a final orange punctuation landing. Thin registration rays/corners support the impression. Original commercial text/actions remain immediately available; decorative bounds exclude navigation and sales copy. The final silhouette size also fits compact/landscape layouts. No new library, generated raster asset, loading progress or scroll lock was introduced. The49 native animation objects and their markup/listeners are removed after settlement; pointer typography/Three initialization wait for ownership transfer. Scroll/control/keyboard/resize/hidden-tab/preference inputs settle immediately, and hash/history/reduced-motion entry skips the entrance.

The first frame review found visible mark/headline overlap, especially on mobile. Its departure envelope was tightened before release, and native animation captures at180/650/1050/1700ms were inspected on1440×900 and390×844. The final design uses the exact bone tile mark and restricts fragments above commercial copy; no long loader replaces the first message. The new browser journey checks initial activation, natural completion, remaining native animations, keyboard interruption/focus, market control access, hash entry and runtime/initial reduced motion. Existing keyboard/axe/all27plan journeys passed with zero retries (3tests), then the final opening and particle forward/reverse/resize/footer regression passed with zero retries (2tests). Strict global page errors remain unchanged.

Cold-load local native-opening instrumentation records phone-sized median16.7ms/p95 16.8ms (116samples,2intervals above33.34ms), desktop median50.1ms/p95 133.3ms (31samples) on the same headless host. Startup long tasks and long animation frames are retained, with no page errors or native animations remaining after settlement. These are viewport/software-rendered lab diagnostics before the final smaller decorative bounds, not physical phone or universal60fps qualification. The desktop stalls are explicitly unresolved in that environment. The archived profile and visual captures are in ignored artifacts/navigation; no shipping test-agent detection, effect removal or score bypass exists.

The full optimization prompt is saved in PERFORMANCE_60FPS_PROMPT.md. It provides actual repository owners, visual/function contracts, physical/emulated device distinctions, repeatable interaction traces, CPU/raster/GPU attribution, frame-tail and Core Web Vitals targets, safe adaptive-rendering rules, memory/lifecycle checks and exact canonical main/CI/provider qualification. Its targets are a future measured assignment, not a claim that every device already passes. Source/API/security/provider/build/dist/localization gates passed; compressed JavaScript grew about2.2KB to280069bytes, remaining within350K total and90K entry budgets. The final bounds adjustment then passed both opening and compact/reduced-motion browser journeys with zero retries. Final exact-commit canonical and both complete workflows remain required after push.


## Reset-aware continuation and GitHub sync, 3 October 2026

Owner authorizes ongoing measured animation/UI/UX/performance refinement while away and explicitly asks to analyze/sync GitHub first. Created the same-chat reset-aware heartbeat before implementation, next scheduled10:10IST after the actual10:05:13reset. No credit/reset redemption or model switching occurred. Read fresh usage before scheduling.

Fetched main9318028, nine commits ahead of this worktree across25files. Both GitHub workflows37082166158/37082166386 succeeded for that baseline. Those commits already implement First Signal, portrait handoff fixes and both restored website plan ladders. Saved local edits to a named stash plus ignored patch, fast-forwarded main and integrated the pointer draft without replacing newer upstream code. The browser-test conflict retained all current fullscreen/skip/portrait/reduced/history scenarios and added the reproduced early-pointer-leave check. The extended brief now describes the delivered opening as a reference rather than requesting a duplicate rebuild.

Pointer enhancement now receives the latest pending position, clears it on leave and releases temporary tracking after initialization. A persisted pagehide retains mounted handlers for BFCache; actual disposal still cleans them. Expanded opening regression passed one worker/zero retries18.8s. Source/API/security/provider/build/dist/localization passed281071compressed JS bytes. No budgets, global browser-error fixtures or baseline functional assertions were weakened.

The current homepage profile includes native opening, pointer and reversed scroll, with a saved DevTools trace. On headlessChromium151/ANGLE SwiftShader, median/p95 frame intervals: opening50.1/183.4ms, pointer66.7/83.4ms, scroll50.0/83.4ms. All9600points remain in one draw call, drawing buffer1076×672. Largest long frames had no qualifying script attribution and zero blockingDuration; this does not prove hardware60fps or identify a sole GPU cause. Software-renderer stalls remain explicit, rather than being hidden behind successful Lighthouse. Future cycles should inspect raster/compositor/renderer evidence before rewriting JavaScript. Exact new-commit canonicalVercel and both full workflows are required after push.


## 3 October 2026 — raster pressure and buffer lifecycle refinement

Fetched GitHub main before edits: unchanged7f32644, clean and matched remote. Fresh five-hour capacity was available. The same heartbeat is now scheduled for15:13IST, shortly after the actual15:07:33 reset; recurring prompt and notification intent preserved.

Evidence: the former controller treated every frame at or below28ms as fast, so a25ms/40fps workload could increase raster scale after300 frames. It also used frame counts for settling/recovery, making duration vary with refresh cadence, and kept adaptation history across resize/resume. The renderer's setPixelRatio calls setSize internally; the following explicit setSize and initial ResizeObserver notification reset the drawing buffer redundantly.

Changes: extracted a small time-based raster policy, with one second settling, sustained pressure above20ms, five seconds recovery at18ms or below, dead band and bounded per-sample credit. Reset history on resize/resume/context restoration. Keep the existing1/.85/.7 raster range, all9600points, shader/color/geometry and CSS layout. Replace the two size setters with one setDrawingBufferSize, guarded against identical dimensions/ratio. The initial frame is not a synthetic33ms pressure sample.

Meaningful regressions: sustained25ms workload cannot recover quality;60/120Hz healthy workloads can recover after sustained headroom; isolated stalls cannot flicker resolution; reset discards prior credit. The initial interruption-test setup incorrectly ran long enough to promote before resetting; corrected its pre-reset duration to4seconds, with no application change or weakened outcome. Existing integrated particle journey now records actual canvas buffer resets and rejects consecutive identical allocations before testing context loss, formation/reversal, footer, responsive layouts and reduced motion. It passed with one worker/retries0 in20.3seconds. Opening/particle journeys previously passed42.7seconds before the final buffer change; exact-commit CI remains required.

Static/API/provider/security/build/dist/locales pass,281199compressed JS bytes. Profile harness now measures a warmed pointer workload for at least10seconds, separately from startup/imports; missing readiness fails instead of being swallowed. Existing script's shorter pointer sample was insufficient for the requested workload.

Same Chromium151/SwiftShader diagnostic before→after: opening median99.9→166.5ms,p95133.3→266.7ms; pointer median83.4→116.7ms,p95233.3→416.7ms; scroll median133.3→99.9ms,p95283.3→166.7ms. Both finish9600points/one drawcall/buffer1007x630; longtasks90→75 andLoAF101→82. Timing remains poor and mixed, including the untouched opening. This is NOT evidence of a general FPS improvement or universal60fps. Concurrent desktop apps and software rasterization remain environmental limitations; no user processes were stopped. Policy correctness and eliminated duplicate buffer resets are the qualified benefits. Physical-device/frame-presentation qualification remains unavailable. Traces/logs preserved under artifacts/performance/raster-{before,after} and artifacts/navigation/raster-*.

Release pending: after final composed viewport review, commit/push completed changes to main and verify exact canonicalSHA/READY Vercel, both full workflows and real Rae completion. Append final evidence to ignored RESUME.md to retain the qualified SHA.


## Pointer atmosphere isolation — 3 October 2026

Source of truth fetched/clean:ee140c8. Native pointer handlers wrote two inherited light variables on the entire hero stage and read its bounding rectangle every pointer frame. Only the atmosphere used those live variables; the obsolete studio pseudo-surface is disabled. Diagnostic-only suppression established avoidable style cost without claiming GPU attribution or removing the shipped motion.

Same36move warm pointer workload before→after, Chromium151/SwiftShader,1440x900:143frame samples in both; median50ms unchanged, p9566.7→66.8ms. Style recalculations290→146; inclusive CDP RecalcStyleDuration454.180→247.749ms (45.45% lower), ScriptDuration106.159→98.868ms, TaskDuration3400.600→3137.392ms. Runtime8269.8→8205.0ms. LayoutCount2/2. Old stage light-variable writes290→0; letter-variable writes2900/2900. Attribution trial without halo writes yielded289.327ms style over42moves and without letters364.715ms over42moves; these differing-length diagnostic runs are not direct FPS comparisons. Captured artifacts/navigation/pointer-attribution.json, pointer-after.json and diagnostic script. Actual before/after retains all visible atmosphere movement; diagnostic suppression is not in shipped source. No universal60fps or improved frame-tail claim.

Implemented hero-light.js: native transform owned directly by .hero-atmosphere, same36px/24px travel and original1.4s transition, coalesced input, cached stage bounds invalidated by resize/scroll, no duplicate unchanged writes. Leave/reduced-motion/hidden/pagehide reset cancels pending work. Actual BFCache retains listeners; permanent disposal disconnects observers/listeners. Existing entry pointer typography remains independently owned, preserving every letter response and original particle scene/shaders/geometry.

Static source/API/provider/security/build/dist/locales passed281403gzipJSbytes within original budgets. Opening plus particle/formation/footer/resize/context journeys passed26.0seconds workers1/retries0 before the final runtime reduced-motion assertion. The existing integrated particle journey also verifies live atmosphere motion, neutral leave, absence of root inherited light writes and reduced-motion input remaining neutral. Final lifecycle journey, composed desktop/mobile checks and exact release gates required.


## Shared navigation refinement — 3 October 2026

Fetched/clean GitHubmain95fd53f before this new owner request. Reworked the native menu into a two-column route index with concise destination descriptions, original custom arrows, real FakhriMart/Yash images and the actual BR monogram. Pointer/keyboard focus changes the desktop context preview through bounded opacity/transform transitions. Phones use a single column with secondary service/terms links and market control visible; preview images remain lazy and the hidden phone preview does not fetch the project/founder images. No new library, fabricated portfolio or changed URL/pricebook. Keep native dismissal/navigation/focus, expanded state tied to real dialog state, guard drag-out versus backdrop click, and keep the close header accessible when a short viewport scrolls.

Initial expanded navigation/access test passed new menu checks but exposed existing desktop plans-index contrast: small spans/prices #776e61 over composed #e1dcd3 measured3.67:1. Darkened the two original rules to#62584b; new focused desktop index Axe assertion passes. Restored390x844 before the original eight-route mobile access loop rather than accidentally changing its device coverage. No assertions/axe rules weakened. Initial failure retained menu-browser.log and targeteddiagnostic menu-desktop-plans-contrast.json. Diagnostic helper first needed explicit browser.newContext for Axe; corrected helper before collecting actual contrast nodes.

Final focused journey passed29.2seconds workers1/retries0, covering menu Axe, expanded state, Escape/focus restoration, market transition, keyboard Studio preview, immediate close/reopen state, drag-out retention/backdrop dismissal, desktop plan-index contrast and original eight-route mobile Axe checks. Static/API/provider/security/build/dist/locales passed281666gzipJSbytes. Final responsive composed checks and exact main/Vercel/fullCI/realRae release qualification required before completion. No general FPS claim: particle geometry/shaders/opening/footer untouched and existing frame-work remains in backlog.


## Particle input and layout bounds refinement — 3 October 2026

Fetched GitHub main89135bd unchanged/clean before this reset cycle. Runtime-only shader guard experiment (original/guard/guard/original) skipped zero-strength pointer arithmetic but yielded no convincing frame gain on local Chromium SwiftShader: all medians50ms, tails66.7–83.4ms. Not shipped. Diagnostic removal of header filters retained50ms median; freezing WebGL clear/draw yielded16.7ms median/16.8ms tail. These are lab attribution experiments, not optimization results or displayed-frame/GPU timer proof; original graphics and blur remain.

Discovered an actual transformed-bounds defect: at hero progress.66 the host's visual bounds1555.2×972 differed from1440×900 layout. Touch at25%/20% yieldedshaderpointer[-.54,.648] rather than[-.5,.6]. A resize at the same pose allocated1512×972 for1400×900 layout, magnifying the draw buffer a second time. Original evidence saved in artifacts/performance/pointer-guard/bounds-baseline.json.

Renderer allocations now use layout dimensions and existing raster tiers. Pointer movement reads current visual bounds once per input frame; presses read current bounds immediately. Same actual probe now yields[-.5,.600000024] and1400×900buffer:14.27% fewer allocated pixels in that resize case, with the same baseline raster policy. No change to shader, particle count, formation, palette, blend mode, motion clocks or atmosphere. Browser regression covers transformed touch and mouse mapping, mid-scroll resized layout buffers, existing context restoration/reversal/reduced-motion/input and fullfooter. Static/API/provider/security/build/dist/localization passed; initial expanded browser test passed15.1s,retries0. Final mouse regression and exact-release qualification remain required; actual local/production frame pacing is not declared60fps.

Final expanded particle regression (touch+mouse+mid-scroll buffer+existing lifecycle/reversal/footer) passed15.7s,oneworker/retries0. Actual1440×900 and390×844 formation screenshots reviewed:9600points,onedrawcall,ready,overflow0/errors[]. CompressedJS281656bytes. Exactrelease remains pending after push.
