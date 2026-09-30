# Award site research for the BRAYROAI rebuild

**Reviewed:** 30 September 2026
**Purpose:** identify adaptable principles for this studio, not reproduce Awwwards layouts, artwork, copy, or assets.

## Sample and evidence method

The sample contains 50 distinct projects from the official Awwwards result galleries: 20 current Sites of the Day, 20 entries in the Sites of the Month collection, and 10 distinct entries in the Sites of the Year collection. Project names, official card/detail pages, live URLs, detail-page awards, published descriptions, technologies, and gallery image URLs are in [`award-records.json`](./award-records.json). The collection and detail sources are saved by the collection script in `/tmp/brayroai-awards-research`; capture files and contact sheets were used for study only and are not production assets.

The daily sample is the 20 most recent entries on the review date. Month/year membership is taken from the **separate official result galleries**, not inferred from an arbitrary range of daily winners. A project can also carry a Site of the Day badge on its detail page; `galleryCollection` and `collectionGalleryUrl` preserve the exact collection evidence separately from that detail-page badge. This avoids relabelling daily records as monthly or annual awards.

The per-project motion/interaction reading is in [`interaction-notes.md`](./interaction-notes.md), with the three evidence types separated. The free-library alternatives, current licenses and actual use decisions are in [`library-review.md`](./library-review.md). A research pass is complete when the project-specific design consequences and limits are written, rather than when 50 image names have merely been collected.

