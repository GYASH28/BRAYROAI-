import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const mountedRoutes = ['/', '/plans', '/founder', '/terms', '/ai-workflow-audit', '/company-second-brain', '/clients', '/clients/fakhrimart'];

for (const route of mountedRoutes) {
  test(`Rae mounts on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.rae-root')).toHaveCount(1);
    await expect(page.locator('[data-rae-launch]')).toBeVisible();
  });
}

test('Rae opens, talks to the same-origin AI route and renders useful actions', async ({ page }) => {
  await page.route('**/api/rae-chat', async (route) => {
    const payload = route.request().postDataJSON();
    expect(payload.message).toContain('plan');
    expect(payload.page.path).toBe('/');
    await new Promise((resolve) => setTimeout(resolve, 120));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        reply: 'For a complete website build, start by comparing the current one-time plans. I can help narrow it down from there.',
        actions: [{ label: 'View plans', href: '/plans', kind: 'navigate' }],
        provider: 'test',
        model: 'test-model',
      }),
    });
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const root = page.locator('.rae-root');
  await page.locator('[data-rae-launch]').click();
  await expect(root).toHaveAttribute('data-open', 'true');
  await expect(page.locator('.rae-panel')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('[data-rae-log]')).toContainText('I’m Rae');

  await page.locator('[data-rae-input]').fill('Which plan fits my website?');
  await page.locator('.rae-send').click();
  await expect(page.locator('[data-rae-log]')).toContainText('current one-time plans');
  await expect(page.locator('.rae-action[href="/plans"]')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(root).toHaveAttribute('data-open', 'false');
});

test('Rae gracefully falls back when the AI route is unavailable', async ({ page }) => {
  await page.route('**/api/rae-chat', (route) => route.abort());
  await page.goto('/plans', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-rae-launch]').click();
  await page.locator('[data-rae-input]').fill('Show me pricing');
  await page.locator('.rae-send').click();
  await expect(page.locator('[data-rae-log]')).toContainText('Plans page');
  await expect(page.locator('[data-rae-status]')).toContainText(/offline|Here when you need me/i);
});

test('Rae stays inside a 320px viewport with the panel open', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-rae-launch]').click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  const box = await page.locator('.rae-panel').boundingBox();
  expect(box).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
});

test('Rae respects reduced motion and has no serious accessibility violations while open', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-rae-launch]').click();
  const motion = await page.locator('.rae-character').evaluate((node) => ({
    animationName: getComputedStyle(node).animationName,
    transitionDuration: getComputedStyle(node).transitionDuration,
  }));
  expect(motion.animationName).toBe('none');
  const results = await new AxeBuilder({ page }).exclude('.v16-cursor').analyze();
  const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
  expect(serious, serious.map((violation) => `${violation.id}: ${violation.help}`).join('\n')).toEqual([]);
});
