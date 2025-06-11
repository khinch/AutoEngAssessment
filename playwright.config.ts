import { defineConfig } from "playwright/test";

export default defineConfig({
  testDir: "./playwright/tests",
  outputDir: "./playwright/reports",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: [["html", { open: "on-failure", outputFolder: "./playwright/reports" }]],
  use: {
    baseURL: "http://localhost:5173",
    browserName: "chromium",
    headless: false,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "Chromium",
      use: { browserName: "chromium" },
    },
  ],
});
