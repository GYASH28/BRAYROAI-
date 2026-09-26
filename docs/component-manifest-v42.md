# BRAYROAI V42 — component / interaction manifest

This pass converts the three requested component ecosystems from research-only references into source-adapted production components while keeping the site lightweight. BRAYROAI remains a Vite multi-page site with lazy React islands; no framework-wide rewrite or decorative dependency was added.

| Source | Exact reference | Production use | Adaptation | Runtime cost | License / note | Keyboard, touch, reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| shadcn/ui Toggle Group | https://ui.shadcn.com/docs/components/base/toggle-group and the public shadcn registry | Market selector, Plans route finder, and 30-second project brief choices | `src/react/ui/toggle-group.js` keeps the reusable group/item component model and single-select semantics, but uses native buttons + ARIA instead of adding another primitive runtime. | Local source only; no new package. | shadcn/ui is MIT. Source attribution stays in the component. | Roving focus; Arrow keys; Home/End; RTL-aware horizontal direction; tap/click; current item remains tabbable. |
| 21st.dev Magnetic | https://news.21st.dev/blog/react-magnetic-cursor-effects — references Magnetic by ibelick and Magnetic Button by bundui | The decisive Plans route CTA and project-brief WhatsApp handoff | `src/react/ui/magnetic-action.js` moves only the visual child, never the clickable hitbox; movement is capped at 8 px. | One pointer handler only on the important CTA being interacted with; transform-only. | Pattern re-authored for BRAYROAI; no registry package or template copied. | Effect is skipped for coarse/touch pointers and reduced motion; the normal link remains complete. |
| React Bits Spotlight Card | https://reactbits.dev/components/spotlight-card / David Haz | AI Workflow Audit and Company Second Brain signal islands | `src/react/ui/spotlight-card.js` follows the React Bits pointer-to-CSS-variable component shape, rethemed to signal orange and integrated with the existing AI explanation card. | Local source only; lazy-loaded with the AI island. No WebGL. | React Bits uses MIT + Commons Clause; this is used inside the BRAYROAI site, not resold or redistributed as a component library. | Pointer enhancement only on fine pointers; reduced motion and touch retain a static readable card. |

## Design-system rules

- The components inherit BRAYROAI typography, bone/ink/orange tokens and existing focus treatment. They do not look like default shadcn panels.
- Essential copy, prices, market choices and enquiry links exist before React hydrates. The React islands progressively enhance the static document.
- None of these components adds an always-on animation loop. Pointer work is local, transform/CSS-variable based and absent on touch/reduced-motion paths.
- Market values still come from the fixed market and pricing data; the components never calculate live exchange rates.
- Client proof, project claims and Rae responses remain governed by the existing truth and fallback guards.

## Why the component sources are local

shadcn/ui and React Bits are explicitly copy/adapt component systems. Keeping the small adapted sources local avoids installing Tailwind/Radix or a broader animation runtime solely to satisfy a checklist. The acceptance test is user-visible behavior plus source provenance, not dependency count.
