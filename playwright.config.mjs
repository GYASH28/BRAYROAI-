import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /(browser-v11|second-scene-regression)\.spec\.mjs/,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  retries: 1,
  reporter: [['line'], ['html', { outputFolder: 'artifacts/playwright-report', open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});
