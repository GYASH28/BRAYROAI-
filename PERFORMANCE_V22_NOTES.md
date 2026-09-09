# BRAYROAI V22 Performance Pass

Goal: preserve the approved V20 visual quality while making the site noticeably smoother on lower-end phones and PCs.

## Runtime changes
- Cached scene geometry in V16, V18 and V20 instead of forcing layout reads during every animation frame.
- V18 stops updating scenes several viewports away while keeping current/adjacent scenes fully animated.
- Removed the duplicate hidden V16 homepage cursor/magnet runtime because V20 already owns those effects.
- V20 caches pointer target rectangles during hover instead of measuring them on every pointermove.
- V20 reads V19 speed from the inline runtime variable instead of forcing computed-style resolution.
- Hero text cycling pauses when the hero is offscreen or the tab is hidden.
- Infinite decorative animations pause only when their scene is far offscreen.
- Hidden tabs pause animations globally.

## Navigation / loading
- Native same-origin MPA View Transitions on supported browsers, with the existing V16 curtain retained as fallback.
- Internal pages prefetch after hover/focus/touch intent on healthy connections only.
- Save-Data and 2G users never get speculative prefetching.
- Non-hero imagery is scheduled for lazy/async decode; hero imagery stays eager/high-priority.

## Safety
- V20 sections, hero, pricing, V18/V20 cinematic layers and rejected-V21 guards remain intact.
- Added browser coverage for simulated 2-core / 2 GB hardware.
- Added offscreen-budget, prefetch, image scheduling and bounded-frame-sampling tests.
