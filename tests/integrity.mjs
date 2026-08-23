import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const html = read('index.html');
const css = read('public/commercial-cut.css');
const js = read('public/commercial-cut.js');
const plans = read('plans.html');
const plansCss = read('public/plans-page.css');
const plansJs = read('public/plans-page.js');
const vite = read('vite.config.mjs');
const vercel = read('vercel.json');
const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };

const cuts = ['top', 'system', 'work', 'plans', 'studio', 'contact'];
cuts.forEach((id) => expect(html.includes(`id="${id}"`), `missing #${id}`));
expect((html.match(/data-commercial-cut=/g) || []).length === 12, 'expected twelve commercial cuts');
expect((html.match(/data-sc-act="flow"/g) || []).length === 12, 'every rhythmic cut must remain a flow act');
expect(!html.includes('data-sc-act="pin"'), 'rhythmic cutlist must not contain pinned acts');
expect(!html.includes('data-sc-dwell'), 'rhythmic cutlist must not contain dwell');

for (const asset of [
  'hero-background.webp', 'yash-cutout.webp', 'about-yash.webp',
  'fakhrimart-case-desktop.png', 'fakhrimart-case-mobile.png',
  'brayroai-convergence.mp4', 'brayroai-convergence-poster.webp'
]) expect(exists(path.join('public/assets', asset)), `missing production asset: ${asset}`);

expect((html.match(/src="\/assets\/hero-background\.webp"/g) || []).length === 2, 'hero requires monochrome and colour background layers');
expect((html.match(/src="\/assets\/yash-cutout\.webp"/g) || []).length === 2, 'hero requires monochrome and colour founder layers');
expect(html.includes('data-colour-stage') && html.includes('data-colour-toggle'), 'director colour-matte interaction is missing');
expect(css.includes('mask-image: radial-gradient') && js.includes('class ColourDirector'), 'live colour aperture is incomplete');
expect(html.includes('data-relief-console') && html.includes('type="range"'), 'tactile product control is missing');
expect((html.match(/data-ai-choice=/g) || []).length === 3, 'AI workflow must expose three real choices');
expect((html.match(/data-preview-mode="(?:desktop|mobile)"/g) || []).length >= 3, 'responsive preview controls are missing');
expect(html.includes('data-proof-stage') && js.includes('class ResponsivePreview'), 'responsive choice does not carry into proof');
expect(html.includes('data-film-controls') && html.includes('data-film-range'), 'directable film timeline is missing');
expect(js.includes('togglePlayback()') && js.includes('this.video.currentTime'), 'film controls are not wired to real media');
expect(js.includes("rootMargin: '120% 0px'") && js.includes('this.loadObserver.disconnect()'), 'brand film must defer its full-buffer fetch until the visitor approaches');
expect((html.match(/data-project-type=/g) || []).length === 3, 'project intent must expose three choices');
expect(html.includes('data-project-cta') && js.includes('class ProjectIntent'), 'project intent does not shape the enquiry');
expect(js.includes("style.setProperty('--cut-p'") && js.includes("style.setProperty('--motion-energy'"), 'scroll choreography signals are missing');
expect(html.includes('aria-live="polite"') && js.includes("setAttribute('aria-pressed'"), 'interactive state semantics are missing');

expect(html.includes('https://fakhriyarns.vercel.app/'), 'live FakhriMart destination is missing');
expect(html.includes('https://github.com/GYASH28'), 'founder GitHub destination is missing');
expect(html.includes('mailto:yashganesh.work@gmail.com'), 'project email destination is missing');
expect(!html.includes('<iframe'), 'proof must not depend on an iframe');
expect(js.includes('window.ScrollCraft.mount(document.body)'), 'ScrollCraft runtime is not mounted');
expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"), 'reduced-motion runtime branch is missing');
expect(css.includes('@media (prefers-reduced-motion: reduce)'), 'reduced-motion styles are missing');
expect(css.includes(':focus-visible'), 'focus-visible safeguards are missing');
expect(css.includes('@media (max-width: 700px)'), 'mobile layout is missing');
expect(!/transition\s*:\s*all/i.test(css), 'transition: all is prohibited');
expect(!/[—]/.test(html), 'visible em dash is prohibited');
expect(html.includes('₹9,999') && html.includes('₹17,999') && html.includes('₹25K–₹35K+'), 'homepage build-plan prices are incorrect');
expect(html.includes('₹2,499/mo') && html.includes('₹3,999/mo') && html.includes('₹5,999+/mo'), 'homepage care-plan prices are incorrect');
expect(html.includes('href="/plans.html"'), 'homepage does not expose the standalone plans page');

expect((plans.match(/data-plan-cut=/g) || []).length === 9, 'standalone plans page must have nine cinematic cuts');
expect(plans.includes('₹9,999') && plans.includes('₹17,999') && plans.includes('₹25K–₹35K+'), 'standalone build-plan prices are incorrect');
expect(plans.includes('₹2,499') && plans.includes('₹3,999') && plans.includes('₹5,999+'), 'standalone care-plan prices are incorrect');
expect((plans.match(/data-scope-choice=/g) || []).length === 3, 'scope director must expose three choices');
expect(plansJs.includes('class ScopeDirector') && plansJs.includes('class PlansTimeline'), 'standalone plans interactions are incomplete');
expect(plansCss.includes('@media (prefers-reduced-motion: reduce)') && plansCss.includes(':focus-visible'), 'standalone plans motion or focus safeguards are missing');
expect(!/transition\s*:\s*all/i.test(plansCss), 'transition: all is prohibited on plans page');
expect(!/[—]/.test(plans), 'visible em dash is prohibited on plans page');
expect(vite.includes("plans:resolve(process.cwd(),'plans.html')"), 'plans page is missing from the production build');
expect(vercel.includes("media-src 'self' blob:"), 'production CSP must allow the Blob-backed brand film');

const refs = [...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)]
  .map((match) => match[1])
  .filter(Boolean);
for (const ref of refs) {
  const candidates = [path.join(root, 'public', ref), path.join(root, ref)];
  expect(candidates.some(fs.existsSync), `missing local homepage reference: /${ref}`);
}

const planRefs = [...plans.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)]
  .map((match) => match[1])
  .filter((ref) => ref && !ref.endsWith('.html'));
for (const ref of planRefs) {
  const candidates = [path.join(root, 'public', ref), path.join(root, ref)];
  expect(candidates.some(fs.existsSync), `missing local plans-page reference: /${ref}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Integrity OK: twelve-cut homepage, corrected six-plan system, standalone plans film, production routing, media, destinations, and motion safeguards checked');
