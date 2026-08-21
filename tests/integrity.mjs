import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const html=read('index.html');
const critical=read('public/styles.css');
const fixes=read('public/site-fixes.css');
const experience=read('public/experience.css');
const js=read('public/app.js');
const vite=read('vite.config.mjs');
const vercel=read('vercel.json');
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
for(const token of ["font:800 clamp(72px,8.8vw,148px)/.78 'Space Grotesk'",'left:59%;bottom:-5%','font-size:12.1vw','padding-top:30.5vh'])expect(critical.includes(token),`locked hero visual token changed: ${token}`);

for(const id of ['main','top','starting-point','difference','services','system','work','plans','pricing','studio','contact'])expect(html.includes(`id="${id}"`),`missing #${id}`);
const chapterOrder=[...html.matchAll(/data-scroll-chapter id="([^"]+)"/g)].map(match=>match[1]);
expect(JSON.stringify(chapterOrder)===JSON.stringify(['starting-point','difference','services','work','plans','studio','contact']),`wrong chapter order: ${chapterOrder.join(', ')}`);
expect(html.includes('<canvas aria-hidden="true" data-particle-field></canvas>'),'persistent decorative particle canvas missing or not aria-hidden');
for(const state of ['presence','attention','disciplines','proof','scope','human','identity'])expect(html.includes(`data-particle-state="${state}"`),`missing particle state ${state}`);
expect(js.includes('class ParticleMorphField')&&js.includes("getContext('webgl'")&&js.includes("document.body.dataset.particleMode='fallback'"),'adaptive WebGL particle engine or fallback missing');
expect(js.includes('class ScrollFilmController')&&js.includes('class CapabilityController'),'scroll-film or capability controller missing');
expect((js.match(/addEventListener\('scroll'/g)||[]).length===1,'scroll work must remain centralized behind one passive listener');
expect(!/Lenis|locomotive|ScrollTrigger/i.test(js+experience),'scroll hijacking or overlapping motion runtime slipped in');

for(const price of ['₹2,599','₹3,999','₹5,999+','₹2,499'])expect(html.includes(price),`pricing missing ${price}`);
for(const oldPrice of ['₹9,999','₹17,999','₹25K–35K+'])expect(!html.includes(oldPrice),`obsolete price returned: ${oldPrice}`);
for(const name of ['Website Starter','Business Website','Custom Experience','Launch','Grow','Pro'])expect(html.includes(name),`offer missing ${name}`);
expect(html.includes('Hosting, domains, paid tools, ecommerce, large content work, and advanced integrations are scoped separately.'),'scope exclusions are not visible beside plan decisions');
for(const subject of ['BRAYROAI%20Website%20Starter%20%E2%80%94%20%E2%82%B92%2C599','BRAYROAI%20Business%20Website%20%E2%80%94%20%E2%82%B93%2C999','BRAYROAI%20Custom%20Experience%20enquiry','Help%20me%20choose%20a%20BRAYROAI%20plan','BRAYROAI%20Launch%20support','BRAYROAI%20Grow%20support','BRAYROAI%20Pro%20support'])expect(html.includes(`subject=${subject}`),`exact mail subject missing: ${subject}`);

for(const fact of ['Yarn wholesaler','Catalogue-led browsing','Desktop + mobile experience','Enquiry-led flow'])expect(html.includes(fact),`verified proof fact missing: ${fact}`);
expect(html.includes('https://fakhriyarns.vercel.app/'),'live FakhriMart destination missing');
expect((html.match(/fakhrimart-case-desktop\.png/g)||[]).length===1,'desktop proof must appear exactly once');
expect((html.match(/fakhrimart-case-mobile\.png/g)||[]).length===1,'mobile proof must appear exactly once');
expect(html.includes('/assets/about-yash.webp'),'real founder image missing');
for(const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp','fakhrimart-case-desktop.png','fakhrimart-case-mobile.png'])expect(exists(path.join('public/assets',asset)),`missing ${asset}`);
for(const invented of ['testimonial','award-winning','guaranteed results','clients served','conversion increase'])expect(!html.toLowerCase().includes(invented),`unverified claim pattern returned: ${invented}`);

expect(html.includes('data-theme-toggle')&&html.includes('aria-label="Switch to light mode"'),'accessible theme control missing');
expect(html.includes('data-motion-toggle')&&html.includes('aria-label="Pause ambient motion"'),'ambient motion pause control missing');
expect((html.match(/data-capability=/g)||[]).length===4&&(html.match(/aria-pressed="false" data-capability/g)||[]).length===3,'four accessible capability controls missing');
expect(experience.includes('@media(prefers-reduced-motion:reduce)')&&js.includes("document.body.dataset.particleMode='static'"),'reduced-motion art direction missing');
expect(experience.includes('@media(forced-colors:active)'),'forced-colors fallback missing');
expect(experience.includes('@media(max-width:700px)')&&experience.includes('@media(max-width:380px)'),'mobile direction missing');
expect(html.includes('id="experience-styles" media="print"')&&html.includes('id="post-fixes-styles" media="print"'),'post-hero styles must remain deferred');
expect(js.includes("document.documentElement.dataset.experience='enhanced'"),'progressive enhancement state missing');
expect(!html.includes(' hidden')&&!html.includes('style="display:none'),'semantic document hides required content without JavaScript');

expect(Buffer.byteLength(critical,'utf8')<24000,'critical styles.css grew above 24KB');
expect(Buffer.byteLength(experience,'utf8')<50000,'experience.css grew above 50KB');
expect(Buffer.byteLength(js,'utf8')<35000,'app.js grew above the authored runtime budget');
expect(fixes.includes('.site-nav.is-compact'),'post-hero header integration missing');
expect(vite.includes("input:{home:resolve(process.cwd(),'index.html')}"),'single-page Vite build contract changed');
expect(vercel.includes('"/plans"')&&vercel.includes('"/#plans"')&&vercel.includes('"/#work"'),'legacy routes do not redirect to canonical anchors');
expect(exists('public/outbound-fresh'),'private outbound concepts were accidentally removed');

const refs=[...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(match=>match[1]).filter(Boolean);
for(const ref of refs){const candidates=[path.join(root,'public',ref),path.join(root,ref)];expect(candidates.some(fs.existsSync),`homepage missing local reference /${ref}`)}

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Integrity OK: frozen hero + seven-chapter signal film + exact lower pricing + proof + adaptive interaction contracts checked');
