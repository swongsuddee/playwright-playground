"use client";

import { useEffect, useRef, useState } from "react";
import { LocatorHint } from "@/components/types";

type Props = {
  /** Optional: feed the shared Inspector panel when a challenge is hovered. */
  onHoverHint?: (hint: LocatorHint | null) => void;
};

type SelectorType = "css" | "xpath";
type Grade = "correct" | "too-broad" | "wrong";

type EvalResult =
  | { kind: "empty" }
  | { kind: "error"; message: string }
  | { kind: "matches"; count: number; grade: Grade; brittle: string | null };

type Challenge = {
  id: string;
  prompt: string;
  hint: string;
  /** Always-valid CSS selector identifying the EXACT expected element set. */
  targetSelector: string;
  expectedCount: number;
  good: {
    css: string;
    xpath: string;
    playwright: string;
    rung: string;
  };
};

const CHALLENGES: Challenge[] = [
  {
    id: "email-input",
    prompt: "Select the email input",
    hint: "It has a <label for>, an aria-label, and a data-testid — any top rung works.",
    targetSelector: '[data-testid="email-input"]',
    expectedCount: 1,
    good: {
      css: '[data-testid="email-input"]',
      xpath: '//input[@data-testid="email-input"]',
      playwright: "page.getByLabel('Email address')",
      rung: "getByLabel (rung 2)",
    },
  },
  {
    id: "confirm-button",
    prompt: "Select the Confirm button",
    hint: "Buttons are best located by role + accessible name.",
    targetSelector: '[data-testid="confirm-btn"]',
    expectedCount: 1,
    good: {
      css: '[data-testid="confirm-btn"]',
      xpath: '//button[@aria-label="Confirm"]',
      playwright: "page.getByRole('button', { name: 'Confirm' })",
      rung: "getByRole (rung 1)",
    },
  },
  {
    id: "newsletter-checkbox",
    prompt: "Select the 'Subscribe to newsletter' checkbox",
    hint: "The checkbox exposes an accessible name via aria-label.",
    targetSelector: '[data-testid="newsletter-checkbox"]',
    expectedCount: 1,
    good: {
      css: '[aria-label="Subscribe to newsletter"]',
      xpath: '//input[@type="checkbox"]',
      playwright: "page.getByRole('checkbox', { name: 'Subscribe to newsletter' })",
      rung: "getByRole (rung 1)",
    },
  },
  {
    id: "taken-seats",
    prompt: "Select ALL taken seats (should be 2)",
    hint: 'Taken seats carry data-taken="true" and are disabled. Match the group, not individual ids.',
    targetSelector: '[data-taken="true"]',
    expectedCount: 2,
    good: {
      css: '[data-taken="true"]',
      xpath: '//button[@data-taken="true"]',
      playwright: "page.getByRole('button', { disabled: true })",
      rung: "attribute CSS (rung 5) / getByRole disabled",
    },
  },
  {
    id: "cart-items",
    prompt: "Select every item in the cart list (should be 3)",
    hint: "Scope to the cart list, then match its list items.",
    targetSelector: '[data-testid="cart-list"] li',
    expectedCount: 3,
    good: {
      css: '[data-testid="cart-list"] li',
      xpath: '//ul[@data-testid="cart-list"]/li',
      playwright: "page.getByTestId('cart-list').getByRole('listitem')",
      rung: "scoping + role (rung 4→1)",
    },
  },
];

const SANDBOX_SEATS: { id: string; taken: boolean }[] = [
  { id: "A1", taken: false },
  { id: "A2", taken: false },
  { id: "A3", taken: true },
  { id: "A4", taken: false },
  { id: "A5", taken: true },
  { id: "A6", taken: false },
];

const CART_ITEMS = ["Popcorn (large)", "Soda", "Nachos"];

/* ---------- pure helpers (stable across renders) ---------- */

function queryCss(selector: string, ctx: HTMLElement): HTMLElement[] {
  return Array.from(ctx.querySelectorAll(selector)).filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  );
}

function queryXpath(expr: string, ctx: HTMLElement): HTMLElement[] {
  const snapshot = document.evaluate(
    expr,
    ctx,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null,
  );
  const out: HTMLElement[] = [];
  for (let i = 0; i < snapshot.snapshotLength; i++) {
    const node = snapshot.snapshotItem(i);
    // Scope results to the sandbox so "//button" doesn't leak to the rest of the page.
    if (node instanceof HTMLElement && ctx.contains(node)) out.push(node);
  }
  return out;
}

function gradeMatch(matched: HTMLElement[], expected: HTMLElement[]): Grade {
  const matchedSet = new Set(matched);
  const allExpectedMatched = expected.every((el) => matchedSet.has(el));
  if (allExpectedMatched && matched.length === expected.length) return "correct";
  if (allExpectedMatched && matched.length > expected.length) return "too-broad";
  return "wrong";
}

