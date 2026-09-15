import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), 'dist');
const checks = [
  ['plans/index.html', '/plans'],
  ['founder/index.html', '/founder'],
  ['terms/index.html', '/terms'],
  ['ai-workflow-audit/index.html', '/ai-workflow-audit'],
  ['company-second-brain/index.html', '/company-second-brain'],
  ['clients/index.html', '/clients'],
  ['clients/fakhrimart/index.html', '/clients/fakhrimart']
];

const errors = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
const assertCspSafeHtml=(html,file,{mobileLink=true}={})=>{
  expect(!/<script(?:\s[^>]*)?>\s*[^<\s][\s\S]*?<\/script>/i.test(html), `${file} contains inline executable script`);
  expect(!/\sonload\s*=/i.test(html), `${file} contains an inline onload handler`);
  expect(!/\sonclick\s*=/i.test(html), `${file} contains an inline click handler`);
  expect(/<html[^>]*\bclass=(['"])[^'"]*\bjs\b[^'"]*\1/i.test(html), `${file} is missing the static JS capability class`);
  expect(!html.includes('data-js-bootstrap'), `${file} still ships a JS bootstrap script`);
  if(mobileLink)expect(html.includes('/mobile-polish-v25.css'), `${file} is missing Mobile V25 polish`);
};

for (const [file, canonicalPath] of checks) {
  const full = resolve(root, file);
  expect(existsSync(full), `Missing materialized clean route: ${file}`);
  if (!existsSync(full)) continue;
  const html = readFileSync(full, 'utf8');
  expect(html.includes(`rel="canonical" href="https://brayroai.vercel.app${canonicalPath}"`), `${file} has the wrong canonical route`);
  expect(html.includes('name="x-brayro-commit"'), `${file} is missing build commit metadata`);
  expect(html.includes('/rae.css'), `${file} is missing Rae CSS`);
  expect(html.includes('/rae.js'), `${file} is missing Rae runtime`);
  expect(html.includes('/brayro-cursor-v22.css'), `${file} is missing V22 cursor CSS`);
  expect(html.includes('/brayro-cursor-v22.js'), `${file} is missing V22 cursor runtime`);
  assertCspSafeHtml(html,file);
}

const fakhri = resolve(root, 'clients/fakhrimart/index.html');
if (existsSync(fakhri)) {
  const html = readFileSync(fakhri, 'utf8');
  expect(html.includes('Not a fake ecommerce store.'), 'FakhriMart clean route lost case-study content');
  expect(html.includes('/client-work.js'), 'FakhriMart clean route lost client runtime');
}

const home = resolve(root, 'index.html');
if (existsSync(home)) {
  const html = readFileSync(home, 'utf8');
  expect(html.includes('href="/assets/brayro-home.css"'), 'Homepage is missing the stable consolidated stylesheet');
  expect(html.includes('/rae.js'), 'Homepage is missing Rae runtime');
  expect(html.includes('/brayro-cursor-v22.js'), 'Homepage is missing V22 cursor runtime');
  expect(!html.includes('href="/mobile-polish-v25.css"'), 'Homepage should bundle Mobile V25 instead of adding a render-blocking stylesheet');
  expect(!html.includes('href="/rae.css"'), 'Homepage should not render-block on the full Rae conversation skin');
  expect(/<link rel="stylesheet" href="\/brayro-cursor-v22\.css" media="\(hover:hover\) and \(pointer:fine\)" data-v22-cursor-home>/i.test(html), 'Homepage cursor skin should be fine-pointer-only');
  expect(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?family=Archivo\+Black[^>]*media="print"[^>]*data-layout-stable-fonts>/i.test(html), 'Homepage Google Fonts should remain non-blocking and CSP-safe');
  assertCspSafeHtml(html,'index.html',{mobileLink:false});
  for (const legacy of ['/brayro-v12.css', '/brayro-v14.css', '/brayro-v15.css', '/rae.css']) {
    expect(!html.includes(`href="${legacy}"`), `Homepage should not direct-link render-blocking ${legacy}`);
  }
  const bundle = resolve(root, 'assets/brayro-home.css');
  expect(existsSync(bundle), 'Homepage stylesheet bundle missing');
  if (existsSync(bundle)) {
    const css = readFileSync(bundle, 'utf8');
    expect(css.includes('.rae-presence'), 'Homepage bundle is missing the lightweight Rae launcher skin');
    expect(!css.includes('.rae-panel{'), 'Homepage bundle should not contain the full Rae conversation skin');
    expect(!css.includes('.v22-cursor__dot'), 'Homepage bundle should not contain the desktop cursor skin');
    expect(css.includes('BRAYROAI / Mobile V25'), 'Homepage bundle is missing Mobile V25 styles');
    expect(css.includes('.opening-sequence{background:transparent!important}'), 'Homepage Mobile V25 should reveal the ready hero beneath the opening shutters');
  }
}

for (const file of ['rae.js','rae.css','brayro-cursor-v22.js','brayro-cursor-v22.css','mobile-polish-v25.css']) {
  expect(existsSync(resolve(root,file)), `Missing production companion asset: ${file}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Dist integrity passed: stable home cascade, CSP-safe static JS capability, non-blocking fonts, intent-loaded Rae skin, fine-pointer cursor skin, bundled-home Mobile V25, canonical metadata and clean routes are present.');
