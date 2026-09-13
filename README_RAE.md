# Rae / BRAYROAI website companion

Rae is the local-first website companion mounted across every public BRAYROAI route.

## What runs locally

Most common visitor questions are handled entirely in `public/rae.js`: pricing, services, client work, FakhriMart, Yash, AI offers, contact paths, terms summaries and page navigation. This keeps responses instant and avoids unnecessary model calls.

## Gemini fallback

Only open-ended business/workflow questions are allowed to call `/api/rae`. The browser never receives the Gemini API key.

Set these Vercel environment variables:

- `GEMINI_API_KEY` — required for deep fallback answers.
- `GEMINI_MODEL` — optional; defaults to `gemini-3.8-flash`.

If the key is absent or Gemini is unavailable, Rae falls back gracefully to local guidance and contact actions.

## Character + performance

Rae's character is pure DOM/CSS using the BRAYROAI Ink/Bone/Orange visual language. There is no mascot image download, canvas loop, WebGL runtime or third-party chat SDK. The homepage folds Rae CSS into `assets/brayro-home.css`; secondary pages load the small shared stylesheet directly.

The runtime keeps proactive suggestions to at most two per browser session and caps Gemini fallbacks at three per session. Server fallback requests are also rate limited.
