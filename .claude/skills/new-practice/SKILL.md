---
name: new-practice
description: >
  Scaffold a new interactive practice in the Playwright Playground and wire it into the
  app. Use when adding a Session 2-style sub-practice (a component that teaches one
  Playwright action/concept with a hover-to-inspect LocatorHint and an assertion example).
  Handles the four-touch wiring so nothing is missed.
---

# Add a new practice

A practice is a self-contained `"use client"` component that (1) renders realistic UI with
stable locators, (2) feeds `LocatorHint`s to the Inspector on hover, and (3) shows the
Playwright assertion that verifies the outcome. Read `CLAUDE.md` and one existing practice
(`src/app/sessions/session-2-basic-operations/practices/Practice21.tsx`) before starting.

## Steps (the four touches)

1. **Create the component** at
   `src/app/sessions/session-2-basic-operations/practices/Practice<XX>.tsx` using the
   template below. Give every interactive element a `data-testid`, an accessible name, and
   a correct `role`. Wire `onHoverHint` on enter/leave.
2. **Export it** — add `export * from "./Practice<XX>";` to `practices/index.ts`.
3. **Route it** in `basic-operation-practice.tsx`: add the hash key (e.g. `"2-12"`) to the
   `TopicKey` union and the `allowed` array in `safeHash()`, import the component, and add
   `{active === "2-12" && <Practice<XX> onHoverHint={onHoverHint} />}`.
4. **Link it** in `src/components/layout/Sidebar.tsx`: add a `children` entry under Session 2:
   `{ title: "2.12 <Name>", href: "/sessions/session-2-basic-operations#2-12" }`.

Then run `npm run lint` (and `npm run build` if practical) and report the result.

## Component template

```tsx
"use client";

import { useState } from "react";
import type { LocatorHint } from "@/components/types";
import { CodeBox, PracticeTitle } from "./PracticeShared";

export function Practice<XX>({ onHoverHint }: { onHoverHint: (h: LocatorHint | null) => void }) {
  const [value, setValue] = useState("");

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: <what it teaches>"
        goal="Goal: <action> → verify <observable outcome> with an assertion."
      />

      <div className="card" style={{ padding: 12 }}>
        <button
          data-testid="do-thing"
          aria-label="Do thing"
          className="btnPrimary"
          onClick={() => setValue("done")}
          onMouseEnter={() =>
            onHoverHint({
              id: "do-thing",
              title: "Do-thing button",
              purpose: "Prefer role + accessible name; test id is the stable fallback.",
              description: "Click to update the result text.",
              selectors: [
                "page.getByRole('button', { name: 'Do thing' })",
                "page.getByTestId('do-thing')",
              ],
              actions: ["click()", "assert result text"],
              docsUrl: "https://playwright.dev/docs/input",
              target: "do-thing",
            })
          }
          onMouseLeave={() => onHoverHint(null)}
        >
          Do thing
        </button>

        <div className="card" style={{ padding: 12, marginTop: 10 }}>
          <div className="small">Result</div>
          <div data-testid="result" style={{ fontWeight: 900 }}>{value || "idle"}</div>
        </div>
      </div>

      <CodeBox
        code={`await page.getByRole('button', { name: 'Do thing' }).click();
await expect(page.getByTestId('result')).toHaveText('done');`}
      />
    </div>
  );
}
```

## Checklist before finishing

- [ ] Every interactive element has `data-testid` + accessible name + correct `role`.
- [ ] `selectors` are ordered best-first per the `locator-ladder` skill.
- [ ] `docsUrl` points to the relevant official Playwright page.
- [ ] The `CodeBox` shows an action **and** a web-first assertion of the outcome.
- [ ] All four touches done; `npm run lint` passes.
