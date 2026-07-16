import { test, expect } from "@playwright/test";

/**
 * Session 1 — Locator Finding (Seat Booking) — answer key.
 *
 * Selectors follow the locator ladder (role/label first, testid where the top
 * rungs are ambiguous) using the REAL identities authored in
 * src/app/sessions/session-1-locators/LocatorPlayground.tsx.
 */
test.describe("Session 1 — Seat Booking", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sessions/session-1-locators");
  });

  test("selecting a seat adds it to the seat list", async ({ page }) => {
    // No seats selected initially.
    await expect(page.getByText("No seats selected")).toBeVisible();

    await page.getByRole("button", { name: "Seat 3C" }).click();

    const seatList = page.getByTestId("seat-list");
    await expect(seatList).toBeVisible();
    await expect(seatList).toContainText("3C");
    // The seat button reflects its pressed state.
    await expect(page.getByRole("button", { name: "Seat 3C" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  test("clicking a selected seat again deselects it", async ({ page }) => {
    const seat = page.getByRole("button", { name: "Seat 2A" });
    await seat.click();
    await expect(page.getByTestId("seat-list")).toContainText("2A");

    await seat.click();
    await expect(seat).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByText("No seats selected")).toBeVisible();
  });

  test("taken seats are disabled and cannot be selected", async ({ page }) => {
    await expect(page.getByTestId("seat-5C")).toBeDisabled();
    await expect(page.getByTestId("seat-5D")).toBeDisabled();
  });

  test("Confirm is disabled until a seat is selected and I agree is checked", async ({
    page,
  }) => {
    const confirm = page.getByTestId("confirm-button");
    await expect(confirm).toBeDisabled();

    // Only agreeing (no seat) keeps it disabled.
    await page.getByTestId("agree-checkbox").check();
    await expect(page.getByTestId("agree-checkbox")).toBeChecked();
    await expect(confirm).toBeDisabled();

    // Selecting a seat while agreed enables Confirm.
    await page.getByRole("button", { name: "Seat 1A" }).click();
    await expect(confirm).toBeEnabled();
  });

  test("choosing a movie via its label updates the selection", async ({
    page,
  }) => {
    const movie = page.getByLabel("Movie");
    await expect(movie).toHaveValue("Interstellar");

    await movie.selectOption("Dune");
    await expect(movie).toHaveValue("Dune");
  });

  test("selecting seats updates the total", async ({ page }) => {
    const total = page.getByTestId("total-label");
    await expect(total).toHaveText("0");

    // basePrice 200 + 10% VAT => 220 for one seat.
    await page.getByRole("button", { name: "Seat 1A" }).click();
    await expect(total).toHaveText("220");

    // Two seats => 440.
    await page.getByRole("button", { name: "Seat 1B" }).click();
    await expect(total).toHaveText("440");
  });

  test("entering a redeem code applies a discount", async ({ page }) => {
    await page.getByRole("button", { name: "Seat 1A" }).click();
    await expect(page.getByTestId("discount-label")).toHaveText("0");

    await page.getByTestId("redeem-input").fill("SAVE50");
    await expect(page.getByTestId("discount-label")).toHaveText("50");
  });
});
