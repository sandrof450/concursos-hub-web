import { defineConfig } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./src/__tests__/e2e",

  timeout: 30000,

  expect: {
    timeout: 5000,
  },

  retries: 1,

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:5173",

    headless: true,

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    trace: "retain-on-failure",
  },

  // Só sobe o servidor de dev localmente — no CI, o docker-compose já cuida disso
  webServer: isCI
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:5173",
        reuseExistingServer: true,
        timeout: 120000,
      },
});