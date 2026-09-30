/** Retry mobile views independently for sites whose desktop capture aborted. */
import {chromium} from '@playwright/test';
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const file = '/tmp/brayroai-awards-research/live/site-audit.json';
const records = JSON.parse(await readFile(file, 'utf8'));
const pending = records.filter(record => !record.mobileOpen);
const browser = await chromium.launch({headless: true, args: ['--no-sandbox']});
let next = 0;
async function worker() {
  while (next < pending.length) {
    const record = pending[next++];
    const key = `${String(record.index).padStart(2, '0')}-${new URL(record.awardUrl).pathname.split('/').filter(Boolean).at(-1)}`;
    const context = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true, deviceScaleFactor: 1, ignoreHTTPSErrors: true});
    try {
      const page = await context.newPage();
      const response = await page.goto(record.liveUrl, {waitUntil: 'domcontentloaded', timeout: 18000});
      await page.waitForTimeout(1000);
      record.mobileOpen = await page.evaluate(() => ({
        title: document.title,
        headline: [...document.querySelectorAll('h1,h2')].map(el => (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 120)).filter(Boolean).slice(0, 8),
        navLabels: [...document.querySelectorAll('nav a,header a')].filter(el => el.getBoundingClientRect().width > 0).map(el => (el.innerText || '').trim().slice(0, 60)).filter(Boolean).slice(0, 12),
        visibleButtons: [...document.querySelectorAll('button')].filter(el => el.getBoundingClientRect().width > 0).map(el => (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 60)).filter(Boolean).slice(0, 12),
        canvasCount: document.querySelectorAll('canvas').length,
        videoCount: document.querySelectorAll('video').length,
        pageHeight: document.documentElement.scrollHeight,
        viewportHeight: innerHeight,
        viewportText: (document.body.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 450),
      }));
      record.mobileHttp = response?.status() ?? null;
      record.mobileFinalUrl = page.url();
      const openFile = `${key}-mobile-open.jpg`;
      try { await page.screenshot({path: resolve('/tmp/brayroai-awards-research/live', openFile), type: 'jpeg', quality: 68, timeout: 12000, animations: 'disabled'}); record.files.mobileOpen = openFile; }
      catch (error) { record.mobileScreenshotError = String(error).slice(0, 180); }
      await page.evaluate(() => scrollBy(0, innerHeight * 1.5));
      await page.waitForTimeout(650);
      record.mobileAfterOne = await page.evaluate(() => ({scrollY: Math.round(scrollY), visibleText: (document.elementFromPoint(innerWidth*.5, innerHeight*.5)?.closest('main,section')?.innerText || document.body.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 400)}));
      const scrollFile = `${key}-mobile-one.jpg`;
      try { await page.screenshot({path: resolve('/tmp/brayroai-awards-research/live', scrollFile), type: 'jpeg', quality: 68, timeout: 12000, animations: 'disabled'}); record.files.mobileAfterOne = scrollFile; }
      catch (error) { record.mobileScrollScreenshotError = String(error).slice(0, 180); }
      delete record.mobileError;
    } catch (error) { record.mobileRetryError = String(error).slice(0, 320); }
    finally { await context.close(); }
    await writeFile(file, JSON.stringify(records, null, 2));
    process.stdout.write(`${records.filter(item => item.mobileOpen).length}/50 mobile ${record.name}\n`);
  }
}
await Promise.all([worker(), worker()]);
await browser.close();
await writeFile(file, JSON.stringify(records, null, 2));
