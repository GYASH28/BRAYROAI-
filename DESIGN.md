# BRAYROAI — design system

## North star

**SIGNAL BECOMING FORM** — digital complexity becomes structure, interface, system, proof, scope, human accountability, and finally identity.

The site should feel like a premium creative-technology launch film, but its sophistication comes from pacing and continuity rather than from visual density.

## Primary rules

1. One dominant scene idea at a time.
2. One persistent signal system across the homepage.
3. Negative space is functional; do not fill it with cards.
4. Motion must show progression, causality, or hierarchy.
5. Real interface proof is stronger than claims.
6. Mobile is a separate director cut, not a shrunken desktop timeline.
7. The frozen hero is never casually redesigned.

## Public architecture

The only primary destinations are:

- Home
- Services
- Work
- Plans
- Contact

Do not add About, Process, Case Studies, Studio, FAQ, Blog, Testimonials, or other top-level destinations unless a future business requirement is strong enough to replace—not merely add to—the current information architecture.

## Homepage movements

### 00 — Identity

Frozen opening + hero. See `FROZEN-HERO.md`.

### 01 — Thesis

Short statements arrive sequentially: exist → explain → guide → convert → remember. The signal moves from potential toward structure.

### 02 — Services

One persistent interface stage. Four selectable disciplines share the same object and each explains:

- Build
- Best for
- Result

Do not turn these into four cards.

### 03 — Work

Bone background. Real FakhriMart desktop/mobile interface dominates the scene. Product-system references remain secondary and truthful.

### 04 — Plans

Bone background. Three thresholds across one runway:

- ₹2,599 — Website Starter
- ₹3,999 — Business Website
- ₹5,999+ — Custom Experience

Do not present them as three floating glass pricing cards.

### 05 — Contact

Return to Ink. Founder image, one large proposition, WhatsApp primary, email secondary. Signal resolves into BRAYROAI identity.

## Signal states

The canonical order is:

`potential → structure → interface → system → proof → scope → human → identity`

Each state should remain recognizable enough that scrolling feels like transformation of one system, not replacement by unrelated decorative scenes.

## Color

- **Ink:** `#08090B`
- **Bone:** `#F6F2EA`
- **Electric Blue:** `#3976FF`
- **Transformation Orange:** `#FF6428`

Orange is rare and conversion-oriented. Blue is structural/systemic. Avoid AI-purple gradients and generic neon palettes.

## Typography

- **Space Grotesk** — display, large narrative statements
- **Manrope** — body and practical interface copy
- **DM Mono** — metadata, numbering, prices, technical labels
- **DM Serif Display** — optional and rare; only when emotional contrast genuinely improves the scene

Large type must still be constrained. Do not make every sentence 10–15vw merely to signal “premium.”

## Motion grammar

Every major scene should follow:

1. anticipation
2. action
3. arrival
4. reading hold
5. handoff

Native scroll is authoritative. Never add Lenis, Locomotive, ScrollTrigger, or another scroll layer simply to create smoothness.

Pointer response may be subtle. Scroll response may be strong. Random ambient motion should remain background-level and pauseable.

## Responsive direction

Desktop may use sticky/pinned cinematic scenes. At <=820px, the film becomes normal document flow with the same hierarchy and signal identity. Further cuts at <=480px and <=340px simplify type, proof framing, service controls, and contact actions.

Required reflow widths include at least 320, 360, 375, 390, 412, and 430px.

## Accessibility

- WCAG 2.2 AA intent
- visible keyboard focus
- semantic controls and pressed states
- reduced-motion mode removes sticky cinematic choreography and WebGL
- forced-colors fallback must keep the content usable
- no information may exist only in motion

## Forbidden patterns

- glass-card soup
- floating bento dashboard sections
- generic purple AI blobs
- random particle decoration with no narrative meaning
- fake stats, testimonials, awards, logos, or dashboards
- robot/brain-chip imagery as shorthand for AI
- scroll hijacking
- background video as the primary visual solution
- endless identical fade-up reveals
- CSS patch stacks such as `final-fix-v2.css`

## Reference discipline

ZEXVRO is a quality reference for restraint, consistent spatial rules, readable density, persistent navigation, and transition continuity. Do not clone its cards, layout, source, assets, colors, wording, Web3 styling, or exact animation.
