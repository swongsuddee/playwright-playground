"use client";

import { useEffect, useMemo, useState } from "react";
import type { LocatorHint } from "@/components/types";
import { CodeBox, PracticeTitle } from "./PracticeShared";

export function Practice22({ onHoverHint }: { onHoverHint: (h: LocatorHint | null) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [usernameDigitError, setUsernameDigitError] = useState("");
  const [ruleErrors, setRuleErrors] = useState<string[]>([]);

  // ===== Rules (descriptions for learners) =====
  const usernameRules = [
    "3–12 characters",
    "Letters only (A–Z), no numbers",
    "No spaces",
  ];

  const passwordRules = [
    "At least 6 characters",
    "Must include at least 1 letter",
    "Must include at least 1 number",
  ];

  // ===== Helpers =====
  const hasDigits = (s: string) => /\d/.test(s);
  const hasLetter = (s: string) => /[A-Za-z]/.test(s);
  const hasNumber = (s: string) => /\d/.test(s);
  const hasSpace = (s: string) => /\s/.test(s);

  const sanitizeUsername = (raw: string) => {
    // Remove digits + spaces (strict for practice)
    const cleaned = raw.replace(/\d+/g, "").replace(/\s+/g, "");

    if (cleaned !== raw) {
      if (hasDigits(raw)) setUsernameDigitError("Numbers are not allowed in username.");
    } else {
      setUsernameDigitError("");
    }

    return cleaned;
  };

  const validate = () => {
    const errs: string[] = [];

    // Username validation (post-sanitize)
    if (!username.trim()) errs.push("Username is required.");
    if (username.length > 0 && (username.length < 3 || username.length > 12))
      errs.push("Username must be 3–12 characters.");
    if (username.length > 0 && /[^A-Za-z]/.test(username))
      errs.push("Username must contain letters only (A–Z).");
    if (hasSpace(username)) errs.push("Username must not contain spaces.");

    // Password validation
    if (!password) errs.push("Password is required.");
    if (password && password.length < 6) errs.push("Password must be at least 6 characters.");
    if (password && !hasLetter(password)) errs.push("Password must include at least 1 letter.");
    if (password && !hasNumber(password)) errs.push("Password must include at least 1 number.");

    setRuleErrors(errs);
    return errs.length === 0;
  };

  const submit = () => {
    setSubmitted(true);
    validate();
  };

  // Re-validate after submit for instant feedback
  useEffect(() => {
    if (submitted) validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password, submitted]);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeTitle
        title="Practice: Text Input & Keyboard"
        goal="Goal: follow input rules → submit (button or Enter) → assert toHaveValue() + validation messages."
      />

      {/* Rules description (what learners need to follow) */}
      <div className="card" style={{ padding: 12 }}>
        <div className="small" style={{ fontWeight: 900, marginBottom: 8 }}>
          Input rules
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div className="small" style={{ fontWeight: 800 }}>
              Username rules
            </div>
            <ul data-testid="rules-username" style={{ marginTop: 6, paddingLeft: 18 }}>
              {usernameRules.map((r) => (
                <li key={r} className="small">
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="small" style={{ fontWeight: 800 }}>
              Password rules
            </div>
            <ul data-testid="rules-password" style={{ marginTop: 6, paddingLeft: 18 }}>
              {passwordRules.map((r) => (
                <li key={r} className="small">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
      >
        <div className="stack" style={{ gap: 10 }}>
          <label className="small" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            data-testid="input-username"
            className="input"
            value={username}
            onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
            placeholder="letters only, 3–12 chars"
            inputMode="text"
            onBeforeInput={(e: any) => {
              const next = String(e?.data ?? "");
              if (/\d/.test(next) || /\s/.test(next)) {
                e.preventDefault?.();
                if (/\d/.test(next)) setUsernameDigitError("Numbers are not allowed in username.");
              }
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text");
              if (hasDigits(pasted) || hasSpace(pasted)) {
                e.preventDefault();
                const cleaned = pasted.replace(/\d+/g, "").replace(/\s+/g, "");
                setUsername((prev) => (prev + cleaned).slice(0, 12));
                if (hasDigits(pasted)) setUsernameDigitError("Numbers are not allowed in username.");
              }
            }}
            onMouseEnter={() =>
              onHoverHint({
                title: "Username input (rules applied)",
                description:
                  "Rules: required, 3–12 chars, letters only, no spaces. Digits are blocked/removed. Assert with toHaveValue() and validate messages.",
                actions: ["fill()", "type()", "press()", "toHaveValue()", "toHaveText()"],
                selectors: ["page.getByTestId('input-username')", "page.getByLabel('Username')"],
                docsUrl: "https://playwright.dev/docs/input#text-input",
                id: "",
                purpose: "",
                target: "",
              })
            }
            onMouseLeave={() => onHoverHint(null)}
          />

          {usernameDigitError ? (
            <div
              data-testid="username-digit-error"
              className="card"
              style={{
                padding: 10,
                borderColor: "rgba(245,158,11,0.35)",
                background: "rgba(245,158,11,0.08)",
              }}
            >
              <div style={{ fontWeight: 800 }}>{usernameDigitError}</div>
              <div className="muted" style={{ marginTop: 4 }}>
                Username accepts letters only (A–Z).
              </div>
            </div>
          ) : null}

          <label className="small" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            data-testid="input-password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="min 6 chars, include letter+number"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />

          <button data-testid="btn-submit" className="btnPrimary" onClick={submit}>
            Submit
          </button>

          {/* Combined validation box */}
          {submitted && ruleErrors.length > 0 ? (
            <div
              data-testid="validation-errors"
              className="card"
              style={{
                padding: 12,
                borderColor: "rgba(239,68,68,0.35)",
                background: "rgba(239,68,68,0.06)",
              }}
            >
              <div style={{ fontWeight: 900, color: "#7f1d1d" }}>Please fix:</div>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {ruleErrors.map((m) => (
                  <li key={m} style={{ color: "#7f1d1d", fontWeight: 700 }}>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Success */}
          {submitted && ruleErrors.length === 0 ? (
            <div
              data-testid="submit-success"
              className="card"
              style={{
                padding: 12,
                borderColor: "rgba(34,197,94,0.35)",
                background: "rgba(34,197,94,0.08)",
              }}
            >
              <div style={{ fontWeight: 900 }}>✅ Submitted successfully</div>
            </div>
          ) : null}
        </div>

        <div className="stack" style={{ gap: 10 }}>
          <div className="card" style={{ padding: 12 }}>
            <div className="small">Current values</div>
            <div className="small" style={{ marginTop: 8 }}>
              username:{" "}
              <span data-testid="username-value" style={{ fontWeight: 900 }}>
                {username || "—"}
              </span>
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              password length:{" "}
              <span data-testid="password-len" style={{ fontWeight: 900 }}>
                {password.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <CodeBox
        code={`// 1) Digits are blocked/removed from username
await page.getByTestId('input-username').fill('ab12cd');
await expect(page.getByTestId('input-username')).toHaveValue('abcd');
await expect(page.getByTestId('username-digit-error')).toBeVisible();

// 2) Submit invalid -> list of errors visible
await page.getByTestId('input-password').fill('123');
await page.getByTestId('btn-submit').click();
await expect(page.getByTestId('validation-errors')).toBeVisible();

// 3) Fix and submit via Enter -> success
await page.getByTestId('input-username').fill('JohnDoe');
await page.getByTestId('input-password').fill('abc123');
await page.keyboard.press('Enter');
await expect(page.getByTestId('submit-success')).toBeVisible();
await expect(page.getByTestId('input-username')).toHaveValue('JohnDoe');`}
      />
    </div>
  );
}