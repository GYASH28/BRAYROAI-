# BRAYROAI master-prompt status — 26 September 2026

This is a working acceptance-criteria estimate, not a marketing completion claim. It compares the current V41 branch against the 25 September master prompt and records what this V42 continuation addresses.

## Before V42

| Area | Weight | Status entering V42 | Evidence / gap |
| --- | ---: | ---: | --- |
| Approved audit and baseline | 10% | 10/10 | Route audit, art direction, before/after captures and QA docs exist. |
| Shared shell, markets, CTA routing | 15% | 14/15 | India/UAE/Australia, first-visit country hint, persistence, RTL and shared shell are implemented. Production edge behavior still needs final deployed verification. |
| Design system + requested component ecosystems | 12% | 6/12 | React islands existed, but shadcn/21st/React Bits were mostly re-authored references rather than clearly source-adapted reusable components. |
| Page storyboards + signature interactions | 25% | 18/25 | All eight routes have major refinement and route-specific interaction work; several scenes still need final art-direction polish and fresh full-page proof. |
| Rae companion | 20% | 7/20 | Streaming assistant, guided briefs, fallback, expressions and SVG rig are substantial. The prompt's editable rigged 3D source + optimized GLB and true 3D runtime are not done. |
| Performance, accessibility, resilience | 10% | 8/10 | Strong local Playwright/Lighthouse/stress evidence exists; final production/device verification remains. |
| Completion evidence + release report | 8% | 5/8 | Existing captures and reports are useful but do not yet form the exact final master-prompt completion package. |

**Estimated complete entering V42: 68%. Estimated remaining: 32%.**

The estimate intentionally gives the missing 3D Rae a large share; it is not a small cosmetic task.

## V42 phases 7–9

### Phase 7 — component-source compliance
- Convert the market selector, Plans route finder and project brief to a shared shadcn-style Toggle Group primitive.
- Use a real source-adapted React Bits Spotlight Card in the AI signal island.
- Use the 21st.dev magnetic interaction pattern on only the highest-value enquiry actions, with a stationary hitbox and an 8px cap.
- Record exact source, adaptation, behavior and licensing in `docs/component-manifest-v42.md`.

### Phase 8 — interaction restraint and signature polish
- Keep all new interaction work lazy and local; no new global loop.
- Preserve touch, keyboard, RTL and reduced-motion paths.
- Reuse the existing route-specific scenes instead of adding more generic reveal layers.
- Treat a missing 3D character source as a separate Rae phase rather than faking 3D with a raster or SVG.

### Phase 9 — QA and evidence
- Add source-provenance/integration guards so later refactors cannot silently fall back to reference-only usage.
- Run static, build, localization, browser, accessibility, stress and Lighthouse gates on the continuation branch.
- Refresh route screenshots and the completion report only after those gates pass.
- Do not deploy or create a Vercel preview as part of this pass.

## Remaining after V42 code work

The largest unresolved requirement is **true 3D Rae**: editable source model, optimized GLB/glTF, rig/animations, device-aware R3F/Three integration and visual matching against the original character sheet. The original sheet is not attached in the current ChatGPT conversation, so no replacement character identity should be invented.

Other remaining work is the final route-by-route visual proof/performance package and any fixes discovered by the fresh QA run. Production deployment remains a separate explicit authorization step.
