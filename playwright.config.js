const { defineConfig } = require('playwright/test');

module.exports = defineConfig({
  testDir: './test',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:18080',
    headless: true,
    ignoreHTTPSErrors: true,
    viewport: {
      width: 1440,
      height: 1200,
    },
  },
  webServer: {
    command: 'python3 -m http.server 18080 --directory docs/build/html',
    port: 18080,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
