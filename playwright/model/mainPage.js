import { expect } from "playwright/test";

export default class MainPage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    this.page = page;
    this.header = page.locator("div#root > div.app-container > h1");
    this.nameInput = page.getByRole("textbox", { name: "Name:" });
    this.submitButton = page.getByRole("button", {
      name: "Submit Application",
    });
  }

  async navigateToPage() {
    await this.page.goto("/");
  }

  async getHeaderText() {
    return await this.header.innerText();
  }

  async assertHeaderText(expectedHeaderText) {
    expect(await this.header.innerText()).toBe(expectedHeaderText);
  }

  async fillName(name) {
    await this.nameInput.fill(name);
  }

  async clickSumbit() {
    await this.submitButton.click();
  }
}
