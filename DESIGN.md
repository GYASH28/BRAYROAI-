# BRAYROAI — DESIGN.md

> Canonical visual and interaction system for BRAYROAI.

## 1. Design north star
**Intelligent craft.**

The visual system should feel like a premium creative studio with serious engineering ability. It should be minimal enough to feel controlled, but expressive enough to be memorable.

The preferred contrast is:
**editorial restraint × digital energy**

## 2. Visual principles

1. **Big ideas, few elements.**
2. **Typography carries identity.**
3. **Motion creates narrative.**
4. **Color is used as signal, not wallpaper.**
5. **Real work is the hero.**
6. **Whitespace is structural.**
7. **Every breakpoint is art-directed.**
8. **Accessibility is part of polish.**
9. **Performance is part of design.**
10. **Avoid generic AI visual language.**

---

## 3. Color system

### Core palette

| Token | Hex | Purpose |
|---|---:|---|
| `ink-950` | `#09090B` | Primary dark background |
| `ink-900` | `#111318` | Elevated dark surface |
| `graphite-800` | `#1A1E25` | Cards / panels |
| `bone-50` | `#F3F0EA` | Primary light text / light surface |
| `bone-100` | `#E7E2D9` | Secondary light surface |
| `steel-500` | `#7F8794` | Secondary text / metadata |
| `blue-500` | `#3E7BFF` | Intelligence / digital accent |
| `blue-300` | `#AFC2FF` | Soft blue accent |
| `orange-500` | `#FF6B2C` | Signal / CTA / energy accent |
| `orange-200` | `#FFD2B8` | Warm highlight |

### CSS variables

```css
:root {
  --br-bg: #09090B;
  --br-surface: #111318;
  --br-panel: #1A1E25;
  --br-text: #F3F0EA;
  --br-text-muted: #7F8794;
  --br-border: rgba(243, 240, 234, 0.14);

  --br-blue: #3E7BFF;
  --br-blue-soft: #AFC2FF;
  --br-orange: #FF6B2C;
  --br-orange-soft: #FFD2B8;

  --br-radius-sm: 10px;
  --br-radius-md: 16px;
  --br-radius-lg: 24px;
  --br-radius-pill: 999px;
}
```

### Color usage ratio
A useful baseline:
- 65–75% neutral dark / bone
- 15–20% supporting neutrals
- 5–10% blue
- 3–8% orange

Blue and orange should feel scarce enough to stay valuable.

---

## 4. Typography

### Recommended system
**Display:** General Sans or Clash Display  
**Body/UI:** Manrope  
**Mono:** DM Mono

If licensing or hosting is uncertain, use:
**Display/Body fallback:** Inter / system sans  
**Mono fallback:** ui-monospace / JetBrains Mono

### Display behavior
- Strong, oversized headlines
- Tight tracking at large sizes
- Controlled line-height
- High contrast between headline and supporting copy

### Suggested scale

```css
--type-display-xl: clamp(4.5rem, 11vw, 11rem);
--type-display-lg: clamp(3.5rem, 8vw, 8rem);
--type-h1: clamp(3rem, 6vw, 6rem);
--type-h2: clamp(2.25rem, 4.5vw, 4.5rem);
--type-h3: clamp(1.5rem, 2.6vw, 2.6rem);
--type-body-lg: clamp(1.125rem, 1.4vw, 1.35rem);
--type-body: 1rem;
--type-small: 0.875rem;
--type-micro: 0.75rem;
```

### Typography rules
- Avoid center-aligning entire pages.
- Use uppercase for labels, not every paragraph.
- Mono text should be used sparingly for technical metadata.
- Headline line breaks should be art-directed at major breakpoints.
- Avoid excessively condensed display fonts for body copy.

---

## 5. Logo usage

### Primary
**BRAYROAI** wordmark.

### Secondary
Compact monogram or symbol, if developed.

### Clear space
Maintain clear space equal to at least the cap-height of the “B” around the wordmark.

### Minimum size
- Digital wordmark: 96 px wide minimum
- Compact icon: 20 px minimum

### Never
- stretch
- skew
- add outer glow
- add bevels
- place on noisy imagery without contrast treatment
- recolor each letter randomly
- turn “AI” into a cliché brain/circuit motif

---

## 6. Grid and spacing

### Desktop grid
- 12 columns
- max content width: 1440 px
- outer margins: clamp(24px, 4vw, 72px)
- common section spacing: 120–220 px

