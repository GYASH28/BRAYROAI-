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
expect(home.includes('href="/latest-refinements.css"'), 'latest refinement layer not loaded');
expect(home.includes('data-colour-stage') && files.homeJs.includes('class ColourDirector'), 'homepage colour interaction incomplete');
expect((home.match(/data-capability=/g) || []).length === 3 && files.homeJs.includes('class CapabilityInstrument'), 'capability interaction incomplete');
expect(home.includes('data-commercial-film') && files.homeJs.includes('URL.createObjectURL'), 'brand film implementation incomplete');

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
expect(!plans.includes('These are not smaller website builds') && !plans.includes('A SEPARATE SERVICE / PAID MONTHLY'), 'old monthly-care positioning returned');

expect(files.refinements.includes('openingAway 0s 3.8s') && files.refinements.includes('shutterTop 1.28s 2.35s'), 'latest homepage opening is not held long enough');
expect(files.refinements.includes('openingProgress 3.35s'), 'opening progress choreography missing');
expect(files.plansJs.includes("'Website Starter', '₹2,599'") && files.plansJs.includes("'Business Website', '₹3,999'") && files.plansJs.includes("'Premium Website', '₹5,999+'"), 'interactive scope director can revert to old pricing');

expect((plans.match(/data-plan-scene=/g) || []).length === 5, 'plans page must contain five purposeful scenes');
expect((plans.match(/class="build-card/g) || []).length === 3, 'plans page requires three website build scopes');
expect((plans.match(/data-scope-choice=/g) || []).length === 3 && files.plansJs.includes('class ScopeDirector'), 'plans scope director incomplete');
expect((plans.match(/glass-panel/g) || []).length >= 7, 'plans page glass system missing');

expect((founder.match(/data-founder-scene=/g) || []).length === 6, 'founder page must contain six meaningful scenes');
expect(founder.includes('Yash Ganesh') && founder.includes('https://github.com/GYASH28'), 'founder identity or destination missing');
expect((founder.match(/data-principle=/g) || []).length === 3 && files.founderJs.includes('class PrincipleInstrument'), 'founder principle interaction incomplete');
for (const asset of ['about-yash.webp','brayroai-process-table.webp','brayroai-installation-hero.webp']) expect(founder.includes(asset), `founder page missing ${asset}`);

for (const [name, css] of Object.entries({home:files.homeCss, plans:files.plansCss, founder:files.founderCss})) {
  expect(css.includes(':focus-visible'), `${name} focus-visible safeguards missing`);
  expect(/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css), `${name} reduced-motion styles missing`);
  expect(!/transition\s*:\s*all/i.test(css), `${name} contains prohibited transition: all`);
}
for (const [name, js] of Object.entries({home:files.homeJs, plans:files.plansJs, founder:files.founderJs})) {
  expect(js.includes('IntersectionObserver') && js.includes("rootMargin: '-3% 0px -11% 0px'"), `${name} reveal timing guard missing`);
  expect(js.includes('window.ScrollCraft.mount(document.body)'), `${name} does not mount ScrollCraft`);
  expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"), `${name} reduced-motion branch missing`);
}

for (const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp','fakhrimart-case-desktop.png','fakhrimart-case-mobile.png','brayroai-convergence.mp4','brayroai-convergence-mobile.mp4','brayroai-convergence-poster.webp','brayroai-installation-hero.webp','brayroai-process-table.webp']) {
  expect(exists(path.join('public/assets', asset)), `missing production asset: ${asset}`);
}
expect(vite.includes("plans:resolve(process.cwd(),'plans.html')") && vite.includes("founder:resolve(process.cwd(),'founder.html')"), 'Vite multi-page entries incomplete');
expect(vercel.includes('"source":"/plans"') && vercel.includes('"source":"/founder"'), 'production clean routes incomplete');
expect(vercel.includes("media-src 'self' blob:"), 'production CSP blocks blob video');

for (const [name, html] of Object.entries({home, plans, founder})) {
  const refs = [...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map((match) => match[1]).filter((ref) => ref && !['plans','founder'].includes(ref));
  for (const ref of refs) {
    const candidates = [path.join(root,'public',ref),path.join(root,ref)];
    expect(candidates.some(fs.existsSync), `missing local ${name} reference: /${ref}`);
  }
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Integrity OK: latest commercial-cut site + founder story + complete one-time low-cost website plans + slower opening choreography checked');
