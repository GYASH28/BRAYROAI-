# BRAYROAI master-prompt status — 26 September 2026

This is a working acceptance-criteria estimate, not a marketing completion claim. It compares the implementation against the 25 September award-level transformation prompt.

## Status after V42 phases 7–9

| Area | Weight | Current estimate | Evidence / remaining gap |
| --- | ---: | ---: | --- |
| Approved audit and baseline | 10% | 10/10 | Route audit, art direction, before/after evidence and QA documentation exist. |
| Shared shell, markets, CTA routing | 15% | 14/15 | India/UAE/Australia, manual selection, country hint, persistence, RTL, localized routes and shared shell are implemented. Final deployed edge/device verification remains. |
| Design system + requested component ecosystems | 12% | 12/12 | V42 ships reusable source-adapted shadcn-style Toggle Group, React Bits Spotlight Card and 21st.dev magnetic action patterns with provenance and integrity guards. |
| Page storyboards + signature interactions | 25% | 21/25 | All eight routes have route-specific choreography and responsive treatment. Fresh captures are clean; further art-direction refinement can still raise the ceiling without adding another global motion layer. |
| Rae companion | 20% | 8/20 | Streaming assistant, guided brief, comparisons, safe actions, fallback, expression rig, responsive modal/sidecar behavior and collision handling are substantial. The current master prompt's original rigged 3D deliverable is not implemented. |
| Performance, accessibility, resilience | 10% | 9.5/10 | Final V42 CI passed static/build/localization, stress, Chromium + Firefox journeys, accessibility, responsive audit and Lighthouse. Production field/device verification remains. |
| Completion evidence + release report | 8% | 6.5/8 | Fresh V42 route captures, Lighthouse, Playwright and stress evidence exist. Production verification and final release report remain. |

**Estimated complete after V42: 81%. Estimated remaining: 19%.**

This estimate deliberately keeps the unresolved Rae 3D requirement large; under the current master prompt it is a real production deliverable, not a cosmetic checkbox.

## Phase 7 — component-source compliance — COMPLETE

- Added a shared shadcn/ui-inspired single-select Toggle Group primitive with roving keyboard focus, Home/End navigation and RTL-aware arrow behavior.
- Reused it in the market selector, Plans route finder and 30-second project brief.
- Added a source-adapted React Bits Spotlight Card to the AI signal island.
- Added the 21st.dev magnetic interaction pattern to high-value enquiry actions only. The clickable hitbox stays fixed; only the inner visual surface moves, capped at 8 px.
- Kept all three integrations local and lightweight rather than adding a framework-wide component/runtime dependency.
- Recorded source, adaptation, runtime and licensing notes in `docs/component-manifest-v42.md`.
- Added `tests/v42-component-sources-integrity.mjs` so these integrations cannot silently regress to reference-only claims.

## Phase 8 — interaction restraint + responsive hardening — COMPLETE

- Kept V42 interaction work lazy and local; no new global scroll loop or permanent WebGL/canvas runtime was added.
- Preserved keyboard, touch, RTL, reduced-motion and no-hydration fallback behavior.
- Fixed radio semantics after integration: `role="radio"` uses `aria-checked` without the invalid `aria-pressed` combination.
- Fixed the founder 390 px first-fold composition with a deterministic final-layer mobile offset rather than relying on competing historical CSS rules.
- Removed Rae's mobile containment hydration race so Firefox gets viewport containment as soon as Rae opens, not only after the V5 polish attribute arrives.
- Cancelled Rae startup autofocus retries once a user manually focuses another control, preventing the desktop sidecar from occasionally stealing focus back.

## Phase 9 — final branch QA + evidence — COMPLETE

Authoritative tested code head: `82b69174d5daf2cfbd762aab563bcb503c65d316`.

GitHub Actions run: `36240415147` — **success**.

### Quality gates

- Static syntax, integrity, production build, distribution and localization: **passed**.
- Localization integrity: **24 pages, 24 offer placements, 24 price-aware leads**, canonical + hreflang checks passed.
- Concurrent stress: **500 requests / concurrency 30, 0 failures, p95 91 ms** on the CI preview.
- Playwright: **146 passed, 4 intentionally skipped, 0 flaky, 0 failed** across Chromium plus targeted Firefox smoke coverage.
- Accessibility: serious/critical Axe checks passed on public routes and Rae's open state.
- Eight-route responsive audit: every route returned **200**, with **0 horizontal overflow at all seven tested viewports** and **0 uncaught page errors**.
- Lighthouse mobile: **Performance 97, Accessibility 100, Best Practices 100, SEO 100**.
- Lighthouse metrics: **LCP 2255 ms, CLS 0.000, TBT 67 ms**.
- Evidence artifact: `brayroai-v42-evidence-7` (artifact id `10905299582`).

Fresh captures were visually reviewed for the homepage, Plans, Founder and AI Workflow Audit at representative desktop/mobile sizes. The founder first fold is now comfortably legible, the mobile Plans decision hierarchy stays inside the viewport, and the AI page keeps pricing/Rae/contact controls separated.

## Remaining after V42

1. **Rae direction / 3D deliverable.** The current master prompt asks for an original editable rigged 3D Rae, optimized GLB/glTF, animation set and device-aware web integration. Project history also contains an earlier instruction that intentionally preferred the detailed 2.5D SVG rig over 3D. Before a large Rae-modeling phase, the active direction should be treated explicitly so the project does not undo a later approved decision.
2. **Final art-direction ceiling.** The current routes are stable and visually coherent, but the remaining award-level work should focus on a few genuinely signature scenes/visual assets rather than another blanket animation pass.
3. **Production verification.** Country/edge behavior, real provider credentials, real-device checks and production Lighthouse/field behavior still need verification on the approved deployment.
4. **Release/merge.** V42 remains isolated from `main`; no production deployment or Vercel preview was created in this phase.

## Release constraint

Do not merge or deploy this branch solely because the CI is green. Production remains an explicit approval step.
