import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(process.cwd(), 'dist');
const routes = [
  ['plans.html', 'plans/index.html', 'BRAYROAI'],
  ['founder.html', 'founder/index.html', 'BRAYROAI'],
  ['terms.html', 'terms/index.html', 'BRAYROAI'],
  ['ai-workflow-audit.html', 'ai-workflow-audit/index.html', 'BRAYROAI'],
  ['company-second-brain.html', 'company-second-brain/index.html', 'BRAYROAI'],
  ['clients.html', 'clients/index.html', 'CLIENT ARCHIVE'],
  ['fakhrimart-case-study.html', 'clients/fakhrimart/index.html', 'Not a fake ecommerce store.']
];

for (const [sourceName, targetName, signature] of routes) {
  const source = resolve(root, sourceName);
  const target = resolve(root, targetName);
  if (!existsSync(source)) throw new Error(`Missing build source for clean route: ${sourceName}`);
  const html = readFileSync(source, 'utf8');
  if (!html.includes(signature)) throw new Error(`Build source ${sourceName} is missing signature: ${signature}`);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
}

console.log(`Materialized ${routes.length} clean static routes, including /clients/fakhrimart.`);
