import { defineConfig } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  globalSetup: "./playwright.global-setup.ts",
  testDir: "./src/__tests__/e2e",

  timeout: 30000,

  expect: {
    timeout: 5000,
  },

  retries: 1,

  reporter: [
    ["html", { open: "never" }],
    ["list"],
  ],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:5173",

    headless: true,

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    trace: "retain-on-failure",
  },

  webServer: isCI
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:5173",
        reuseExistingServer: true,
        timeout: 120000,
      },
});