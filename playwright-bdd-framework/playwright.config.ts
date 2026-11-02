import { chromium, firefox, webkit } from "playwright";

// Browser instances come from Playwright itself; Cucumber remains the test runner.
export const playwrightBrowsers = { chromium, firefox, webkit } as const;

export const playwrightDefaults = {
  headless: true,
  timeoutMs: 30_000,
};
