---
name: write-playwright-spec
description: >
  Generate a runnable Playwright test spec against a playground practice, following the
  locator ladder and web-first assertions. Use when someone asks to "write a test for
  <practice>", wants an answer-key/solution spec, or needs to bootstrap the e2e test runner
  that this repo does not yet have.
---

# Write a Playwright spec for a practice

This repo is the **app under test**; it has no test runner yet. A learner's spec runs from
a Playwright project (either an `e2e/` folder added here, or a separate repo) pointed at the
dev server (http://localhost:3000) or the deployed GitHub Pages URL.

## If no runner exists yet (bootstrap once)

Only do this when the user asks to set up testing. Keep it isolated under `e2e/` and do not
disturb the app build:

1. `npm i -D @playwright/test` then `npx playwright install`.
2. Add `playwright.config.ts` with `use.baseURL = 'http://localhost:3000'` and a
   `webServer` that runs `npm run dev` (so `npx playwright test` starts the app itself).
3. Put specs in `e2e/`. Add an `e2e` script to `package.json` (`"e2e": "playwright test"`).

Confirm the plan with the user before installing packages.

## Writing the spec

1. Identify the practice and its target elements — read the practice component to get the
   real `data-testid`s, roles, and accessible names. Do not invent selectors.
2. Choose locators via the `locator-ladder` skill (role/label/text first).
3. Structure: one `test.describe` per practice, `beforeEach` navigating to the practice's
   hash URL, one `test` per behavior with a clear name.
4. Pair each action with a **web-first, auto-retrying** assertion of the outcome
   (`await expect(locator).toHaveText(...)`, `.toBeVisible()`, `.toBeChecked()`, `.toHaveValue()`).
5. No `waitForTimeout`. Trust auto-waiting; use `waitForURL`/`expect` polling for real signals.

## Example (Session 1 — Seat Booking)

```ts
import { test, expect } from '@playwright/test';

test.describe('Session 1 — Seat Booking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sessions/session-1-locators');
  });

  test('selecting a seat and agreeing enables Confirm', async ({ page }) => {
    await page.getByRole('button', { name: 'Seat 3C' }).click();
    await expect(page.getByTestId('seat-list')).toContainText('3C');

    await page.getByTestId('agree-checkbox').check();
    await expect(page.getByTestId('confirm-button')).toBeEnabled();
  });

  test('taken seats cannot be selected', async ({ page }) => {
    await expect(page.getByTestId('seat-5C')).toBeDisabled();
  });
});
```

Return the spec plus a one-line note on how to run it (`npx playwright test`).
