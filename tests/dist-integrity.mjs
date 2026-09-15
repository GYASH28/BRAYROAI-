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
  expect(html.includes('href="/home-critical.css" data-brayro-home-critical'), 'Homepage is missing the mobile first-fold critical stylesheet');
  expect(/href="\/assets\/brayro-home\.css" media="\(min-width:701px\)" data-brayro-home-styles/.test(html), 'Homepage full cinematic stylesheet should be non-blocking on phone widths');
  expect(html.includes('src="/home-style-loader.js" data-home-style-loader'), 'Homepage is missing the intent-driven full-style loader');
  expect(html.includes('/rae.js'), 'Homepage is missing Rae runtime');
  expect(html.includes('/brayro-cursor-v22.js'), 'Homepage is missing V22 cursor runtime');
  expect(!html.includes('href="/mobile-polish-v25.css"'), 'Homepage should bundle Mobile V25 instead of adding a render-blocking stylesheet');
  expect(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?family=Archivo\+Black[^>]*media="print"[^>]*data-layout-stable-fonts>/i.test(html), 'Homepage Google Fonts should remain non-blocking and CSP-safe');
  assertCspSafeHtml(html,'index.html',{mobileLink:false});
  for (const legacy of ['/brayro-v12.css', '/brayro-v14.css', '/brayro-v15.css', '/rae.css', '/brayro-cursor-v22.css']) {
    expect(!html.includes(`href="${legacy}"`), `Homepage should bundle stylesheet instead of direct-linking ${legacy}`);
  }
  const bundle = resolve(root, 'assets/brayro-home.css');
  expect(existsSync(bundle), 'Homepage stylesheet bundle missing');
  if (existsSync(bundle)) {
    const css = readFileSync(bundle, 'utf8');
    expect(css.includes('.rae-root'), 'Homepage bundle is missing Rae styles');
    expect(css.includes('.v22-cursor'), 'Homepage bundle is missing V22 cursor styles');
    expect(css.includes('BRAYROAI / Mobile V25'), 'Homepage bundle is missing Mobile V25 styles');
    expect(css.includes('.opening-sequence{background:transparent!important}'), 'Homepage Mobile V25 should reveal the ready hero beneath the opening shutters');
  }
  const critical=resolve(root,'home-critical.css');
  const loader=resolve(root,'home-style-loader.js');
  expect(existsSync(critical),'Homepage critical CSS asset missing');
  expect(existsSync(loader),'Homepage full-style loader asset missing');
  if(existsSync(critical)){
    const css=readFileSync(critical,'utf8');
    expect(css.includes('.hero__subject')&&css.includes('html:not(.home-full-ready)'), 'Homepage critical CSS lost hero geometry or below-fold shielding');
    expect(Buffer.byteLength(css)<12000, `Homepage critical CSS exceeds 12KB guardrail (${Buffer.byteLength(css)})`);
  }
  if(existsSync(loader)){
    const js=readFileSync(loader,'utf8');
    expect(js.includes('__BRAYRO_HOME_STYLES__')&&js.includes("sheet.media='all'"), 'Homepage loader lost intent-driven stylesheet promotion');
    expect(Buffer.byteLength(js)<3000, `Homepage style loader exceeds 3KB guardrail (${Buffer.byteLength(js)})`);
  }
}

for (const file of ['rae.js','rae.css','brayro-cursor-v22.js','brayro-cursor-v22.css','mobile-polish-v25.css','home-critical.css','home-style-loader.js']) {
  expect(existsSync(resolve(root,file)), `Missing production companion asset: ${file}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Dist integrity passed: clean routes, CSP-safe static JS capability, non-blocking fonts, critical mobile home CSS, intent-loaded full home styles, Mobile V25, canonical metadata, Rae and V22 cursor are present.');
