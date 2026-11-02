import { After, Before, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { config } from "../config/config";
import { LoginPage } from "../pages/LoginPage";
import { CustomWorld } from "../support/CustomWorld";
import { playwrightBrowsers } from "../playwright.config";

setDefaultTimeout(config.timeoutMs);

// Hooks create an isolated browser context per scenario and always release resources.
Before(async function (this: CustomWorld) {
  const browser = await playwrightBrowsers[config.browser].launch({
    headless: config.headless,
  });
  this.browser = browser;
  const context = await browser.newContext();
  this.context = context;
  const page = await context.newPage();
  this.page = page;
  page.setDefaultTimeout(config.timeoutMs);
  this.loginPage = new LoginPage(page, config.baseUrl);
});

After(async function (this: CustomWorld, scenario) {
  try {
    if (scenario.result?.status === Status.FAILED && this.page) {
      await mkdir(config.screenshotDir, { recursive: true });
      const screenshotPath = join(
        config.screenshotDir,
        `${scenario.pickle.name
          .replace(/[^a-zA-Z0-9_-]+/g, "-")
          .replace(/^-|-$/g, "")}-${Date.now()}.png`,
      );
      const screenshot = await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      await this.attach(screenshot, "image/png");
    }
  } finally {
    try {
      if (this.page) {
        await this.page.close();
      }
    } finally {
      try {
        if (this.context) {
          await this.context.close();
        }
      } finally {
        if (this.browser) {
          await this.browser.close();
        }
      }
    }
  }
});
