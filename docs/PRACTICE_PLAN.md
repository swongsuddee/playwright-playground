# Practice Content Plan

Status: **draft for discussion** · Last updated: 2026-07-13

This plan expands the playground from "Playwright actions + locators" toward a full
learning path for QA engineers, and fills the gaps in Playwright feature coverage. It
reworks the proposed `lv.1–lv.7` outline; see **Comments & suggestions** at the end for the
reasoning behind each change.

---

## Where we are today

- **Session 1 — Locator Finding** (Seat Booking) — hover-to-inspect locator hints. ✅
- **Session 2 — Basic Operations** — 11 sub-practices: click/mouse, keyboard, read text,
  element state, select/checkbox/radio, date picker, custom toggle, upload, download,
  scroll-into-view, carousel. ✅
- **Sessions 3–5** — API basics / POM / Custom UI — stubbed "coming soon".
- **No Playwright test runner** — learners can inspect locators but can't yet *run* a spec
  in-repo.

**Two gaps drive this plan:** (1) Playwright coverage is narrow (locators + basic actions;
no assertions/waiting/network/tracing/config practice), and (2) there's no loop that lets a
learner actually *write and run* a test.

---

## Proposed structure — two tracks

The proposed `lv.1–4` teaches programming from scratch; `lv.5–7` teaches web testing.
Those are two different products for two different learners. Split them so someone who can
already code can jump straight to Track B.

### Track A — Foundations (optional, for non-coders)

| Lv | Module | Goal | Notes vs. original |
|----|--------|------|--------------------|
| A1 | **Code blocks (Scratch)** ✅ *built* | Sequence, loops, conditionals as blocks | Shipped as a multi-page session under `/foundations/a1-code-blocks`: overview + 4 concept lessons + 5 one-per-page Scratch practices + a **Maze Challenge** mouse game. Sends learners to the real MIT Scratch editor; each page has a contextual "Scratch companion" rail (launcher + objective + checkpoint) and prev/next nav |
| A2 | **Flow diagrams** ✅ *built* | Read/build flowcharts for simple logic | `/foundations/a2-flow-diagrams` — shapes legend + worked example + interactive **flowchart tracer** (walk the path, branch at the decision) |
| A3 | **Problem decomposition** ✅ *built* | Turn a real-world case → steps → flow diagram | `/foundations/a3-decomposition` — the 4-step method + **order-the-steps** practice (3 scenarios, graded) that reveals the ordered flow |
| A4 | **Programming languages** ✅ *built* | Same logic in **Python / TypeScript / Java** | `/foundations/a4-languages` — 3-language tabs + a Python-Tutor-style **step-through visualizer** (line highlight + variables + output). Dropped C/C++ (no Playwright binding) |

### Track B — Web Testing with Playwright (core)

| Lv | Module | Goal |
|----|--------|------|
| B0 | **SDLC & test levels** (orientation) | Where E2E fits vs unit/integration; when to automate |
| B1 | **HTML, CSS & the DOM** | How the page is structured; what a selector selects |
| B2 | **Locators** | XPath vs CSS vs Playwright `getBy*`; the priority ladder |
| B3 | **Actions** | click/fill/press/hover/select/check/upload/download/drag |
| B4 | **Assertions** | web-first, auto-retrying `expect`; state vs value assertions |
| B5 | **Waiting & actionability** | auto-wait, `waitForURL`/`waitForResponse`, expect polling |
| B6 | **Handling the tricky bits** | dialogs, new tabs/popups, iframes, shadow DOM |
| B7 | **Network** | intercept/mock with `route`, API testing with the `request` fixture |
| B8 | **Structure & POM** | fixtures, `describe`/hooks, Page Object Model, data-driven |
| B9 | **Config & tooling** | projects, retries, trace/video/screenshot, codegen, trace viewer, UI mode |

> B0/B1 map to the original `lv.6`/`lv.5` but are re-sequenced: SDLC context first as
> orientation, then DOM before locators (you can't locate what you can't read), then the
> Playwright ladder. B3–B9 replace/expand the single "lv.7 actions & assertions."

---

## Playwright coverage gap analysis

The current app covers the **bold-done** items. Everything else is a candidate practice.

- **Locators** — ✅ role/label/testid/text/css/xpath (Session 1). ➕ add: filtering
  (`.filter`), chaining/scoping, `getByRole` options, `.nth()`, frames, shadow DOM.
- **Actions** — ✅ click/dblclick/hover, fill/type/press, select/check/radio, upload,
  download, scroll. ➕ add: **drag-and-drop**, right-click/context menu, keyboard shortcuts
  & modifiers, clipboard.
- **Assertions** — ⚠️ only shown as read-only `CodeBox` snippets, never *practiced*. ➕ add
  a dedicated module: `toHaveText/toHaveValue/toBeVisible/toBeChecked/toHaveCount/
  toHaveAttribute/toHaveScreenshot`, soft assertions, `not`.
- **Waiting** — ❌ none. ➕ add: auto-wait demo, `waitForURL`, `waitForResponse`, delayed/
  async UI that teaches why hard waits are wrong.
