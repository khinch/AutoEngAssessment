# Test Automation Engineer Assessment

This repository is designed to assess the skills of test automation engineers. It contains a React application built with Vite.

## Getting Started

To get the form running locally, follow these steps:

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at the URL provided in the terminal output.

## Instructions

Please refer to the `Instructions.docx` file located in the `questionPaper` directory for detailed instructions on completing the assessment.

# Implementation Approach ...
To ensure maximum value for the time available, the chosen approach was the "make it work, make it right, make it fast" paradigm. At this point, they do work,but adding any more tests would begin to become cumbersome without first performing some refactoring and making the tests more readable, maintainable and robust. Currently, they meet the requirements for the current state of the application. 

## Make it work
Make all the tests work as expected with correct and valid assertions. 

## Make it right
Tidy up the tests:
- Refactor repeatable sections into more re-usable patterns
- Use idiomatic Playwright structure and approach
- Improve locators to be more re-usable across multiple tests

## Make it fast
- Refactor to make the test structure easier to expand:
  - More pages should be quick to add following the established pattern
  - Test suites for integration/a11y/device testing should be quick to create by reusing the established models
- Move static page content into static JSON files

# Observations
- The "Personal Statement" box is resizeable, despite comfortably holding more than 100 characters. 
- The name field appears to have no maximum character limit
- The name field is not marked as mandatory
- Resizing the viewport begins to cover elements before the text wraps
- The non-text elements don't resize with the viewport

# Installing and Running the Tests
## Installing Playwright
``` 
npx install playwright
```
## Running the tests
```
npm run test
```
The reports are generated within `playwright/reports` directory.  

Screenshots are only generated on test failure. Test failures will also auto-start the report viewer: click the link in the console to view the reports, or navigate to the html file in the reports directory above. 

## Maintaining the Tests
```
npm run test-edit
```
Opens Playwright GUI for using the test recorder and object inspector.

# Future Work
## Additional Tests
### All fields
- Some form of content validation should take place to verify the copy is as expected, ideally against a content service or content file provided by BA, PO or UX, as appropriate. 
### Name field
- Test special characters don't crash the application or cause errors in the logs, and are successfully dispatched
- Test multiple clearings and re-populations continue to behave as expected regarding the modal and form submission
- Verify it can be cleared
### Radio buttons
- Test multiple toggles back and forth update the component and are correctly represented in form submission
- Verify each is deselected as the counterpart is selected to ensure they are associated
- Verify the labels match the component value and form submission value
### Experience Slider
- Use click/drag to set the slider and assert the value
- Set the value programatically and verify the slider moves (perhaps visual test)
- Verify it can be set multiple times
### CV Selector
- Verify selected file can be changed after selection
- Check a variety of file types. It probably shouldn't allow potentially dangerous files. 
- Rename an `.exe` as `.doc` and test if it is accepted.
### Personal Statement field
- Test special characters don't crash the application or cause errors in the logs, and are successfully dispatched
- Verify it can be cleared
### Task Completed checkbox
- Verify the correct value is dispatched on submit

## Accessibility Considerations
Idiomatic Playwright suggests the use of `getByRole`, where possible, to ensure compatibility with accessibility guidelines, and for ease of test creation with help from the Playwright GUI. This may not be appropriate for all applications, and should be considered for the application under test. For example, a button labelled "Submit" could easily be changed to "Continue" or "Next" and still make sense to a user, but all tests using that element would fail. It may make sense to create a dedicated accessibilty suite which exclusively uses aria elements, and visual elements of the page, to ensure visual continuity. This suite should also use Axe tools to scan the page. This would mean visual elements are checked and accessibility has automation coverage, but the functional suite would still continue provided the `data-testid` style tags are maintained. 

## Integration Testing
The current suite covers the UI components, and the simulated log output goes some way to checking the contract with other services is being met. A dedicated integration test suite with a small number of high-value tests could run post-deployment to test the full system. This could be potentially data-driven and scenario based. 

## Visual Testing
Playwright's built-in visual analysis/comparison tools should be used to verify the page layout has not changed since the last manual review of the screenshots. 

## Device Testing
If the application is expected to be used on mobiles, the use of a mobile testing service such as BrowserStack, Saucelabs or LambdaTest should be considered, to cover a selection of most used mobile devices and viewports. 

## Contract Testing
If the application is expected to interact with multiple orchestrator/coordinator services, then contract testing should be considered. 

## Test Environments
Use config files to support dev/int/uat style environment progression with as little change to the test implementation as possible. The tests should not need to be aware of their environment. The environment should be selectable as the tests are invoked to allow for pipelines etc. 
