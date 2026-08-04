# Test Case Report - Validation Suite

## 1. Introduction
This document provides a detailed report of the automated test cases developed for the **Login** and **Customer Creation** validation scenarios using Playwright.

## 2. Test Environment
- **Base URL:** `https://stg-innoflex.businessthrust.com/admin/login`
- **Automation Tool:** Playwright
- **Language:** TypeScript
- **Browser:** Chromium

## 3. Test Summary
| Module | Total Tests | Passed | Failed | Success Rate |
| :--- | :--- | :--- | :--- | :--- |
| Login Validation | 3 | 3 | 0 | 100% |
| Customer Validation | 4 | 4 | 0 | 100% |
| **Total** | **7** | **7** | **0** | **100%** |

---

## 4. Detailed Test Cases

### 4.1 Login Validation (`tests/login/LoginValidation.spec.ts`)

| TC ID | Test Case Description | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| LVAL-01 | Verify validation messages for empty fields | 1. Navigate to Login Page<br>2. Fill and clear Email<br>3. Fill and clear Password | "Email is required" and "Password is required" messages appear. | PASS |
| LVAL-02 | Verify validation for invalid email format | 1. Enter "invalid-email"<br>2. Click on Password field | "Email must be valid" message appears. | PASS |
| LVAL-03 | Verify error for invalid credentials | 1. Enter wrong email/password<br>2. Click "Sign In" | Error indicator (snackbar/alert) appears. | PASS |

### 4.2 Customer Validation (`tests/customer/CustomerValidation.spec.ts`)

| TC ID | Test Case Description | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| CVAL-01 | Mandatory fields validation | 1. Navigate to Create Customer<br>2. Fill and clear mandatory fields | Required field validation messages are triggered (e.g., "First name is required"). | PASS |
| CVAL-02 | Invalid email format | 1. Enter invalid email in Customer form<br>2. Blur field | "Email must be valid" message appears. | PASS |
| CVAL-03 | Field length limits (Customer Code) | 1. Enter > 20 characters in Customer Code | Input is truncated to 20 characters (or error shows). | PASS |
| CVAL-04 | Numeric fields constraint | 1. Enter alphabets in Phone Number field | Field rejects non-numeric characters or clears them. | PASS |

---

## 5. Execution Instructions

### Running the tests
To execute these specific validation tests, run the following command in the terminal:
```bash
npx playwright test tests/login/LoginValidation.spec.ts tests/customer/CustomerValidation.spec.ts
```

### Viewing the HTML Report
Playwright generates a detailed HTML report for every run. To open the last report, use:
```bash
npx playwright show-report
```
The report includes:
- Execution time for each step.
- Screenshots (if configured).
- Detailed error logs and traces.

---
*Report generated on: 2026-07-24*
