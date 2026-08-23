import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const home = read('index.html');
const plans = read('plans.html');
const founder = read('founder.html');
const files = {
  homeCss: read('public/commercial-cut.css'), homeJs: read('public/commercial-cut.js'),
  refinements: read('public/latest-refinements.css'),
  polishCss: read('public/premium-polish.css'), polishJs: read('public/premium-polish.js'),
  v2Css: read('public/experience-v2.css'), v2Compat: read('public/experience-v2-compat.css'), v2Js: read('public/experience-v2.js'),
  plansCss: read('public/plans-page.css'), plansJs: read('public/plans-page.js'),
  founderCss: read('public/founder-page.css'), founderJs: read('public/founder-page.js')
};
const vite = read('vite.config.mjs');
const vercel = read('vercel.json');
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };

expect((home.match(/data-scene=/g) || []).length === 7, 'homepage must contain seven focused scenes');
for (const id of ['top','services','work','plans','studio','contact']) expect(home.includes(`id="${id}"`), `homepage missing #${id}`);
expect(home.includes('href="/plans"') && home.includes('href="/founder"'), 'homepage missing latest Plans / Founder routes');
for (const html of [home,plans,founder]) {
  expect(html.includes('href="/premium-polish.css"'), 'premium polish CSS is not wired into every public page');
  expect(html.includes('src="/premium-polish.js"'), 'premium polish runtime is not wired into every public page');
  expect(html.includes('href="/experience-v2.css"'), 'V2 experience polish CSS is not wired into every public page');
  expect(html.includes('src="/experience-v2.js"'), 'V2 experience runtime is not wired into every public page');
}
expect(home.includes('href="/experience-v2-compat.css"'), 'signal chamber compatibility layer missing');
expect(home.includes('data-colour-stage') && files.homeJs.includes('class ColourDirector'), 'homepage colour interaction incomplete');
expect((home.match(/data-capability=/g) || []).length === 3 && files.homeJs.includes('class CapabilityInstrument'), 'capability interaction incomplete');

expect(home.includes('data-signal-chamber'), 'native signal chamber third scene missing');
expect(home.includes('BRAYROAI / SIGNAL CHAMBER') && home.includes('ONE CONNECTED PRODUCTION'), 'signal chamber content incomplete');
expect(home.includes('data-signal-status') && home.includes('data-signal-index'), 'signal chamber live status instrumentation missing');
expect(!home.includes('<video') && !home.includes('data-commercial-film') && !home.includes('data-film-controls'), 'background video or playback controls returned to the third scene');
expect(files.v2Js.includes('class SignalChamber') && files.v2Js.includes('--signal-scale') && files.v2Js.includes('SHIPPING THE EXPERIENCE'), 'signal chamber scroll runtime incomplete');
expect(files.v2Css.includes('.film.signal-scene') && files.v2Css.includes('.signal-chamber__core') && files.v2Css.includes('.signal-chamber__orbit'), 'signal chamber visual system incomplete');
expect(files.v2Compat.includes('--signal-rot-one') && files.v2Compat.includes('--signal-sweep'), 'signal chamber browser compatibility transforms missing');

for (const price of ['₹2,599','₹3,999','₹5,999+']) {
  expect(home.includes(price), `homepage missing website-build price ${price}`);
  expect(plans.includes(price), `plans page missing website-build price ${price}`);
}
for (const obsolete of ['₹9,999','₹17,999','₹25K–₹35K+','₹2,499/mo','₹3,999/mo','₹5,999+/mo']) {
  expect(!home.includes(obsolete), `homepage still exposes obsolete pricing ${obsolete}`);
  expect(!plans.includes(obsolete), `plans page still exposes obsolete pricing ${obsolete}`);
}
expect(home.includes('Every plan below is for building and launching a complete website'), 'homepage does not clearly define plans as website builds');
expect(home.includes('NO MAINTENANCE SUBSCRIPTION REQUIRED'), 'homepage maintenance clarification missing');
expect(plans.includes('Every plan on this page is for making and launching a complete website'), 'plans page does not clearly define low tiers as full website builds');
expect(plans.includes('You do not need a maintenance subscription'), 'plans page optional-maintenance boundary missing');

