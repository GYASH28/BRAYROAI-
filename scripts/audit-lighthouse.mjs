import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {chromium} from 'playwright';

// Use Playwright's pinned headless Chromium, rather than the host's full Chrome.
// Both local and deployed audits retain the same mobile throttling and budgets.
const require = createRequire(import.meta.url);
const [url = 'http://127.0.0.1:4173/', output = 'artifacts/lighthouse-local.json'] = process.argv.slice(2);
mkdirSync(dirname(output), {recursive: true});

const run = args => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, args, {stdio: 'inherit'});
  child.once('error', reject);
  child.once('exit', code => resolve(code ?? 1));
});
// Allocate a separate CDP port for this audit; do not attach to a user's browser.
const reservation = createServer();
await new Promise((resolve, reject) => {
  reservation.once('error', reject);
  reservation.listen(0, '127.0.0.1', resolve);
});
const port = reservation.address().port;
await new Promise(resolve => reservation.close(resolve));
const browser = await chromium.launch({args: [`--remote-debugging-port=${port}`]});
let result;
try {
  const endpoint = await fetch(`http://127.0.0.1:${port}/json/version`);
  if (!endpoint.ok || !(await endpoint.json()).webSocketDebuggerUrl) {
    throw new Error('The pinned Lighthouse browser did not expose its own CDP endpoint.');
  }
  console.log(`Lighthouse browser: pinned Playwright Chromium ${browser.version()}`);
  result = await run([require.resolve('lighthouse/cli/index.js'), url,
    '--quiet', `--port=${port}`,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--form-factor=mobile', '--save-assets', '--output=json', `--output-path=${output}`,
  ]);
} finally {
  await browser.close();
}
process.exitCode = result === 0 ? await run(['tests/lighthouse-budget.mjs', output]) : result;