### Tablet
- 8 columns
- margins: 28–48 px

### Mobile
- 4 columns
- margins: 18–24 px
- preserve strong negative space instead of compressing desktop layouts

### Spacing scale
`4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 220`

---

## 7. Shape language
- mostly rectilinear
- restrained corner radii
- occasional circles/discs as visual anchors
- thin borders
- layered planes
- avoid excessive glassmorphism
- avoid bubbly card UI

---

## 8. Buttons

### Primary
- high contrast
- compact vertical rhythm
- subtle motion
- arrow or directional cue optional

### Secondary
- transparent surface
- 1 px border
- strong hover/focus state

### Interaction
- 160–240 ms hover transitions
- magnetic movement only on fine-pointer devices
- never rely on hover for essential information

---

## 9. Motion system

### Motion character
**Smooth, weighted, deliberate.**

### Preferred motion
- mask reveals
- staggered text
- parallax depth
- sticky storytelling
- progress-linked transforms
- subtle pointer response
- image/typography overlap
- scale + opacity transitions

### Avoid
- bouncing
- elastic overshoot everywhere
- random spinning
- constant CPU-heavy ambient motion
- excessive scroll hijacking

### Timing
- micro interaction: 120–220 ms
- standard transition: 300–500 ms
- cinematic section moment: 700–1200 ms

### Easing
Use smooth cubic-bezier curves such as:
```css
--ease-out: cubic-bezier(.16, 1, .3, 1);
--ease-in-out: cubic-bezier(.65, 0, .35, 1);
```

### Reduced motion
Respect `prefers-reduced-motion: reduce`.
Remove parallax, long transforms, and continuous loops. Do not merely slow them down.

---

## 10. Image direction

### Founder portraits
- strong directional light
- confident neutral pose
- clean cutout when layering with typography
- cinematic but believable
- avoid excessive AI retouching

### Project imagery
- prioritize real interfaces
- show desktop + mobile context
- use close crops for interaction detail
- avoid generic stock photos when product proof exists

### Image processing
- subtle contrast
- controlled grain optional
- no heavy HDR
- no oversaturated cyberpunk treatment

---

## 11. Hero system

### Composition
1. atmospheric background
2. large wordmark/type layer behind subject
3. founder portrait foreground
4. concise copy
5. one strong CTA + one secondary route
6. optional scroll cue

### Hero copy recommendation
**Digital, designed to feel different.**

Supporting copy:
**BRAYROAI builds premium websites, digital experiences, and AI-powered systems for modern brands.**

### Layering
Background -> typography -> subject -> UI/copy.

Each layer may move at a different depth on desktop. Mobile should use a simplified composition with no face obstruction.

---

## 12. Section rhythm
Alternate between:
- visual impact
- proof
- explanation
- interaction
- breathing space

Avoid repeating the same “heading + 3 cards” pattern for every chapter.

---

## 13. Project cards / case studies
A project card should communicate:
- project name
- category
- role
- live/repo status
- one strong visual
- one reason it matters

No fake KPIs.

---

## 14. Accessibility
Minimum expectations:
- WCAG-aware contrast
- visible keyboard focus
- semantic headings
- alt text for meaningful images
- decorative imagery hidden from assistive tech
- 44x44 px touch targets where practical
- motion reduction support
- no text embedded only inside imagery

---

## 15. Performance targets
Preferred launch targets:
- LCP < 2.5 s on representative mobile conditions
- CLS < 0.1
- no persistent long-running animation loops off-screen
- responsive images
- lazy-load non-critical embeds
- prefetch only when useful
- avoid loading large libraries for one small effect

---

## 16. Anti-patterns
Never default to:
- generic gradient blobs
- floating glass cards everywhere
- brain icons
- robot imagery
- random neon grids
- fake terminal text
- meaningless 3D objects
- infinite marquees in every section
- template-style “Our Services / 3 cards / testimonials / pricing” repetition

---

## 17. Signature visual motifs
Potential BRAYROAI motifs:
- slash `/`
- split blue/orange lighting
- offset wordmark layers
- numbered chapters
- mono metadata
- thin directional arrows
- large editorial type behind imagery
- subtle frame/grid lines

Use 2–4 consistently. Do not use all of them at once.

---

## 18. Final design test
The final experience should feel:
**authored, premium, technical, alive, and unmistakably BRAYROAI.**
