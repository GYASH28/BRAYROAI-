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

async function waitForCommercial(page){
  await page.waitForFunction(()=>document.body.classList.contains('commercial-ready'),null,{timeout:4000});
}

test('homepage is fully branded as BRAYROAI and keeps the complete studio narrative', async ({ page }) => {
  const errors=captureRuntimeErrors(page);
  await page.goto('/',{waitUntil:'networkidle'});
  await waitForIntro(page);
  await waitForCommercial(page);
  await expect(page).toHaveTitle('BRAYROAI — Design. Engineering. AI.');
  await expect(page.locator('.brand-word')).toHaveText('BRAYROAI');
  await expect(page.locator('h1')).toContainText('Digital, designed');
  await expect(page.locator('h1')).toContainText('to feel different.');
  await expect(page.locator('h1')).toHaveCount(1);
  for(const id of ['top','intro','services','work','client-proof','lab','process','about','engage']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator('#plans-snapshot')).toHaveCount(1);
  await expect(page.locator('#clients')).toHaveCount(1);
  await expect(page.locator('.hero-bg-layer img')).toHaveJSProperty('complete',true);
  await expect(page.locator('.hero-subject-layer img')).toHaveJSProperty('complete',true);
  await expect(page.locator('body')).not.toContainText('YKG Digital');
  expect(errors).toEqual([]);
});

test('homepage has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/',{waitUntil:'networkidle'});
  await waitForIntro(page);
  await waitForCommercial(page);
  const results=await new AxeBuilder({page}).analyze();
  const blocking=results.violations.filter(v=>['critical','serious'].includes(v.impact));
  expect(blocking,blocking.map(v=>`${v.id}: ${v.help}\n${v.nodes.map(n=>n.failureSummary).join('\n')}`).join('\n\n')).toEqual([]);
});

test('mobile navigation has branded background, focus containment and clean close state', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/',{waitUntil:'networkidle'});
  await waitForIntro(page);
  await waitForCommercial(page);
  const toggle=page.locator('[data-menu-button]');
  const menu=page.locator('[data-mobile-menu]');
  await expect(toggle).toBeVisible();
  await expect(page.locator('.mobile-menu__bg')).toHaveCount(1);
  await expect(menu.locator('a[href="/plans.html"]')).toHaveCount(1);
  await expect(menu.locator('a[href="#clients"]')).toHaveCount(1);
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

test('four BRAYROAI capabilities stay interactive and update their visual stage', async ({ page }) => {
  await page.goto('/',{waitUntil:'networkidle'});
  await waitForIntro(page);
  await waitForCommercial(page);
  await page.locator('.desktop-nav a[href="#services"]').click();
  await expect(page).toHaveURL(/#services$/);
  const steps=page.locator('[data-cap-step]');
  await expect(steps).toHaveCount(4);
  for(let index=0;index<4;index++){
    await steps.nth(index).click();
    await expect(steps.nth(index)).toHaveClass(/is-active/);
    await expect(page.locator(`[data-cap-panel="${index}"]`)).toHaveClass(/is-active/);
  }
});

test('no chapter is an empty viewport-sized shell after it is visited', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await waitForIntro(page);
  await waitForCommercial(page);
  for(const id of ['intro','services','work','client-proof','lab','process','about','engage']){
    const section=page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(180);
    const visibleText=await section.locator('h2,h3,p,a').evaluateAll(items=>items.filter(el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      return s.visibility!=='hidden'&&Number(s.opacity)>.05&&r.width>0&&r.height>0;
    }).length);
    expect(visibleText,`#${id} rendered without meaningful visible content`).toBeGreaterThan(0);
  }
});

test('real FakhriMart captures replace fragile live iframe mockups', async ({ page }) => {
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await waitForIntro(page);
  await waitForCommercial(page);
  await expect(page.locator('#work .project-grid')).toHaveCount(0);
  await expect(page.locator('iframe[data-src]')).toHaveCount(0);
  await expect(page.locator('.project-screen img[src="/assets/fakhrimart-case-desktop.png"]')).toHaveCount(1);
  await expect(page.locator('.project-phone img[src="/assets/fakhrimart-case-mobile.png"]')).toHaveCount(1);
  await expect(page.locator('.case-gallery img')).toHaveCount(2);
  await page.locator('.case-gallery').scrollIntoViewIfNeeded();
  await expect.poll(async()=>page.locator('.case-gallery img').first().evaluate(img=>img.naturalWidth),{timeout:8000}).toBeGreaterThan(1000);
  await expect.poll(async()=>page.locator('.case-gallery img').nth(1).evaluate(img=>img.naturalWidth),{timeout:8000}).toBeGreaterThan(300);
  const aboutImage=page.locator('.about-portrait img');
  await page.locator('#about').scrollIntoViewIfNeeded();
  await expect.poll(async()=>aboutImage.evaluate(img=>img.naturalWidth),{timeout:8000}).toBeGreaterThan(0);
});

test('enhanced interaction layer responds without becoming required for content', async ({ page }) => {
  await page.goto('/',{waitUntil:'networkidle'});
  await waitForIntro(page);
  await waitForCommercial(page);
  await page.locator('#services').scrollIntoViewIfNeeded();
  await expect(page.locator('.chapter-entered')).not.toHaveCount(0);
  const progress=page.locator('[data-capability-progress]');
  await expect(progress).toHaveCount(1);
  await page.locator('[data-cap-step="2"]').click();
  await expect(progress).toHaveCSS('transform',/matrix/);
  await page.locator('#process').scrollIntoViewIfNeeded();
  await page.waitForTimeout(220);
  await expect(page.locator('.process-row.is-current')).toHaveCount(1);
});

test('reduced-motion mode removes blocking and continuous motion', async ({ browser }) => {
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await page.goto('/',{waitUntil:'networkidle'});
  await expect(page.locator('[data-loader]')).toBeHidden();
  await expect(page.locator('body')).toHaveClass(/hero-ready/);
  await waitForCommercial(page);
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  expect(await page.locator('.cursor-orb').evaluate(el=>getComputedStyle(el).display)).toBe('none');
  await page.locator('#about').scrollIntoViewIfNeeded();
  const transform=await page.locator('.about-portrait img').evaluate(el=>getComputedStyle(el).translate);
  expect(['none','0px','0px 0px'].includes(transform)).toBeTruthy();
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
    await waitForCommercial(page);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow,`document overflowed by ${overflow}px`).toBeLessThanOrEqual(1);
  });
}

test('contact and real project destinations remain intentional',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await waitForCommercial(page);
  await expect(page.locator('a[href^="mailto:yashganesh.work@gmail.com"]')).not.toHaveCount(0);
  await expect(page.locator('a[href="https://lernioai.vercel.app/"]')).not.toHaveCount(0);
  await expect(page.locator('a[href="https://github.com/GYASH28/B.R.A.C.E"]')).not.toHaveCount(0);
  await expect(page.locator('a[href="https://fakhriyarns.vercel.app/"]')).not.toHaveCount(0);
  await expect(page.locator('.desktop-nav a[href="/plans.html"]')).toHaveCount(1);
  await expect(page.locator('a[href="/case-studies/fakhrimart.html"]')).not.toHaveCount(0);
});
