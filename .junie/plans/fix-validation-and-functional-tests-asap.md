---
sessionId: session-260724-154856-1x3j
---

# Requirements

### Overview & Goals
The goal is to provide a complete and reliable automation suite for the Login and Create Customer sections, focusing on "all types of validation" as requested. This includes fixing existing timeouts and flaky locators to ensure the tests run as soon as possible (ASAP).

### Scope
- **In Scope**:
    - `LoginPage` and `CustomerPage` improvements.
    - `CreateCustomer.spec.ts` functional test fix.
    - `LoginValidation.spec.ts` and `CustomerValidation.spec.ts` comprehensive coverage.
    - Validation of mandatory fields, format checks (Email, Phone, UEN, Postal Code), and error messages.
- **Out of Scope**:
    - Backend changes.
    - UI styling changes.

# Technical Design

### Current Implementation
- `CustomerPage.ts` contains a brittle locator for the billing address switch and a flaky contact person selection logic in the Address tab, causing timeouts.
- Validation tests are scattered across multiple files (`ComprehensiveValidation.spec.ts`, `LoginValidation.spec.ts`, etc.) and often fail due to visibility issues with Vuetify's dynamic error messages.

### Proposed Changes
- **Page Object Enhancements**:
    - Introduce `getFieldError(fieldName)` in `BasePage` (or specific pages) to centralize error message retrieval.
    - Use `click({ force: true })` or better targeting for Vuetify components like switches and dropdowns.
- **Validation Strategy**:
    - Use `toBeAttached()` for error message assertions to account for Vuetify's DOM behavior where messages might be hidden but present.
    - Consolidate all validation logic into two main files: `tests/login/LoginValidation.spec.ts` and `tests/customer/CustomerValidation.spec.ts`.
- **Reliability Fixes**:
    - Fix the "Contact Person" selection by waiting for the specific name to appear in the list or using a keyboard-based fallback if the list takes too long to populate.

### File Structure
- `pages/login/LoginPage.ts` (Modified: add validation helpers)
- `pages/customer/CustomerPage.ts` (Modified: fix locators and logic)
- `tests/login/LoginValidation.spec.ts` (Modified/New: consolidated login validations)
- `tests/customer/CustomerValidation.spec.ts` (Modified/New: consolidated customer validations)
- `tests/customer/CreateCustomer.spec.ts` (Modified: fix to use improved page methods)

# Testing

### Validation Approach
- Verify that clicking "Sign In" or "Save Customer" with empty fields triggers "required" messages.
- Verify that entering invalid data (e.g., `invalid-email`) triggers format error messages.
- Verify that numeric-only fields (Phone, Postal Code) correctly handle or reject non-numeric input.

### Key Scenarios
- **Login**:
    - Empty Email/Password.
    - Invalid Email format.
    - Valid credentials (success).
    - Invalid credentials (toast message).
- **Create Customer**:
    - Mandatory fields check (First Name, Company Name, etc.).
    - Email/Phone format validation.
    - UEN format validation.
    - Postal Code (SG 6-digit) validation.
    - Successful creation with unique data.

# Delivery Steps

### * Step 1: Fix Functional Flow and Page Object Reliability
Fix the logic in `CustomerPage.ts` and `LoginPage.ts` to ensure functional tests pass without timeouts.
- Improve `CustomerPage.fillCustomerForm` to handle contact person selection in the Address tab more reliably (using fallback or search).
- Refactor brittle locators (e.g., the billing address switch) in `CustomerPage.ts`.
- Update `LoginPage.ts` with more robust input locators.
- Verify `CreateCustomer.spec.ts` passes within a reasonable timeframe.

###   Step 2: Implement Comprehensive Validation Suite
Implement and consolidate all requested validation tests for Login and Customer sections.
- Update `LoginValidation.spec.ts` to cover empty fields, invalid email format, and incorrect credentials with resilient assertions (`toBeAttached`).
- Update `CustomerValidation.spec.ts` to cover mandatory fields, Email format, Phone format, UEN format, and Postal Code validation.
- Add helper methods to Page Objects for easier validation checking (e.g., `getErrorMessage(fieldName)`).
- Remove redundant/temporary test files to clean up the workspace.