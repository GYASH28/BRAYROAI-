import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),read=file=>fs.readFileSync(path.join(root,file),'utf8'),exists=file=>fs.existsSync(path.join(root,file)),errors=[],expect=(condition,message)=>{if(!condition)errors.push(message)};
const home=read('index.html'),plans=read('plans.html'),css=read('public/brayro-v12.css'),css13=read('public/brayro-v13.css'),js=read('public/brayro-v12.js'),motion5=read('public/motion-v5.js'),vite=read('vite.config.mjs'),pkg=read('package.json');

expect((home.match(/data-scene=/g)||[]).length===8,'homepage must contain eight purposeful source scenes');
expect(home.includes('class="v12-hero-title"')&&home.includes('Digital, designed'),'hero typography guard is missing');
expect(home.includes('data-v12-story')&&(home.match(/data-v12-step=/g)||[]).length===4,'four-discipline source markup is incomplete');
expect((home.match(/data-v12-project data-preview=/g)||[]).length===3,'project showcase must contain three previewable rows');
expect(home.includes('FEATURED CLIENT / FAKHRIMART')&&home.includes('https://fakhriyarns.vercel.app/'),'real FakhriMart client proof is missing');
expect(home.includes('id="ai-systems"')&&home.includes('AI Workflow Audit')&&home.includes('Company Second Brain'),'homepage AI product section is missing');
for(const price of ['₹9,999','₹29,999','₹2,999/mo'])expect(home.includes(price),`homepage missing AI price signal ${price}`);
expect((plans.match(/class="build-card/g)||[]).length===6,'six website plan cards must remain intact');
expect((plans.match(/class="ai-plan-card/g)||[]).length===2,'Plans must contain two primary AI product cards');

for(const token of ['.v12-hero-title','.v12-project-preview','.v12-ai-products','.v12-product-card','.ai-plan-card'])expect(css.includes(token),`V12 CSS missing live token ${token}`);
for(const token of ['.brayro-flip','.brayro-curtain'])expect(css13.includes(token),`V13 live interaction CSS missing ${token}`);
for(const token of ['class IntroPerformanceGuard','class V12Reveal','class FloatingHeader','class FlipLinks','class CurtainReveal','class ProjectPreview','class HeroTextGuard'])expect(js.includes(token),`V12 runtime missing ${token}`);
for(const retired of ['class CapabilityLedger','class ContextCursor','class ProductTilt','class SpotlightSurfaces','BRAYROAI / CAPABILITY LEDGER'])expect(!js.includes(retired),`retired V12 runtime still ships: ${retired}`);
expect(!css13.includes('.brayro-ledger'),'retired V13 ledger CSS still ships');
expect(js.includes('IntersectionObserver'),'V12 active navigation/reveal should use observer-based state');
expect(!/transition\s*:\s*all/i.test(css+css13),'V12/V13 contains prohibited transition: all');
expect(Buffer.byteLength(css13)<4000,'V13 live CSS should remain below 4KB after dead-code purge');
expect(Buffer.byteLength(js)<13000,'V12 compatibility JS exceeds 13KB after dead-code purge');

expect(motion5.includes("document.querySelector('.v12-capabilities')")&&motion5.includes("body.classList.add('v12-runtime-isolated')"),'legacy V5 isolation contract changed unexpectedly');
expect(vite.includes("href=\"\\/motion-v5\\.css\"")&&vite.includes("src=\"\\/motion-v5\\.js\""),'production transform does not strip no-op V5 home assets');
expect(pkg.includes('"version": "16.0.0"'),'package release baseline changed unexpectedly');

for(const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp','fakhrimart-case-desktop.png','fakhrimart-case-mobile.png','brayroai-cinematic-opening.mp4','brayroai-cinematic-opening-silent.mp4'])expect(exists(path.join('public/assets',asset)),`missing ${asset}`);
for(const file of ['public/brayro-v12.css','public/brayro-v13.css','public/brayro-v12.js','public/contact-priority.css','public/contact-priority.js','public/visual-finish.css'])expect(exists(file),`missing ${file}`);

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V12 compatibility integrity OK: live proof/offer contracts remain while replaced ledger, cursor, tilt and spotlight runtimes are gone.');
