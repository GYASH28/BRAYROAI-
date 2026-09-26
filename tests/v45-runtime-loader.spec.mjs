import {test,expect} from '@playwright/test';

test('mobile hero does not fetch heavy enhancement runtimes before interaction',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForTimeout(450);
  const before=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(before.some(name=>/commercial-cut-runtime/i.test(name))).toBeFalsy();
  expect(before.some(name=>/react-islands-runtime/i.test(name))).toBeFalsy();

  await page.mouse.wheel(0,260);
  await expect.poll(async()=>page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name).some(name=>/commercial-cut-runtime/i.test(name))),{timeout:8000}).toBeTruthy();
  await expect.poll(async()=>page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name).some(name=>/react-islands-runtime/i.test(name))),{timeout:8000}).toBeTruthy();
});

test('desktop loads both enhancement runtimes without waiting for interaction',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/',{waitUntil:'networkidle'});
  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(resources.some(name=>/commercial-cut-runtime/i.test(name))).toBeTruthy();
  expect(resources.some(name=>/react-islands-runtime/i.test(name))).toBeTruthy();
});
