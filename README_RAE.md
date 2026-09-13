# Rae / BRAYROAI real AI character

Rae is a lightweight layered character and streaming AI guide mounted across every public BRAYROAI route. The implementation stays inside the existing Vite + semantic HTML/CSS/vanilla-JS architecture.

## Character technology decision

There is no editable, production-ready `.riv` Rae source in this repository. Rather than substitute a generic marketplace mascot, Rae keeps the existing Bone/Ink/Orange identity as a small layered SVG rig in `public/rae/rae-character.js`.

`public/rae/rae-director.js` owns the actor state machine. Chat/network code never toggles raw face parts directly.

Primary states:

- `boot`
- `idle`
- `attention`
- `opening`
- `listening`
- `thinking`
- `speaking`
- `positive`
- `curious`
- `confused`
- `error`
- `offline`
- `celebrate`
- `sleep`

The director also owns randomized blinks, weighted idle variants, pointer gaze on fine pointers, tap reaction on coarse pointers, speaking energy from streamed chunks, document-hidden sleep and reduced-motion behavior.

## Client architecture

`public/rae.js` is only the immediate launcher/bootstrap. It lazy-imports the fuller subsystem after interaction or an idle window:

- `public/rae/rae-app.js` — orchestration
- `public/rae/rae-director.js` — character/application state machine
- `public/rae/rae-chat-client.js` — SSE transport, abort and retry
- `public/rae/rae-ui.js` — accessible transcript, cards, composer and mobile sheet
- `public/rae/rae-actions.js` — allowlisted deterministic site actions
- `public/rae/rae-context.js` — current page/section + session-scoped context
- `public/rae/rae-character.js` — layered SVG Rae rig
- `public/rae.css` — scoped character/chat styling

The closed launcher remains tiny. Save-data/reduced-motion modes are intentionally conservative, and the character can fall back to a static shell if the modular runtime fails.

## Real AI transport

Free-text Rae replies come from `/api/rae-chat`, a Vercel Function that streams lifecycle events and text deltas. `/api/rae` remains a compatibility alias.

Event shape:

- `state` — `thinking` / `speaking`
- `delta` — streamed text chunk
- `meta` — deterministic quick replies, safe cards and allowlisted actions
- `done` — stream completion
- `error` — provider/network failure

The browser uses `AbortController`, exposes Stop while generating, preserves partial output when stopped, and offers Retry on failures. Model text is rendered as text nodes, not raw HTML.

## Provider configuration

Set `RAE_PROVIDER` to one of:

- `gemini`
- `openai`
- `groq`

Set `RAE_MODEL` to the provider model you want Rae to use.

Server-side secret variables supported:

- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `GROQ_API_KEY`

Optional compatibility/configuration variables:

- `GEMINI_MODEL`
- `OPENAI_MODEL`
- `GROQ_MODEL`
- `RAE_OPENAI_BASE_URL`
- `RAE_GROQ_BASE_URL`
- `RAE_MAX_PER_WINDOW`

No provider secret is referenced by public Rae code.

## Verified knowledge

`api/_rae-knowledge.js` is the single small curated business-knowledge source for Rae. It contains current public pricing, AI offers, verified FakhriMart proof, public routes and truth rules. It deliberately avoids a vector database because the current site is small enough for structured verified context.

The server prompt treats this module as the source of truth for BRAYROAI claims and forbids invented prices, clients, testimonials, metrics, availability, delivery dates and guarantees.

## Safe site actions

Rae can offer deterministic actions from an explicit allowlist:

- `navigateToRoute`
- `scrollToSection`
- `openProject`
- `showPlan`
- `highlightElement`
- explicit `startProject` handoff from an editable project brief

The model never receives arbitrary DOM execution power. WhatsApp only opens after a user clicks the handoff button.

## Character event contract

Application/animation coordination uses events such as:

- `rae:boot`
- `rae:opened`
- `rae:closed`
- `rae:user-focus`
- `rae:user-submit`
- `rae:request-start`
- `rae:first-token`
- `rae:stream-chunk`
- `rae:stream-complete`
- `rae:stream-abort`
- `rae:tool-start`
- `rae:tool-success`
- `rae:tool-error`
- `rae:network-error`
- `rae:offline`
- `rae:sleep`
- `rae:wake`

## Privacy and accessibility

Conversation state is session-scoped with `sessionStorage`; there is no cross-user memory or fingerprinting. Older turns are compacted into a bounded local summary.

The launcher is a real button, the panel uses dialog semantics, Escape closes it, focus returns to the launcher, streamed tokens are not individually announced to screen readers, reduced motion disables continuous character animation, and mobile uses dynamic viewport/safe-area behavior.

## Local preview

```bash
npm ci
npm run dev
```

The Vite preview does not execute Vercel Functions by itself. For real AI responses, run in a Vercel-compatible local environment or deploy with the provider variables above. Browser tests mock the SSE endpoint deterministically so AI credentials are never required in CI.
