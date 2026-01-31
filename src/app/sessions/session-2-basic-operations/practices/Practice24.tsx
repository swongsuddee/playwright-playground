import { useState } from "react";
import { CodeBox, PracticeTitle } from "./PracticeShared";

export function Practice24() {
  const [open, setOpen] = useState(true);
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Element State & Visibility"
        goal="Goal: toggle panel and disable button → assert visible/hidden and enabled/disabled."
      />

      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="stack" style={{ gap: 10 }}>
          <button data-testid="btn-toggle-panel" className="btnPrimary" onClick={() => setOpen((v) => !v)}>
            Toggle panel
          </button>

          <label className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              data-testid="toggle-disabled"
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
            Disable action button
          </label>

          {open ? (
            <div data-testid="panel" className="card" style={{ padding: 12 }}>
              <div style={{ fontWeight: 900 }}>Visible panel ✅</div>
              <button
                data-testid="btn-action"
                className="btnSecondary"
                disabled={disabled}
                style={{ marginTop: 10, opacity: disabled ? 0.5 : 1 }}
              >
                Action
              </button>
            </div>
          ) : (
            <div data-testid="panel-hidden" className="card" style={{ padding: 12 }}>
              <div style={{ fontWeight: 900 }}>Panel hidden ❌</div>
            </div>
          )}
        </div>
      </div>

        <CodeBox
          code={`await page.getByTestId('btn-toggle-panel').click();
await expect(page.getByTestId('panel')).toBeHidden();

await page.getByTestId('toggle-disabled').check();
await expect(page.getByTestId('btn-action')).toBeDisabled();`}
        />
    </div>
  );
}