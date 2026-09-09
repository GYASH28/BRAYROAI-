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

const expectNoHorizontalOverflow=async(page,label='page')=>{
  const metrics=await page.evaluate(()=>{
    const viewport=document.documentElement.clientWidth;
    const offenders=[...document.querySelectorAll('body *')].map(node=>{
      const rect=node.getBoundingClientRect();
      return {
        tag:node.tagName.toLowerCase(),
        id:node.id||'',
        cls:typeof node.className==='string'?node.className.slice(0,120):'',
        left:Math.round(rect.left*10)/10,
        right:Math.round(rect.right*10)/10,
        width:Math.round(rect.width*10)/10
      };
    }).filter(item=>item.width>0&&(item.right>viewport+2||item.left< -2)).sort((a,b)=>Math.max(b.right-viewport,-b.left)-Math.max(a.right-viewport,-a.left)).slice(0,8);
    return {
      doc:document.documentElement.scrollWidth,
      viewport,
      body:document.body.scrollWidth,
      offenders
    };
  });
  expect(Math.max(metrics.doc,metrics.body),`${label}: viewport=${metrics.viewport}, offenders=${JSON.stringify(metrics.offenders)}`).toBeLessThanOrEqual(metrics.viewport+2);
};

test('V21 homepage combines growth positioning with V20 cinematic assets',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openPage(page);
  await expect(page.locator('.v12-hero-title')).toContainText('Turn missed enquiries');
  await expect(page.locator('.v12-hero-title')).toContainText('booked customers.');
  await expect(page.locator('.hero__subject').first()).toHaveAttribute('src','/assets/yash-cutout.webp');
  await expect(page.locator('link[href="/cinematic-v18.css"]')).toHaveCount(1);
  await expect(page.locator('link[href="/cinematic-v20.css"]')).toHaveCount(1);
  await expect(page.locator('link[href="/international-growth.css"]')).toHaveCount(1);
  await expect(page.getByLabel('BRAYROAI credibility')).toContainText('Pune, India');
  await expect(page.getByRole('link',{name:/Book an AI Growth Audit/i}).first()).toBeVisible();
  await expectNoHorizontalOverflow(page,'homepage desktop');
});

test('Growth Engine demo and illustrative calculator remain interactive',async({page})=>{
  await openPage(page);
  const demo=page.locator('[data-ig-demo]');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toContainText('System online / demo');
  await expect(page.locator('[data-ig-lead-name]')).toHaveText('Maya / Apartment enquiry');
  await page.locator('[data-ig-next]').click();
  await expect(page.locator('[data-ig-progress]')).toContainText('STEP 02');
  await page.locator('[data-ig-scenario]').selectOption('consulting');
  await expect(page.locator('[data-ig-lead-name]')).toHaveText('Daniel / Operations project');

  const calculator=page.locator('[data-ig-calculator]');
  await calculator.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-ig-revenue-opportunity]')).toHaveText('$4,800 / mo');
  await page.locator('[name="monthlyLeads"]').fill('100');
  await page.locator('[name="leadValue"]').fill('2000');
  await expect(page.locator('[data-ig-revenue-opportunity]')).toHaveText('$10,000 / mo');
  await expect(calculator).toContainText('Illustrative scenario only');
});

test('Growth Audit validates required fields and prepares a complete request',async({page})=>{
  await openPage(page,'/audit');
  await page.getByRole('button',{name:'Faster follow-up'}).click();
  await page.locator('[data-ig-audit-next]').click();
  await page.locator('[data-ig-audit-next]').click();
  await expect(page.locator('#audit-name')).toBeFocused();

  await page.locator('#audit-name').fill('Alex Morgan');
  await page.locator('#audit-email').fill('alex@example.com');
  await page.locator('#audit-company').fill('Northstar Services');
  await page.locator('#audit-website').fill('https://example.com');
  await page.locator('#audit-region').selectOption('United States');
  await page.locator('#audit-budget').selectOption('US$3,000–$7,500');
  await page.locator('[data-ig-audit-next]').click();
  await page.locator('#audit-notes').fill('Website leads wait in a shared inbox before the sales team follows up.');
  await page.locator('[data-ig-audit-next]').click();
  await page.locator('[data-ig-audit-next]').click();

  await expect(page.locator('[data-ig-audit-summary]')).toContainText('Faster follow-up');
  await expect(page.locator('[data-ig-audit-email]')).toHaveAttribute('href',/alex%40example\.com/);
  await expect(page.locator('[data-ig-audit-email]')).toHaveAttribute('href',/Northstar/);
  await expect(page.locator('[data-ig-audit-whatsapp]')).toHaveAttribute('href',/wa\.me\/919175524637/);
});

test('US and UAE funnels remain honest about location and localized by intent',async({page})=>{
  await openPage(page,'/us');
  await expect(page.locator('h1')).toContainText('US service businesses');
  await expect(page.locator('main')).toContainText('Pune, India');
  await expect(page.locator('main')).toContainText('From US$1,500');
  await expect(page.locator('main')).toContainText('does not imply a US office');

  await openPage(page,'/uae');
  await expect(page.locator('h1')).toContainText('UAE enquiries');
  await expect(page.locator('main')).toContainText('WhatsApp');
  await expect(page.locator('main')).toContainText('does not claim a Dubai office');
  await expect(page.locator('[data-ig-whatsapp-context]').first()).toHaveAttribute('href',/Region%3A%20UAE/);
});

test('verified FakhriMart proof has a dedicated truth-safe case study',async({page})=>{
  await openPage(page,'/work/fakhrimart');
  await expect(page.getByText('VERIFIED CLIENT WORK / FAKHRIMART')).toBeVisible();
  await expect(page.getByRole('heading',{name:/Proof without invented metrics/i})).toBeVisible();
  await expect(page.locator('img[src="/assets/fakhrimart-case-desktop.png"]')).toBeVisible();
  await expect(page.locator('img[src="/assets/fakhrimart-case-mobile.png"]')).toBeVisible();
  await expect(page.getByRole('link',{name:/Visit the live client website/i})).toHaveAttribute('href','https://fakhriyarns.vercel.app/');
});

test('V21 core buyer pages have no serious or critical axe violations',async({page})=>{
  for(const route of ['/','/audit','/us','/uae','/plans','/founder','/work/fakhrimart']){
    await openPage(page,route);
    const result=await new AxeBuilder({page}).analyze();
    expect(serious(result),`${route}: ${JSON.stringify(serious(result).map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length})))}`).toEqual([]);
  }
});

test('V21 mobile buyer journeys have no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const route of ['/','/audit','/us','/uae','/plans','/lab','/work/fakhrimart']){
    await openPage(page,route);
    await expectNoHorizontalOverflow(page,route);
  }
});

test('reduced motion keeps the core growth journey usable',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await openPage(page);
  await expect(page.locator('.v12-hero-title')).toBeVisible();
  await page.locator('#growth-engine').scrollIntoViewIfNeeded();
  await page.locator('[data-ig-play]').click();
  await expect(page.locator('[data-ig-progress]')).toContainText('STEP 02');
});
