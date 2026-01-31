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

      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
              border: "1px solid rgba(148,163,184,0.25)",
              background: on ? "rgba(249,115,22,0.25)" : "rgba(2,6,23,0.06)",
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
                background: "white",
                border: "1px solid rgba(148,163,184,0.25)",
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