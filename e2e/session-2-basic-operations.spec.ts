import { test, expect } from "@playwright/test";

/**
 * Session 2 — Basic Operations — answer key (representative practices).
 *
 * Routing: the page uses a hash router (basic-operation-practice.tsx). On mount
 * it reads `window.location.hash` and also listens for `hashchange`, so a plain
 * `page.goto('.../session-2-basic-operations#2-1')` renders the right practice.
 * Each beforeEach waits for a practice-specific element before acting so we
 * never assert against the wrong (default) practice.
 *
 * All identities below are the REAL data-testids / labels authored in the
 * practices/ components — nothing is invented.
 */
const SESSION_2 = "/sessions/session-2-basic-operations";

test.describe("Session 2.1 — Click & Mouse Operations (#2-1)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${SESSION_2}#2-1`);
    await expect(page.getByTestId("status-text")).toBeVisible();
  });

  test("clicking Save updates the status", async ({ page }) => {
    await expect(page.getByTestId("status-text")).toHaveText("Idle");

    const save = page.getByRole("button", { name: "Save" });
    await expect(save).toBeEnabled();
    await save.click();

    await expect(page.getByTestId("status-text")).toHaveText("Saved");
  });

  test("double-clicking sets the double-saved status", async ({ page }) => {
    await page.getByTestId("btn-double").dblclick();
    await expect(page.getByTestId("status-text")).toHaveText("Double Saved");
  });

  test("hovering reveals the tooltip", async ({ page }) => {
    await expect(page.getByTestId("tooltip")).toBeHidden();
    await page.getByTestId("hover-target").hover();
    await expect(page.getByTestId("tooltip")).toBeVisible();
  });

  test("disabling the buttons makes Save non-clickable", async ({ page }) => {
    await page.getByTestId("toggle-enabled").uncheck();
    await expect(page.getByRole("button", { name: "Save" })).toBeDisabled();
    await expect(page.getByTestId("btn-double")).toBeDisabled();
  });
});

test.describe("Session 2.2 — Text Input & Keyboard (#2-2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${SESSION_2}#2-2`);
    await expect(page.getByTestId("input-username")).toBeVisible();
  });

  test("digits are blocked while typing the username and an error shows", async ({
    page,
  }) => {
    // The field blocks digits at `beforeinput`, so type char-by-char (a fast
    // fill() would be cancelled wholesale). Letters are accepted.
    const username = page.getByTestId("input-username");
    await username.pressSequentially("ab");
    await expect(username).toHaveValue("ab");

    // A digit is rejected: the value is unchanged and the error appears.
    await username.pressSequentially("1");
    await expect(username).toHaveValue("ab");
    await expect(page.getByTestId("username-digit-error")).toBeVisible();

    // Typing more letters keeps only the letters (digit was never inserted).
    await username.pressSequentially("cd");
    await expect(username).toHaveValue("abcd");
  });

  test("submitting an invalid form lists validation errors", async ({
    page,
  }) => {
    await page.getByTestId("input-password").fill("123");
    await page.getByTestId("btn-submit").click();
    await expect(page.getByTestId("validation-errors")).toBeVisible();
  });

  test("a valid form submitted with Enter succeeds", async ({ page }) => {
    await page.getByTestId("input-username").fill("JohnDoe");
    await page.getByTestId("input-password").fill("abc123");
    // Enter within the password field submits the form.
    await page.getByTestId("input-password").press("Enter");

    await expect(page.getByTestId("submit-success")).toBeVisible();
    await expect(page.getByTestId("input-username")).toHaveValue("JohnDoe");
    await expect(page.getByTestId("password-len")).toHaveText("6");
  });
});

test.describe("Session 2.5 — Select, Checkbox, Radio & Dropdown (#2-5)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${SESSION_2}#2-5`);
    await expect(page.getByTestId("select-seat-type")).toBeVisible();
  });

  test("native single select updates the observed value", async ({ page }) => {
    await page.getByTestId("select-seat-type").selectOption("vip");
    await expect(page.getByTestId("value-seatType")).toHaveText("vip");
  });

  test("checkbox toggles the meal state", async ({ page }) => {
    await expect(page.getByTestId("value-meal")).toHaveText("false");
    await page.getByTestId("checkbox-meal").check();
    await expect(page.getByTestId("checkbox-meal")).toBeChecked();
    await expect(page.getByTestId("value-meal")).toHaveText("true");
  });

  test("radio buttons switch the payment method", async ({ page }) => {
    await expect(page.getByTestId("radio-card")).toBeChecked();

    await page.getByTestId("radio-cash").check();
    await expect(page.getByTestId("radio-cash")).toBeChecked();
    await expect(page.getByTestId("radio-card")).not.toBeChecked();
    await expect(page.getByTestId("value-payment")).toHaveText("cash");
  });

  test("native multiple select records every chosen language", async ({
    page,
  }) => {
    await page.getByTestId("select-languages").selectOption(["ts", "python"]);
    await expect(page.getByTestId("value-languages")).toHaveText("ts, python");
  });

  test("custom multiple dropdown enforces the 3-tag maximum", async ({
    page,
  }) => {
    await page.getByTestId("dropdown-tags").click();
    await page.getByTestId("tag-QA").click();
    await page.getByTestId("tag-Playwright").click();
    await page.getByTestId("tag-API").click();
    await expect(page.getByTestId("value-tags")).toHaveText("QA, Playwright, API");

    // Once the max is reached the 4th option is disabled, so it cannot be added.
    await expect(page.getByTestId("tag-Performance")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    await expect(page.getByTestId("value-tags")).toHaveText("QA, Playwright, API");
  });
});
