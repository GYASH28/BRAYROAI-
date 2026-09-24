# BRAYROAI V25 — Awards Refinement Implementation

Implemented on `codex/brayroai-site-rae-redesign` from handoff commit `b4ce3f3`.

## Direction
This pass preserves the approved dark editorial system, bone typography and signal-orange accent while making the existing routes feel like one authored product. It adds a compact-on-scroll global header, cross-document continuity, more intentional section depth, clearer focus treatment, stronger project/card interactions and a common inner-page visual language.

## Rae
The live Rae body and launcher no longer reference the raster illustration assets. The full character is a structured SVG rig: shell and visor, fins and ear modules, luminous eyes, face states, neck, torso, chest signal, shoulders, articulated arms, hands/fingers, pelvis, hips, legs, knees and feet. Existing director states remain compatible: idle, opening, attention/curious, listening, thinking, speaking, positive, confused, playful, error/offline, celebrate and sleep.

The old raster files remain in repository history/assets only; they are not used by the live character.

## Research and runtime choices
- MDN View Transition API and `@view-transition` for progressive multi-page continuity.
- MDN scroll-driven animation and `content-visibility` guidance.
- W3C WCAG focus-visible guidance.
- Motion performance guidance reinforced compositor-friendly transform/opacity motion.
- Motion is MIT licensed.
- shadcn/ui was reviewed, but a React migration would be disproportionate for this Vite multi-page/vanilla-JS architecture.
- 21st.dev was treated as visual/component reference only; no marketplace implementation was copied.

No new animation or component dependency was added.

## Guardrails
- No customer-facing route added or removed.
- No approved offers, prices, legal copy or case facts rewritten in this pass.
- No 3D Rae.
- No live raster Rae body or launcher.
- Reduced-motion keeps a readable static experience.
- Existing market/Arabic runtime remains untouched.
- Integrity tests fail if raster Rae returns or the compact-header/refinement layer disappears.
