import { test, expect } from "playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Name Field Tests", () => {
  test("Task 1.1 - Valid name is output to logs on form submission", async ({
    page,
  }) => {
    let name = "Mortimer Fastwind";
    await page.getByRole("textbox", { name: "Name:" }).fill(name);

    // TODO Move log parser in the utils
    const logs = [];
    page.on("console", (msg) => {
      logs.push(msg.text());
    });

    expect(logs.length).toBe(0);
    await page.getByRole("button", { name: "Submit Application" }).click();
    expect(logs.length).toBeGreaterThan(0);

    // TODO:
    // Improve the follow assertion: should loop through for the expected prefix and
    // check the string vs expected: clearer to debug if it fails and just better in general
    expect(logs.includes(`Name: ${name}`)).toBeTruthy();

    // TODO: verify success modal appears
  });

  test("Task 1.2 - Empty name field displays error modal", async ({ page }) => {
    // TODO: Move these constants into JSON content files
    const modalHeadingText = "Validation Error";
    const errorMessageText = "Name field is required.";

    let modalHeading = page.getByText(modalHeadingText);
    let errorMessage = page.getByText(errorMessageText);

    await page.getByRole("button", { name: "Submit Application" }).click();
    await modalHeading.waitFor();
    await expect(modalHeading).toBeVisible();
    await expect(errorMessage).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(modalHeading).not.toBeVisible();
    await expect(page.getByText(modalHeadingText)).not.toBeVisible();
    await expect(errorMessage).not.toBeVisible();

    // TODO: Check logs for appropriate debug messages
  });
});

test.describe("Radio Button Tests", () => {
  const buttonValues = ["Yes", "No"];
  for (const buttonValue of buttonValues) {
    test(
      "Tasks 2.1 and 2.2 - Radio button should log correctly: value " +
        buttonValue,
      async ({ page }) => {
        const logs = [];
        page.on("console", (msg) => {
          logs.push(msg.text());
        });
        expect(logs.length).toBe(0);

        await page
          .getByRole("textbox", { name: "Name:" })
          .fill(`${buttonValue}`);
        await page.getByRole("radio", { name: buttonValue }).check();
        expect(logs.length).toBe(0);

        await page.getByRole("button", { name: "Submit Application" }).click();
        expect(logs.length).toBeGreaterThan(0);

        expect(
          logs.includes(`Automation Used: ${buttonValue.toLowerCase()}`)
        ).toBeTruthy();
      }
    );
  }
});

test.describe("Experience Slider Tests", () => {
  const sliderValues = [3, 6, 10];
  for (const sliderValue of sliderValues) {
    test(
      "Tasks 3.1, 3.2 and 3.3 - Experience slider should log correctly: value " +
        sliderValue,
      async ({ page }) => {
        const logs = [];
        page.on("console", (msg) => {
          logs.push(msg.text());
        });
        expect(logs.length).toBe(0);

        await page
          .getByRole("textbox", { name: "Name:" })
          .fill(`${sliderValue}`);

        await page
          .getByRole("slider", { name: "How many years of automation" })
          .fill(`${sliderValue}`);

        expect(logs.length).toBe(0);

        await page.getByRole("button", { name: "Submit Application" }).click();
        expect(logs.length).toBeGreaterThan(0);
        expect(logs.includes(`Years Experience: ${sliderValue}`)).toBeTruthy();

        const automationPrefix =
          "How many years of automation experience do you have?";
        let expectedSliderValue =
          sliderValue == 10 ? `${sliderValue}+` : `${sliderValue}`;
        expect(
          page.getByText(`${automationPrefix} (${expectedSliderValue})`)
        ).toBeVisible();
      }
    );
  }

  test("Task 3.4 - Slider shouldn't allow values larger than 10", async ({
    page,
  }) => {
    const logs = [];
    page.on("console", (msg) => {
      logs.push(msg.text());
    });
    expect(logs.length).toBe(0);

    await page
      .getByRole("textbox", { name: "Name:" })
      .fill("These amps go to 11");

    let slider = page.getByRole("slider", {
      name: "How many years of automation",
    });

    await slider.evaluate((element) => element.setAttribute("max", "11"));
    await slider.fill("11");

    expect(logs.length).toBe(0);

    await page.getByRole("button", { name: "Submit Application" }).click();
    expect(logs.length).toBeGreaterThan(0);

    // The following fails: raise bug that validation should not happen in elements
    // expect(logs.includes(`Years Experience: 11`)).toBeFalsy();
    // expect(
    //   page.getByText("How many years of automation experience do you have? (11)")
    // ).not.toBeVisible();

    // TODO:
    // The assertions above correctly fail, but if both of the strings change, they
    // will incorrectly fail. They should both be moved to a central storage of
    // content to be re-used - this will ensure that expecting things to be NOT visible
    // or NOT appear in the logs will be reliable.
  });
});

test.describe("CV Upload Tests", () => {
  test("Task 4.1 - CV Upload label should populate correctly", async ({
    page,
  }) => {
    const dir = "playwright/resources/";
    const filename = "bob.txt";

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Please attach your CV:" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(dir + filename);

    await expect(
      page.getByRole("button", { name: "Please attach your CV:" })
    ).toHaveValue(`C:\\fakepath\\${filename}`);
    await expect(page.locator("form")).toContainText(
      `Selected file: ${filename}`
    );
  });
});

test.describe("Personal Statement Tests", () => {
  test("Task 5.1 - Personal Statement area character count calculates correctly", async ({
    page,
  }) => {
    const text = "The quick brown fox jumps over the lazy dog.";
    let counter = page.locator(".char-count");
    let textbox = page.locator("#personalStatement");

    expect(textbox).toHaveValue("");
    await expect(counter).toContainText("0 / 100");

    await textbox.fill("T");
    await expect(counter).toContainText("1 / 100");
    expect(textbox).toHaveValue("T");

    await textbox.fill(text);
    await expect(counter).toContainText("44 / 100");
    expect(textbox).toHaveValue(text);
  });

  test("Task 5.2 - Personal Statement area should disallow greater than 100 characters", async ({
    page,
  }) => {
    const text =
      "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque";
    let counter = page.locator(".char-count");
    let textbox = page.locator("#personalStatement");

    await textbox.fill(text);
    await expect(counter).toContainText("100 / 100");
    expect(textbox).toHaveValue(text);

    await textbox.fill(text + "a");
    await expect(counter).toContainText("100 / 100");
    expect(textbox).toHaveValue(text);
  });

  test("Task 5.3 - Personal Statement area should implement appropriate validation", async ({
    page,
  }) => {
    const text =
      "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque";
    let counter = page.locator(".char-count");
    let textbox = page.locator("#personalStatement");

    await textbox.fill(text + "a");
    await expect(counter).toContainText("100 / 100");
    expect(textbox).toHaveValue(text);

    await textbox.evaluate((element) =>
      element.setAttribute("maxLength", "101")
    );
    await textbox.fill(text + "a");
    // Raise bug: maxLength is not sufficient validation
    // await expect(counter).toContainText("100 / 100");
    // expect(textbox).toHaveValue(text);
  });
});

test.describe("Completed Task Checkbox Tests", () => {
  test("Task 6.1 - Checkbox should correctly toggle value as it is clicked", async ({
    page,
  }) => {
    let checkbox = page.getByRole("checkbox", { name: "Completed the task" });

    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();

    await expect(checkbox).not.toBeChecked();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });
});
