import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';

const root = process.cwd();
const pages = ['index.html', 'work.html', 'work/fakhrimart.html'];
const failures = [];
const warnings = [];

const fail = message => failures.push(message);
const warn = message => warnings.push(message);
const read = file => readFileSync(join(root, file), 'utf8');

function publicTarget(fromFile, url) {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean || clean.startsWith('mailto:') || clean.startsWith('tel:') || clean.startsWith('data:') || /^https?:\/\//i.test(clean)) return null;
  if (clean === '/') return 'index.html';
  if (clean === '/work') return 'work.html';
  if (clean === '/work/fakhrimart') return 'work/fakhrimart.html';
  if (clean.startsWith('/')) return clean.slice(1);
  return normalize(join(dirname(fromFile), clean));
}

for (const page of pages) {
  if (!existsSync(join(root, page))) {
    fail(`${page}: missing page`);
    continue;
  }
  const html = read(page);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) fail(`${page}: expected exactly one h1, found ${h1Count}`);
  if (!/<html\s+lang=["']en["']/i.test(html)) fail(`${page}: missing html lang=en`);
  if (!/<meta\s+name=["']viewport["']/i.test(html)) fail(`${page}: missing viewport meta`);
  if (!/<meta\s+name=["']description["']/i.test(html)) fail(`${page}: missing description meta`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${page}: missing document title`);
  if (!/<a\s+class=["']skip-link["']/i.test(html)) fail(`${page}: missing skip link`);
  if (!/prefers-reduced-motion/.test(read('brayroai-responsive.css'))) fail('responsive CSS: reduced motion support missing');
  if (/\bonclick\s*=/i.test(html)) fail(`${page}: inline onclick handler found`);

  const imgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map(match => match[0]);
  imgTags.forEach((tag, index) => {
    if (!/\balt\s*=\s*["'][^"']*["']/i.test(tag)) fail(`${page}: image ${index + 1} missing alt attribute`);
  });

  const urls = [...html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]);
  for (const url of urls) {
    const target = publicTarget(page, url);
    if (!target || target.startsWith('#')) continue;
    const full = join(root, target);
    if (!existsSync(full)) fail(`${page}: broken local reference ${url} -> ${target}`);
  }

  if (/YKG\s+Digital|YKG\s+DIGITAL|YASH[_ ]PORTFOLIO/i.test(html)) fail(`${page}: legacy portfolio/agency branding leaked into BRAYROAI`);
}

for (const file of ['brayroai-core.css','brayroai-sections.css','brayroai-pages.css','brayroai-responsive.css','brayroai.js']) {
  if (!existsSync(join(root, file))) fail(`${file}: missing core runtime file`);
  else if (statSync(join(root, file)).size === 0) fail(`${file}: empty file`);
}

const js = read('brayroai.js');
if (/console\.log\(/.test(js)) warn('brayroai.js: console.log found');
if (!/IntersectionObserver/.test(js)) warn('brayroai.js: no IntersectionObserver usage detected');
if (!/prefers-reduced-motion/.test(js)) fail('brayroai.js: reduced motion runtime detection missing');

const hugeCritical = ['assets/ykg-hero-v13-4k.jpg','assets/fakhri-mart-home.webp'];
for (const file of hugeCritical) {
  if (existsSync(join(root, file)) && statSync(join(root, file)).size > 750_000) warn(`${file}: critical image exceeds 750 KB`);
}

if (warnings.length) {
  console.log('\nWarnings:');
  warnings.forEach(item => console.log(`  - ${item}`));
}
if (failures.length) {
  console.error('\nIntegrity audit failed:');
  failures.forEach(item => console.error(`  - ${item}`));
  process.exit(1);
}
console.log(`Integrity audit passed: ${pages.length} pages, local routes/assets, semantics, brand separation, and motion fallback verified.`);
