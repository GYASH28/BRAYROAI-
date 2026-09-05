import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));
const home=read('index.html');
const plans=read('plans.html');
const css=read('public/brayro-v12.css');
const css13=read('public/brayro-v13.css');
const js=read('public/brayro-v12.js');
const motion5=read('public/motion-v5.js');
const pkg=read('package.json');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

expect((home.match(/data-scene=/g)||[]).length===8,'V12 homepage must contain eight purposeful source scenes');
expect(home.includes('class="v12-hero-title"')&&home.includes('Digital, designed'),'V12 hero typography guard is missing');
expect(home.includes('data-v12-story')&&(home.match(/data-v12-step=/g)||[]).length===4,'V12 four-discipline source markup is incomplete');
expect((home.match(/data-v12-project data-preview=/g)||[]).length===3,'V12 project showcase must contain three previewable rows');
expect(home.includes('FEATURED CLIENT / FAKHRIMART')&&home.includes('https://fakhriyarns.vercel.app/'),'real FakhriMart client proof is missing');
expect(home.includes('id="ai-systems"')&&home.includes('AI Workflow Audit')&&home.includes('Company Second Brain'),'homepage AI product section is missing');
for(const price of ['₹9,999','₹29,999','₹2,999/mo'])expect(home.includes(price),`homepage missing AI price signal ${price}`);
expect(home.includes('₹9,999 audit fee is credited toward an AI system'),'audit implementation credit is missing');
expect(home.includes('THREE WAYS TO WORK')&&home.includes('AI Systems for growing companies'),'homepage offer architecture is unclear');
expect(home.includes('/brayro-v12.css')&&home.includes('/brayro-v12.js'),'V12 assets are not mounted on homepage');

expect((plans.match(/data-plan-scene=/g)||[]).length===7,'Plans V12 must contain seven purposeful scenes');
expect((plans.match(/class="build-card/g)||[]).length===6,'six website plan cards must remain intact');
expect((plans.match(/class="ai-plan-card/g)||[]).length===2,'Plans must contain two primary AI product cards');
expect(plans.includes('Knowledge Care')&&plans.includes('From ₹2,999/mo'),'Knowledge Care offer is missing');
for(const text of ['AI Workflow Audit','Company Second Brain','₹9,999','From ₹29,999'])expect(plans.includes(text),`Plans AI offer missing ${text}`);
expect(plans.includes('API usage')&&plans.includes('approved company sources'),'AI scope boundaries are not clear enough');

for(const token of ['.v12-hero-title','.v12-signal-strip','.v12-project-preview','.v12-ai-products','.v12-product-card','.v12-cursor','.ai-plan-card'])expect(css.includes(token),`V12 CSS missing ${token}`);
for(const token of ['.brayro-ledger','.brayro-ledger__stage','.brayro-ledger__row','.brayro-flip','.brayro-spotlight-surface','.brayro-curtain'])expect(css13.includes(token),`V13 interaction CSS missing ${token}`);
for(const token of ['class CapabilityLedger','class V12Reveal','class FloatingHeader','class FlipLinks','class SpotlightSurfaces','class CurtainReveal','class ProjectPreview','class ContextCursor','class ProductTilt','class HeroTextGuard'])expect(js.includes(token),`V12 runtime missing ${token}`);
expect(js.includes('BRAYROAI / CAPABILITY LEDGER')&&js.includes('Less decoration.'),'legacy editorial capability layer is missing');
expect(js.includes("diagram:['SOURCE','CONTEXT','ASSIST','ACTION']"),'legacy AI capability language regressed');
expect(css.includes('@media(prefers-reduced-motion:reduce)'),'V12 reduced-motion CSS is missing');
expect(css13.includes('@media(prefers-reduced-motion:reduce)'),'V13 interaction reduced-motion CSS is missing');
expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"),'V12 runtime reduced-motion handling is missing');
expect(!/transition\s*:\s*all/i.test(css),'V12 contains prohibited transition: all');
expect(!/transition\s*:\s*all/i.test(css13),'V13 interaction layer contains prohibited transition: all');
expect(Buffer.byteLength(css)<40000,'V12 CSS exceeds 40KB guardrail');
expect(Buffer.byteLength(css13)<12000,'V13 interaction CSS exceeds 12KB guardrail');
expect(Buffer.byteLength(js)<18000,'V12 JS exceeds 18KB guardrail');

expect(motion5.includes("document.querySelector('.v12-capabilities')")&&motion5.includes("body.classList.add('v12-runtime-isolated')"),'legacy V5→V11 homepage mutation chain is not isolated');
expect(pkg.includes('"version": "15.0.0"'),'package release is not V15');
expect(pkg.includes('node --check public/brayro-v12.js'),'syntax suite does not check V12 compatibility runtime');
expect(pkg.includes('node tests/v12-integrity.mjs'),'integrity suite does not keep the V12 compatibility contract');

for(const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp','fakhrimart-case-desktop.png','fakhrimart-case-mobile.png','brayroai-cinematic-opening.mp4'])expect(exists(path.join('public/assets',asset)),`missing ${asset}`);
for(const file of ['public/brayro-v12.css','public/brayro-v13.css','public/brayro-v12.js','public/contact-priority.css','public/contact-priority.js','public/visual-finish.css'])expect(exists(file),`missing ${file}`);

for(const [name,html] of Object.entries({home,plans})){
  const refs=[...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(match=>match[1]).filter(ref=>ref&&!['plans','founder','terms'].includes(ref));
  for(const ref of refs)expect([path.join(root,'public',ref),path.join(root,ref)].some(fs.existsSync),`missing local ${name} reference: /${ref}`);
}

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V12 compatibility integrity OK beneath V15: source contracts, project proof, AI offers and legacy isolation checked');
