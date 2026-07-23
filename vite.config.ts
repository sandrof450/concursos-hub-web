// vite.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.ts",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "src/__tests__/e2e/**",
      "TypeScript/**"
    ],
  },
  server: {
    host: true,
    port: 5173,
  },
});