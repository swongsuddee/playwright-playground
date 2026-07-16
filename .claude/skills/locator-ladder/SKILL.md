---
name: locator-ladder
description: >
  The locator strategy reference for this playground: the priority ladder (role -> label
  -> text -> testid -> css -> xpath), how to narrow with filter/chaining/nth, and the
  brittle patterns to avoid. Use whenever choosing selectors for a LocatorHint, teaching
  locator finding, reviewing a spec's selectors, or answering "what's the best locator".
---

# Locator ladder

Robust locators describe an element the way a user (or the accessibility tree) sees it, not
where it sits in the DOM. Prefer the highest rung that unambiguously identifies the element.

| Rung | Locator | Use when | Example |
|---|---|---|---|
| 1 | `getByRole(role, { name })` | Almost always — buttons, links, headings, inputs, checkboxes | `getByRole('button', { name: 'Save' })` |
| 2 | `getByLabel(text)` | Form control tied to a `<label>` | `getByLabel('Movie')` |
| 3 | `getByPlaceholder` / `getByText` / `getByAltText` / `getByTitle` | Placeholder-only inputs, static copy, images | `getByPlaceholder('e.g. SAVE50')` |
| 4 | `getByTestId('id')` | The above are impossible/ambiguous; needs `data-testid` | `getByTestId('total-label')` |
| 5 | `locator('css')` | Structural scoping/chaining, or no semantic handle exists | `locator('[data-seat="5C"]')` |
| 6 | XPath | Last resort; teach recognition, discourage in real tests | `//button[@aria-label="Seat 5C"]` |

## Narrowing (when a rung matches many elements)

- `.filter({ hasText: 'VAT' })` — keep matches containing text.
- `.filter({ has: page.getByRole('button') })` — keep matches that contain another element.
- Chaining / scoping — `page.getByTestId('seat-list').getByRole('listitem')`.
- `getByRole` options — `{ exact: true }`, `{ level: 2 }` (headings), `{ checked: true }`,
  `{ pressed: true }`, `{ disabled: false }`.
- `.first()` / `.last()` / `.nth(i)` — use only when order is the actual identity
  (e.g. carousel slides). If a semantic name exists, index is a smell.

## Avoid (brittle — these break on harmless refactors)

- Auto-generated / hashed class names (`.css-1a2b3c`, Tailwind chains).
- Deep structural CSS (`div > div:nth-child(3) > span`).
- Absolute XPath (`/html/body/div[2]/...`).
- Locating by text that will be translated or is likely to be reworded.
- Index-based selection when a stable name/role/testid is available.

## In this repo

The playground's UI is authored so the top rungs work: elements carry `role`,
`aria-label`/visible text, `<label for>`, and `data-testid`. When you write a `LocatorHint`,
order `selectors` best-first and include one lower-rung example so learners can compare
robustness. Official docs: https://playwright.dev/docs/locators ·
https://playwright.dev/docs/other-locators · https://playwright.dev/docs/best-practices
