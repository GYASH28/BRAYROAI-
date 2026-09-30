/** Capture the live state behind each award record. Screenshots stay in /tmp. */
import {chromium} from '@playwright/test';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const records = JSON.parse(await readFile(new URL('./award-records.json', import.meta.url), 'utf8'));
const out = '/tmp/brayroai-awards-research/live';
await mkdir(out, {recursive: true});
const browser = await chromium.launch({headless: true, args: ['--no-sandbox']});
const results = new Array(records.length);
let next = 0;

const selectText = (root, selector, limit = 10) => [...root.querySelectorAll(selector)]
  .filter(el => {
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return box.width > 0 && box.height > 0 && style.visibility !== 'hidden';
  })
  .map(el => (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 150))
  .filter(Boolean).slice(0, limit);

async function scan(page) {
  return page.evaluate(() => {
    const visible = (selector, limit = 10) => [...document.querySelectorAll(selector)]
      .filter(el => {const box = el.getBoundingClientRect(); const style = getComputedStyle(el); return box.width > 0 && box.height > 0 && style.visibility !== 'hidden';})
      .map(el => (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 150))
      .filter(Boolean).slice(0, limit);
    const sectionNames = visible('main h1, main h2, main h3, section h1, section h2, section h3', 24);
    const navLabels = visible('header a, nav a, [role="navigation"] a', 16);
    const bodyStyle = getComputedStyle(document.body);
    const sample = document.elementFromPoint(innerWidth * .5, innerHeight * .5);
    return {
      title: document.title,
      sectionNames, navLabels,
      visibleButtons: visible('button', 12),
      canvasCount: document.querySelectorAll('canvas').length,
      videoCount: document.querySelectorAll('video').length,
      imageCount: document.querySelectorAll('img').length,
      linkCount: document.querySelectorAll('a[href]').length,
      viewportText: (document.elementFromPoint(innerWidth*.5, innerHeight*.6)?.closest('main,section')?.innerText || document.body.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 450),
      bodyBackground: bodyStyle.backgroundColor,
      centerBackground: sample ? getComputedStyle(sample).backgroundColor : null,
      pageHeight: Math.round(document.documentElement.scrollHeight),
      viewportHeight: innerHeight,
    };
  });
}

async function review(record) {
  const key = `${String(record.index + 1).padStart(2, '0')}-${record.slug.replace(/[^a-z0-9-]/gi, '')}`;
  const desktop = await browser.newContext({viewport: {width: 1365, height: 768}, deviceScaleFactor: 1, ignoreHTTPSErrors: true});
  const page = await desktop.newPage();
  page.setDefaultTimeout(5000);
  const failures = [];
  page.on('pageerror', error => failures.push(error.message.slice(0, 180)));
  const result = {index: record.index + 1, name: record.name, category: record.galleryCollection, awardUrl: record.awardUrl, liveUrl: record.liveUrl, status: 'unavailable', files: {}, failures};
  try {
    const response = await page.goto(record.liveUrl, {waitUntil: 'domcontentloaded', timeout: 16000});
    result.http = response?.status() ?? null;
    result.finalUrl = page.url();
    await page.waitForTimeout(1300);
    result.desktopOpen = await scan(page);
    result.files.desktopOpen = `${key}-desktop-open.jpg`;
    await page.screenshot({path: resolve(out, result.files.desktopOpen), type: 'jpeg', quality: 70, animations: 'disabled'});
    await page.mouse.wheel(0, 690);
    await page.waitForTimeout(800);
    result.desktopAfterOne = await scan(page);
    result.files.desktopAfterOne = `${key}-desktop-one.jpg`;
    await page.screenshot({path: resolve(out, result.files.desktopAfterOne), type: 'jpeg', quality: 70, animations: 'disabled'});
    await page.mouse.wheel(0, 1610);
    await page.waitForTimeout(800);
    result.desktopAfterThree = await scan(page);
    result.files.desktopAfterThree = `${key}-desktop-three.jpg`;
    await page.screenshot({path: resolve(out, result.files.desktopAfterThree), type: 'jpeg', quality: 70, animations: 'disabled'});
    result.desktopScrollY = await page.evaluate(() => Math.round(scrollY));
    result.status = result.desktopOpen.pageHeight > 850 && result.desktopOpen.title ? 'observed' : 'limited';

    const mobile = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true, ignoreHTTPSErrors: true});
    try {
      const phone = await mobile.newPage();
      await phone.goto(record.liveUrl, {waitUntil: 'domcontentloaded', timeout: 16000});
      await phone.waitForTimeout(1200);
      result.mobileOpen = await scan(phone);
      result.files.mobileOpen = `${key}-mobile-open.jpg`;
      await phone.screenshot({path: resolve(out, result.files.mobileOpen), type: 'jpeg', quality: 70, animations: 'disabled'});
      await phone.evaluate(() => scrollBy(0, innerHeight * 1.5));
      await phone.waitForTimeout(650);
      result.mobileAfterOne = await scan(phone);
      result.files.mobileAfterOne = `${key}-mobile-one.jpg`;
      await phone.screenshot({path: resolve(out, result.files.mobileAfterOne), type: 'jpeg', quality: 70, animations: 'disabled'});
      result.mobileScrollY = await phone.evaluate(() => Math.round(scrollY));
    } catch (error) { result.mobileError = String(error).slice(0, 320); }
    finally { await mobile.close(); }
  } catch (error) {
    result.error = String(error).slice(0, 320);
  } finally { await desktop.close(); }
  return result;
}

async function worker() {
  while (next < records.length) {
    const index = next++;
    results[index] = await review(records[index]);
    const done = results.filter(Boolean).length;
    process.stdout.write(`${done}/50 ${results[index].status} ${results[index].name}\n`);
    await writeFile(resolve(out, 'site-audit.json'), JSON.stringify(results.filter(Boolean), null, 2));
  }
}
await Promise.all([worker(), worker(), worker()]);
await browser.close();
await writeFile(resolve(out, 'site-audit.json'), JSON.stringify(results, null, 2));
