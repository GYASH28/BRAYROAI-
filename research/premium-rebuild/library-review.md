# Free motion and rendering library review

Checked 30 September 2026. Versions and license fields were read from the current npm package metadata; behavior was checked against the linked maintainers' docs. `Free` is not an instruction to install everything. The choice below is the smallest coherent set for this site's specific scenes and its existing native-scroll engine.

| Package (version) | Maintainer documentation and actual role | License | Decision for BRAYROAI |
| --- | --- | --- | --- |
| Existing Scrollcraft runtime | Repository-local scroll scenes, cues and fallbacks; inspect its own docs and live behavior. | Already in this project | **Keep.** It owns narrative scroll state. |
| [Anime.js](https://animejs.com/documentation/) (4.5.0) | Entry choreography, SVG path drawing and staggered timelines. | MIT | **Reviewed, then removed.** It made the mobile opening exceed the Lighthouse blocking-time budget. Lightweight CSS transform and native observer motion preserve the intended entrance with much less startup work. |
| [Three.js](https://threejs.org/docs/) (0.186.1) | One shallow perspective scene combining real FakhriMart screen textures, with a DOM/still fallback. | MIT | **Use only in the proof stage.** Load on intersection, cap pixel ratio, pause when hidden, dispose on exit. Already installed. |
| [Motion](https://motion.dev/docs/animate) (13.4.6) | Mini and hybrid animation, plus [scroll](https://motion.dev/docs/scroll) and [inView](https://motion.dev/docs/inview). | MIT | **Do not add alongside Scrollcraft.** Its entry timeline is now lightweight CSS; overlapping state engines gain us little. |
| [OGL](https://github.com/oframe/ogl) (1.0.11) | Low-abstraction shader and WebGL tools with zero dependencies. | Unlicense | **Reserve** for a future shader-led scene. The planned proof uses textured planes and a camera rig, which Three already supports directly. |
| [PixiJS](https://pixijs.com/8.x/guides/getting-started/intro) (8.21.0) | Fast interactive 2D scene graph and graphics. | MIT | **Do not add.** Our screen transformation requires small 3D perspective rather than a large 2D canvas/game stage. |
| [Lenis](https://github.com/darkroomengineering/lenis) (1.3.26) | Smooth scroll and DOM/WebGL synchronization; maintainers document anchor, modal and reduced-motion behavior. | MIT | **Do not add.** The site already owns native scroll/anchors in Scrollcraft. Adding another scroll controller would require more integration and risk the existing page/navigation contracts. |
| [Lottie-web](https://github.com/airbnb/lottie-web) (5.13.0) | Plays exported After Effects vector animations. | MIT | **Do not add.** No authored animation export exists; CSS and SVG make the few marks directly. |
| [Barba.js](https://barba.js.org/docs/getstarted/intro/) (2.10.3) | Client-side navigation and page transition lifecycle. | MIT | **Do not add.** This is a multi-page Vite site with direct routes, forms, market redirects and a complex Rae lifecycle. A route hijack would add release risk. |
| [Swup](https://swup.js.org/getting-started/) (4.10.0) | HTML page replacement with page transitions. | MIT | **Do not add** for the same route/form/Rae reasons; local section transitions can be designed without a new router. |
| [tsParticles](https://github.com/tsparticles/tsparticles/blob/main/websites/website/docs/guide/getting-started.md) engine (4.4.0) | A configurable particle canvas; the engine package alone renders nothing without shape/interactions modules. | MIT | **Do not add.** A stock particle field would compete with the actual client screen and portrait. If the proof stage needs a few alignment motes, draw them locally with a count and purpose. |
| [GSAP](https://gsap.com/docs/v3/) (3.15.0) | Mature timelines and ScrollTrigger. | Standard no-charge license; [terms](https://gsap.com/standard-license/) | **Do not add.** It duplicates Scrollcraft and the native entry animation for this scope. The license is not an npm MIT claim. |
| [Theatre.js core](https://github.com/theatre-js/theatre) (0.7.2) | Sequenced 3D/camera authoring. The editor and runtime have different licenses. | Core Apache-2.0; editor AGPL-3.0 per maintainer | **Do not add.** This site has one constrained camera rig, so hand-authored key states are easier to maintain. |

## Technical rule from the review

The proof interaction drives **one normalized progress value**. Scroll, pointer drag, keyboard, and touch controls update that value; the visible DOM, still images, and optional Three camera derive from it. This prevents two animation engines from fighting over transform state. On reduced motion, no animation engine should be needed to understand the final state. Any visual layer must maintain real links/text and direct route loading.

## Why this is a design decision

The award references show distinct motion tied to their subject: a watch reveal, a real production interface, a journey map, a product camera orbit, or an interactive data story. Installing more generic effect packages would not give BRAYROAI a stronger idea. The site's own subject is a founder, a working companion, and real finished work; the library selection exists to express those subjects with clear controls.
