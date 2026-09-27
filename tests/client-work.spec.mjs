import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes=['/clients','/clients/fakhrimart'];

for(const route of routes){
  test(`${route} has no serious accessibility violations`,async({page})=>{
    await page.goto(route,{waitUntil:'networkidle'});
    const results=await new AxeBuilder({page}).exclude('.v16-cursor').analyze();
    const serious=results.violations.filter(v=>['serious','critical'].includes(v.impact));
    expect(serious,serious.map(v=>`${v.id}: ${v.help}`).join('\n')).toEqual([]);
  });
}

test('client archive filters verified work and handles an empty search',async({page})=>{
  await page.goto('/clients',{waitUntil:'networkidle'});
  await expect(page.locator('h1')).toContainText('Client work');
  await expect(page.locator('[data-client-card]')).toHaveCount(1);
  const card=page.locator('[data-client-card]');
  await expect(card).toContainText('FakhriMart');
  await expect(card.locator('.client-card__media[href="/clients/fakhrimart"]')).toHaveCount(1);
  await expect(card.locator('h2 a[href="/clients/fakhrimart"]')).toHaveCount(1);
  await expect(card.locator('.client-card__actions a[href="/clients/fakhrimart"]')).toHaveCount(1);
  await page.locator('[data-client-filter="live"]').click();
  await expect(page.locator('[data-client-card]:visible')).toHaveCount(1);
  await page.locator('.client-search input').fill('no matching client');
  await expect(page.locator('[data-client-card]:visible')).toHaveCount(0);
  await expect(page.locator('[data-client-count]')).toHaveText('0 projects');
  await expect(page.locator('.client-empty')).toBeVisible();
  await page.locator('.client-search input').fill('');
  await page.locator('[data-client-filter="all"]').click();
  await expect(page.locator('[data-client-card]:visible')).toHaveCount(1);
});

test('verified work remains visible and linked without JavaScript',async({browser})=>{
  const context=await browser.newContext({baseURL:process.env.BASE_URL||'http://127.0.0.1:4173',javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('/clients');
  await expect(page.locator('.client-hero h1')).toBeVisible();
  await expect(page.locator('[data-client-card]')).toBeVisible();
  await expect(page.locator('[data-client-card] h2')).toHaveText('FakhriMart');
  await expect(page.locator('[data-client-card] .client-card__actions a').first()).toHaveAttribute('href','/clients/fakhrimart');
  await expect(page.locator('.client-filters')).toBeHidden();
  await context.close();
});

test('Arabic archive keeps verified work visible and the hero image clear of the title',async({browser})=>{
  const context=await browser.newContext({baseURL:process.env.BASE_URL||'http://127.0.0.1:4173',javaScriptEnabled:false,viewport:{width:1440,height:900}});
  const page=await context.newPage();
  await page.goto('/ae/ar/clients');
  await expect(page.locator('.client-card__badge')).toHaveText('عمل عميل موثق');
  await expect(page.locator('[data-client-card] .client-card__media')).toHaveAttribute('href','/ae/ar/clients/fakhrimart');
  const separated=await page.evaluate(()=>{
    const image=document.querySelector('.client-hero__feature').getBoundingClientRect();
    const title=document.querySelector('.client-hero h1').getBoundingClientRect();
    return image.right<=title.left||title.right<=image.left||image.bottom<=title.top||title.bottom<=image.top;
  });
  expect(separated).toBeTruthy();
  await context.close();
});

test('FakhriMart case study exposes evidence, live project and technical story',async({page})=>{
  await page.goto('/clients/fakhrimart',{waitUntil:'networkidle'});
  await expect(page.locator('h1')).toContainText('Fakhri');
  await expect(page.locator('.global-nav__links a[href="/clients"]')).toHaveAttribute('aria-current','page');
  const liveLinks=page.locator('a[href="https://fakhriyarns.vercel.app/"]');
  await expect(liveLinks).toHaveCount(2);
  for(let i=0;i<2;i++){await expect(liveLinks.nth(i)).toHaveAttribute('target','_blank');await expect(liveLinks.nth(i)).toHaveAttribute('rel',/noreferrer/)}
  await expect(page.locator('.client-close__email')).toHaveAttribute('href',/^mailto:/);
  const body=await page.locator('body').textContent();
  for(const text of ['Not a fake ecommerce store.','CATALOGUE ARCHITECTURE','04 / CONVERSION','From browsing to a useful enquiry.','React 19','React Router 8','No fabricated conversion uplift'])expect(body).toContain(text);
  await expect(page.locator('img[src="/assets/fakhrimart-case-desktop.webp"]')).toHaveCount(2);
  await expect(page.locator('img[src="/assets/fakhrimart-case-mobile.webp"]')).toHaveCount(2);
});

for(const width of [320,390,768,1440,1920]){
  test(`client pages do not overflow at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    for(const route of routes){
      await page.goto(route,{waitUntil:'domcontentloaded'});
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow,`${route} horizontal overflow @${width}`).toBeLessThanOrEqual(2);
    }
  });
}

test('client work respects reduced motion',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/clients/fakhrimart',{waitUntil:'networkidle'});
  const state=await page.locator('[data-client-reveal]').first().evaluate(node=>({transition:getComputedStyle(node).transitionDuration,transform:getComputedStyle(node).transform,clip:getComputedStyle(node).clipPath}));
  expect(state.transition).toBe('0s');
  expect(state.transform).toBe('none');
});
