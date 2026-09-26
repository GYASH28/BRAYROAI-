# BRAYROAI V43 — Dimensional Rae and signature scenes

## Purpose

V43 raises the visual ceiling without undoing V42's performance architecture. It adds one real WebGL character scene and two tightly scoped signal interactions. It does **not** add a site-wide WebGL canvas, a new homepage section, or another global scroll engine.

## Rae dimensional path

- The existing SVG Rae remains the baseline, including launcher, header, mobile and accessibility behavior.
- On first Rae open, capable desktop devices may lazy-load `src/rae-3d-island.js`.
- The module uses the official Three.js r186 ESM sources from `mrdoob/three.js`; the MIT license is stored at `src/vendor/THREE-LICENSE.txt`.
- The model is original BRAYROAI procedural geometry authored in code: ivory shell, black visor/joints, orange luminous eyes/accents, large rounded head, compact torso and articulated limbs.
- Rae state events drive real 3D head/arm/eye poses for listening, thinking, speaking, positive, playful, confused, celebrate, error/offline and sleep states.
- The renderer is transparent, self-hosted and confined to the existing Rae stage.
- Pixel ratio is capped at 1.5 (1.25 on lower-memory eligible devices).
- Rendering stops when Rae closes, the stage leaves view or the tab is hidden.
- Reduced-motion, Save-Data, mobile widths, low-resource devices and WebGL failure keep the existing SVG actor without downloading the 3D chunk.

This is true WebGL geometry, but it is **not yet a standalone rigged GLB/glTF asset**. If the strict master-prompt requirement is interpreted as requiring an exported reusable GLB source file, that remains a separate asset-production step.

## Signature scene 1 — grounded AI source flow

The existing AI capability plate now receives nine small source particles that travel only from the approved-source side toward the answer side. The animation:
- runs only when the AI capability state is active and visible,
- pauses otherwise,
- uses transform/opacity,
- reduces particle count on narrow screens,
- disappears under reduced motion.

## Signature scene 2 — production handoff relay

The existing direction → engineering → delivery film receives one orange relay riding the existing vertical rule. Its position changes only when the existing `data-phase` changes. It has no RAF loop and creates a visible shared motif between the three production phases.

## Guardrails

- No pricing, offer, client claim or localization data changed.
- No fake client output or generated proof imagery added.
- No new global scroll loop.
- No mobile WebGL dependency.
- Existing SVG Rae remains functional if every V43 enhancement fails.
