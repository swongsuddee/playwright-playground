"use client";

import { useState } from "react";
import type { LocatorHint } from "@/components/types";
import { CodeBox, PracticeTitle } from "./PracticeShared";

export function Practice21({ onHoverHint }: { onHoverHint: (h: LocatorHint | null) => void }) {
  const [status, setStatus] = useState<"Idle" | "Saved" | "Double Saved">("Idle");
  const [tooltip, setTooltip] = useState(false);
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Click & Mouse Operations"
        goal="Goal: click / dblclick / hover → verify UI changes using assertions."
      />

      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="stack" style={{ gap: 10 }}>
          <button
            data-testid="btn-save"
            aria-label="Save"
            className="btnPrimary"
            disabled={!enabled}
            style={{ opacity: enabled ? 1 : 0.5 }}
            onClick={() => setStatus("Saved")}
            onMouseEnter={() =>
              onHoverHint({
                title: "Save button",
                description: "Click to change the Status text.",
                actions: ["click()"],
                selectors: ["page.getByRole('button', { name: 'Save' })", "page.getByTestId('btn-save')"],
                docsUrl: "https://playwright.dev/docs/input#mouse-click",
                target: "btn-save",
                id: "",
                purpose: "",
              })
            }
            onMouseLeave={() => onHoverHint(null)}
          >
            Save
          </button>

          <button
            data-testid="btn-double"
            aria-label="Double click me"
            className="btnSecondary"
            disabled={!enabled}
            style={{ opacity: enabled ? 1 : 0.5 }}
            onClick={() => setStatus("Saved")}
            onDoubleClick={() => setStatus("Double Saved")}
            onMouseEnter={() =>
              onHoverHint({
                title: "Double click button",
                description: "Double click to set Status = 'Double Saved'.",
                actions: ["dblclick()"],
                selectors: ["page.getByTestId('btn-double')"],
                docsUrl: "https://playwright.dev/docs/input#mouse-click",
                target: "btn-double",
                id: "",
                purpose: "",
              })
            }
            onMouseLeave={() => onHoverHint(null)}
          >
            Double click me
          </button>

          <div
            data-testid="hover-target"
            role="button"
            tabIndex={0}
            onMouseEnter={() => {
              setTooltip(true);
              onHoverHint({
                title: "Hover target",
                description: "Hover to show tooltip. Assert tooltip visibility.",
                actions: ["hover()"],
                selectors: ["page.getByTestId('hover-target')", "page.getByTestId('tooltip')"],
                docsUrl: "https://playwright.dev/docs/input#mouse-move",
                target: "hover-target",
                id: "",
                purpose: "",
              });
            }}
            onMouseLeave={() => {
              setTooltip(false);
              onHoverHint(null);
            }}
            style={{
              border: "1px solid rgba(148,163,184,0.25)",
              borderRadius: 12,
              padding: 12,
              background: "rgba(2,6,23,0.02)",
              fontWeight: 800,
            }}
          >
            Hover me
            {tooltip ? (
              <div
                data-testid="tooltip"
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(249,115,22,0.35)",
                  background: "rgba(249,115,22,0.08)",
                  color: "#9a3412",
                  fontWeight: 700,
                }}
              >
                Tooltip visible ✅
              </div>
            ) : null}
          </div>

          <label className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              data-testid="toggle-enabled"
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            Enable buttons
          </label>
        </div>

        <div className="stack" style={{ gap: 10 }}>
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Status</div>
            <div data-testid="status-text" style={{ fontWeight: 900, fontSize: 18 }}>
              {status}
            </div>
          </div>
        </div>
      </div>

      <CodeBox
        code={`await expect(page.getByTestId('btn-save')).toBeEnabled();
await page.getByTestId('btn-save').click();
await expect(page.getByTestId('status-text')).toHaveText('Saved');

await page.getByTestId('hover-target').hover();
await expect(page.getByTestId('tooltip')).toBeVisible();`}
      />
    </div>
  );
}
