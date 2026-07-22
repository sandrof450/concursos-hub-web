import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/__tests__/e2e",

  timeout: 30000,

  expect: {
    timeout: 5000,
  },

  retries: 1,

  use: {
    baseURL: "http://localhost:5173",

    headless: true,

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    trace: "retain-on-failure",
  },

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120000,
  },
});