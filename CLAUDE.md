# Playwright Playground — Project Guide

A **static training app for QA engineers** to practice (1) finding stable element
locators and (2) writing Playwright automation. It is the *application under test* —
learners interact with realistic UI here, inspect the suggested locators, then write
Playwright scripts against it.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** (via `@tailwindcss/postcss`) — but most styling uses hand-written
  utility classes in `src/app/globals.css` (e.g. `panel`, `card`, `btnPrimary`, `stack`,
  `h1`, `small`, `code`) plus inline `style={{}}`.
- Static export deployed to **GitHub Pages** (`npm run build:gh`, workflow in
  `.github/workflows/static.yml`). Base path is `/playwright-playground` in prod.

## Commands

> **Node ≥ 20.9 required** (Next 16). If the default `node` is 18, use nvm:
> `export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"` before build/dev.

- `npm run dev` — local dev server at http://localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint (`eslint-config-next`)
- `npm run build:gh` — build with the GitHub Pages base path

There is currently **no Playwright test runner** in this repo (no `@playwright/test`,
no `playwright.config.ts`, no `e2e/`). See `docs/PRACTICE_PLAN.md` for the plan to add one.

## Architecture

```
src/
  app/
    layout.tsx                 # RootLayout -> AppShell
    page.tsx                   # Landing (Sidebar + HomeContent + empty InspectorPanel)
    sessions/
      page.tsx
      session-1-locators/      # Session 1 — Locator Finding (Seat Booking)
      session-2-basic-operations/
        session2-client.tsx    # 3-col layout wrapper, owns `hint` state
        basic-operation-practice.tsx  # hash router -> renders one Practice2x
        practices/             # Practice21..27, upload/download/scroll/colossal, index.ts
  components/
    layout/
      AppShell.tsx             # appRoot > topBar + appGrid
      Sidebar.tsx              # left nav; `sessions[]` array drives it (hash children)
      InspectorPanel.tsx       # right panel; renders a LocatorHint
    types.ts                   # LocatorHint type
```

### The 3-column layout

Every session page renders `<main className="container">` with three children:
`<Sidebar />` (left, 280px) · the practice panel (center, `1fr`) · `<InspectorPanel />`
(right, 360px). The center panel owns a `useState<LocatorHint | null>` and passes a
`setHint` callback down as `onHoverHint`.

### The `LocatorHint` contract (the core teaching mechanism)

Defined in `src/components/types.ts`:

```ts
type LocatorHint = {
  id: string;          // short slug, e.g. "seat-5C" (shown as a badge)
  title: string;       // headline in the inspector
  description?: string;
  selectors: string[]; // Playwright/CSS/XPath examples, best-first
  purpose: string;     // why/when to use this locator
  actions: string[];   // things the learner can do/assert
  docsUrl: string;     // official Playwright docs link
  target: string;      // the element's data-testid (or "")
};
```

Interactive elements call `onHoverHint(hint)` on `onMouseEnter` and `onHoverHint(null)`
on `onMouseLeave`. The `InspectorPanel` renders whatever hint is currently set (or an
empty default). **This hover→inspect loop is the product** — keep it working when adding UI.

### Conventions for authored UI (important)

- Give every interactive element a **stable, testable identity**: `data-testid`, an
  accessible name (`aria-label` or visible text), and correct `role`. This is what
  learners practice locating — sloppy markup defeats the purpose.
- Follow the **locator priority ladder** in each hint's `selectors`, best first:
  `getByRole` → `getByLabel` → `getByPlaceholder`/`getByText` → `getByTestId` → CSS → XPath.
- Every practice pairs an **action with an assertion**. Use the `CodeBox` shared
  component to show the expected Playwright assertion (`PracticeShared.tsx`).
- Reuse `PracticeTitle` + `CodeBox` from
  `src/app/sessions/session-2-basic-operations/practices/PracticeShared.tsx`.

### Adding a practice (Session 2 pattern)

Wiring a new sub-practice currently touches **four** places:
1. Create `practices/PracticeXX.tsx` (export a named component taking `{ onHoverHint }`).
2. Re-export it from `practices/index.ts`.
3. Add its hash key to the `TopicKey` union + `allowed[]` + render branch in
   `basic-operation-practice.tsx`.
4. Add a `children` entry (title + `#hash`) under Session 2 in `Sidebar.tsx`.

> This manual four-touch wiring is fragile as content grows; `docs/PRACTICE_PLAN.md`
> proposes a single registry to drive it. Use the `new-practice` skill to do it consistently.

## Tooling for this repo (`.claude/`)

- **Agents**: `practice-author` (build/edit practices), `locator-coach` (recommend the
  best locator + rationale), `test-reviewer` (grade a learner's Playwright spec).
- **Skills**: `new-practice` (scaffold + wire a practice), `locator-ladder` (the locator
  strategy reference), `write-playwright-spec` (generate a runnable spec for a practice).
