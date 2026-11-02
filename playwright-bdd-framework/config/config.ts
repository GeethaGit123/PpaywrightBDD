import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { playwrightDefaults } from "../playwright.config";

export type BrowserName = "chromium" | "firefox" | "webkit";

const environment = (process.env.TEST_ENV ?? "qa").toLowerCase();
if (environment !== "qa" && environment !== "uat") {
  throw new Error(
    `Unsupported TEST_ENV "${environment}". Choose "qa" or "uat".`,
  );
}

const envFilePath = join(__dirname, `.env.${environment}`);
if (!existsSync(envFilePath)) {
  throw new Error(`Environment file not found: ${envFilePath}`);
}

const dotenvResult = dotenv.config({ path: envFilePath });
if (dotenvResult.error) {
  throw dotenvResult.error;
}

function requiredEnvironmentValue(name: string): string {
  const configuredValue =
    name === "USERNAME"
      ? process.env.BDD_USERNAME?.trim() ?? dotenvResult.parsed?.[name]?.trim()
      : process.env[name]?.trim() ?? dotenvResult.parsed?.[name]?.trim();
  const value = configuredValue;
  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in ${envFilePath} or in the process environment.`,
    );
  }
  return value;
}

function readBoolean(name: string, defaultValue: boolean): boolean {
  const value = process.env[name]?.toLowerCase();
  if (value === undefined) {
    return defaultValue;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  throw new Error(`${name} must be "true" or "false".`);
}

function readBrowserName(): BrowserName {
  const browser = (process.env.BROWSER ?? "chromium").toLowerCase();
  if (browser === "chromium" || browser === "firefox" || browser === "webkit") {
    return browser;
  }
  throw new Error(
    `Unsupported BROWSER "${browser}". Choose chromium, firefox, or webkit.`,
  );
}

const browser = readBrowserName();

const timeoutMs = Number(
  process.env.TIMEOUT_MS ?? String(playwrightDefaults.timeoutMs),
);
if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
  throw new Error("TIMEOUT_MS must be a positive whole number.");
}

export const config = {
  environment,
  baseUrl: requiredEnvironmentValue("BASE_URL"),
  username: requiredEnvironmentValue("USERNAME"),
  password: requiredEnvironmentValue("PASSWORD"),
  browser,
  headless: readBoolean("HEADLESS", playwrightDefaults.headless),
  timeoutMs,
  screenshotDir: join(__dirname, "..", "screenshots"),
};
