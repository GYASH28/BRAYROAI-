import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const captureRuntimeErrors = page => {
  const errors=[];
  page.on('console',message=>{ if(message.type()==='error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror',error=>errors.push(`page: ${error.message}`));
  return errors;
};

async function ready(page){
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'),null,{timeout:5000});
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'),null,{timeout:5000});
}

async function openHome(page){
  await page.goto('/',{waitUntil:'networkidle'});
  await ready(page);
}

test('homepage keeps the locked BRAYROAI opening/hero and exposes the new story', async ({page}) => {
  const errors=captureRuntimeErrors(page);
  await openHome(page);
  await expect(page).toHaveTitle('BRAYROAI — Design. Engineering. AI.');
  await expect(page.locator('.intro-loader__mark')).toContainText('BRAYRO');
  await expect(page.locator('.hero-bg-layer img')).toHaveAttribute('src','/assets/hero-background.webp');
  await expect(page.locator('.hero-subject-layer img')).toHaveAttribute('src','/assets/yash-cutout.webp');
  await expect(page.locator('.hero-message h1')).toContainText('Digital, designed');
  await expect(page.locator('.hero-message h1')).toContainText('to feel different.');
  await expect(page.locator('.hero-signal-deck')).toHaveCount(1);
  await expect(page.locator('[data-scene]')).toHaveCount(6);
  for(const id of ['services','work','process','lab','about','engage']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('homepage has no serious or critical accessibility violations', async ({page}) => {
  await openHome(page);
  const results=await new AxeBuilder({page}).analyze();
  const blocking=results.violations.filter(v=>['critical','serious'].includes(v.impact));
  expect(blocking,blocking.map(v=>`${v.id}: ${v.help}\n${v.nodes.map(n=>n.failureSummary).join('\n')}`).join('\n\n')).toEqual([]);
});

test('mobile navigation remains usable and keeps Plans/contact visible', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await openHome(page);
  const toggle=page.locator('[data-menu-button]');
  const menu=page.locator('[data-mobile-menu]');
  await expect(toggle).toBeVisible();
  await expect(menu.locator('a[href="/plans.html"]')).toHaveCount(1);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await expect(menu).toHaveAttribute('aria-hidden','false');
  await expect(menu.locator('a').first()).toBeFocused();
  const links=menu.locator('a');
  await links.last().focus();
  await page.keyboard.press('Tab');
  await expect(links.first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await expect(toggle).toBeFocused();
});

test('real project captures are the centerpiece and no live iframe can blank the scene', async ({page}) => {
  await openHome(page);
  await expect(page.locator('iframe')).toHaveCount(0);
  const desktop=page.locator('#work img[src="/assets/fakhrimart-case-desktop.png"]');
  const mobile=page.locator('#work img[src="/assets/fakhrimart-case-mobile.png"]');
  await expect(desktop).toHaveCount(1);
  await expect(mobile).toHaveCount(1);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect.poll(async()=>desktop.evaluate(img=>img.naturalWidth),{timeout:8000}).toBeGreaterThan(1000);
  await expect.poll(async()=>mobile.evaluate(img=>img.naturalWidth),{timeout:8000}).toBeGreaterThan(300);
  await expect(page.locator('#work a[href="/case-studies/fakhrimart.html"]')).toHaveCount(1);
  await expect(page.locator('#work a[href="https://fakhriyarns.vercel.app/"]')).not.toHaveCount(0);
});

test('Lab objects are functional, not decorative mockups', async ({page}) => {
  await openHome(page);
  await page.locator('#lab').scrollIntoViewIfNeeded();
  const ai=page.locator('[data-lab-object="ai"]');
  await ai.locator('[data-ai-mode="deep"]').click();
  await expect(ai).toHaveAttribute('data-mode','deep');
  await expect(ai.locator('[data-ai-output]')).toContainText('reasoning');
  await ai.locator('[data-ai-mode="automate"]').click();
  await expect(ai).toHaveAttribute('data-mode','automate');
  await expect(ai.locator('[data-ai-output]')).toContainText('workflow');
  const motion=page.locator('[data-motion-toggle]');
  await motion.click();
  await expect(motion).toHaveClass(/is-running/);
  await expect(motion.locator('span')).toHaveText('COMPLETE');
  await motion.click();
  await expect(motion).not.toHaveClass(/is-running/);
});

test('all authored chapters render meaningful visible content', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  for(const id of ['services','work','process','lab','about','engage']){
    const section=page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const visible=await section.locator('h2,h3,p,a,strong').evaluateAll(items=>items.filter(el=>{
      const style=getComputedStyle(el),rect=el.getBoundingClientRect();
      return style.visibility!=='hidden'&&Number(style.opacity)>.05&&rect.width>0&&rect.height>0;
    }).length);
    expect(visible,`#${id} has no meaningful visible content`).toBeGreaterThan(0);
  }
});

test('reduced motion keeps the story complete without sticky camera choreography', async ({browser}) => {
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await page.goto('/',{waitUntil:'networkidle'});
  await ready(page);
  await expect(page.locator('[data-loader]')).toBeHidden();
  await expect(page.locator('.cursor-orb')).toBeHidden();
  await expect(page.locator('[data-context-cursor]')).toBeHidden();
  const sticky=await page.locator('#services .scene-sticky').evaluate(el=>getComputedStyle(el).position);
  expect(sticky).toBe('relative');
  await expect(page.locator('#work img[src="/assets/fakhrimart-case-desktop.png"]')).toBeVisible();
  await expect(page.locator('#engage .resolution-primary')).toBeVisible();
  await context.close();
});

for(const viewport of [
  {width:1920,height:1080},{width:1440,height:900},{width:1366,height:768},{width:1280,height:720},{width:1024,height:768},
  {width:768,height:1024},{width:430,height:932},{width:390,height:844},{width:375,height:812},{width:360,height:800}
]){
  test(`layout has no horizontal overflow at ${viewport.width}x${viewport.height}`,async({page})=>{
    await page.setViewportSize(viewport);
    await openHome(page);
    for(const id of ['services','work','process','lab','about','engage']){
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(40);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow,`#${id} overflowed by ${overflow}px`).toBeLessThanOrEqual(1);
    }
  });
}

test('commercial paths remain intact', async ({page}) => {
  await openHome(page);
  await expect(page.locator('a[href^="mailto:yashganesh.work@gmail.com"]')).not.toHaveCount(0);
  await expect(page.locator('a[href="https://lernioai.vercel.app/"]')).toHaveCount(1);
  await expect(page.locator('a[href="https://github.com/GYASH28/B.R.A.C.E"]')).toHaveCount(1);
  await expect(page.locator('.desktop-nav a[href="/plans.html"]')).toHaveCount(1);
  await expect(page.locator('a[href="/case-studies/fakhrimart.html"]')).toHaveCount(1);
});
