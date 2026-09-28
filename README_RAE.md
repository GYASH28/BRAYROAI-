# Rae

Rae is the site's opt-in AI companion. The launcher and dialog are present in the shared HTML shell, while `src/site/rae.js` loads when the visitor opens the dialog. `static/assets/rae-face.svg` is a small vector adaptation of the earlier Rae head, retaining her ears, ivory shell, dark visor and orange eyes. There is no continuous character renderer.

The browser posts the question and bounded conversation history to `api/rae-chat.js`. The endpoint validates input, uses the configured AI provider, streams status and answer events, and may append application-owned suggestions from `api/_rae-knowledge.js`. The browser maps those suggestions through a local route allowlist before rendering links. The provider's text cannot create arbitrary navigation or execute actions. Drafts stay in session storage until submitted; errors are shown rather than replaced with a fabricated answer.

Production needs the existing provider environment configuration. API contract, fallback and security checks run through `npm run test:integrity`; chat UI journeys run through `npm run test:browser`.
