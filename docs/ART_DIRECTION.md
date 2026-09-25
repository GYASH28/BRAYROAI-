# Art direction and asset inventory

## Existing assets

- Founder hero cutout and portrait are approved, real-person assets. Keep the human lead in the homepage hero and founder page.
- FakhriMart desktop and mobile captures are real client evidence. Use the existing WebP derivatives in the page; keep PNG originals as source material only.
- Existing BRAYROAI installation and process WebP images are studio visuals. They can identify internal studies only when clearly labelled.
- The original orange FakhriMart homepage display and the Project Studio section stay removed. The archive and full case study stay available.

## Character source

`/home/yashg/Downloads/Rae Robot Brand Character Design Sheet.png` is the supplied reference. Rae has an oversized bone-ivory shell, black rounded visor, amber facial lights, tapered lit ear fins, circular ear discs, compact ivory torso, black articulated joints and gloves, and broad boots with orange details. The sheet's palette is Bone/Ivory `#F7F1E6`, Deep Ink `#0E0E12`, and Signal Orange `#FF8A00`. Use these for one dimensional 2.5D illustration with vector facial expressions across the launcher and chat. Expressions should read through eyes, head angle, arms and body timing, without depending on audio.

## Planned original visual language

Four capabilities are four different kinds of evidence, not four copies of one orb: an editorial browser composition for web experiences; interconnected but legible flow cards for product design; a schematic assembly for frontend engineering; and a source-to-answer light field for AI systems. The visual language shares a dark field, pale typography, signal-orange highlights, fine technical rules and strong spacing. No generated client screenshot, fabricated UI result, third-party logo, or invented person appears in the work.

Any raster generation must use this art direction, be inspected, be exported as compressed WebP/AVIF derivatives, and record its prompt/source here. Reproducible vector and CSS visuals are preferred when they give sharper results at lower bytes.

## Composition sheet

| Destination | Visual concept | Aspect and focal area | Text-safe region | Mobile treatment |
| --- | --- | --- | --- | --- |
| Home hero | Real founder portrait over charcoal with a quiet BRAYROAI wordmark and signal-orange type | Wide editorial frame; face to the right on desktop | Left and lower-left hold the headline and first action | Portrait crops behind the title, with enough dark gradient for legibility |
| Web Experiences | Tilted ivory browser study with an orange aperture | Landscape plate, roughly 1.45:1; browser in the center | The plate carries only short illustrative interface labels; live chapter copy sits outside it | Plate stacks above copy and reduces its decorative grid |
| Product Design | Three connected decision cards, need → flow → action | Landscape plate, centered sequence | Live chapter copy stays outside the visual | Cards compress and keep large label contrast |
| Frontend Engineering | Dark code frame with an amber build result | Landscape plate, code lines left of center | Live chapter copy stays outside the visual | Long result label drops while the code structure stays visible |
| AI Systems | Approved sources flowing into a grounded answer card | Landscape plate, answer right of center | Live chapter copy stays outside the visual | Source nodes and answer remain distinct without horizontal scrolling |
| Client case | Verified desktop and mobile site captures | Source aspect ratios retained; product UI is the subject | Captions live in the document, never baked into the capture | WebP mobile derivative shows the actual narrow interface |
| Rae | Compact ivory robot with a larger black visor and orange lights | Portrait 2.5D cutout with a transparent background and a subtle three-quarter stance | Rae's chat text remains real HTML outside the canvas | The same illustration scales down; expression and text remain legible |

All original visual work in this pass is authored in this repository. The capability plates use HTML/CSS; Rae uses a transparent illustrated WebP with SVG facial layers and CSS transforms. The client captures and founder portrait are existing project assets. No external stock art or generated claim image was added, so there is no external asset licence to carry into deployment.

## Produced assets

| Asset | Source | Use and performance |
| --- | --- | --- |
| `public/rae/rae-illustration.webp` | Generated with the supplied character sheet as identity reference | 66 KiB transparent 2.5D body with ivory shell, dark visor, amber ear and boot lights, articulated joints and a greeting pose. Loaded when Rae wakes. |
| `public/rae/rae-illustration-thumb.webp` | Small derivative of the same source | 12 KiB launcher preview, loaded with the site shell. |
| `public/rae/rae-character.js` | Authored SVG visor layer and layout | Live eyes, mouth, thought and listening graphics over the artwork; one expression system serves the launcher, header and stage. |
| Four capability plates | `index.html` + `public/experience-upgrade.css` | Original browser, product-flow, frontend and grounded-AI compositions made from HTML and CSS. No image request, no animation loop, and no fabricated client output. |
| FakhriMart WebP derivatives | Existing verified client captures | Source captures remain in PNG; WebP is served in archive and case study to reduce transfer. |

The original generated PNG source is kept at `artifacts/experience/rae-illustration-source.png`; the served WebP derivatives live in `public/rae/`. `public/rae/rae-character.js` defines the SVG facial overlay and crops. `public/rae/rae-character-v2.css` and `public/rae/rae-character-emotions.css` define motion and expressions. The initial launcher uses the small derivative, then upgrades to the full illustration when Rae loads.

## Rae animation manifest

| State | Purpose | Trigger |
| --- | --- | --- |
| `idle` | Quiet breathing and presence | Open panel at rest |
| `blink` | Short visor-eye blink | Director-controlled facial timing |
| `listening` | Attentive head and arm posture | Focus and incoming user message |
| `thinking` | Small inward tilt | Waiting for a real AI response or an error |
| `speaking` | Gentle head/arm motion | Streaming response tokens |
| `happy` | Measured positive reaction | Successful action or project guidance |
| `sleep` | Settled quiet posture | Offline or inactive state |

Animations are limited to SVG and image transforms and opacity; there is no frame loop or canvas. Reduced motion disables character animation while preserving the artwork and every chat control.
