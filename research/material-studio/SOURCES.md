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

Rae completion recovery, 2 October2026: https://ai.google.dev/gemini-api/docs/thinking and https://ai.google.dev/api/generate-content . Gemini thought tokens share the output ceiling; the token ceiling is increased while supported low/minimal thinking and existing attempt/time bounds remain. Only a validated terminal STOP is success. A cut-off or unconfirmed response stays an honest retry state.


Hero typography and monogram refinement, 2 October 2026: Instrument Serif regular and italic are served locally in WOFF2, converted from the official Google Fonts distribution. Primary font license: https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/OFL.txt . The SIL OFL 1.1 license is retained at `static/fonts/InstrumentSerif-OFL.txt`; no Reserved Font Name is specified. Particle targets derive from the owner's approved `static/brand/brayro-monogram.svg`, with no external scene or copied website artwork.

Rae interrupted-stream recovery is capability negotiated: only the current client advertising `supportsStreamReset` can receive a reset followed by replacement provider text. Legacy clients receive the existing honest error. Only terminal STOP emits completion metadata and completed history. Retry order and the four-attempt/8.5-second-per-attempt bounds remain.


Owner refinement, 2 October 2026: the opening now explains website and AI offers and renders the market-specific website starting price. Scrolling controls the assembly sequence with no range or burst panel. Fallbacks are rasterized by Chromium from the authored SVG generator and delivered in 1000px/600px WebP sizes; ImageMagick is used only for PNG-to-WebP conversion because its SVG renderer misread modern color syntax. Optional regeneration: `node scripts/generate-particle-fallbacks.mjs`. Font and other asset provenance above remains unchanged.

Native rendering optimization: https://web.dev/articles/content-visibility . Non-hero rooms use `content-visibility:auto` with measured intrinsic size estimates; completed sizes are cached by the browser. Scene measurements refresh when an offscreen room becomes rendered. Hero particles and text remain rendered continuously; semantic content stays in the document.

Centred typography refinement: the existing licensed Instrument Serif is composed at 16.3vw desktop and 21.4vw phone, with regular/italic contrast. A four-word native transform/light response loads only after fine-pointer interaction and is disabled for reduced motion. Later room layouts use the same owner palette and genuine content; the process instrument uses semantic roving tabs and explanatory SVG flows. No new external assets or libraries were added for this refinement.

## 2 October: material controls and refinement

- Owner's four screenshots: identify the rejected homepage practice, capability and process scenes. The actual routes are retained; those scenes are replaced with a useful project choice.
- Owner's brand-guide.html: approved mosaic identity and ink/bone/orange/cobalt palette, retained across new type, glass controls and conversation.
- [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter): translucent controls can filter the content behind them. Used on the navigation and modal surfaces, with restrained blur and opaque-enough text backgrounds.
- [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog): native modal semantics and showModal/Escape behavior used for full plan details and shared controls.
- [MDN ::backdrop](https://developer.mozilla.org/docs/Web/CSS/::backdrop): separate modal backdrop provides a dimmed, lightly blurred surrounding page.
- [Three.js Material](https://threejs.org/docs/pages/Material.html): existing single Points shader remains; visibility is improved through authored alpha, point size and palette rather than a new post-processing dependency.

These primary references inform implementation mechanics. The repository's fifty-site study remains the design research; this correction adds a distinct current composition instead of treating an old brief as owner approval.

### Navigation qualification

- [Chrome for Developers: cross-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document): the incoming listener must be registered before the first rendering opportunity. The global exception fixture caught an early saved-market redirect abandoning its incoming transition before that document revealed. Preference and detection redirects now wait for the next rendering callback so the existing lifecycle listener can observe the incoming transition. Unexpected errors remain visible; the browser assertion is unchanged.

### Consistent performance audit runtime

- [Playwright browsers](https://playwright.dev/docs/browsers): the installed dependency version supplies a dedicated Chromium headless shell for default headless runs. The audit uses the public launch API and a separate CDP port, with cleanup in `finally`.
- [Chrome Launcher configuration](https://github.com/GoogleChrome/chrome-launcher/blob/main/README.md): an existing remote-debugging port can be used for Lighthouse instead of automatic system Chrome selection.
