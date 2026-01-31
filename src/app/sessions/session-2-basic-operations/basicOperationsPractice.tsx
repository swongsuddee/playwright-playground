"use client";

import { LocatorHint } from "@/components/types";
import { useEffect, useMemo, useState } from "react";

type TopicKey =
  | "2-1"
  | "2-2"
  | "2-3"
  | "2-4"
  | "2-5"
  | "2-6"
  | "2-7"
  | "2-8"
  | "2-9";

function safeHash(): TopicKey {
  if (typeof window === "undefined") return "2-1";
  const raw = window.location.hash?.replace("#", "");
  const allowed: TopicKey[] = ["2-1","2-2","2-3","2-4","2-5","2-6","2-7","2-8","2-9"];
  return (allowed.includes(raw as TopicKey) ? (raw as TopicKey) : "2-1");
}

function PracticeTitle({ title, goal }: { title: string; goal: string }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>
      <div className="small" style={{ marginTop: 6 }}>{goal}</div>
    </div>
  );
}

function CodeBox({ code }: { code: string }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ fontWeight: 800 }}>Assertion example</div>
      <pre className="code" style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{code}</pre>
    </div>
  );
}

/* =========================
   2.1 Click & Mouse
========================= */
function Practice21({ onHoverHint }: { onHoverHint: (h: LocatorHint | null) => void }) {
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
                purpose: ""
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
                purpose: ""
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
                purpose: ""
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

/* =========================
   2.2 Text Input & Keyboard
========================= */
function Practice22({ onHoverHint }: { onHoverHint: (h: LocatorHint | null) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const error =
    submitted && (!username.trim() || password.length < 6)
      ? "Please provide username and password (min 6 chars)."
      : "";

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Text Input & Keyboard"
        goal="Goal: fill inputs → submit (button or Enter) → assert value + validation."
      />

      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="stack" style={{ gap: 10 }}>
          <label className="small" htmlFor="username">Username</label>
          <input
            id="username"
            data-testid="input-username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. JohnDoe"
            onMouseEnter={() =>
              onHoverHint({
                title: "Username input",
                description: "Use fill() and assert with toHaveValue().",
                actions: ["fill()"],
                selectors: ["page.getByTestId('input-username')", "page.getByLabel('Username')"],
                docsUrl: "https://playwright.dev/docs/input#text-input",
                id: "",
                purpose: "",
                target: ""
              })
            }
            onMouseLeave={() => onHoverHint(null)}
          />

          <label className="small" htmlFor="password">Password</label>
          <input
            id="password"
            data-testid="input-password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="min 6 chars"
            onKeyDown={(e) => {
              if (e.key === "Enter") setSubmitted(true);
            }}
          />

          <button data-testid="btn-submit" className="btnPrimary" onClick={() => setSubmitted(true)}>
            Submit
          </button>

          {error ? (
            <div
              data-testid="validation-error"
              className="card"
              style={{
                padding: 12,
                borderColor: "rgba(239,68,68,0.35)",
                background: "rgba(239,68,68,0.06)",
              }}
            >
              <div style={{ fontWeight: 800, color: "#7f1d1d" }}>{error}</div>
            </div>
          ) : null}
        </div>

        <div className="stack" style={{ gap: 10 }}>
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Current values</div>
            <div className="small" style={{ marginTop: 8 }}>
              username: <span data-testid="username-value" style={{ fontWeight: 900 }}>{username || "—"}</span>
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              password length: <span data-testid="password-len" style={{ fontWeight: 900 }}>{password.length}</span>
            </div>
          </div>

        </div>
      </div>
      <CodeBox
            code={`await page.getByTestId('input-username').fill('ab');
await page.getByTestId('input-password').fill('123');
await page.getByTestId('btn-submit').click();
await expect(page.getByTestId('validation-error')).toBeVisible();

await page.getByTestId('input-username').fill('abc');
await page.getByTestId('input-password').fill('123456');
await page.keyboard.press('Enter');
await expect(page.getByTestId('input-username')).toHaveValue('abc');`}
          />
    </div>
  );
}

/* =========================
   2.3 Reading Text & Values
========================= */
function Practice23() {
  const [count, setCount] = useState(0);
  const weirdText = "  Hello   Playwright  ";

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Reading Text & Values"
        goal="Goal: learn which Playwright text API to use for different UI patterns."
      />

      <div
        className="card"
        style={{
          padding: 12,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {/* LEFT COLUMN */}
        <div className="stack" style={{ gap: 10 }}>
          {/* Counter */}
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Plain visible text</div>
            <div data-testid="counter" style={{ fontWeight: 900, fontSize: 22 }}>
              {count}
            </div>
            <div className="stack" style={{ gap: 8, marginTop: 10 }}>
              <button
                data-testid="btn-inc"
                className="btnPrimary"
                onClick={() => setCount((c) => c + 1)}
              >
                +1
              </button>
              <button
                data-testid="btn-reset"
                className="btnSecondary"
                onClick={() => setCount(0)}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Weird whitespace */}
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Text with extra whitespace</div>
            <div data-testid="weird-text" style={{ fontWeight: 900 }}>
              {weirdText}
            </div>
          </div>

          {/* Hidden text */}
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Hidden text (DOM only)</div>
            <span data-testid="hidden-text" style={{ display: "none" }}>
              secret-token-123
            </span>
            <div className="muted">Not visible to user</div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="stack" style={{ gap: 10 }}>
          {/* Styled text */}
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Styled / colored text</div>
            <p data-testid="error-text" style={{ color: "red", fontWeight: 700 }}>
              Error occurred
            </p>
          </div>

          {/* Paragraph */}
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Paragraph text</div>
            <p data-testid="paragraph-text">
              Line one
              <br />
              Line two
            </p>
          </div>

          {/* Code block */}
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Code / preformatted text</div>
            <pre data-testid="code-text">npm install playwright</pre>
          </div>

          {/* Input */}
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Input value</div>
            <input
              data-testid="input-text"
              defaultValue="hello world"
              className="input"
            />
          </div>
        </div>
      </div>

      <CodeBox
        code={`// Plain visible text
await page.getByTestId('btn-inc').click();
await expect(page.getByTestId('counter')).toHaveText('1');

// Whitespace-safe assertion
await expect(page.getByTestId('weird-text')).toContainText('Hello');

// Hidden text (not visible)
await expect(page.getByTestId('hidden-text'))
  .toHaveText('secret-token-123');

// Styled text (content only)
await expect(page.getByTestId('error-text'))
  .toHaveText('Error occurred');

// Paragraph (multiline)
await expect(page.getByTestId('paragraph-text'))
  .toContainText('Line one');

// Code / pre
await expect(page.getByTestId('code-text'))
  .toHaveText('npm install playwright');

// Input value
await expect(page.getByTestId('input-text'))
  .toHaveValue('hello world');`}
      />
    </div>
  );
}

/* =========================
   2.4 Element State & Visibility
========================= */
function Practice24() {
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

/* =========================
   2.5 Select, Checkbox, Radio & Dropdown
========================= */
function Practice25() {
  const [seatType, setSeatType] = useState("standard");
  const [meal, setMeal] = useState(false);
  const [payment, setPayment] = useState<"card" | "cash">("card");

  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState("Thailand");
  const options = useMemo(() => ["Thailand", "Japan", "Nepal", "Russia"], []);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Select, Checkbox, Radio & Dropdown"
        goal="Goal: change selections and assert value/checked/aria-selected."
      />

      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="stack" style={{ gap: 10 }}>
          <label className="small" htmlFor="seatType">Seat type</label>
          <select
            id="seatType"
            data-testid="select-seat-type"
            className="input"
            value={seatType}
            onChange={(e) => setSeatType(e.target.value)}
          >
            <option value="standard">Standard</option>
            <option value="vip">VIP</option>
            <option value="sofa">Sofa</option>
          </select>

          <label className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              data-testid="checkbox-meal"
              type="checkbox"
              checked={meal}
              onChange={(e) => setMeal(e.target.checked)}
            />
            Add meal
          </label>

          <div className="small" style={{ fontWeight: 900 }}>Payment</div>
          <label className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              data-testid="radio-card"
              type="radio"
              name="payment"
              checked={payment === "card"}
              onChange={() => setPayment("card")}
            />
            Card
          </label>
          <label className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              data-testid="radio-cash"
              type="radio"
              name="payment"
              checked={payment === "cash"}
              onChange={() => setPayment("cash")}
            />
            Cash
          </label>

          <div className="small" style={{ fontWeight: 900, marginTop: 6 }}>Country (custom dropdown)</div>
          <div className="card" style={{ padding: 12 }}>
            <div
              data-testid="dropdown-country"
              role="button"
              aria-haspopup="listbox"
              aria-expanded={countryOpen}
              onClick={() => setCountryOpen((v) => !v)}
              style={{ fontWeight: 900, cursor: "pointer", userSelect: "none" }}
            >
              {country} ▾
            </div>

            {countryOpen ? (
              <div
                data-testid="dropdown-list"
                role="listbox"
                style={{
                  marginTop: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(148,163,184,0.25)",
                  background: "white",
                  overflow: "hidden",
                }}
              >
                {options.map((o) => {
                  const selected = o === country;
                  return (
                    <div
                      key={o}
                      role="option"
                      aria-selected={selected}
                      data-testid={`country-${o}`}
                      onClick={() => {
                        setCountry(o);
                        setCountryOpen(false);
                      }}
                      style={{
                        padding: 10,
                        fontWeight: 900,
                        cursor: "pointer",
                        background: selected ? "rgba(249,115,22,0.10)" : "transparent",
                        color: selected ? "#9a3412" : "#0f172a",
                      }}
                    >
                      {o}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="stack" style={{ gap: 10 }}>
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Observed state</div>
            <div className="small" style={{ marginTop: 8 }}>
              seatType: <span data-testid="value-seatType" style={{ fontWeight: 900 }}>{seatType}</span>
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              meal: <span data-testid="value-meal" style={{ fontWeight: 900 }}>{meal ? "true" : "false"}</span>
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              payment: <span data-testid="value-payment" style={{ fontWeight: 900 }}>{payment}</span>
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              country: <span data-testid="value-country" style={{ fontWeight: 900 }}>{country}</span>
            </div>
          </div>
        </div>
      </div>

          <CodeBox
            code={`await page.getByTestId('select-seat-type').selectOption('vip');
await expect(page.getByTestId('select-seat-type')).toHaveValue('vip');

await page.getByTestId('checkbox-meal').check();
await expect(page.getByTestId('checkbox-meal')).toBeChecked();

await page.getByTestId('dropdown-country').click();
await page.getByTestId('country-Japan').click();
await expect(page.getByTestId('value-country')).toHaveText('Japan');`}
          />
    </div>
  );
}

/* =========================
   2.6 Date & Time Picker
========================= */
function Practice26() {
  const [date, setDate] = useState("2026-01-30");
  const [time, setTime] = useState("14:30");
  const [disablePastDemo, setDisablePastDemo] = useState(false);

  const times = useMemo(() => ["09:00", "10:30", "12:00", "14:30", "18:00"], []);
  const isDisabledTime = (t: string) => disablePastDemo && t < "12:00";

  const combined = `${date} ${time}`;

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Date & Time Picker"
        goal="Goal: set date + time → assert combined date-time. Demo: disable past time options."
      />

      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="stack" style={{ gap: 10 }}>
          <label className="small" htmlFor="date">Date</label>
          <input
            id="date"
            data-testid="input-date"
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label className="small" htmlFor="time">Time</label>
          <select
            id="time"
            data-testid="select-time"
            className="input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {times.map((t) => (
              <option key={t} value={t} disabled={isDisabledTime(t)} data-testid={`time-${t}`}>
                {t} {isDisabledTime(t) ? "(disabled)" : ""}
              </option>
            ))}
          </select>

          <label className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              data-testid="toggle-disable-past"
              type="checkbox"
              checked={disablePastDemo}
              onChange={(e) => setDisablePastDemo(e.target.checked)}
            />
            Disable times before 12:00 (demo)
          </label>

          <div className="card" style={{ padding: 12 }}>
            <div className="small">Combined date-time</div>
            <div data-testid="datetime-value" style={{ fontWeight: 900, fontSize: 18 }}>
              {combined}
            </div>
          </div>
        </div>
      </div>

        <CodeBox
          code={`await page.getByTestId('input-date').fill('2026-02-10');
await page.getByTestId('select-time').selectOption('14:30');
await expect(page.getByTestId('datetime-value')).toContainText('2026-02-10 14:30');

await page.getByTestId('toggle-disable-past').check();
await expect(page.getByTestId('time-09:00')).toBeDisabled();`}
        />
    </div>
  );
}

/* =========================
   2.7 Toggle (Custom UI)
========================= */
function Practice27() {
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

/* =========================
   2.8 Upload Image
========================= */
function Practice28() {
  const [preview, setPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Upload Image"
        goal="Goal: upload image and assert preview appears (frontend-only)."
      />

      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="stack" style={{ gap: 10 }}>
          <input
            data-testid="file-input"
            type="file"
            accept="image/*"
            className="input"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setFilename(file.name);
              const url = URL.createObjectURL(file);
              setPreview(url);
            }}
          />

          {preview ? (
            <div className="card" style={{ padding: 12 }}>
              <div className="small">Preview</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-testid="img-preview"
                src={preview}
                alt="preview"
                style={{ width: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 12 }}
              />
              <div data-testid="file-name" className="small" style={{ marginTop: 8, fontWeight: 900 }}>
                {filename}
              </div>
            </div>
          ) : (
            <div className="small">No image selected</div>
          )}
        </div>
      </div>

        <CodeBox
          code={`await page.getByTestId('file-input').setInputFiles('tests/assets/profile.jpg');
await expect(page.getByTestId('img-preview')).toBeVisible();
await expect(page.getByTestId('file-name')).toContainText('.jpg');`}
        />
    </div>
  );
}

/* =========================
   2.9 Download File / Image
========================= */
function Practice29() {
  const [last, setLast] = useState<string>("—");

  const download = () => {
    const content = `Ticket generated at: ${new Date().toISOString()}\nRef: PW-PLAYGROUND\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ticket.txt";
    a.click();
    URL.revokeObjectURL(url);
    setLast("ticket.txt");
  };

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Download File / Image"
        goal="Goal: trigger download and assert filename + file exists."
      />

      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="stack" style={{ gap: 10 }}>
          <button data-testid="btn-download" className="btnPrimary" onClick={download}>
            Download ticket
          </button>

          <div className="card" style={{ padding: 12 }}>
            <div className="small">Last downloaded</div>
            <div data-testid="last-downloaded" style={{ fontWeight: 900 }}>
              {last}
            </div>
          </div>
        </div>
      </div>

        <CodeBox
          code={`const downloadPromise = page.waitForEvent('download');
await page.getByTestId('btn-download').click();
const download = await downloadPromise;

expect(download.suggestedFilename()).toBe('ticket.txt');
await download.saveAs('downloads/ticket.txt');
// then assert file exists & size > 0`}
        />
    </div>
  );
}

export function BasicOperationsPractice({
  onHoverHint,
}: {
  onHoverHint: (h: LocatorHint | null) => void;
}) {
  const [active, setActive] = useState<TopicKey>("2-1");

  // Update when sidebar changes hash
  useEffect(() => {
    setActive(safeHash());
    const onHashChange = () => setActive(safeHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const headerHint = useMemo<LocatorHint>(
    () => ({
      title: "Session 2 — Basic Operations",
      description: "Use the left sidebar to switch topics. Each practice teaches Action → Assertion.",
      actions: ["Use stable locators", "Assert final UI state"],
      selectors: ["getByRole()", "getByLabel()", "getByTestId()"],
      docsUrl: "https://playwright.dev/docs/test-assertions",
      target: "session-2-header",
      id: "",
      purpose: ""
    }),
    []
  );

  return (
    <section className="panel">
      <div
        className="panelHeader"
        onMouseEnter={() => onHoverHint(headerHint)}
        onMouseLeave={() => onHoverHint(null)}
      >
        <h1 className="h1">Session 2 — Basic Operations</h1>
        <p className="small">Practice each interaction and always finish with an assertion.</p>
      </div>

      <div className="panelBody stack">
        {active === "2-1" && <Practice21 onHoverHint={onHoverHint} />}
        {active === "2-2" && <Practice22 onHoverHint={onHoverHint} />}
        {active === "2-3" && <Practice23 />}
        {active === "2-4" && <Practice24 />}
        {active === "2-5" && <Practice25 />}
        {active === "2-6" && <Practice26 />}
        {active === "2-7" && <Practice27 />}
        {active === "2-8" && <Practice28 />}
        {active === "2-9" && <Practice29 />}
      </div>
    </section>
  );
}
