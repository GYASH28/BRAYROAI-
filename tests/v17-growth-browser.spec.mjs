import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const serious=result=>result.violations.filter(violation=>['serious','critical'].includes(violation.impact));

const clearOpening=async page=>{
  await page.evaluate(()=>{
    document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(node=>node.remove());
    document.body.classList.remove('polish-opening','hf-intro-active','is-opening');
  });
};

const openPage=async(page,route='/')=>{
  await page.goto(route,{waitUntil:'networkidle'});
  await clearOpening(page);
};

const expectNoHorizontalOverflow=async page=>{
  const metrics=await page.evaluate(()=>({
    doc:document.documentElement.scrollWidth,
    viewport:document.documentElement.clientWidth,
    body:document.body.scrollWidth
  }));
  expect(Math.max(metrics.doc,metrics.body)).toBeLessThanOrEqual(metrics.viewport+2);
};

test('homepage preserves BRAYROAI visual identity while owning the V17 commercial story',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openPage(page);

  await expect(page.locator('.v12-hero-title')).toBeVisible();
  await expect(page.locator('.v12-hero-title')).toContainText('Turn missed enquiries');
  await expect(page.locator('.v12-hero-title')).toContainText('booked customers.');
  await expect(page.locator('.hero__subject')).toHaveAttribute('src','/assets/yash-cutout.webp');
  await expect(page.locator('.hero__background')).toHaveCount(2);
  await expect(page.locator('link[href="/brayro-v12.css"]')).toHaveCount(1);
  await expect(page.locator('link[href="/brayro-v15.css"]')).toHaveCount(1);
  await expect(page.locator('link[href="/international-growth.css"]')).toHaveCount(1);

  const theme=await page.evaluate(()=>{
    const style=getComputedStyle(document.documentElement);
    return {
      ink:style.getPropertyValue('--ig-ink').trim(),
      bone:style.getPropertyValue('--ig-bone').trim(),
      blue:style.getPropertyValue('--ig-blue').trim(),
      orange:style.getPropertyValue('--ig-orange').trim()
    };
  });
  expect(theme).toEqual({ink:'#09090B',bone:'#F3F0EA',blue:'#3E7BFF',orange:'#FF6B2C'});

  await expect(page.getByRole('link',{name:/Book an audit/i}).first()).toBeVisible();
  await expect(page.locator('.ig-proof-bar').first()).toContainText('Pune, India');
  await expectNoHorizontalOverflow(page);
});

test('legacy capability runtimes do not overwrite the Growth Engine solution section',async({page})=>{
  await openPage(page);
  const services=page.locator('#services');
  await services.scrollIntoViewIfNeeded();
  await expect(services).toHaveAttribute('data-scene','growth-services');
  await expect(services).not.toHaveAttribute('data-v15-play','');
  await expect(services).not.toHaveAttribute('data-v14-reel','');
  await expect(services).not.toHaveAttribute('data-v13-ledger','');
  await expect(services).toContainText('BRAYRO GROWTH ENGINE');
  await expect(services).toContainText('AI OPERATIONS');
  await expect(services).toContainText('CUSTOM DIGITAL SYSTEMS');
  await expect(services).toContainText('BRAYRO OS');
});

test('Growth Engine demo is interactive and clearly sample data',async({page})=>{
  await openPage(page);
  const demo=page.locator('[data-ig-demo]');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toBeVisible();
  await expect(demo).toContainText('System online / demo');
  await expect(page.locator('[data-ig-lead-name]')).toHaveText('Maya / Apartment enquiry');
  await expect(page.locator('[data-ig-event].is-active')).toHaveCount(1);

  await page.locator('[data-ig-next]').click();
  await expect(page.locator('[data-ig-event].is-active')).toHaveCount(2);
  await expect(page.locator('[data-ig-progress]')).toContainText('STEP 02');

  await page.locator('[data-ig-scenario]').selectOption('consulting');
  await expect(page.locator('[data-ig-lead-name]')).toHaveText('Daniel / Operations project');
  await expect(page.locator('[data-ig-lead-source]')).toContainText('LinkedIn');
});

test('opportunity calculator updates illustrative economics without claiming guaranteed ROI',async({page})=>{
  await openPage(page);
  const calculator=page.locator('[data-ig-calculator]');
  await calculator.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-ig-revenue-opportunity]')).toHaveText('$4,800 / mo');
  await expect(page.locator('[data-ig-admin-cost]')).toHaveText('$1,559 / mo');
  await expect(page.locator('[data-ig-hours-recoverable]')).toHaveText('20.8 hrs / mo');
  await expect(calculator).toContainText('Illustrative scenario only');

  await page.locator('[name="monthlyLeads"]').fill('100');
  await page.locator('[name="leadValue"]').fill('2000');
  await expect(page.locator('[data-ig-revenue-opportunity]')).toHaveText('$10,000 / mo');
});

