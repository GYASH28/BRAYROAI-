import { test, expect } from '@playwright/test';

async function ready(page){
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'),null,{timeout:5000});
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'),null,{timeout:5000});
  await page.waitForFunction(()=>document.body.classList.contains('commercial-ready'),null,{timeout:5000});
  await page.waitForFunction(()=>document.body.classList.contains('refinement-ready'),null,{timeout:5000});
}

const rgb = value => (value.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
const luminance = ([r,g,b]) => {
  const convert = n => {
    n/=255;
    return n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4);
  };
  const [R,G,B]=[r,g,b].map(convert);
  return .2126*R+.7152*G+.0722*B;
};
const contrast = (a,b) => {
  const [l1,l2]=[luminance(rgb(a)),luminance(rgb(b))].sort((x,y)=>y-x);
  return (l1+.05)/(l2+.05);
};

test('major homepage shells keep one optical left edge', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  const selectors=['#plans-snapshot .plans-snapshot__head','#work .work-head','#lab .lab-head','#about .about-grid','#engage .engage-title'];
  const lefts=[];
  for(const selector of selectors){
    const box=await page.locator(selector).boundingBox();
    expect(box,`${selector} has no layout box`).not.toBeNull();
    lefts.push(box.x);
  }
  expect(Math.max(...lefts)-Math.min(...lefts),`shell left edges differ: ${lefts.join(', ')}`).toBeLessThanOrEqual(2);
});

test('Process chapter is readable and focus follows meaningful scroll position', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  const process=page.locator('#process');
  await process.scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);

  const palette=await process.evaluate(section=>{
    const heading=section.querySelector('.process-row h3');
    const copy=section.querySelector('.process-row p');
    return {
      background:getComputedStyle(section).backgroundColor,
      heading:getComputedStyle(heading).color,
      copy:getComputedStyle(copy).color
    };
  });
  expect(contrast(palette.heading,palette.background),JSON.stringify(palette)).toBeGreaterThan(7);
  expect(contrast(palette.copy,palette.background),JSON.stringify(palette)).toBeGreaterThan(4.5);

  await expect(page.locator('.process-row.is-current')).toHaveCount(1);
  await expect(page.locator('.process-row[aria-current="step"]')).toHaveCount(1);
  const focus=Number(await page.locator('.process-row.is-current').evaluate(el=>getComputedStyle(el).getPropertyValue('--row-focus')));
  expect(focus).toBeGreaterThan(.45);
});

test('scroll choreography settles sections instead of looping independently', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  const work=page.locator('#work');
  const before=Number(await work.evaluate(el=>getComputedStyle(el).getPropertyValue('--ref-enter')||0));
  await work.evaluate(el=>window.scrollTo({top:el.offsetTop-window.innerHeight*.18,behavior:'auto'}));
  await expect.poll(async()=>Number(await work.evaluate(el=>getComputedStyle(el).getPropertyValue('--ref-enter')||0)),{timeout:3000}).toBeGreaterThan(.75);
  const after=Number(await work.evaluate(el=>getComputedStyle(el).getPropertyValue('--ref-enter')||0));
  expect(after).toBeGreaterThan(before);
  expect(after).toBeLessThanOrEqual(1);
  expect(await page.evaluate(()=>window.__BRAYROAI_REFINEMENT__)).toBe(true);
});

test('mobile capabilities snap as full reading cards and update the active discipline', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await ready(page);
  await page.locator('#services').scrollIntoViewIfNeeded();
  const scroller=page.locator('.capability-steps');
  const cards=page.locator('[data-cap-step]');
  await expect(cards).toHaveCount(4);
  await expect(scroller).toHaveAttribute('tabindex','0');

  const geometry=await page.evaluate(()=>{
    const scroller=document.querySelector('.capability-steps');
    const card=scroller?.querySelector('[data-cap-step]');
    return {scroller:scroller?.clientWidth||0,card:card?.getBoundingClientRect().width||0};
  });
  expect(geometry.card/geometry.scroller,JSON.stringify(geometry)).toBeGreaterThan(.9);
  expect(geometry.card/geometry.scroller,JSON.stringify(geometry)).toBeLessThanOrEqual(1);

  await scroller.evaluate(el=>el.scrollTo({left:el.scrollWidth-el.clientWidth,behavior:'auto'}));
  await expect.poll(async()=>cards.nth(3).getAttribute('aria-current'),{timeout:3000}).toBe('step');
  await expect(cards.nth(3)).toHaveClass(/is-active/);
  await expect(page.locator('[data-cap-panel="3"]')).toHaveClass(/is-active/);
});

test('mobile Studio hands off directly to Start a Project with no dead layout tail', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await ready(page);
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.waitForTimeout(160);

  await expect(page.locator('.studio-matrix > div')).toHaveCount(4);
  await expect(page.locator('.about-links a')).toHaveCount(2);
  for(const link of await page.locator('.about-links a').all()) await expect(link).toBeVisible();

  const geometry=await page.evaluate(()=>{
    const about=document.querySelector('#about');
    const engage=document.querySelector('#engage');
    const tail=document.documentElement.scrollHeight-(engage.offsetTop+engage.offsetHeight);
    return {
      aboutHeight:about.offsetHeight,
      gap:engage.offsetTop-(about.offsetTop+about.offsetHeight),
      engageHeight:engage.offsetHeight,
      tail
    };
  });
  expect(Math.abs(geometry.gap),JSON.stringify(geometry)).toBeLessThanOrEqual(2);
  expect(geometry.aboutHeight,JSON.stringify(geometry)).toBeLessThan(2200);
  expect(geometry.engageHeight,JSON.stringify(geometry)).toBeGreaterThan(900);
  expect(Math.abs(geometry.tail),JSON.stringify(geometry)).toBeLessThanOrEqual(2);

  await page.locator('#engage').scrollIntoViewIfNeeded();
  await expect(page.locator('.giant-contact')).toBeVisible();
  await expect(page.locator('#engage .engage-card')).toHaveCount(2);
});

test('v6 refinement fully settles in reduced-motion mode', async ({browser}) => {
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await ready(page);
  const values=await page.locator('#work').evaluate(el=>({
    enter:getComputedStyle(el).getPropertyValue('--ref-enter').trim(),
    center:getComputedStyle(el).getPropertyValue('--ref-center').trim()
  }));
  expect(values.enter).toBe('1');
  expect(['0','0.0000'].includes(values.center)).toBeTruthy();
  const cardTranslate=await page.locator('#engage .engage-card').first().evaluate(el=>getComputedStyle(el).translate);
  expect(['none','0px','0px 0px'].includes(cardTranslate)).toBeTruthy();
  await context.close();
});
