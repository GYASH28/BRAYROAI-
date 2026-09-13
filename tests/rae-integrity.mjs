import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

const js=read('public/rae.js');
const css=read('public/rae.css');
const api=read('api/rae.js');
const vite=read('vite.config.mjs');
const pkg=read('package.json');

for(const token of ['class Rae','localReply(raw)','shouldUseGemini(text)','askGemini(text)','observePage()','showNudge(text,key)','trackEyes(event)'])expect(js.includes(token),`Rae runtime missing ${token}`);
for(const token of ['rae-avatar','rae-panel','rae-nudge','rae-message','rae-suggestions','prefers-reduced-motion'])expect(css.includes(token),`Rae CSS missing ${token}`);
for(const token of ['home','plans','clients','case','founder','terms','audit','brain'])expect(js.includes(`${token}:`)||js.includes(`'${token}'`),`Rae page awareness missing ${token}`);
for(const phrase of ['I asked Yash for a raise','I don’t use synergy','Windows error sound','Skynet'])expect(js.includes(phrase),`Rae personality lost: ${phrase}`);
expect(js.includes("fetch('/api/rae'")&&js.includes("this.fallbackCount>=3"),'Rae Gemini fallback is not tightly gated');
expect(js.includes('sessionStorage'),'Rae session memory missing');
expect(!js.includes('GEMINI_API_KEY'),'Public Rae runtime must never contain the Gemini API key name');
expect(api.includes('process.env.GEMINI_API_KEY'),'Server fallback must read Gemini key from environment only');
expect(api.includes("'x-goog-api-key':key"),'Gemini API key must be sent server-side in x-goog-api-key');
expect(api.includes("gemini-3.8-flash"),'Rae fallback model default is missing');
expect(api.includes('MAX_PER_WINDOW=8'),'Rae server fallback rate limit missing');
expect(api.includes('maxOutputTokens:180'),'Rae fallback response length guard missing');
expect(api.includes('Never invent client results'),'Rae truth guard missing');
expect(!/transition\s*:\s*all/i.test(css),'Rae CSS must not use transition: all');
expect(!/backdrop-filter/i.test(css),'Rae must not add backdrop-filter cost');
expect(vite.includes("'rae.css'")&&vite.includes('/rae.js'),'Vite does not mount Rae');
expect(vite.includes("!isHome&&!html.includes('href=\"/rae.css\"')"),'Secondary pages must receive Rae CSS');
expect(vite.includes("src=\"/rae.js\""),'All pages must receive Rae runtime');
expect(pkg.includes('node --check public/rae.js')&&pkg.includes('node --check api/rae.js'),'Syntax suite does not guard Rae');
expect(pkg.includes('node tests/rae-integrity.mjs'),'Integrity suite does not guard Rae');
expect(Buffer.byteLength(js)<36000,'Rae JS exceeds 36KB guardrail');
expect(Buffer.byteLength(css)<18000,'Rae CSS exceeds 18KB guardrail');
expect(Buffer.byteLength(api)<10000,'Rae API exceeds 10KB guardrail');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Rae integrity OK: local-first friend, page awareness, fun personality, secure Gemini fallback and lightweight visual system are intact.');
