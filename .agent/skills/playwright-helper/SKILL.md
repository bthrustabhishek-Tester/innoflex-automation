# Playwright Helper Skill

This skill provides the agent with specialized knowledge for working with the current Playwright project.

## Capabilities
- Generate Playwright tests based on existing POMs.
- Debug failing Playwright tests.
- Suggest locators for new UI elements.

## Instructions
- Always check `pages/base/BasePage.ts` for common utilities.
- When creating a new test, check if a corresponding Page Object already exists in `pages/`.
- If a Page Object is missing, propose its creation before writing the test.
- Use `npx playwright test` to verify any changes to tests.
- Follow the naming convention: `[FeatureName].spec.ts`.

## Reference
- Playwright Documentation: https://playwright.dev/docs/intro
- Project-specific BasePage: `pages/base/BasePage.ts`
