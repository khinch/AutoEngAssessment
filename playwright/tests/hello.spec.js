import { test, expect } from "playwright/test";

test("test", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Name:" }).fill("Foo Bar");
  await page.getByRole("radio", { name: "Yes" }).check();
  await page
    .getByRole("slider", { name: "How many years of automation" })
    .fill("10");
  await page
    .getByRole("textbox", { name: "Personal Statement (max 100" })
    .fill("The quick brown fox jumps over the lazy dog.\n");
  await page.getByRole("checkbox", { name: "Completed the task" }).check();
  page.once("dialog", (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole("button", { name: "Submit Application" }).click();
});
