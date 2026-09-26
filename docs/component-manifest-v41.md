# BRAYROAI V41 — Component / Interaction Manifest

This manifest records external interaction references used during the Phase 4–6 refinement pass. The implementation stays BRAYROAI-specific; third-party patterns are adapted only where they improve a real user task.

| Reference | Source | Adapted purpose in BRAYROAI | Runtime / weight decision | License / usage note | Keyboard + mobile behavior | Status |
| --- | --- | --- | --- | --- | --- | --- |
| shadcn/ui Toggle Group | https://ui.shadcn.com/docs/components/base/toggle-group | Single-select interaction model for the Plans React route finder and native plan mode switch | No shadcn/Tailwind/Radix dependency added. The interaction semantics were re-authored in the existing React island. | shadcn/ui is MIT: https://github.com/shadcn-ui/ui/blob/main/LICENSE.md | Roving focus with Arrow keys, Home/End, click/tap and visible focus | Adapted |
| 21st.dev Spotlight pattern | https://docs.21st.dev/blog/react-spotlight-effect-components | Pointer spotlight for verified client cards and case-study decision surfaces | One delegated pointer listener writes CSS custom properties directly; no React state or animation runtime per card | Performance guide / pattern reference. No component source copied. | Hover/focus get the rich light treatment; touch keeps border/press affordance; reduced motion skips tracking | Adapted |
| React Bits Orb | https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/Backgrounds/Orb/Orb.tsx | Visual reference for the AI Workflow Audit / Company Second Brain “signal orb” | No OGL/WebGL dependency added in V41. A lightweight React + CSS version was authored for the site and lazy-loaded only near the AI hero. Its animations pause when the section or tab is inactive. | React Bits license is MIT + Commons Clause: https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md. No React Bits source is redistributed in this implementation. | Decorative orb is non-blocking; explanatory text remains normal DOM content; responsive stack and reduced-motion static state included | Reference adapted |

## Why these choices

- A design reference does not justify another permanent runtime. The site already had too many overlapping scroll and animation systems.
- React is reserved for stateful interaction islands; core content and navigation remain available without hydration.
- Pointer effects write CSS variables directly instead of using React state on every frame.
- Any decorative continuous animation must have an offscreen / document-hidden pause path.
- Touch and keyboard users receive an intentional state even when a pointer-only visual cannot exist.
- Market, pricing, legal meaning, verified client evidence and direct enquiry paths remain functional content, not decoration.

## V41 ownership summary

- Homepage choreography: V18/V20.
- Plans scroll ownership: CachedPlansTimeline.
- Founder scroll ownership: CachedFounderTimeline.
- Terms / AI / Clients general secondary motion: V16 SceneKinetics where no dedicated owner exists.
- Global progress: global-shell only.
- Market selector, plan finder, project brief and AI signal: lazy React islands.
