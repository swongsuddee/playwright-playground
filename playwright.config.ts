import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the Playwright Playground (the app under test).
 *
 * NODE REQUIREMENT: the dev server (Next 16) needs Node >= 20.9. If your default
 * `node` is 18, start the run from a shell where Node 20+ is on PATH, e.g.:
 *   export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
 * We intentionally do NOT hardcode an nvm path in `webServer.command` so this
 * config stays portable across machines.
 *
 * Run:   npm run e2e         (or: npx playwright test)
 * If browsers are missing:   npx playwright install chromium
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
