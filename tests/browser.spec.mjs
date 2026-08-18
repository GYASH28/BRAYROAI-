import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const captureRuntimeErrors = page => {
  const errors=[];
  page.on('console',message=>{ if(message.type()==='error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror',error=>errors.push(`page: ${error.message}`));
  return errors;
};

async function waitForIntro(page){
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'),null,{timeout:4000});
}

test('homepage preserves the recovered YKG identity and core chapters', async ({ page }) => {
  const errors=captureRuntimeErrors(page);
  await page.goto('/',{waitUntil:'networkidle'});
  await waitForIntro(page);
  await expect(page).toHaveTitle('YKG Digital — Design + Engineering');
  await expect(page.locator('h1')).toContainText('Digital experiences');
  await expect(page.locator('h1')).toContainText('built to be remembered.');
  await expect(page.locator('h1')).toHaveCount(1);
  for(const id of ['top','intro','services','work','client-proof','lab','about','engage']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator('.hero-bg-layer img')).toHaveJSProperty('complete',true);
  await expect(page.locator('.hero-subject-layer img')).toHaveJSProperty('complete',true);
  expect(errors).toEqual([]);
});

test('homepage has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/',{waitUntil:'networkidle'});
  await waitForIntro(page);
  const results=await new AxeBuilder({page}).analyze();
  const blocking=results.violations.filter(v=>['critical','serious'].includes(v.impact));
  expect(blocking,blocking.map(v=>`${v.id}: ${v.help}\n${v.nodes.map(n=>n.failureSummary).join('\n')}`).join('\n\n')).toEqual([]);
});

test('mobile navigation has its background, focus management and clean close state', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/',{waitUntil:'networkidle'});
  await waitForIntro(page);
  const toggle=page.locator('[data-menu-button]');
  const menu=page.locator('[data-mobile-menu]');
  await expect(toggle).toBeVisible();
  await expect(page.locator('.mobile-menu__bg')).toHaveCount(1);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await expect(menu).toHaveAttribute('aria-hidden','false');
  await expect(menu).toHaveClass(/open/);
  await expect(page.locator('body')).toHaveClass(/menu-open/);
  await expect(menu.locator('a').first()).toBeFocused();

  const links=menu.locator('a');
  await links.last().focus();
  await page.keyboard.press('Tab');
  await expect(links.first()).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await expect(menu).toHaveAttribute('aria-hidden','true');
  await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  await expect(toggle).toBeFocused();
});

test('navigation and capability storytelling remain interactive', async ({ page }) => {
  await page.goto('/',{waitUntil:'networkidle'});
  await waitForIntro(page);
  await page.locator('.desktop-nav a[href="#services"]').click();
  await expect(page).toHaveURL(/#services$/);
  const steps=page.locator('[data-cap-step]');
  await expect(steps).toHaveCount(5);
  await steps.nth(2).click();
  await expect(steps.nth(2)).toHaveClass(/is-active/);
  await expect(page.locator('[data-cap-panel="2"]')).toHaveClass(/is-active/);
  await steps.nth(4).click();
  await expect(steps.nth(4)).toHaveClass(/is-active/);
});

test('deferred media activates near the relevant chapters', async ({ page }) => {
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await waitForIntro(page);
  const frames=page.locator('iframe[data-src]');
  expect(await frames.count()).toBeGreaterThanOrEqual(4);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const assigned=await frames.evaluateAll(items=>items.filter(frame=>frame.hasAttribute('src')).length);
  expect(assigned).toBeGreaterThan(0);

  const aboutImage=page.locator('.about-portrait img');
  await page.locator('#about').scrollIntoViewIfNeeded();
  await expect.poll(async()=>aboutImage.evaluate(img=>img.naturalWidth),{timeout:8000}).toBeGreaterThan(0);
});

test('reduced-motion mode removes blocking/continuous motion', async ({ browser }) => {
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await page.goto('/',{waitUntil:'networkidle'});
  await expect(page.locator('[data-loader]')).toBeHidden();
  await expect(page.locator('body')).toHaveClass(/hero-ready/);
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  expect(await page.locator('.cursor-orb').evaluate(el=>getComputedStyle(el).display)).toBe('none');
  await context.close();
});

for(const viewport of [
  {width:360,height:800},
  {width:390,height:844},
  {width:430,height:932},
  {width:768,height:1024},
  {width:1024,height:768},
  {width:1440,height:900},
  {width:1920,height:1080}
]){
  test(`layout has no horizontal document overflow at ${viewport.width}px`,async({page})=>{
    await page.setViewportSize(viewport);
    await page.goto('/',{waitUntil:'networkidle'});
    await waitForIntro(page);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow,`document overflowed by ${overflow}px`).toBeLessThanOrEqual(1);
  });
}

test('contact and project destinations remain intentional',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('a[href^="mailto:yashganesh.work@gmail.com"]')).not.toHaveCount(0);
  await expect(page.locator('a[href="https://lernioai.vercel.app/"]')).not.toHaveCount(0);
  await expect(page.locator('a[href="https://github.com/GYASH28/B.R.A.C.E"]')).not.toHaveCount(0);
  await expect(page.locator('a[href="https://fakhriyarns.vercel.app/"]')).not.toHaveCount(0);
});
