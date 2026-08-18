# YKG Digital — implementation design note

The current YKG Digital website is the visual and interaction source of truth. Preserve this art direction rather than restoring the retired BRAYROAI implementation.

## Visual language
- Dark ink foundation with warm paper/orange chapters.
- Space Grotesk display type, Manrope body/interface type and DM Mono metadata.
- Full-screen photographic hero with independent background, oversized YKG DIGITAL typography and founder cutout layers.
- Editorial section changes rather than repetitive SaaS cards.
- Orange is the primary signal; lime, sky and warm neutrals are secondary accents.

## Interaction language
- Short fail-safe intro sequence, scroll progress and chapter indicator.
- One requestAnimationFrame scroll choreography for hero depth, manifesto motion, client proof and capability activation.
- Lazy external FakhriMart frames; fine-pointer-only cursor/magnetics/tilt; full reduced-motion path.
- Mobile navigation must retain focus containment, Escape close and focus return.

## Release rules
- Zero serious/critical axe violations.
- No document overflow at 360, 390, 430, 768, 1024, 1440 or 1920px.
- Hero imagery and conversion/project destinations must resolve.
- CSP must permit the site’s Google Fonts and FakhriMart iframe origin.
