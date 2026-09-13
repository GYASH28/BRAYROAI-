import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

const js=read('public/rae.js');
const css=read('public/rae.css');
const api=read('api/rae.js');
const vite=read('vite.config.mjs');
const pkg=read('package.json');

for(const token of ['class Rae','localReply(raw)','reasonLocally(raw)','projectRecommendation()','captureMemory(raw)','shouldUseGemini(text)','askGemini(text)','observePage()','showNudge(text,key)','scheduleIdle()','trackEyes(event)','resolveCollisions()'])expect(js.includes(token),`Rae runtime missing ${token}`);
for(const token of ['rae-avatar','rae-panel','rae-nudge','rae-message','rae-suggestions','rae-avatar__brow','rae-avatar__cheek','rae-avatar__hand','data-mood="excited"','data-mood="skeptical"','data-mood="shy"','data-mood="sleepy"','data-action="celebrate"','raeWave','raeBlink','raeMessageIn','prefers-reduced-motion'])expect(css.includes(token),`Rae CSS missing ${token}`);
for(const token of ['home','plans','clients','case','founder','terms','audit','brain'])expect(js.includes(`${token}:`)||js.includes(`'${token}'`),`Rae page awareness missing ${token}`);
for(const phrase of ['I asked Yash for a raise','I don’t use synergy','Windows error sound','Skynet','Tiny face, big opinions','goldfish'])expect(js.includes(phrase),`Rae personality lost: ${phrase}`);
for(const domain of ['restaurant','ecommerce','manufacturer','clinic','school','real estate','consulting','agency','saas'])expect(js.includes(`'${domain}'`)||js.includes(`${domain}`),`Rae local business reasoning missing ${domain}`);
expect(js.includes("fetch('/api/rae'")&&js.includes('this.fallbackCount>=2'),'Rae Gemini fallback is not last-resort gated');
expect(js.includes('genuinelyComplex')&&js.includes('genericWorldQuestion'),'Rae Gemini gate lacks complexity/domain filtering');
expect(js.includes('sessionStorage')&&js.includes('rae:profile')&&js.includes('rae:dialogue'),'Rae session buddy memory missing');
expect(js.includes('--rae-collision-lift')&&js.includes('position!==\'fixed\''),'Rae collision avoidance missing');
expect(!js.includes('GEMINI_API_KEY'),'Public Rae runtime must never contain the Gemini API key name');
expect(api.includes('process.env.GEMINI_API_KEY'),'Server fallback must read Gemini key from environment only');
expect(api.includes("'x-goog-api-key':key"),'Gemini API key must be sent server-side in x-goog-api-key');
expect(api.includes("gemini-3.8-flash"),'Rae fallback model default is missing');
expect(api.includes('MAX_PER_WINDOW=8'),'Rae server fallback rate limit missing');
expect(api.includes('maxOutputTokens:180'),'Rae fallback response length guard missing');
expect(api.includes('Never invent client results')||api.includes('Never invent client results, testimonials'),'Rae truth guard missing');
expect(api.includes('ACTUAL LAST RESORT')&&api.includes('Tiny face')&&api.includes('smallest sensible'),'Gemini fallback is not programmed as Rae');
expect(api.includes('safeProfile')&&api.includes('Known visitor context'),'Gemini fallback does not preserve Rae session context');
expect(!/transition\s*:\s*all/i.test(css),'Rae CSS must not use transition: all');
expect(!/backdrop-filter/i.test(css),'Rae must not add backdrop-filter cost');
expect(vite.includes("'rae.css'")&&vite.includes('/rae.js'),'Vite does not mount Rae');
expect(vite.includes("!isHome&&!html.includes('href=\"/rae.css\"')"),'Secondary pages must receive Rae CSS');
expect(vite.includes("src=\"/rae.js\""),'All pages must receive Rae runtime');
expect(pkg.includes('node --check public/rae.js')&&pkg.includes('node --check api/rae.js'),'Syntax suite does not guard Rae');
expect(pkg.includes('node tests/rae-integrity.mjs'),'Integrity suite does not guard Rae');
expect(Buffer.byteLength(js)<56000,'Rae JS exceeds 56KB guardrail');
expect(Buffer.byteLength(css)<26000,'Rae CSS exceeds 26KB guardrail');
expect(Buffer.byteLength(api)<15000,'Rae API exceeds 15KB guardrail');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Rae integrity OK: local-first buddy reasoning, memory, expressions, collision safety and last-resort Gemini voice are intact.');
