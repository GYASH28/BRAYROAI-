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

for (const [file, canonicalPath] of checks) {
  const full = resolve(root, file);
  expect(existsSync(full), `Missing materialized clean route: ${file}`);
  if (!existsSync(full)) continue;
  const html = readFileSync(full, 'utf8');
  expect(html.includes(`rel="canonical" href="https://brayroai.vercel.app${canonicalPath}"`), `${file} has the wrong canonical route`);
  expect(html.includes('name="x-brayro-commit"'), `${file} is missing build commit metadata`);
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
  expect(html.includes('href="/assets/brayro-home.css"'), 'Homepage is missing the consolidated stylesheet');
  for (const legacy of ['/brayro-v12.css', '/brayro-v14.css', '/brayro-v15.css']) {
    expect(!html.includes(`href="${legacy}"`), `Homepage still renders legacy stylesheet link ${legacy}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Dist integrity passed: clean static routes, canonical metadata and consolidated homepage CSS are present.');