- **Dialogs / tabs / iframes** — ❌ none. ➕ add: `window.alert/confirm/prompt`, target=_blank
  popups, an `<iframe>` practice, native `<dialog>`.
- **Network / API** — ❌ (Session 3 stub). ➕ add: a page that fetches JSON so learners
  practice `page.route()` mocking and `request` fixture API tests.
- **POM / fixtures** — ❌ (Session 4 stub). ➕ add once the e2e runner exists.
- **Config / tracing / debugging** — ❌ none. ➕ add a "tooling" module (codegen, trace
  viewer, UI mode, retries, screenshots-on-failure) — mostly docs + guided screenshots.
- **Emulation / a11y / visual** — ❌ none. ➕ stretch: viewport/mobile emulation,
  `toHaveScreenshot`, accessibility snapshot.

---

## Signature features to build

1. **Interactive locator challenge (highest value, ties Track B2 together).**
   Hide the answer; let the learner type a selector and validate it live against the DOM:
   - CSS → `document.querySelectorAll(input)`; XPath → `document.evaluate(...)`.
   - Highlight matched elements and show the match count ("1 match ✅" / "3 matches — too
     broad"). This is fully client-side and makes locator finding a *game*, not a reading
     exercise. Playwright `getBy*` can be approximated by mapping to role/label queries or
     by explaining the equivalent.

2. **Add an `e2e/` Playwright runner + answer keys.**
   Closes the loop: interact → inspect → write spec → run → assert. Ship a solution spec per
   practice behind a "reveal solution" toggle. Config uses `webServer: npm run dev` and
   `baseURL`, so `npx playwright test` boots the app itself. (See the `write-playwright-spec`
   skill.)

3. **Practice registry (refactor, do before adding many practices).**
   Replace the four-touch manual wiring (component → `index.ts` → hash union/branch →
   sidebar) with one array of `{ key, level, title, hash, component }` that drives the
   sidebar, the hash router, and progress. Adding a practice becomes one entry, and the
   `new-practice` skill/agent becomes deterministic.

4. **Code-execution visualization (Track A4, the `staging.fun`/Python Tutor idea).**
   Two options: (a) embed / link **pythontutor.com** (supports Python, JS, C++, Java — fast
   to ship, external dependency, won't work in the static export offline); or (b) build a
   small in-house stepper (highlight current line + a variables table) for a constrained
   snippet subset. Recommend starting with (a) for reach, (b) later for the 3–4 canonical
   examples.

5. **Progress tracking (optional).**
   Per-practice objectives ("select seat 3C", "assert Confirm enabled") checked off in
   `localStorage`, with a level/track progress bar. Reinforces the leveled structure.

---

## Comments & suggestions on the proposed lv.1–7

1. **Split fundamentals from Playwright.** `lv.1–4` (blocks → flow → decomposition →
   language) is essentially a "learn to program" course; `lv.5–7` is the QA/Playwright core.
   Bundling them makes one huge product and buries the part most QA joined for. Two tracks
   with a "skip A if you can code" gate serves both audiences.

2. **Drop C/C++ from the language comparison (lv.4).** Playwright's official bindings are
   **TypeScript/JS, Python, Java, .NET — not C/C++**. If the point is general "how code
   works," C/C++ is fine but it's a dead end for this playground's goal. Use **TypeScript
   (recommended) + Python**, optionally Java, so the comparison flows straight into Track B.

3. **Re-sequence lv.5/lv.6.** SDLC & test levels (lv.6) is *orientation* — it answers "why
   automate / where does E2E fit," so it reads better **before** the hands-on Playwright
   work, not after. And DOM/CSS (part of lv.5) should come **before** locators, because you
   can't locate what you can't read.

4. **lv.7 is too big as one level.** "Actions and assertions" is really 6+ modules once you
   add assertions-as-practice, waiting, dialogs/tabs/iframes, network, POM, and tooling
   (see the gap analysis). Break it out so each Playwright concept gets its own practice.

5. **Make assertions a first-class practice, not a `CodeBox`.** Today assertions are shown
   as static snippets. Learners should *run* `expect` and see pass/fail — this is the single
   biggest coverage gap relative to the stated "focus on actions and locators."

6. **Add the test runner early.** Everything above is more convincing if the learner can
   actually execute a spec. The `e2e/` project + per-practice answer keys is the backbone.

7. **Refactor the wiring before scaling content.** The manual four-touch pattern will not
   survive going from ~11 practices to 40+. The registry (feature #3) pays for itself fast.

8. **The `staging.fun`-style visualizer is a real build.** Ship the embed first; treat the
   in-house stepper as a later enhancement for a few canonical snippets, not a v1 gate.

---

## Suggested delivery order

1. Practice registry refactor (unblocks everything). 
2. Assertions module (biggest Playwright gap).
3. `e2e/` runner + answer keys for Sessions 1–2.
4. Interactive locator challenge.
5. Waiting + dialogs/tabs/iframes + network modules.
6. POM/fixtures (Session 4) once the runner is in.
7. Foundations Track A (blocks/flow/decomposition/language + code viz).
8. Config/tooling module + progress tracking.
