import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const bootstrap = read('public/contact-priority.js');
const js = read('public/rae/rae.js');
const css = read('public/rae/rae.css');
const api = read('api/rae-chat.js');
const vercel = read('vercel.json');

assert.match(bootstrap, /\/rae\/rae\.css/);
assert.match(bootstrap, /\/rae\/rae\.js/);
assert.match(js, /dataset\.state/);
assert.match(js, /SpeechRecognition/);
assert.match(js, /\/api\/rae-chat/);
assert.match(js, /prefers-reduced-motion/);
assert.match(css, /\.rae-root/);
assert.match(css, /data-state="thinking"/);
assert.match(css, /prefers-reduced-motion/);
assert.match(api, /VERIFIED_KNOWLEDGE/);
assert.match(api, /GROQ_API_KEY/);
assert.match(api, /GEMINI_API_KEY/);
assert.match(api, /openai\/gpt-oss-120b/);
assert.match(api, /gemini-3\.8-flash/);
assert.match(vercel, /microphone=\(self\)/);

console.log('Rae integrity checks passed.');
