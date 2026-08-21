# Frozen opening and hero map

Baseline commit inspected: `b7ffe78`.

## Do not touch

- `index.html`: `.intro-loader` and the complete `<section id="top" class="hero hero-v3 chapter">…</section>` block
- `public/styles.css`: the block marked `HERO V3 — visual contract frozen`
- `public/app.js`: `LockedHeroController`, including the 920ms loader resolution and hero depth multipliers
- `/assets/hero-background.webp`
- `/assets/yash-cutout.webp`
- the integrity selectors and tokens protecting these contracts

The exact hero markup SHA-256 is:

`4adaa5b58fd6373a1d7fa467299a71d667d96a8a8a6d068c2ceed1fa45df9528`

## Allowed handoff

The post-hero remake starts at `.signal-film > .hero-handoff`, after the frozen hero closing tag. It inherits the hero grid and darkness without editing the hero itself. The first detached signal points become the persistent particle field there.
