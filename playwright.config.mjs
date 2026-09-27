import {defineConfig,devices} from '@playwright/test';

export default defineConfig({
  testDir:'./tests',
  testMatch:/award-experience\.spec\.mjs/,
  timeout:45_000,
  expect:{timeout:10_000},
  fullyParallel:true,
  reporter:'line',
  use:{baseURL:process.env.BASE_URL||'http://127.0.0.1:4176',trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[{name:'chromium',use:{...devices['Desktop Chrome']}}],
  webServer:{command:'npm run preview -- --port 4176 --strictPort',url:'http://127.0.0.1:4176',reuseExistingServer:!process.env.CI,timeout:30_000}
});
