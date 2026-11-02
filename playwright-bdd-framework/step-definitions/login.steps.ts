// Step definitions connect readable Gherkin steps to the page object.
import { Given, Then, When } from "@cucumber/cucumber";
import { config } from "../config/config";
import { CustomWorld } from "../support/CustomWorld";

Given("I navigate to the login page", async function (this: CustomWorld) {
  await this.loginPage.navigateToLoginPage();
});

When(
  "I enter valid username and password",
  async function (this: CustomWorld) {
    await this.loginPage.enterUsername(config.username);
    await this.loginPage.enterPassword(config.password);
  },
);

When(
  "I enter invalid username and password",
  async function (this: CustomWorld) {
    await this.loginPage.enterUsername(`${config.username}_invalid`);
    await this.loginPage.enterPassword(config.password);
  },
);

When("I click the login button", async function (this: CustomWorld) {
  await this.loginPage.clickLogin();
});

Then(
  "I should be successfully logged in",
  async function (this: CustomWorld) {
    await this.loginPage.verifySuccessfulLogin();
  },
);

Then("I should see a login error message", async function (this: CustomWorld) {
  await this.loginPage.verifyLoginFailure();
});
