# Project: Playwright Automation

This is a Playwright-based end-to-end automation project.

## Project Context
- **Framework:** Playwright (TypeScript)
- **Language:** TypeScript
- **Target:** Web application testing
- **Main Directories:**
  - `tests/`: Contains test specifications.
  - `pages/`: Page Object Models (POM).
  - `specs/`: Additional test specifications.
  - `utils/`: Helper functions.
  - `config/`: Configuration files.

## Coding Standards
- Use Page Object Model (POM) for all UI interactions.
- Test files should be named with `.spec.ts` suffix.
- Use `await` for all Playwright actions.
- Prefer `locator` API over old selectors.
- Maintain clean and descriptive test names.

## Agent Guidelines
- When generating tests, follow the existing POM structure in the `pages/` directory.
- Ensure all tests include proper assertions.
- Use the existing `BasePage.ts` as a base for new page objects.
- Refer to `playwright.config.ts` for environment settings.
