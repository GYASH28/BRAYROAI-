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
  plansCss: read('public/plans-page.css'), plansJs: read('public/plans-page.js'),
  founderCss: read('public/founder-page.css'), founderJs: read('public/founder-page.js')
};
const vite = read('vite.config.mjs');
const vercel = read('vercel.json');
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };

expect((home.match(/data-scene=/g) || []).length === 7, 'homepage must contain seven focused scenes');
expect(!home.includes('edit-flash') && !home.includes('impact-cut') && !home.includes('silence-cut'), 'obsolete cut effects remain on homepage');
for (const id of ['top','services','work','plans','studio','contact']) expect(home.includes(`id="${id}"`), `homepage missing #${id}`);
for (const price of ['₹9,999','₹17,999','₹25K–₹35K+','₹2,499/mo','₹3,999/mo','₹5,999+/mo']) expect(home.includes(price), `homepage missing ${price}`);
expect(home.includes('SEPARATE MONTHLY CARE') && home.includes('Optional support after your website is live'), 'homepage does not separate monthly care from builds');
expect(home.includes('href="/plans"') && home.includes('href="/founder"'), 'homepage missing meaningful page routes');
expect(home.includes('data-colour-stage') && files.homeJs.includes('class ColourDirector'), 'homepage colour interaction incomplete');
expect((home.match(/data-capability=/g) || []).length === 3 && files.homeJs.includes('class CapabilityInstrument'), 'capability interaction incomplete');
expect(home.includes('data-commercial-film') && files.homeJs.includes('URL.createObjectURL'), 'brand film implementation incomplete');

expect((plans.match(/data-plan-scene=/g) || []).length === 5, 'plans page must contain five purposeful scenes');
expect((plans.match(/class="build-card/g) || []).length === 3, 'plans page requires three build scopes');
expect((plans.match(/glass-panel/g) || []).length >= 7, 'plans page glass system missing');
for (const price of ['₹9,999','₹17,999','₹25K–₹35K+','₹2,499','₹3,999','₹5,999+']) expect(plans.includes(price), `plans page missing ${price}`);
expect(plans.includes('These are not smaller website builds') && plans.includes('A SEPARATE SERVICE / PAID MONTHLY'), 'plans page does not clearly separate care');
expect((plans.match(/data-scope-choice=/g) || []).length === 3 && files.plansJs.includes('class ScopeDirector'), 'plans scope director incomplete');

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
console.log('Integrity OK: focused seven-scene agency site, clear one-time versus monthly plans, dedicated founder story, optimized motion, routes, assets and safeguards checked');