/** Light heuristic — flag common brittle strategies. */
function detectBrittle(selector: string, type: SelectorType): string | null {
  const s = selector.toLowerCase();
  if (type === "css") {
    if (/:nth-child|:nth-of-type|:first-child|:last-child/.test(s)) {
      return "index-based CSS (:nth-child) breaks if the DOM order changes";
    }
    if (/\.css-[a-z0-9]{3,}|\.sc-[a-z0-9]/.test(s)) {
      return "hashed / generated class name changes on every rebuild";
    }
    return null;
  }
  // xpath
  if (/^\s*\/html|^\s*\/body|^\s*\/\w+\[/.test(s)) {
    return "absolute XPath breaks on any structural change";
  }
  if (/\[\d+\]/.test(s)) {
    return "positional index [n] is fragile — prefer an attribute predicate";
  }
  return null;
}

function hintFor(c: Challenge): LocatorHint {
  return {
    id: c.id,
    title: c.prompt,
    description: c.hint,
    purpose: c.hint,
    selectors: [
      c.good.playwright,
      `page.locator('${c.good.css}')`,
      `page.locator('xpath=${c.good.xpath}')`,
    ],
    actions: [
      "Type a CSS or XPath selector to match live",
      "Match exactly the target element(s)",
      "Prefer role / label / testid over DOM structure",
    ],
    docsUrl: "https://playwright.dev/docs/locators",
    target: "",
  };
}

/* ---------- highlight (imperative outline ring) ---------- */

function highlightOn(el: HTMLElement) {
  el.style.outline = "2px solid var(--accent)";
  el.style.outlineOffset = "2px";
  el.style.boxShadow = "0 0 0 4px var(--ring)";
  el.style.borderRadius = "8px";
}

function highlightOff(el: HTMLElement) {
  el.style.outline = "";
  el.style.outlineOffset = "";
  el.style.boxShadow = "";
  el.style.borderRadius = "";
}

/* ---------- component ---------- */

export function LocatorChallenge({ onHoverHint }: Props) {
  const sandboxRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef<HTMLElement[]>([]);

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectorType, setSelectorType] = useState<SelectorType>("css");
  const [input, setInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [solved, setSolved] = useState<string[]>([]);
  const [result, setResult] = useState<EvalResult>({ kind: "empty" });

  const challenge = CHALLENGES[challengeIndex];

  // Evaluate the typed selector live against the sandbox DOM.
  useEffect(() => {
    const ctx = sandboxRef.current;
    if (!ctx) return;

    const current = CHALLENGES[challengeIndex];
    const raw = input.trim();

    // Clear any previous highlight.
    highlightedRef.current.forEach(highlightOff);
    highlightedRef.current = [];

    if (raw === "") {
      setResult({ kind: "empty" });
      return;
    }

    let matched: HTMLElement[];
    try {
      matched = selectorType === "css" ? queryCss(raw, ctx) : queryXpath(raw, ctx);
    } catch (err) {
      setResult({
        kind: "error",
        message: err instanceof Error ? err.message : "Could not parse selector",
      });
      return;
    }

    matched.forEach(highlightOn);
    highlightedRef.current = matched;

    let expected: HTMLElement[] = [];
    try {
      expected = queryCss(current.targetSelector, ctx);
    } catch {
      expected = [];
    }

    const grade = gradeMatch(matched, expected);
    const brittle = detectBrittle(raw, selectorType);
    setResult({ kind: "matches", count: matched.length, grade, brittle });

    if (grade === "correct") {
      setSolved((prev) => (prev.includes(current.id) ? prev : [...prev, current.id]));
    }

    // Clear the ring on re-run / unmount.
    return () => {
      highlightedRef.current.forEach(highlightOff);
      highlightedRef.current = [];
    };
  }, [input, selectorType, challengeIndex]);

  const selectChallenge = (i: number) => {
    setChallengeIndex(i);
    setInput("");
    setShowAnswer(false);
    setResult({ kind: "empty" });
  };

  const tabStyle = (active: boolean) => ({
    padding: "6px 10px",
    fontSize: 12,
    borderRadius: 999,
    cursor: "pointer",
    border: active ? "1px solid var(--accent-border)" : "1px solid var(--border)",
    background: active ? "var(--accent-soft)" : "var(--surface)",
    color: active ? "var(--accent-text)" : "var(--text-muted)",
    fontWeight: active ? 700 : 500,
  });

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2 className="h1">Locator Challenge</h2>
        <p className="small">
          Type a selector and it is validated <b>live</b> against the sandbox below. Matches
          are highlighted with an indigo ring. Aim for the fewest, most robust matches.
        </p>
      </div>

      <div className="panelBody stack">
        {/* Challenge picker */}
        <div className="card stack">
          <div className="inspectorTitleRow">
            <div style={{ fontWeight: 700, fontSize: 15 }}>Challenges</div>
            <span className="badge">
              Solved {solved.length}/{CHALLENGES.length}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CHALLENGES.map((c, i) => {
              const active = i === challengeIndex;
              const done = solved.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  data-testid={`challenge-tab-${c.id}`}
                  onClick={() => selectChallenge(i)}
                  onMouseEnter={() => onHoverHint?.(hintFor(c))}
                  onMouseLeave={() => onHoverHint?.(null)}
                  style={tabStyle(active)}
                >
                  {done ? "✅ " : ""}
                  {c.prompt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two columns: sandbox (left) + evaluator (right) */}
        <div className="grid2">
          {/* ---------- Sandbox DOM ---------- */}
          <div
            ref={sandboxRef}
            data-testid="challenge-sandbox"
            className="card stack"
            style={{ background: "var(--surface-2)" }}
          >
            <div style={{ fontWeight: 700, fontSize: 14 }}>Sandbox</div>

            <form aria-label="Ticket checkout form" className="stack" onSubmit={(e) => e.preventDefault()}>
              <div className="stack" style={{ gap: 6 }}>
                <label className="small" htmlFor="cl-email">
                  Email
                </label>
                <input
                  id="cl-email"
                  type="email"
                  className="input"
                  data-testid="email-input"
                  aria-label="Email address"
                  placeholder="you@example.com"
                />
              </div>

              <div className="stack" style={{ gap: 6 }}>
                <label className="small" htmlFor="cl-password">
                  Password
                </label>
                <input
                  id="cl-password"
                  type="password"
                  className="input"
                  data-testid="password-input"
                  aria-label="Password"
                />
              </div>

              <label className="agreeRow">
                <input
                  type="checkbox"
                  data-testid="newsletter-checkbox"
                  aria-label="Subscribe to newsletter"
                />
                <span>Subscribe to newsletter</span>
              </label>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="btn btnPrimary"
                  data-testid="confirm-btn"
                  aria-label="Confirm"
                >
                  Confirm
                </button>
                <button type="button" className="btn" data-testid="cancel-btn" aria-label="Cancel">
                  Cancel
                </button>
              </div>
            </form>

            <div className="hr" />

            <div className="stack" style={{ gap: 8 }}>
              <div className="small" style={{ fontWeight: 650, color: "var(--text)" }}>
                Seats
              </div>
              <div
                role="group"
                aria-label="Seat selection"
                style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
              >
                {SANDBOX_SEATS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={["seatBtn", s.taken ? "seatTaken" : ""].join(" ")}
                    data-testid={`seat-${s.id}`}
                    data-seat={s.id}
                    data-taken={s.taken ? "true" : "false"}
                    aria-label={`Seat ${s.id}`}
                    aria-disabled={s.taken ? "true" : "false"}
                    disabled={s.taken}
                    style={{ width: 42, height: 32, fontSize: 12 }}
                  >
                    {s.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="hr" />

            <div className="stack" style={{ gap: 8 }}>
              <div className="small" style={{ fontWeight: 650, color: "var(--text)" }}>
                Cart
              </div>
              <ul data-testid="cart-list" style={{ margin: 0, paddingLeft: 18 }}>
                {CART_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------- Evaluator ---------- */}
          <div className="stack">
            <div className="card stack">
              <div style={{ fontWeight: 700 }}>{challenge.prompt}</div>
              <div className="small">Hint: {challenge.hint}</div>

              {/* selector-type toggle */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="small" style={{ margin: 0 }}>
                  Selector type:
                </span>
                <button
                  type="button"
                  data-testid="selector-type-css"
                  onClick={() => setSelectorType("css")}
                  style={tabStyle(selectorType === "css")}
                >
                  CSS
                </button>
                <button
                  type="button"
                  data-testid="selector-type-xpath"
                  onClick={() => setSelectorType("xpath")}
                  style={tabStyle(selectorType === "xpath")}
                >
                  XPath
                </button>
              </div>

              <input
                className="input"
                data-testid="selector-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectorType === "css"
                    ? 'e.g. [data-testid="email-input"]'
                    : 'e.g. //input[@data-testid="email-input"]'
                }
                style={{
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
                }}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />

              <ResultBanner result={result} expectedCount={challenge.expectedCount} />

              {input.trim() !== "" && (
                <button
                  type="button"
                  className="btn"
                  data-testid="clear-selector"
                  onClick={() => setInput("")}
                  style={{ justifySelf: "start", padding: "6px 10px", fontSize: 12 }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Playwright getBy* explainer */}
            <div className="card stack" style={{ gap: 6 }}>
              <div style={{ fontWeight: 650, fontSize: 13 }}>Playwright getBy* equivalent</div>
              <p className="small" style={{ margin: 0 }}>
                Full <code className="kbd">getBy*</code> resolution is out of scope here (we only
                run raw CSS / XPath), but they map like this:
              </p>
              <pre className="code codeWrap" style={{ margin: 0 }}>
                {[
                  "// CSS you type here →",
                  `page.locator('${selectorType === "css" ? input.trim() || "css…" : "…"}')`,
                  "",
                  "// XPath you type here →",
                  `page.locator('xpath=${selectorType === "xpath" ? input.trim() || "//…" : "//…"}')`,
                  "",
                  "// Prefer the semantic rungs when possible:",
                  "page.getByRole('button', { name: 'Confirm' })",
                  "page.getByLabel('Email address')",
                  "page.getByTestId('cart-list')",
                ].join("\n")}
              </pre>
            </div>

            {/* Show a good answer */}
            <div className="card stack" style={{ gap: 8 }}>
              <button
                type="button"
                className="btn"
                data-testid="toggle-answer"
                onClick={() => setShowAnswer((v) => !v)}
                style={{ justifySelf: "start" }}
              >
                {showAnswer ? "Hide the good answer" : "Show a good answer"}
              </button>

              {showAnswer && (
                <div className="stack" style={{ gap: 8 }} data-testid="good-answer">
                  <div className="small" style={{ margin: 0 }}>
                    Recommended (following the ladder — {challenge.good.rung}):
                  </div>
                  <pre className="code codeWrap" style={{ margin: 0 }}>
                    {[
                      `Playwright : ${challenge.good.playwright}`,
                      `CSS        : ${challenge.good.css}`,
                      `XPath      : ${challenge.good.xpath}`,
                    ].join("\n")}
                  </pre>
                  <p className="small" style={{ margin: 0 }}>
                    Tip: copy the {selectorType.toUpperCase()} line into the box above to see it
                    turn green.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- result banner ---------- */

function ResultBanner({
  result,
  expectedCount,
}: {
  result: EvalResult;
  expectedCount: number;
}) {
  const base = {
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 13,
    border: "1px solid",
  } as const;

  if (result.kind === "empty") {
    return (
      <div
        data-testid="result-banner"
        style={{
          ...base,
          borderColor: "var(--border)",
          background: "var(--surface)",
          color: "var(--text-muted)",
        }}
      >
        Type a selector to see live matches.
      </div>
    );
  }

  if (result.kind === "error") {
    return (
      <div
        data-testid="result-banner"
        style={{
          ...base,
          borderColor: "var(--danger-border)",
          background: "var(--danger-soft)",
          color: "var(--danger)",
        }}
      >
        Invalid selector: {result.message}
      </div>
    );
  }

  const { count, grade, brittle } = result;
  const countLabel = count === 1 ? "1 match" : `${count} matches`;

  if (count === 0) {
    return (
      <div
        data-testid="result-banner"
        style={{
          ...base,
          borderColor: "var(--danger-border)",
          background: "var(--danger-soft)",
          color: "var(--danger)",
        }}
      >
        0 matches ❌ — nothing in the sandbox matched. Check your selector.
      </div>
    );
  }

  if (grade === "correct") {
    return (
      <div className="stack" style={{ gap: 6 }}>
        <div
          data-testid="result-banner"
          style={{
            ...base,
            borderColor: "var(--success-border)",
            background: "var(--success-soft)",
            color: "var(--success)",
          }}
        >
          {countLabel} ✅ Correct! Robust locator.
        </div>
        {brittle && (
          <div
            data-testid="brittle-warning"
            style={{
              ...base,
              borderColor: "color-mix(in srgb, var(--warn) 45%, transparent)",
              background: "color-mix(in srgb, var(--warn) 12%, transparent)",
              color: "var(--warn)",
            }}
          >
            ⚠️ It works, but {brittle}. Prefer role / label / testid.
          </div>
        )}
      </div>
    );
  }

  if (grade === "too-broad") {
    return (
      <div
        data-testid="result-banner"
        style={{
          ...base,
          borderColor: "color-mix(in srgb, var(--warn) 45%, transparent)",
          background: "color-mix(in srgb, var(--warn) 12%, transparent)",
          color: "var(--warn)",
        }}
      >
        {countLabel} — too broad ⚠️ You caught the target(s) plus extra elements. Expected{" "}
        {expectedCount}.
      </div>
    );
  }

  return (
    <div
      data-testid="result-banner"
      style={{
        ...base,
        borderColor: "var(--danger-border)",
        background: "var(--danger-soft)",
        color: "var(--danger)",
      }}
    >
      {countLabel} ❌ Matched the wrong element(s). Expected {expectedCount}.
    </div>
  );
}
