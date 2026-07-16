import { useState } from "react";
import { CodeBox, PracticeTitle } from "./PracticeShared";

export function Practice27() {
  const [on, setOn] = useState(false);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Toggle Button (Custom UI)"
        goal="Goal: click toggle → assert aria-checked + label."
      />

      <div className="card grid2" style={{ padding: 12 }}>
        <div className="stack" style={{ gap: 10 }}>
          <div
            data-testid="toggle"
            role="switch"
            aria-checked={on}
            onClick={() => setOn((v) => !v)}
            style={{
              width: 64,
              height: 34,
              borderRadius: 999,
              border: "1px solid var(--border-strong)",
              background: on ? "var(--accent)" : "var(--surface-2)",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <div
              data-testid="toggle-knob"
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: "var(--surface)",
                border: "1px solid var(--border-strong)",
                position: "absolute",
                top: 2,
                left: on ? 34 : 2,
                transition: "left 160ms ease",
              }}
            />
          </div>

          <div data-testid="toggle-label" className="small" style={{ fontWeight: 900 }}>
            {on ? "ON" : "OFF"}
          </div>
        </div>
      </div>

        <CodeBox
          code={`await page.getByTestId('toggle').click();
await expect(page.getByTestId('toggle')).toHaveAttribute('aria-checked', 'true');
await expect(page.getByTestId('toggle-label')).toHaveText('ON');`}
        />
    </div>
  );
}