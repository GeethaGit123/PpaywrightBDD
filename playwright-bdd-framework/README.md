# Playwright BDD Framework

A beginner-friendly BDD automation framework using Cucumber as the test runner and
Playwright as the browser automation library. It targets the SauceDemo login page.

## A. Project architecture

```text
features/          Gherkin feature files describing user-visible behavior
step-definitions/  TypeScript implementations of the Gherkin steps
pages/              Page Object Model classes with locators and UI actions
hooks/              Per-scenario browser setup, teardown, and failure screenshots
support/            Custom Cucumber World shared by steps and hooks
config/             Environment selection and QA/UAT dotenv files
test-runner/        Cucumber CLI wrapper, including headed-mode support
utils/              Location for reusable helpers as the framework grows
reports/            Generated Cucumber HTML report
screenshots/        PNG screenshots captured for failed scenarios
```

`cucumber.js` wires feature files, TypeScript loading, hooks, and reporting.
`playwright.config.ts` contains the shared Playwright browser defaults; it does not
configure or invoke the Playwright Test runner. `tsconfig.json` configures TypeScript,
`package.json` defines dependencies and commands, and `package-lock.json` records
the resolved dependency versions for repeatable installs.

The feature file uses **Gherkin**, a readable Given/When/Then format. **Step
definitions** connect those sentences to TypeScript. The **Page Object Model** keeps
selectors and UI interactions in `LoginPage`, rather than duplicating them in steps.

The Cucumber **World** is created once for each scenario and shares its Playwright
`Page` with that scenario's steps. A Playwright **Browser** is the browser process;
its **BrowserContext** is an isolated session (including cookies and storage), and a
**Page** is a tab in that session. Hooks manage these resources and attach screenshots
on failure. Cucumber's HTML formatter records features, scenarios, step outcomes,
timing, errors, and attached screenshots in the report.

## B. Install dependencies

From this project directory:

```sh
npm install
```

## C. Install Playwright browsers

Install Chromium:

```sh
npx playwright install chromium
```

Or install all browser engines supported by the configuration:

```sh
npx playwright install
```

## D. Configure environments

Choose the environment with `TEST_ENV=qa` (the default) or `TEST_ENV=uat`.
Edit `config/.env.qa` and `config/.env.uat` to set each environment's `BASE_URL`,
`USERNAME`, and `PASSWORD`. Keep real credentials out of source control; use local
environment files or a secrets manager for private environments.
On Windows, the operating system defines `USERNAME`, so use `BDD_USERNAME` when
overriding the configured username from the process environment.

Optional process variables override browser execution settings:

```text
BROWSER=chromium
HEADLESS=true
TIMEOUT_MS=30000
```

Supported `BROWSER` values are `chromium`, `firefox`, and `webkit`. The checked-in
environment files contain the supplied public SauceDemo sample login so the example
can run immediately.

PowerShell environment selection example:

```powershell
$env:TEST_ENV = "uat"
npm run test:bdd
```

## E. Execute all BDD tests

```sh
npm run test:bdd
```

All feature files under `features/` run by default. Cucumber reports scenario
failures and continues with subsequent scenarios where possible.

## F. Execute a specific feature

```sh
npm run test:bdd -- features/login.feature
```

## G. Execute a specific scenario or tag

Run the smoke scenario by tag:

```sh
npm run test:bdd -- --tags "@smoke"
```

If your terminal is at the workspace root (`D:\PlaywrightBDD`) rather than inside
`playwright-bdd-framework`, run:

```sh
npm run test:bdd --prefix playwright-bdd-framework -- --tags "@smoke"
```

These are Cucumber scenarios, so use the Cucumber `--tags` filter rather than
`npx playwright test --grep`; Playwright Test is not the runner for this framework.

Run the invalid-login regression scenario:

```sh
npm run test:bdd -- --tags "@regression"
```

To select by scenario name instead:

```sh
npm run test:bdd -- --name "Successful login with valid credentials"
```

The underlying Cucumber CLI also accepts standard options such as `--name` and
`--tags`.

## H. Run in headed mode

```sh
npm run test:bdd:headed
```

The runner sets `HEADLESS=false`. You can combine this with feature paths or Cucumber
filters in the same way as `test:bdd`.

## I. Generate the HTML report

Both `test:bdd` and `test:bdd:html` write the report to
`reports/cucumber-report.html`. Run the latter explicitly when the HTML output is the
main goal:

```sh
npm run test:bdd:html
```

The report includes feature/scenario names, steps, pass/fail status, execution
duration, failure details, and screenshots attached by the hooks.

## J. Failure screenshots

After a failed scenario, the `After` hook saves a full-page PNG under `screenshots/`
and attaches the image bytes to the Cucumber result. The HTML report can display the
attached image. The hook then closes the page, context, and browser even when
screenshot capture encounters an error.

## K. End-to-end execution flow

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```

The Cucumber CLI reads the feature and loads the TypeScript steps and hooks through
`tsx`. Each step calls a method on `LoginPage`; that page object uses Playwright's
`Page` to interact with SauceDemo. Hooks manage the browser lifecycle and attach
failure screenshots, and the Cucumber HTML formatter writes the results.

Type-check the framework with:

```sh
npm run typecheck
```
