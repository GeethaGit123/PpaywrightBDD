import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";

// This wrapper runs Cucumber (not the Playwright Test runner) and preserves CLI filters.
const cliPath = resolve(
  dirname(require.resolve("@cucumber/cucumber")),
  "..",
  "bin",
  "cucumber.js",
);
const forwardedArguments = process.argv.slice(2);
const headedFlagIndex = forwardedArguments.indexOf("--headed");
const environment = { ...process.env };

if (headedFlagIndex !== -1) {
  forwardedArguments.splice(headedFlagIndex, 1);
  environment.HEADLESS = "false";
}

const result = spawnSync(
  process.execPath,
  [cliPath, "--config", "cucumber.js", ...forwardedArguments],
  {
    cwd: process.cwd(),
    env: environment,
    stdio: "inherit",
  },
);

if (result.error) {
  throw result.error;
}

if (result.signal) {
  process.stderr.write(`Cucumber was terminated by signal ${result.signal}.\n`);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
