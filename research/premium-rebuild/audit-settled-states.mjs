/** Revisit entry-gated and loader-heavy sites after a longer settle. */
import {chromium} from '@playwright/test';
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const path = '/tmp/brayroai-awards-research/live/site-audit.json';
const rows = JSON.parse(await readFile(path, 'utf8'));
const extra = new Set([3, 5, 7, 12, 16, 20, 24, 27, 30, 32, 35, 38, 45, 46, 47]);
const todo = rows.filter(row => row.mobileOpen?.pageHeight <= 900 || extra.has(row.index));
const browser = await chromium.launch({headless: true, args: ['--no-sandbox']});
let next = 0;
async function worker() {
  while (next < todo.length) {
    const row = todo[next++];
    const slug = new URL(row.awardUrl).pathname.split('/').filter(Boolean).at(-1);
    const key = `${String(row.index).padStart(2, '0')}-${slug}`;
    const context = await browser.newContext({viewport: {width: 1365, height: 768}, deviceScaleFactor: 1, ignoreHTTPSErrors: true});
    try {
      const page = await context.newPage();
      const response = await page.goto(row.liveUrl, {waitUntil: 'domcontentloaded', timeout: 18000});
      await page.waitForTimeout(5200);
      row.settled = {http: response?.status() ?? null, url: page.url(), beforeAction: await page.evaluate(() => ({height: document.documentElement.scrollHeight, text: (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 500), buttons: [...document.querySelectorAll('button,a')].filter(el => {const r=el.getBoundingClientRect(); return r.width && r.height && r.top < innerHeight && r.bottom > 0}).map(el => (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g,' ').slice(0,50)).filter(Boolean).slice(0,20)}))};
      const action = page.locator('button, a, [role="button"]').filter({hasText: /^(enter|start|explore|skip intro|skip|continue|discover|read now|read more)$/i}).first();
      if (await action.count() && await action.isVisible()) {
        row.settled.action = (await action.innerText()).trim().slice(0,50);
        await action.click({timeout: 3000}).catch(() => {});
        await page.waitForTimeout(1000);
      }
      const first = `${key}-settled.jpg`;
      try { await page.screenshot({path: resolve('/tmp/brayroai-awards-research/live', first), type: 'jpeg', quality: 72, timeout: 12000}); row.files.settled = first; }
      catch (error) { row.settled.screenshotError = String(error).slice(0,160); }
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(750);
      row.settled.afterScroll = await page.evaluate(() => ({y: Math.round(scrollY), height: document.documentElement.scrollHeight, text: (document.elementFromPoint(innerWidth*.5, innerHeight*.5)?.closest('main,section')?.innerText || document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 500)}));
      const after = `${key}-settled-scroll.jpg`;
      try { await page.screenshot({path: resolve('/tmp/brayroai-awards-research/live', after), type: 'jpeg', quality: 72, timeout: 12000}); row.files.settledScroll = after; }
      catch (error) { row.settled.scrollScreenshotError = String(error).slice(0,160); }
    } catch (error) { row.settled = {error: String(error).slice(0,300)}; }
    finally { await context.close(); }
    await writeFile(path, JSON.stringify(rows, null, 2));
    process.stdout.write(`${todo.filter(item => item.settled).length}/${todo.length} settled ${row.name}\n`);
  }
}
await Promise.all([worker(), worker()]);
await browser.close();
await writeFile(path, JSON.stringify(rows, null, 2));
