"use client";

import { useEffect, useRef, useState } from "react";
import type { LocatorHint } from "@/components/types";
import { CodeBox, PracticeTitle } from "./PracticeShared";

/**
 * Practice: Web-first, auto-retrying assertions.
 *
 * Every family below pairs an interactive element (stable data-testid +
 * accessible name + role) with the `await expect(locator).toXxx()` assertion
 * that verifies its state. The delayed banner is the key teaching moment:
 * `toBeVisible()` auto-retries until the element appears, so you never need
 * `waitForTimeout`.
 */
export function PracticeAssertions({
  onHoverHint,
}: {
  onHoverHint: (h: LocatorHint | null) => void;
}) {
  // toHaveText / toContainText
  const [status, setStatus] = useState<"Idle" | "Ready">("Idle");

  // toBeVisible / toBeHidden (appears after a delay -> auto-retry demo)
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // toBeChecked + toBeEnabled / toBeDisabled
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // toHaveValue
  const [coupon, setCoupon] = useState("");

  // toHaveCount
  const [items, setItems] = useState<string[]>(["Item 1", "Item 2"]);

  // Clean up any pending banner timer on unmount.
  useEffect(() => {
    return () => {
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
  }, []);

  const loadBanner = () => {
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    setBannerVisible(false);
    setBannerLoading(true);
    // Deliberate ~800ms delay so the banner is NOT present when the click
    // resolves. Auto-retrying assertions wait it out; waitForTimeout guesses.
    bannerTimer.current = setTimeout(() => {
      setBannerVisible(true);
      setBannerLoading(false);
    }, 800);
  };

  const dismissBanner = () => {
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    setBannerVisible(false);
    setBannerLoading(false);
  };

  const addItem = () => setItems((prev) => [...prev, `Item ${prev.length + 1}`]);
  const removeItem = () => setItems((prev) => prev.slice(0, -1));

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Web-first Assertions (auto-retry)"
        goal="Goal: trigger each state → verify it with an auto-retrying await expect(locator).toXxx() assertion. No waitForTimeout."
      />

      {/* ============ toHaveText / toContainText ============ */}
      <div className="card" style={{ padding: 12 }}>
        <div className="small" style={{ fontWeight: 900, marginBottom: 8 }}>
          1 · toHaveText / toContainText
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            data-testid="refresh-status"
            aria-label="Refresh status"
            className="btnPrimary"
            onClick={() => setStatus("Ready")}
            onMouseEnter={() =>
              onHoverHint({
                id: "refresh-status",
                title: "Refresh status button",
                description: "Click to change the status text to 'Status: Ready'.",
                purpose:
                  "Prefer role + accessible name; the test id is the stable fallback.",
                selectors: [
                  "page.getByRole('button', { name: 'Refresh status' })",
                  "page.getByTestId('refresh-status')",
                ],
                actions: ["click()", "then assert status text"],
                docsUrl:
                  "https://playwright.dev/docs/test-assertions#locator-assertions-to-have-text",
                target: "refresh-status",
              })
            }
            onMouseLeave={() => onHoverHint(null)}
          >
            Refresh status
          </button>

          <div
            data-testid="status-text"
            role="status"
            aria-live="polite"
            onMouseEnter={() =>
              onHoverHint({
                id: "status-text",
                title: "Status text (live region)",
                description:
                  "toHaveText matches the full string; toContainText matches a substring.",
                purpose:
                  "Assert visible copy the user reads. Web-first, so it retries until the text updates.",
                selectors: [
                  "page.getByRole('status')",
                  "page.getByTestId('status-text')",
                ],
                actions: [
                  "toHaveText('Status: Ready')",
                  "toContainText('Ready')",
                ],
                docsUrl:
                  "https://playwright.dev/docs/test-assertions#locator-assertions-to-contain-text",
                target: "status-text",
              })
            }
            onMouseLeave={() => onHoverHint(null)}
            style={{ fontWeight: 900, fontSize: 16 }}
          >
            {`Status: ${status}`}
          </div>
        </div>
      </div>

      {/* ============ toBeVisible / toBeHidden (delay -> auto-retry) ============ */}
      <div className="card" style={{ padding: 12 }}>
        <div className="small" style={{ fontWeight: 900, marginBottom: 8 }}>
          2 · toBeVisible / toBeHidden — appears after ~800ms (auto-retry)
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            data-testid="load-banner"
            aria-label="Load banner"
            className="btnPrimary"
            onClick={loadBanner}
            onMouseEnter={() =>
              onHoverHint({
                id: "load-banner",
                title: "Load banner button",
                description:
                  "Click, then the banner appears ~800ms later. toBeVisible() retries until it does.",
                purpose:
                  "The teaching moment: assert on the outcome, not on a timer. No waitForTimeout needed.",
                selectors: [
                  "page.getByRole('button', { name: 'Load banner' })",
                  "page.getByTestId('load-banner')",
                ],
                actions: ["click()", "then toBeVisible() on the banner"],
                docsUrl:
                  "https://playwright.dev/docs/test-assertions#locator-assertions-to-be-visible",
                target: "load-banner",
              })
            }
            onMouseLeave={() => onHoverHint(null)}
          >
            Load banner
          </button>

          <button
            data-testid="dismiss-banner"
            aria-label="Dismiss banner"
            className="btnSecondary"
            disabled={!bannerVisible}
            style={{ opacity: bannerVisible ? 1 : 0.5 }}
            onClick={dismissBanner}
            onMouseEnter={() =>
              onHoverHint({
                id: "dismiss-banner",
                title: "Dismiss banner button",
                description: "Hides the banner so you can assert toBeHidden().",
                purpose:
                  "toBeHidden() passes when the element is detached OR not visible.",
                selectors: [
                  "page.getByRole('button', { name: 'Dismiss banner' })",
                  "page.getByTestId('dismiss-banner')",
                ],
                actions: ["click()", "then toBeHidden() on the banner"],
                docsUrl:
                  "https://playwright.dev/docs/test-assertions#locator-assertions-to-be-hidden",
                target: "dismiss-banner",
              })
            }
            onMouseLeave={() => onHoverHint(null)}
          >
            Dismiss banner
          </button>

          {bannerLoading ? (
            <span data-testid="banner-loading" className="small" role="status" aria-live="polite">
              Loading…
            </span>
          ) : null}
        </div>

        {bannerVisible ? (
          <div
            data-testid="delayed-banner"
            role="alert"
            aria-label="Delayed banner"
            data-state="loaded"
            onMouseEnter={() =>
              onHoverHint({
                id: "delayed-banner",
                title: "Delayed banner (role=alert)",
                description:
                  "Rendered only after the delay. Auto-retry makes the assertion wait for it.",
                purpose:
                  "await expect(locator).toBeVisible() polls until visible or the timeout — deterministic, no fixed sleep.",
                selectors: [
                  "page.getByRole('alert')",
                  "page.getByTestId('delayed-banner')",
                ],
                actions: [
                  "toBeVisible()",
                  "toHaveAttribute('data-state', 'loaded')",
                ],
                docsUrl:
                  "https://playwright.dev/docs/test-assertions#locator-assertions-to-be-visible",
                target: "delayed-banner",
              })
            }
            onMouseLeave={() => onHoverHint(null)}
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 12,
              border: "1px solid var(--success-border)",
              background: "var(--success-soft)",
              fontWeight: 800,
            }}
          >
            Banner loaded ✅
          </div>
        ) : null}
      </div>

      {/* ============ toBeChecked + toBeEnabled / toBeDisabled ============ */}
      <div className="card" style={{ padding: 12 }}>
        <div className="small" style={{ fontWeight: 900, marginBottom: 8 }}>
          3 · toBeChecked · toBeEnabled / toBeDisabled
        </div>
        <div className="stack" style={{ gap: 10 }}>
          <label className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              data-testid="accept-terms"
              type="checkbox"
              aria-label="I accept the terms"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                setSubmitted(false);
              }}
              onMouseEnter={() =>
                onHoverHint({
                  id: "accept-terms",
                  title: "Accept terms checkbox",
                  description:
                    "Check it to enable Submit. toBeChecked() asserts the checked state.",
                  purpose:
                    "Assert state, not the click. toBeChecked() reads the element's checked property.",
                  selectors: [
                    "page.getByRole('checkbox', { name: 'I accept the terms' })",
                    "page.getByTestId('accept-terms')",
                  ],
                  actions: ["check()", "toBeChecked()", "not.toBeChecked()"],
                  docsUrl:
                    "https://playwright.dev/docs/test-assertions#locator-assertions-to-be-checked",
                  target: "accept-terms",
                })
              }
              onMouseLeave={() => onHoverHint(null)}
            />
            I accept the terms
          </label>

          <button
            data-testid="submit-order"
            aria-label="Submit order"
            className="btnPrimary"
            disabled={!accepted}
            style={{ opacity: accepted ? 1 : 0.5, alignSelf: "flex-start" }}
            onClick={() => setSubmitted(true)}
            onMouseEnter={() =>
              onHoverHint({
                id: "submit-order",
                title: "Submit order button (gated)",
                description:
                  "Disabled until the checkbox is checked. Assert toBeDisabled() then toBeEnabled().",
                purpose:
                  "Enabled/disabled is a state assertion — verify the gate instead of clicking blindly.",
                selectors: [
                  "page.getByRole('button', { name: 'Submit order' })",
                  "page.getByTestId('submit-order')",
                ],
                actions: ["toBeDisabled()", "toBeEnabled()", "click()"],
                docsUrl:
                  "https://playwright.dev/docs/test-assertions#locator-assertions-to-be-enabled",
                target: "submit-order",
              })
            }
            onMouseLeave={() => onHoverHint(null)}
          >
            Submit order
          </button>

          {submitted ? (
            <div data-testid="order-result" role="status" className="small" style={{ fontWeight: 900 }}>
              Order submitted ✅
            </div>
          ) : null}
        </div>
      </div>

      {/* ============ toHaveValue ============ */}
      <div className="card" style={{ padding: 12 }}>
        <div className="small" style={{ fontWeight: 900, marginBottom: 8 }}>
          4 · toHaveValue
        </div>
        <label className="small" htmlFor="coupon-input">
          Coupon code
        </label>
        <input
          id="coupon-input"
          data-testid="coupon-input"
          className="input"
          value={coupon}
          placeholder="e.g. SAVE50"
          onChange={(e) => setCoupon(e.target.value)}
          onMouseEnter={() =>
            onHoverHint({
              id: "coupon-input",
              title: "Coupon input",
              description: "Type a value, then assert toHaveValue() reads it back.",
              purpose:
                "toHaveValue() reads the input's current value — the reliable way to verify what was typed.",
              selectors: [
                "page.getByLabel('Coupon code')",
                "page.getByPlaceholder('e.g. SAVE50')",
                "page.getByTestId('coupon-input')",
              ],
              actions: ["fill('SAVE50')", "toHaveValue('SAVE50')"],
              docsUrl:
                "https://playwright.dev/docs/test-assertions#locator-assertions-to-have-value",
              target: "coupon-input",
            })
          }
          onMouseLeave={() => onHoverHint(null)}
          style={{ marginTop: 6, maxWidth: 260 }}
        />
      </div>

      {/* ============ toHaveCount ============ */}
      <div className="card" style={{ padding: 12 }}>
        <div className="small" style={{ fontWeight: 900, marginBottom: 8 }}>
          5 · toHaveCount
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            data-testid="add-item"
            aria-label="Add item"
            className="btnPrimary"
            onClick={addItem}
            onMouseEnter={() =>
              onHoverHint({
                id: "add-item",
                title: "Add item button",
                description: "Appends a list item. Assert the new toHaveCount().",
                purpose: "Prefer role + accessible name for controls.",
                selectors: [
                  "page.getByRole('button', { name: 'Add item' })",
                  "page.getByTestId('add-item')",
                ],
                actions: ["click()", "then toHaveCount(n) on the items"],
                docsUrl:
                  "https://playwright.dev/docs/test-assertions#locator-assertions-to-have-count",
                target: "add-item",
              })
            }
            onMouseLeave={() => onHoverHint(null)}
          >
            Add item
          </button>
          <button
            data-testid="remove-item"
            aria-label="Remove item"
            className="btnSecondary"
            disabled={items.length === 0}
            style={{ opacity: items.length === 0 ? 0.5 : 1 }}
            onClick={removeItem}
            onMouseEnter={() =>
              onHoverHint({
                id: "remove-item",
                title: "Remove item button",
                description: "Removes the last list item. Assert the reduced toHaveCount().",
                purpose: "Prefer role + accessible name for controls.",
                selectors: [
                  "page.getByRole('button', { name: 'Remove item' })",
                  "page.getByTestId('remove-item')",
                ],
                actions: ["click()", "then toHaveCount(n) on the items"],
                docsUrl:
                  "https://playwright.dev/docs/test-assertions#locator-assertions-to-have-count",
                target: "remove-item",
              })
            }
            onMouseLeave={() => onHoverHint(null)}
          >
            Remove item
          </button>
          <span
            data-testid="item-count"
            className="small"
            style={{ fontWeight: 900 }}
          >
            {`${items.length} items`}
          </span>
        </div>

        <ul
          data-testid="item-list"
          onMouseEnter={() =>
            onHoverHint({
              id: "item-list",
              title: "Item list",
              description:
                "toHaveCount() asserts how many elements a locator resolves to — it retries as items are added/removed.",
              purpose:
                "Scope to the list, then count its rows by role. Count assertions auto-retry like the rest.",
              selectors: [
                "page.getByTestId('item-list').getByRole('listitem')",
                "page.getByRole('list').getByRole('listitem')",
              ],
              actions: ["toHaveCount(3)", "not.toHaveCount(0)"],
              docsUrl:
                "https://playwright.dev/docs/test-assertions#locator-assertions-to-have-count",
              target: "item-list",
            })
          }
          onMouseLeave={() => onHoverHint(null)}
          style={{ marginTop: 10, paddingLeft: 18 }}
        >
          {items.map((label) => (
            <li key={label} className="small" style={{ fontWeight: 700 }}>
              {label}
            </li>
          ))}
        </ul>
      </div>

      {/* ============ toHaveAttribute + .not (bonus) ============ */}
      <div className="card" style={{ padding: 12 }}>
        <div className="small" style={{ fontWeight: 900, marginBottom: 8 }}>
          6 · toHaveAttribute + .not (bonus)
        </div>
        <a
          data-testid="assertions-docs-link"
          href="https://playwright.dev/docs/test-assertions"
          target="_self"
          rel="noreferrer"
          onMouseEnter={() =>
            onHoverHint({
              id: "assertions-docs-link",
              title: "Assertions docs link",
              description:
                "Assert an attribute value, or use .not to assert it is absent / different.",
              purpose:
                "toHaveAttribute() checks a DOM attribute; .not negates any web-first assertion (still auto-retrying).",
              selectors: [
                "page.getByRole('link', { name: 'Assertions docs' })",
                "page.getByTestId('assertions-docs-link')",
              ],
              actions: [
                "toHaveAttribute('href', /test-assertions/)",
                "not.toHaveAttribute('target', '_blank')",
              ],
              docsUrl:
                "https://playwright.dev/docs/test-assertions#locator-assertions-to-have-attribute",
              target: "assertions-docs-link",
            })
          }
          onMouseLeave={() => onHoverHint(null)}
          style={{ fontWeight: 800 }}
        >
          Assertions docs
        </a>
      </div>

      <CodeBox
        code={`// 1) Text — full match vs substring
await page.getByRole('button', { name: 'Refresh status' }).click();
await expect(page.getByTestId('status-text')).toHaveText('Status: Ready');
await expect(page.getByTestId('status-text')).toContainText('Ready');

// 2) Visibility — the banner appears ~800ms AFTER the click.
//    ✅ Web-first: the assertion auto-retries until it is visible.
await page.getByRole('button', { name: 'Load banner' }).click();
await expect(page.getByTestId('delayed-banner')).toBeVisible();
//    ❌ Anti-pattern: guessing a fixed delay is flaky and slow.
//    await page.waitForTimeout(800); // never do this
await page.getByRole('button', { name: 'Dismiss banner' }).click();
await expect(page.getByTestId('delayed-banner')).toBeHidden();

// 3) Checked + enabled/disabled gate
await expect(page.getByTestId('submit-order')).toBeDisabled();
await page.getByRole('checkbox', { name: 'I accept the terms' }).check();
await expect(page.getByTestId('accept-terms')).toBeChecked();
await expect(page.getByTestId('submit-order')).toBeEnabled();

// 4) Input value
await page.getByLabel('Coupon code').fill('SAVE50');
await expect(page.getByTestId('coupon-input')).toHaveValue('SAVE50');

// 5) Count (auto-retries as items change)
const items = page.getByTestId('item-list').getByRole('listitem');
await page.getByRole('button', { name: 'Add item' }).click();
await expect(items).toHaveCount(3);

// 6) Attribute + .not
const link = page.getByTestId('assertions-docs-link');
await expect(link).toHaveAttribute('href', /test-assertions/);
await expect(link).not.toHaveAttribute('target', '_blank');`}
      />
    </div>
  );
}
