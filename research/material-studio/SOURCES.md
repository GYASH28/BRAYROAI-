# Sources and asset provenance

The 50 official project records and live inspection limits are retained in `research/premium-rebuild/`; this revision uses the same verified evidence rather than claiming a fresh study. Three recurring findings inform this design: Lusion's tactile authored worlds; OFF+BRAND's responsive motion geometry; and the live audit's repeated loader failures. The entry stays legible while enhancements load.

Current primary implementation sources checked 30 September 2026:
- https://react.dev/reference/react-dom/client/createRoot : attach React to specific interactive islands.
- https://threejs.org/docs/ : renderer/material/geometry lifecycle.
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/ : scrub, lifecycle, responsive updates and native scrolling.
- https://gsap.com/community/standard-license/ : GSAP Standard License; application is this studio website, not an animation authoring product.
- https://uizze.com : catalogue consulted; its generic software screens were less relevant than the existing photographic studio research. No proprietary UI was copied and no HTML was sent to the optional external checker.
- https://github.com/google/fonts/tree/main/ofl/spacegrotesk : Space Grotesk under SIL OFL, self-hosted Latin WOFF2 and license in static/fonts.

React and Three use MIT; GSAP uses its Standard License. Installed exact versions are in package-lock.json. No downloaded third-party scenes or proprietary source/assets.

## New imagery

`static/assets/studio-loop.webp`: built-in image generation, original photographic material study. Silver fins and an orange inner ribbon in a black studio. Original generation retained in Codex generated_images; web-optimized project copy. It is studio art, not completed client work.

`static/assets/knowledge-installation.webp`: built-in image generation, original photographic material study. Cobalt glass, aluminium and bone-paper planes in a suspended installation. It is studio art, not a screenshot or deployed product.

Prompt preamble for both: physically photographed sculptural technology, deep ink, warm bone, polished chrome, precise physical reflections, practical softboxes, no words/logos/UI/spheres/neon/AI blobs/clay/watermarks. Full prompts in image-prompts.json.

Existing founder, process, client screens, Rae and logo resources retain their provenance from research/premium-rebuild/assets.md. Real client screens are not generated.

## Lighting refinement, 1 October 2026

- https://lusion.co/ : the studio describes its practice as 3D visual storytelling, motion and development. Consulted again for the relationship between physical imagery and interaction; no scene or asset was copied.
- https://threejs.org/examples/?q=physical#webgl_materials_physical_clearcoat : official material example reference for coated surface highlights and reflected lighting.
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient : soft elliptical light fields in CSS. The broad fading gradients are composed around the objects rather than placed behind every paragraph.

The 1000px/600px WebP deliveries remain on the studio capability room. The current hero uses authored seeded points from `src/site/particle-points.js`, with a matching generated SVG fallback; rejected metal-object artwork is not used. The footer uses the owner-approved `static/brand/logo-horizontal-reverse.svg`, embedded as an inert template and enhanced on approach. No external particle scene or logo asset was downloaded.

Rae recovery references (1 October2026): https://ai.google.dev/gemini-api/docs/models and https://ai.google.dev/gemini-api/docs/generate-content/thinking . The stable3.5/3.1 Flash-Lite endpoints support minimal thinking; they fill spare recovery slots after the configured providers, preserving the original intelligence/priority and bounded attempt count.

Native transition lifecycle: https://developer.chrome.com/docs/web-platform/view-transitions/cross-document . Incoming `pagereveal` observation must be registered in a classic parser-blocking head script. A small same-origin script observes only expected skip/timeout rejections; unexpected defects retain normal browser error reporting.