expect(files.polishCss.includes('polishOpeningExit') && files.polishCss.includes('polishOpeningMark') && files.polishCss.includes('polishShutterTop'), 'enhanced multi-beat homepage opening missing');
expect(files.polishCss.includes('.services{min-height:118svh'), 'desktop pacing refinements missing');
expect(files.polishCss.includes('@media(max-width:700px)') && files.polishCss.includes('.opening-sequence{display:block!important'), 'mobile opening/pacing treatment missing');
expect(files.polishCss.includes('@media(prefers-reduced-motion:reduce)'), 'premium polish reduced-motion safeguard missing');
expect(files.polishJs.includes('polish-open__beats') && files.polishJs.includes("['SIGNAL', 'DIRECTION', 'SYSTEM', 'LAUNCH']"), 'opening beat director missing');
expect(files.polishJs.includes('is-scene-live') && files.polishJs.includes('scrolling-down') && files.polishJs.includes('--reveal-delay'), 'scene continuity/stagger motion director incomplete');
expect(files.v2Css.includes('@media(prefers-reduced-motion:reduce)') && files.v2Js.includes("matchMedia('(prefers-reduced-motion: reduce)')"), 'V2 reduced-motion safeguards missing');
expect(files.v2Css.includes('v2CloseBreath') && files.v2Css.includes('v2PortraitSweep') && files.v2Css.includes('v2BeamPulse'), 'second-pass subtle motion details missing');
expect(Buffer.byteLength(files.polishCss) < 24000, 'premium polish CSS exceeds 24KB guardrail');
expect(Buffer.byteLength(files.polishJs) < 12000, 'premium polish JS exceeds 12KB guardrail');
expect(Buffer.byteLength(files.v2Css) < 26000, 'V2 experience CSS exceeds 26KB guardrail');
expect(Buffer.byteLength(files.v2Js) < 12000, 'V2 experience JS exceeds 12KB guardrail');
expect(Buffer.byteLength(files.v2Compat) < 6000, 'V2 compatibility CSS exceeds 6KB guardrail');

expect(files.plansJs.includes("'Website Starter', '₹2,599'") && files.plansJs.includes("'Business Website', '₹3,999'") && files.plansJs.includes("'Premium Website', '₹5,999+'"), 'interactive scope director can revert to old pricing');
expect((plans.match(/data-plan-scene=/g) || []).length === 5, 'plans page must contain five purposeful scenes');
expect((plans.match(/class="build-card/g) || []).length === 3, 'plans page requires three website build scopes');
expect((plans.match(/data-scope-choice=/g) || []).length === 3 && files.plansJs.includes('class ScopeDirector'), 'plans scope director incomplete');
expect((plans.match(/glass-panel/g) || []).length >= 7, 'plans page glass system missing');

expect((founder.match(/data-founder-scene=/g) || []).length === 6, 'founder page must contain six meaningful scenes');
expect(founder.includes('Yash Ganesh') && founder.includes('https://github.com/GYASH28'), 'founder identity or destination missing');
expect((founder.match(/data-principle=/g) || []).length === 3 && files.founderJs.includes('class PrincipleInstrument'), 'founder principle interaction incomplete');
for (const asset of ['about-yash.webp','brayroai-process-table.webp','brayroai-installation-hero.webp']) expect(founder.includes(asset), `founder page missing ${asset}`);

for (const [name, css] of Object.entries({home:files.homeCss, plans:files.plansCss, founder:files.founderCss, polish:files.polishCss, v2:files.v2Css})) {
  if (!['polish','v2'].includes(name)) expect(css.includes(':focus-visible'), `${name} focus-visible safeguards missing`);
  expect(/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css), `${name} reduced-motion styles missing`);
  expect(!/transition\s*:\s*all/i.test(css), `${name} contains prohibited transition: all`);
}
for (const [name, js] of Object.entries({home:files.homeJs, plans:files.plansJs, founder:files.founderJs})) {
  expect(js.includes('IntersectionObserver') && js.includes("rootMargin: '-3% 0px -11% 0px'"), `${name} reveal timing guard missing`);
  expect(js.includes('window.ScrollCraft.mount(document.body)'), `${name} does not mount ScrollCraft`);
  expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"), `${name} reduced-motion branch missing`);
}

for (const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp','fakhrimart-case-desktop.png','fakhrimart-case-mobile.png','brayroai-installation-hero.webp','brayroai-process-table.webp']) {
  expect(exists(path.join('public/assets', asset)), `missing production asset: ${asset}`);
}
expect(vite.includes("plans:resolve(process.cwd(),'plans.html')") && vite.includes("founder:resolve(process.cwd(),'founder.html')"), 'Vite multi-page entries incomplete');
expect(vercel.includes('"source":"/plans"') && vercel.includes('"source":"/founder"'), 'production clean routes incomplete');

for (const [name, html] of Object.entries({home, plans, founder})) {
  const refs = [...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map((match) => match[1]).filter((ref) => ref && !['plans','founder'].includes(ref));
  for (const ref of refs) {
    const candidates = [path.join(root,'public',ref),path.join(root,ref)];
    expect(candidates.some(fs.existsSync), `missing local ${name} reference: /${ref}`);
  }
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Integrity OK: native signal chamber + no-video third scene + premium motion layers + one-time website pricing checked');