- [Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/)
- [Sites of the Month](https://www.awwwards.com/websites/sites_of_the_month/)
- [Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/)
- Each of the 50 official project pages is linked by `awardUrl` in the JSON. Their 50 public screenshot captures were laid into ten five-project contact sheets and visually reviewed.
- After that first five-site check, all 50 live destinations were revisited in a scripted desktop/mobile browser audit. The run produced 47 desktop opening captures, 36 desktop wheel-state captures, 50 mobile openings and 49 mobile wheel-state captures. A further long-settle pass across 34 loader/entry-heavy sites produced 30 desktop settled openings and 27 post-wheel captures. The exact per-site provenance is in [`live-audit-summary.json`](./live-audit-summary.json); screenshots stayed in a temporary research folder and are not being republished. We visually reviewed ten initial live contact sheets and seven delayed-state contact sheets. This is a design study, not exhaustive QA of another team's site.
- A successful HTTP response or a screenshot of a loader does **not** prove we observed the final experience. Some destinations remain behind a long-loading WebGL scene, consent, or click-to-enter state in automation; L.I.S.A. returned a Cloudflare challenge, and Navigate returned an origin TLS error. Many WebGL pages keep `scrollY` at zero while consuming wheel input for internal camera movement. Our notes explicitly distinguish what the award listing highlights from what the current live page displayed. Opal's current destination shows a newer product landing page, so its awarded webcam appearance is based on the Awwwards record/capture.
- Official project notes, Awwwards highlights, and the page metadata were compared with captures. The capsule observations below are our analysis, not quotations or claims about source code.

## What the sample taught us

1. **Make the proof belong to the brand.** The strongest first screens often showed the actual object, person, activity, or finished project that makes the brand specific: a miner, athlete, product, landscape, person, real screen, or cultural artefact. Replace generic mockups with the actual FakhriMart website and BRAYROAI's existing founder/Rae assets.
2. **Assign each motion a job.** Openings invite entry; a genuine product frame gives scale; a map, handoff, timeline, or selection makes information navigable. Hover flourish alone cannot carry a story. Vary pace and allow readable holds after a reveal. The delayed audit also exposed a real cost: a loader that still obscures content after several seconds can sacrifice the decisive first impression even when the final scene is beautiful.
3. **A recognisable graphic idea beats a pile of effects.** A narrow palette, confident typography and one identifiable object or interaction produce a stronger memory than routine gradients, card grids, counters or generic particles. Our site's orange arrow will remain a branded mark; its interaction will get a new role.
4. **Resolve the action.** Striking art still needs an obvious route to relevant work, details, or contact. The earlier BRAYROAI site demonstrates this well through its live nav, market choice, Rae entry point, contact shortcuts, useful footer and direct route index; those are working product foundations to preserve.
5. **Make high craft resilient.** Every scene still needs semantic live text and links. Keep the mobile crop composed deliberately, make all hidden content reachable, respect reduced motion, and let the business proof load before decorative rendering.
6. **Let color identify a subject.** The 50 examples include quiet monochrome, pale architectural fields, hard red, clean greens, saturated illustration, dark product theatre and high-key photography. A universal “awards palette” does not exist. BRAYROAI will keep its real signal orange, and use ink, warm white and cool material neutrals as the surrounding system.

## Fifty visual studies

### Current Sites of the Day

1. **CoMinVi.** A real industrial setting supplies its palette and 3D subject; black space, one warm signal orange, a small set of decisive menu windows.
2. **Jesper Landberg.** Dark project cases use photographed work, floor space and scale rather than invented feature illustrations.
3. **Butter.** A familiar editing-timeline frame holds the product story; vivid tool imagery sits on a restrained charcoal ground.
4. **Realevate.** Large blue editorial type is paired with a genuinely related photograph; scroll links the type and property imagery instead of isolating sections.
5. **Meer Mohsin.** Red grain and a fire-like central face make its personal identity unmistakable; simple menu/action words keep an intense visual world legible.
6. **The Tie-break.** A brief tennis onboarding moment and geometric court cue explain the invitation before the visitor enters the game.
7. **Moto Finance.** A laptop-shaped surface presents the real finance experience with clear marble texture and measured negative space.
8. **Sobha Privy Collection.** High-contrast portrait photography and precise serif setting suit the real luxury subject.
9. **bleibtgleich'26.** A warped saturated frame surrounds one quiet typographic centre; the distortion is a border, not a substitute for content.
10. **Gil Huybrecht.** A dark folio uses small views of actual projects as the browsing affordance.
11. **Pensatori Irrazionali.** An outdoor computer screen grounds its portfolio; the work remains readable on the actual screen.
12. **Boc.Studio.** A centered stone/material image and a strong orange strip link the studio mark to its work.
13. **Noho.** Real outdoor furniture photographs and useful product detail make the object the layout's centre.
14. **LxL Creative.** A real person holding the working tablet communicates use and scale in one frame.
15. **L.I.S.A.** The unusual CRT-wearing human is inseparable from that identity; it is not a general pattern to copy for a mascot.
16. **Aspen Search.** The executive-search site uses a monochrome information screen with a small mint-green signal area and generous gray space.
17. **Léo Parpeix.** An illustrated flower world feels personal to this individual illustrator, rather than like a default 3D agency landscape.
18. **The Tuscan Journey Begins.** Tactile fabric/pattern and travel typography support a specific destination, not a generic luxury treatment.
19. **Warm & Fuzzy.** Bold blue, immediate playful copy and a strong world are justified by the entertainment studio.
20. **White Desert.** A real Antarctic expedition figure stands in an ice passage; cold blue photography and oversized white type do the work of several decorative layers.

### Sites of the Month

21. **ERA Residence.** Quiet daylight and broad architectural composition match its subject; type provides contrast rather than extra decoration.
22. **Lama Lama.** A macro liquid-red image makes its beverage category visible instantly.
23. **Son Daven.** Striped, woven-looking type and a shepherd scene reference the Hutsul culture behind the Carpathian hospitality project.
24. **Floema.** Moss, stone and garden material join the physical product to its sustainability story.
25. **Oryzo AI.** A cork coaster is presented as a fully realized fictional AI product in a familiar workspace; the product launch is intentional satire, not a real customer proof point.
26. **GQ & AP The Extraordinary Lab.** The watch has darkness and polished light to give it scale; reduced chrome keeps it premium.
27. **The Renaissance Edition.** Generative Renaissance-style painting and modern commerce objects give Shopify's product-update edition an explicit visual premise.
28. **Bruno's Portfolio.** A true 3D game world makes the portfolio navigable, not just atmospheric.
29. **MindMarket.** Friendly illustration and a short color set give a mental-health service a lighter, human tone.
30. **Lando Norris.** The actual helmet/athlete supplies the identity, set against black with one disciplined high-vis accent.
31. **Ponpon Mania.** Hand-drawn characters and individual story details justify its maximal color and animated world.
32. **Terminal Industries.** The illuminated actual truck makes a logistics site concrete; the scene supports the product's scale.
33. **Cartier Watches & Wonders 2025.** Warm gallery architecture frames the watches and preserves a calm luxury rhythm.
34. **Tracing Art.** Linking individual art to its provenance provides a navigable concept, not decorative history.
35. **Montfort.** The near-white mountain firm uses restraint and its subject as its main image.
36. **Anime.js.** The documentation presents actual animation behaviors and interactive parameters as an explorable tool.
37. **Navigate.** A saturated outer frame carries distinct, functioning categories so color separates options that have real meaning.
38. **Siena Film Foundation.** Framed cinematic stills and editorial acclaim make a production house's narrative work visible immediately.
39. **Dropbox Brand.** Real identity components are intentionally recombined; the identity itself is the organizing device.
40. **Immersive Garden.** An atmospheric photographed/natural mark provides a cohesive threshold before work.

### Sites of the Year

41. **Messenger.** A diagrammatic tiny world and typographic entry make it playful but still unmistakably an intentional first interaction.
42. **Igloo Inc.** Its named material is the world itself: an ice shelter, snow, muted light, and small annotation rather than an abstract tech gradient.
43. **Don't Board Me.** One expressive dog illustration, bright red type and a direct proposition make the service useful and memorable.
44. **Opal Tadpole.** A hand holds the actual small webcam against deep charcoal, communicating its scale and finish immediately.
45. **Lusion v3.** Carefully restrained light chrome surrounds a cluster of coordinated 3D forms, letting motion/art direction hold the focus.
46. **Noomo Agency.** Sparse cool color, oversized type and a small 3D sculpture establish a tone without overwhelming its offer.
47. **Mana Yerba Mate.** The actual can and comic characters share a bright product frame; the shop controls remain simple and usable.
48. **KPR.** Large comic illustration ties the game world's character art to the team's “protect and reimagine” message.
49. **The Other Side of Truth.** A pale blue/yellow editorial story, time labels and very large letter shapes support a clear, emotionally weighted timeline.
50. **Persepolis Reimagined.** A real landscape provides the threshold to a culturally specific immersive history experience.

## Direct observations and authored case studies

- **CoMinVi (direct live settled/open/wheel).** The first text is already legible against darkness, then the mining video/landscape resolves behind it. Its wheel state moves to an actual miner and concise business figures. That is visual depth serving a verifiable subject, not a generic particle layer. [Official awarded project](https://www.awwwards.com/sites/cominvi)
- **Butter (direct live settled/wheel).** A nearly blank loading frame resolves to an editorial headline and suspended creative objects. The wheel takes the visitor to a statement about the editing product, with the real timeline appearing deeper in the awarded capture. The dramatic blank wait is a tradeoff we will avoid for BRAYROAI's first frame. [Official awarded project](https://www.awwwards.com/sites/butter)
- **Realevate (direct live settled/wheel).** Its blue loader and small property image resolve into oversize blue lettering plus a live property crop. Wheel input reveals named development cards even while normal `scrollY` stays zero. The information architecture justifies the full-screen transition. [Official awarded project](https://www.awwwards.com/sites/realevate)
- **Meer Mohsin (direct live settled).** The red identity and typographic count resolve, with a click-anywhere invitation recorded in the visible text. The automation did not complete that entry; the case/hero/footer movements are listed as official Awwwards highlights. BRAYROAI can borrow the distinct opening energy while keeping services and contact immediately reachable. [Official awarded project](https://www.awwwards.com/sites/meer-mohsin)
- **The Tie-break (direct live opening/settled).** The branded loading/court invitation persisted through the browser's settle window, so we treat its gameplay and shoe-reveal behavior as official highlight evidence, not a personally tested game session. [Official awarded project](https://www.awwwards.com/sites/the-tie-break)
- **Moto Finance (direct mobile/opening and official highlight).** The live mobile page exposed a long scroll. The laptop material/product composition is clearest in the award capture; a later desktop revisit timed out. Its features/infrastructure chapters are official highlights rather than observed full-journey QA. [Official awarded project](https://www.awwwards.com/sites/moto-finance)
- **Sobha Privy Collection (direct live settled/wheel).** The dark sculptural loading state resolves to an elegant product title, while the official record separately shows 3D map/gallery/zoom interactions. This is a useful example of 3D acting as product presentation rather than a floating decoration. [Official awarded project](https://www.awwwards.com/sites/sobha-privy-collection)
- **Boc.Studio, Aspen Search, Warm & Fuzzy, White Desert (direct live settled/wheel).** Their resolved states showed four different first-screen subjects and wheel moves: physical material and orange identity, strict type/data panels, saturated work footage, and a real expedition figure with an immediate trip path. None require a shared palette or effect recipe. Individual Awwwards detail URLs are in the record file.
- **Mana Yerba Mate and The Other Side of Truth (direct live settled/wheel).** The former assembles its giant product statement letter by letter in a warm commercial field; the latter shifts an editorial wartime timeline through large yellow/blue blocks. Both make opening text movement match the underlying subject. Individual Awwwards detail URLs are in the record file.
- **Igloo Inc. (Awwwards studio case study).** Their creator account describes working from a journey/structure first, making story/previsualization explicit, building with performance in mind, and adding complexity only where it reinforces a distinct scene. This is why our plan has an authored feeling curve and one measured peak instead of defaulting to maximum motion on every section. [Awwwards case study](https://www.awwwards.com/igloo-inc-case-study.html)
- **Lusion on Oryzo AI.** Lusion explicitly calls this a satirical campaign for a fictional cork-coaster product. The creator-led account describes how one object, motion, campaign copy and associated media were held inside a coherent fictional launch. It is a useful example of production discipline, not evidence that Oryzo is a real commercial product. [Codrops creator study](https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/)
- **OFF+BRAND on narrative and responsive motion.** The studio's own account describes Lando Norris as a character-led story beyond motorsport and Aether1 as one continuous scroll arc with the assistant integrated into the scene. Their technical walkthrough computes a curved hero path from measured DOM anchors and recalculates on resize, a useful reminder that responsive motion needs layout-aware geometry rather than fixed desktop coordinates. These are creator claims and a technique reference, not a template to transplant. [Studio account](https://tympanus.net/codrops/2026/08/17/creativity-at-enterprise-scale-without-compromise-the-offbrand-story/), [technical walkthrough](https://tympanus.net/codrops/2025/12/17/building-responsive-scroll-triggered-curved-path-animations-with-gsap/)
- **Motion as tone.** A separate creator conversation on Codrops stresses movement tied to the mood and frictionless routing as stories unfold. Use as a qualitative perspective, not an objective award rule. [Codrops interview](https://tympanus.net/codrops/2025/01/10/developer-spotlight-lorenzo-dossi/)

## Application to this build

- Keep the old founder-led hero recognisable. Its opening motion will introduce the hero directly rather than suspend the page behind an unrelated logo movie.
- Lead with first-party work: real FakhriMart desktop/mobile captures, the true case-study story and visible route; never draw fabricated business results.
- Give each viewport one memorable spatial/kinetic idea and let its controls, headings and links remain normal HTML.
- Extend the previous site quality that the user recalls: the bespoke footer, complete route index, compact site navigation, correct market switch, working Rae companion, founder imagery, and distinct designs for the existing service/case pages.
- Use original photography only where it supplies atmosphere, not as faux client evidence. A small authored 3D construction can react to scroll/selection; non-WebGL images and text form the full fallback.
- Keep the custom hand-drawn orange arrow as BRAYROAI navigation identity. Avoid repeating the previous page's exact act where it assembles Fakhri screenshots into a completed project.

## Free resources reviewed

The comparison now covers 12 libraries/engines with current npm metadata, maintainer docs, role and accept/reject reasoning in [`library-review.md`](./library-review.md). The following are the selected resources for this build. The initial Anime.js selection was reversed after direct mobile performance measurement.

| Resource | Why it fits | License / guardrail |
| --- | --- | --- |
| Existing in-repository Scrollcraft runtime | Already drives native scroll story, act cues, worldflight, mobile and reduced-motion modes. | Project-local engine; keep its shared code unchanged. |
| CSS transform and native observer animation | The founder opening, arrow drawing and section reveals retain their visible sequence without a page-load animation runtime. | Respect reduced motion and keep text in the first frame. Anime.js was reviewed but removed after its startup cost failed the Lighthouse guardrail. |
| Three.js | One restrained, code-authored spatial stage can give real client screenshots and studio materials depth; no stock scene/model needed. | MIT. [Official project/license](https://github.com/mrdoob/three.js/blob/dev/LICENSE); cap pixel ratio, stop outside viewport/tab, provide still fallback and dispose GPU objects. |
| Existing real media and licensed font | Current founder, process and Rae assets, Fakhri screenshots, self-hosted Manrope preserve identity and performance. | The local Manrope OFL is in `static/fonts/OFL-Manrope.txt`. Confirmed case-image facts remain source-backed. |

We did **not** select GSAP, Lenis, a SaaS motion engine or a remote scene embed. The repository already has a native-scroll story runtime; overlapping it with a second scroll controller risks anchor, touch, focus and reduced-motion behavior. Existing assets and a lightweight local module can meet the brief with fewer remote dependencies.
