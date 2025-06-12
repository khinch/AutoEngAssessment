import { expect } from "playwright/test";

export default class Modal {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    this.page = page;
    this.modalContent = this.page.locator("div.modal-backdrop > .modal-content");
    this.modalHeader = this.modalContent.locator("h2");
    this.modalMessage = this.modalContent.locator("p");
    this.closeButton = this.modalContent.getByRole("button");
  }

  async waitFor() {
    await this.modalContent.waitFor();
  }

  assertIsVisible(expected) {
    if(expected) {
      expect(this.modalContent).toBeVisible();
    } else {
      expect(this.modalContent).not.toBeVisible();
    }
  }

  async assertHeaderText(expectedText) {
    expect(await this.modalHeader.innerText()).toBe(expectedText);
  }

  async assertMessageText(expectedText) {
    expect(await this.modalMessage.innerText()).toBe(expectedText);
  }

  async close() {
    await this.closeButton.click();
  }
}
