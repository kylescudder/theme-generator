import { defineConfig } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:44321'

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    screenshot: 'on',
    trace: 'retain-on-failure'
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command:
          'bunx --no-install astro dev --ignore-lock --host 127.0.0.1 --port 44321',
        url: baseURL,
        reuseExistingServer: false,
        timeout: 30_000
      }
})
