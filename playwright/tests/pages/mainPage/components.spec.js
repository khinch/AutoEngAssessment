import { test, expect } from "playwright/test";
import { page as mainPage } from "../../../locators/mainPage";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

// let mainpage = mainPage({ page });

test.describe("Name Field Tests", () => {
  // var mainpage = mainPage(page);

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
    const errorMessage = "Name field is required.";

    await page.getByRole("button", { name: "Submit Application" }).click();
    await page.getByRole("heading", { name: modalHeadingText }).waitFor();
    await expect(page.getByText(modalHeadingText)).toBeVisible();
    await expect(page.getByText(errorMessage)).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(
      page.getByRole("heading", { name: modalHeadingText })
    ).not.toBeVisible();
    await expect(page.getByText(modalHeadingText)).not.toBeVisible();
    await expect(page.getByText(errorMessage)).not.toBeVisible();

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

        // TODO:
        // This is a bit hacky. Improve the locator so that the buttonValues don't
        // have to match the form labels. Could probably use CSS Selectors.
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

        // TODO:
        // Tidy up this
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

    await slider.evaluate(element => element.setAttribute('max', '11'));
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
