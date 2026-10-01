# Material Intelligence verification

1 October 2026. This file records the local qualification of the redesign. Production qualification is tied to the pushed commit by the GitHub `BRAYROAI Production Smoke` workflow and the Vercel `x-brayro-commit` marker; a build is not evidence of a current deployment.

## Scope and preserved facts

All eight routes have distinct new compositions, with English India/UAE/Australia variants. The nine approved offers and their independent price books, original terms, real FakhriMart screens, founder photographs, Rae streaming transport/action allowlist and contact drafts are retained. Source/API/distribution/localization checks passed. Remote main was fetched before work and again before release; the dirty original local checkout was left alone. GitHub currently has only `main`, also its default branch.

## Visual and motion review

Desktop1440×900 and phone390×844 openings, route compositions and intermediate scroll states were captured and reviewed. Additional browser probes cover360,768,320×568 and667×375, tab return, resize, keyboard input and reversed pinned travel. There was no horizontal overflow in the final checks.

| Beat | Intended feel | Initial review | Refinement / final observed state |
| --- | --- | --- | --- |
| Studio | Intrigue, a physical studio object | Regular torus read as a gear; flat black field and floating cubes felt basic | Unequal spatial ellipse, six collar groups, varying thickness, ceramic/cobalt trim, rounded anodised core, tiny material glints, procedural reflections, arrival unfolding and amber/cobalt light field. Whole and open states remain contained. |
| Client exhibit | Confidence, strongest evidence | Phone was cropped and screen occupied too much height | Adjusted phone scale/position and screen height; perspective turns into readable actual client screen. Reverse scroll restores earlier perspective. |
| Capabilities | Possibility, a change of room | Large colour grounds lacked depth | Type object and material photograph remain focal; soft gradients provide spatial light. Desktop lateral movement; mobile vertical collection. |
| Practice | Understanding | Fallback flex content could overflow before enhancement | Responsive fallback grid and React keyboard tabs preserve real method content. |
| Founder | Human connection | Art direction needed separation from general offer layouts | Oversized photographic name composition, colour control, staged principles and process photograph. |
| Scope | Readiness | Hero papers needed more usable sizes and contrast | Responsive CSS3D papers select the native price categories; all offer content and deep links remain. |
| Contact / close | Commitment |360px contact line overflow and blue paragraph contrast | Narrow footer typography/arrow adjusted; actual brief and market-aware contact targets; readable ink on blue. |

The homepage is approximately10.2 desktop viewport heights including the colophon. The main hold is the real work exhibit; mobile capability rooms remain ordinary vertical flow. Screenshots and scripted scroll/input probes demonstrate local rendering and behavior; they do not certify subjective award quality or real-user frame rates.

## Actual gates

- `npm run qa:static`: syntax, Rae contracts/provider recovery/security, source integrity, build, clean routes, dist and localization passed.
- `BASE_URL=http://127.0.0.1:4180 npm run test:browser -- --workers=1`:11/11 passed without retries in the final run. Tests include client journey/history, three market books, restored pages, manual/late geo behavior, legacy preferences, plan hashes/contact links, Rae draft/errors/actions, no-JS/reduced-motion content, sculpture keyboard/resize/tab lifecycle, forward/reverse proof, menu/market keyboard and WCAG scans of eight routes.
- WCAG2A/AA and2.1A/AA scans: no violations on all eight routes at390px in the final scan; browser suite repeats those checks.
- Stress:240 requests across20 routes passed.
- First Lighthouse run:92/100/100/100, CLS0, TBT28ms; LCP3236ms exceeded the existing3000ms gate. Responsive1000/600px encodings now deliver the same generated image at the appropriate screen size. One-time reveals now initialise on viewport arrival, startup waits for fonts and redundant refreshes were removed. Final Lighthouse:97 performance /100 accessibility /100 best practices /100 SEO, LCP2549ms, CLS0.000, TBT11ms; all existing thresholds passed. The report is stored in `artifacts/lighthouse-material-local.json`.
- Sculpture geometry measured from the authored geometry functions:61,386 triangles. This is a geometry count, not an FPS claim. Offscreen, hidden, open-dialog and context-loss safeguards, mobile DPR1 and desktop DPR≤1.5 are retained.
- All JavaScript including lazy chunks:approximately278KB compressed. Initial app plus motion:about57KB compressed. Three/React sculpture code is loaded separately; mobile loads3D on range input. Vite's large chunk warning concerns this lazy Three chunk.

## Evidence locations

Ignored runtime artifacts: `artifacts/material-studio/` (all route captures, motion positions, sculpture refinements, opened views), `artifacts/playwright-report/`, `artifacts/screenshots/` and Lighthouse JSON. CI uploads browser, Lighthouse, deployment and load evidence to the corresponding GitHub run. Full generation prompts are in `image-prompts.json`; source and license attribution in `SOURCES.md`.

## Limits and intentional fallbacks

Mobile initially shows the original generated material photograph and requests the live object when its range is used. Reduced motion, missing WebGL or context loss retains readable imagery and usable routes. Native document transitions depend on browser support; ordinary links and history work throughout. Rae requires a configured provider in production and reports provider failures honestly. The real-provider smoke is verified after deployment, separately from the deterministic browser mocks. No claim is made that every device can render3D at a fixed frame rate, that lab measurements are field data, or that this site has won an award.

## First production release

The redesigned source shipped as `25e6b2f1f4a850818284794ad503cfe4dadd200c`. Vercel deployment `dpl_3gxguYZ6PsoXFojJ55enVHKi9uDi` was READY and the canonical site returned that exact commit marker. Both [source/quality](https://github.com/GYASH28/BRAYROAI-/actions/runs/36865965949) and [production](https://github.com/GYASH28/BRAYROAI-/actions/runs/36865966192) workflows completed successfully. The production run measured92/100/100/100, LCP2112ms, CLS0 and TBT296ms;360 requests across20 routes and11 browser/accessibility journeys passed.

A separate real-provider Rae check revealed Google503/timeout failures on the two configured Flash models, despite the deterministic browser/provider tests passing. The follow-up keeps the configured provider priority and the four-attempt/time bounds, and fills spare Google-only recovery attempts with documented Flash-Lite models using their supported minimal thinking level. Contract tests prove configured Groq remains reachable, grounded price context survives recovery, private reasoning stays hidden and a complete provider outage still produces an honest error. The final release is qualified again by the exact-commit production workflow; real-provider recovery is checked independently.
