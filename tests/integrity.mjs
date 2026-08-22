import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const html=read('index.html');
const plansHtml=read('plans.html');
const critical=read('public/styles.css');
const film=read('public/minimal-film.css');
const js=read('public/app.js');
const plansCss=read('public/plans.css');
const plansJs=read('public/plans.js');
const vite=read('vite.config.mjs');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

const heroStart=html.indexOf('<section class="hero hero-v3');
const heroEnd=html.indexOf('\n</section>',heroStart)+11;
const heroHash=crypto.createHash('sha256').update(html.slice(heroStart,heroEnd)).digest('hex');
expect(heroHash==='4adaa5b58fd6373a1d7fa467299a71d667d96a8a8a6d068c2ceed1fa45df9528','frozen hero markup changed');
expect(html.includes('<div aria-hidden="true" class="intro-loader" data-loader="">'),'locked opening loader missing');
expect(js.includes('class LockedHeroController')&&js.includes('},920)'),'locked hero controller or loader timing changed');
expect(js.includes('this.px*34*depth')&&js.includes('scrollP*86*depth'),'locked hero parallax behavior changed');
expect(critical.includes('/* HERO V3 — visual contract frozen. */'),'frozen hero CSS marker missing');

for(const id of ['main','top','services','work','plans','contact'])expect(html.includes(`id="${id}"`),`missing #${id}`);
const chapterOrder=[...html.matchAll(/data-scroll-chapter id="([^"]+)"/g)].map(match=>match[1]);
expect(JSON.stringify(chapterOrder)===JSON.stringify(['services','work','plans','contact']),`wrong post-hero chapter order: ${chapterOrder.join(', ')}`);
expect(chapterOrder.length===4,'homepage must contain exactly four post-hero scenes');
for(const removed of ['starting-point','difference','studio'])expect(!html.includes(`id="${removed}"`),`removed scene returned: #${removed}`);
for(const nav of ['Home','Services','Work','Plans','Contact'])expect(html.includes(`>${nav}</a>`),`primary five-item navigation missing ${nav}`);

expect(html.includes('<canvas aria-hidden="true" data-particle-field></canvas>'),'persistent particle canvas missing');
for(const state of ['disciplines','proof','scope','identity'])expect(html.includes(`data-particle-state="${state}"`),`missing particle state ${state}`);
expect(js.includes('class ParticleMorphField')&&js.includes("getContext('webgl'"),'WebGL particle engine missing');
expect(js.includes('class ScrollFilmController')&&js.includes('class CapabilityController'),'scroll-film runtime missing');
expect((js.match(/addEventListener\('scroll'/g)||[]).length===1,'scroll work must stay centralized');
expect(!/Lenis|locomotive|ScrollTrigger/i.test(js+film),'scroll hijacking dependency returned');

for(const price of ['₹2,599','₹3,999','₹5,999+','₹2,499'])expect(html.includes(price),`homepage pricing missing ${price}`);
for(const name of ['Website Starter','Business Website','Custom Experience'])expect(html.includes(name),`homepage offer missing ${name}`);
expect((html.match(/data-plan=/g)||[]).length===3,'homepage must show exactly three primary plan decisions');
expect(html.includes('Hosting, domains, paid tools, ecommerce, large content work, and advanced integrations are scoped separately.'),'scope boundary missing');
for(const route of ['/plans?plan=starter','/plans?plan=business','/plans?plan=custom','/plans#plan-finder'])expect(html.includes(`href="${route}`),`homepage plan route missing: ${route}`);

for(const fact of ['Yarn wholesaler','Catalogue-led browsing','Desktop + mobile experience','Enquiry-led flow'])expect(html.includes(fact),`verified proof fact missing: ${fact}`);
expect(html.includes('https://fakhriyarns.vercel.app/'),'live FakhriMart destination missing');
expect((html.match(/fakhrimart-case-desktop\.png/g)||[]).length===1,'desktop proof must appear exactly once');
expect((html.match(/fakhrimart-case-mobile\.png/g)||[]).length===1,'mobile proof must appear exactly once');
expect(html.includes('/assets/about-yash.webp'),'founder image missing from final scene');

expect(html.includes('data-theme-toggle')&&html.includes('aria-label="Switch to light mode"'),'theme control missing');
expect(html.includes('data-motion-toggle')&&html.includes('aria-label="Pause ambient motion"'),'motion pause control missing');
expect((html.match(/data-capability=/g)||[]).length===4,'four capability controls missing');
expect(film.includes('@media(prefers-reduced-motion:reduce)'),'reduced-motion direction missing');
expect(film.includes('@media(forced-colors:active)'),'forced-colors direction missing');
expect(film.includes('.minimal-scene .scene-stick')&&film.includes('position:sticky'),'scroll-film sticky composition missing');
expect(film.includes('.particle-hud,.formation-director{display:none!important}'),'clutter HUD is not suppressed');
expect(film.includes('.scene-word')&&film.includes('.minimal-proof')&&film.includes('.minimal-plans'),'five-scene visual system incomplete');
expect(html.includes('<link href="/minimal-film.css" rel="stylesheet"/>'),'minimal film stylesheet not loaded');
for(const legacy of ['experience-styles','cinematic-styles','commercial-styles','clarity-styles','post-fixes-styles'])expect(!html.includes(legacy),`legacy visual layer still loaded: ${legacy}`);

for(const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp','fakhrimart-case-desktop.png','fakhrimart-case-mobile.png'])expect(exists(path.join('public/assets',asset)),`missing ${asset}`);
for(const invented of ['testimonial','award-winning','guaranteed results','clients served','conversion increase'])expect(!html.toLowerCase().includes(invented),`unverified claim pattern returned: ${invented}`);

for(const price of ['₹2,599','₹3,999','₹5,999+','₹2,499'])expect(plansHtml.includes(price),`dedicated plans page missing ${price}`);
expect(plansHtml.includes('data-plan-finder')&&plansJs.includes('class PlanFinder'),'dedicated plan finder missing');
expect(plansCss.includes('@media(max-width:620px)'),'plans mobile direction missing');
expect(vite.includes("plans:resolve(process.cwd(),'plans.html')"),'plans page missing from Vite build');

expect(Buffer.byteLength(critical,'utf8')<24000,'critical styles.css grew above 24KB');
expect(Buffer.byteLength(film,'utf8')<26000,'minimal-film.css grew above 26KB');
expect(Buffer.byteLength(js,'utf8')<35000,'app.js grew above authored runtime budget');

const refs=[...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(match=>match[1]).filter(Boolean).filter(ref=>ref!=='plans');
for(const ref of refs){
  const candidates=[path.join(root,'public',ref),path.join(root,ref),path.join(root,`${ref}.html`)];
  expect(candidates.some(fs.existsSync),`homepage missing local reference /${ref}`);
}

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Integrity OK: frozen hero + five-scene minimalist SaaS film + proof + pricing + accessibility contracts checked');