test('AI Growth Audit routes a qualified request to email and WhatsApp without a fake backend',async({page})=>{
  await openPage(page,'/audit');
  await expect(page.getByRole('heading',{name:/Find the highest-value leak/i})).toBeVisible();
  await page.getByRole('button',{name:'Faster follow-up'}).click();
  await page.locator('[data-ig-audit-next]').click();

  await page.locator('#audit-name').fill('Alex Morgan');
  await page.locator('#audit-email').fill('alex@example.com');
  await page.locator('#audit-company').fill('Northstar Services');
  await page.locator('#audit-website').fill('https://example.com');
  await page.locator('#audit-region').selectOption('United States');
  await page.locator('#audit-budget').selectOption('US$3,000–$7,500');
  await page.locator('[data-ig-audit-next]').click();

  await page.locator('#audit-notes').fill('Website leads wait in a shared inbox before the sales team follows up.');
  await page.locator('[data-ig-audit-next]').click();
  await expect(page.locator('[data-ig-audit-summary]')).toBeEmpty();
  await page.locator('[data-ig-audit-next]').click();

  await expect(page.locator('[data-ig-audit-summary]')).toContainText('Faster follow-up');
  await expect(page.locator('[data-ig-audit-email]')).toHaveAttribute('href',/mailto:yashganesh\.work@gmail\.com/);
  await expect(page.locator('[data-ig-audit-email]')).toHaveAttribute('href',/Northstar/);
  await expect(page.locator('[data-ig-audit-whatsapp]')).toHaveAttribute('href',/wa\.me\/919175524637/);
});

test('US and UAE pages are localized without pretending BRAYROAI has foreign offices',async({page})=>{
  await openPage(page,'/us');
  await expect(page.locator('h1')).toContainText('US service businesses');
  await expect(page.locator('main')).toContainText('Pune, India');
  await expect(page.locator('main')).toContainText('From US$1,500');
  await expect(page.locator('main')).toContainText('No. BRAYROAI is based in Pune, India');

  await openPage(page,'/uae');
  await expect(page.locator('h1')).toContainText('UAE enquiries');
  await expect(page.locator('main')).toContainText('WhatsApp');
  await expect(page.locator('main')).toContainText('does not claim a Dubai office');
  await expect(page.locator('[data-ig-whatsapp-context]').first()).toHaveAttribute('href',/Region%3A%20UAE/);
});

test('verified client work remains explicitly distinct from internal demonstrations',async({page})=>{
  await openPage(page);
  const work=page.locator('#work');
  await work.scrollIntoViewIfNeeded();
  await expect(work).toContainText('VERIFIED CLIENT WORK');
  await expect(work).toContainText('FakhriMart');
  await expect(work.locator('a[href="https://fakhriyarns.vercel.app/"]').first()).toBeVisible();
  await expect(work).toContainText('Internal demonstration');
  await expect(work).toContainText('Product direction');
});

test('core buyer pages have no serious or critical axe violations',async({page})=>{
  for(const route of ['/','/audit','/us','/uae','/plans','/founder']){
    await openPage(page,route);
    const result=await new AxeBuilder({page}).analyze();
    expect(serious(result),`${route}: ${JSON.stringify(serious(result).map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length})))}`).toEqual([]);
  }
});

test('mobile buyer journeys do not overflow and key CTAs remain usable',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const route of ['/','/audit','/us','/uae','/plans','/lab']){
    await openPage(page,route);
    await expectNoHorizontalOverflow(page);
  }

  await openPage(page,'/');
  await expect(page.locator('.v12-hero-title')).toBeVisible();
  await expect(page.getByRole('link',{name:/Book an AI Growth Audit/i}).first()).toBeVisible();
  await page.locator('#growth-engine').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-ig-demo]')).toBeVisible();
  await page.locator('[data-ig-next]').click();
  await expect(page.locator('[data-ig-progress]')).toContainText('STEP 02');
});

test('reduced motion keeps the content and demo usable',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await openPage(page);
  await expect(page.locator('.v12-hero-title')).toBeVisible();
  await expect(page.locator('#services')).toContainText('BRAYRO GROWTH ENGINE');
  await page.locator('#growth-engine').scrollIntoViewIfNeeded();
  await page.locator('[data-ig-play]').click();
  await expect(page.locator('[data-ig-progress]')).toContainText('STEP 02');
});

test('homepage does not emit page errors during the core growth journey',async({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await openPage(page);
  await page.locator('#growth-engine').scrollIntoViewIfNeeded();
  await page.locator('[data-ig-next]').click();
  await page.locator('#brayro-os').scrollIntoViewIfNeeded();
  await page.locator('#work').scrollIntoViewIfNeeded();
  expect(errors).toEqual([]);
});
