import {
  setWorldConstructor,
  World,
  type IWorldOptions,
} from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "playwright";
import type { LoginPage } from "../pages/LoginPage";

// A World is a fresh per-scenario context that makes the page and browser available to steps.
export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
