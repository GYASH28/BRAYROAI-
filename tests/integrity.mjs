import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const html=read('index.html');
const plansHtml=read('plans.html');
const critical=read('public/styles.css');
const fixes=read('public/site-fixes.css');
const experience=read('public/experience.css');
const cinematic=read('public/cinematic.css');
const commercial=read('public/commercial.css');
const js=read('public/app.js');
const plansCss=read('public/plans.css');
const plansJs=read('public/plans.js');
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
expect(js.includes('setNarrative(index,morph')&&js.includes('uPulseAge')&&js.includes('gl.drawArrays(gl.POINTS,0,this.profile.count)'),'continuous two-pass particle narrative missing');
expect(js.includes('transitionBurst')&&js.includes("dataset.particleTransition")&&js.includes("presence:['IDEA'")&&js.includes("human:['YASH'"),'recognizable staged particle formation and deformation missing');
expect(js.includes("document.body.dataset.particleMode='pending'")&&js.includes('activate(){if(this.gl'),'post-hero particle initialization is not deferred away from hero LCP');
expect(js.includes("addEventListener('wheel',begin")&&js.includes("addEventListener('touchmove',begin")&&js.includes('innerHeight*.96'),'particle field is not armed for the first scroll into the hero handoff');
expect(experience.includes('body[data-particle-mode="pending"].post-hero-active .particle-fallback')&&experience.includes('@keyframes fallbackField'),'visible animated particle warmup or resilient fallback missing');
expect(js.includes("attention:['SEEN'")&&js.includes("identity:['BRAYROAI'"),'meaningful attention and identity particle typography missing');
expect(html.includes('data-signal-label')&&html.includes('MOVE / PRESS / SCROLL'),'particle state HUD missing');
expect(html.includes('data-formation-director')&&html.includes('data-formation-word')&&html.includes('data-formation-phase'),'cinematic formation director missing');
expect(js.includes('class ScrollFilmController')&&js.includes('class CapabilityController'),'scroll-film or capability controller missing');
expect(js.includes("dataset.scenePhase")&&js.includes("--scene-in")&&js.includes("--scene-out"),'four-phase chapter choreography missing');
expect((js.match(/addEventListener\('scroll'/g)||[]).length===1,'scroll work must remain centralized behind one passive listener');
expect(!/Lenis|locomotive|ScrollTrigger/i.test(js+experience),'scroll hijacking or overlapping motion runtime slipped in');

for(const price of ['₹2,599','₹3,999','₹5,999+','₹2,499'])expect(html.includes(price),`pricing missing ${price}`);
for(const oldPrice of ['₹9,999','₹17,999','₹25K–35K+'])expect(!html.includes(oldPrice),`obsolete price returned: ${oldPrice}`);
for(const name of ['Website Starter','Business Website','Custom Experience','Launch','Grow','Pro'])expect(html.includes(name),`offer missing ${name}`);
expect(html.includes('Hosting, domains, paid tools, ecommerce, large content work, and advanced integrations are scoped separately.'),'scope exclusions are not visible beside plan decisions');
for(const route of ['/plans?plan=starter','/plans?plan=business','/plans?plan=custom','/plans#plan-finder'])expect(html.includes(`href="${route}`),`homepage plan route missing: ${route}`);
expect((html.match(/https:\/\/wa\.me\/919175524637/g)||[]).length>=3,'homepage direct WhatsApp conversion paths missing');

for(const price of ['₹2,599','₹3,999','₹5,999+','₹2,499'])expect(plansHtml.includes(price),`dedicated plans page missing ${price}`);
for(const name of ['Website Starter','Business Website','Custom Experience','Launch support','Grow support','Pro support'])expect(plansHtml.includes(name)||plansJs.includes(name),`dedicated plans page offer missing ${name}`);
expect((plansHtml.match(/https:\/\/wa\.me\/919175524637/g)||[]).length>=10,'dedicated plan and support WhatsApp paths missing');
expect(plansHtml.includes('data-plan-finder')&&plansJs.includes('class PlanFinder'),'interactive plan finder missing');
expect(plansHtml.includes('data-theme-toggle')&&plansJs.includes("localStorage.getItem('brayroai-theme')"),'plans theme persistence missing');
expect(plansCss.includes('@media(max-width:620px)')&&plansCss.includes('.plans-mobile-dock'),'dedicated plans mobile experience missing');

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
expect(cinematic.includes('[data-scene-phase="approach"]')&&cinematic.includes('[data-scene-phase="reveal"]')&&cinematic.includes('[data-scene-phase="hold"]')&&cinematic.includes('[data-scene-phase="release"]'),'scene anticipation and release styles missing');
expect(cinematic.includes('.formation-director')&&cinematic.includes('.context-cursor'),'cinematic formation or interaction feedback layer missing');
expect(cinematic.includes('particleTypeDrift')&&cinematic.includes('background-clip:text')&&cinematic.includes('data-particle-mode="fallback"][data-particle-transition="holding"'),'fallback particles do not visibly assemble and disperse');
expect(cinematic.includes('--scene-in:1;--scene-out:0;--scene-presence:1'),'no-JavaScript cinematic baseline would hide chapter content');
expect(experience.includes('@media(forced-colors:active)'),'forced-colors fallback missing');
expect(experience.includes('@media(max-width:700px)')&&experience.includes('@media(max-width:380px)'),'mobile direction missing');
expect(html.includes('id="experience-styles" media="print"')&&html.includes('id="post-fixes-styles" media="print"')&&html.includes('id="cinematic-styles" media="print"')&&html.includes('id="commercial-styles" media="print"'),'post-hero styles must remain deferred');
expect(js.includes("'commercial-styles'"),'commercial film layer is not activated with the progressive experience');
expect(commercial.includes('commercial cut')&&commercial.includes('heroCamera')&&commercial.includes('proof-gallery'),'premium commercial direction layer missing');
expect(js.includes("document.documentElement.dataset.experience='enhanced'"),'progressive enhancement state missing');
expect(!html.includes(' hidden')&&!html.includes('style="display:none'),'semantic document hides required content without JavaScript');

expect(Buffer.byteLength(critical,'utf8')<24000,'critical styles.css grew above 24KB');
expect(Buffer.byteLength(experience,'utf8')<50000,'experience.css grew above 50KB');
expect(Buffer.byteLength(cinematic,'utf8')<24000,'cinematic.css grew above 24KB');
expect(Buffer.byteLength(commercial,'utf8')<22000,'commercial.css grew above 22KB');
expect(Buffer.byteLength(js,'utf8')<35000,'app.js grew above the authored runtime budget');
expect(Buffer.byteLength(plansCss,'utf8')<42000,'plans.css grew above 42KB');
expect(Buffer.byteLength(plansJs,'utf8')<12000,'plans.js grew above 12KB');
expect(fixes.includes('.site-nav.is-compact'),'post-hero header integration missing');
expect(vite.includes("plans:resolve(process.cwd(),'plans.html')"),'dedicated plans page is missing from the Vite build');
expect(vercel.includes('"/pricing"')&&vercel.includes('"/plans"')&&vercel.includes('"/#work"'),'legacy routes do not redirect to canonical destinations');
expect(exists('public/outbound-fresh'),'private outbound concepts were accidentally removed');

const refs=[...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(match=>match[1]).filter(Boolean);
for(const ref of refs){const candidates=[path.join(root,'public',ref),path.join(root,ref),path.join(root,`${ref}.html`)];expect(candidates.some(fs.existsSync),`homepage missing local reference /${ref}`)}
const planRefs=[...plansHtml.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(match=>match[1]).filter(Boolean).filter(ref=>ref!=='plans');
for(const ref of planRefs){const candidates=[path.join(root,'public',ref),path.join(root,ref),path.join(root,`${ref}.html`)];expect(candidates.some(fs.existsSync),`plans page missing local reference /${ref}`)}

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Integrity OK: frozen hero + seven-chapter signal film + exact lower pricing + proof + adaptive interaction contracts checked');
