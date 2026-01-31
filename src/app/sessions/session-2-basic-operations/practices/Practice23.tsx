import { useState } from "react";
import { CodeBox, PracticeTitle } from "./PracticeShared";

export function Practice23() {
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
            <ul style={{ paddingLeft: 20, marginTop: 6 }}>
              <li>
                display: none → 
                <span
                  data-testid="display-none-text"
                  style={{ display: "none" }}
                >
                  element is removed from layout and not visible to the user
                </span>
              </li>

              <li>
                opacity: 0 → 
                <span
                  data-testid="muted-opacity-text"
                  style={ { opacity: 0}}
                >
                  element still exists in layout but fully transparent
                </span>
              </li>
              <li>
                visibility: hidden → 
                <span
                  data-testid="visibility-hidden-text"
                  style={{ visibility: "hidden" }}
                >
                  element keeps its space but text is invisible
                </span>
              </li>
            </ul>
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

      <div
        className="card"
        style={{
          padding: 12,
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <table className="table">
          <thead>
            <tr>
              <th>CSS Style</th>
              <th>Visible to User</th>
              <th>Takes Layout Space</th>
              <th>Playwright Testing Insight</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>display: none</code></td>
              <td>❌ No</td>
              <td>❌ No</td>
              <td>
                <code>textContent()</code> can still read text,
                <code>innerText()</code> returns empty
              </td>
            </tr>

            <tr>
              <td><code>opacity: 0</code></td>
              <td>❌ No</td>
              <td>✅ Yes</td>
              <td>
                Element exists in DOM and layout,
                visibility assertions may still pass
              </td>
            </tr>

            <tr>
              <td><code>visibility: hidden</code></td>
              <td>❌ No</td>
              <td>✅ Yes</td>
              <td>
                Layout is preserved,
                <code>textContent()</code> still returns text
              </td>
            </tr>
          </tbody>
        </table>

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