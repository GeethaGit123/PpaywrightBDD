import assert from "node:assert/strict";
import type { Locator, Page } from "playwright";

// The Page Object Model keeps login selectors and browser interactions together.
export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly inventoryList: Locator;

  constructor(private readonly page: Page, private readonly baseUrl: string) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.inventoryList = page.locator(".inventory_list");
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(this.baseUrl);
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.page.waitForURL(/\/inventory\.html$/);
    await this.inventoryList.waitFor({ state: "visible" });
    assert.match(this.page.url(), /\/inventory\.html$/);
  }

  async verifyLoginFailure(): Promise<void> {
    await this.errorMessage.waitFor({ state: "visible" });
    const message = await this.errorMessage.innerText();
    assert.match(
      message,
      /username and password do not match/i,
      "The login page should explain that the credentials are invalid.",
    );
    assert.doesNotMatch(this.page.url(), /\/inventory\.html$/);
  }
}
