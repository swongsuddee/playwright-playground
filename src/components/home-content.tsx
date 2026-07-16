import Link from "next/link";

export default function HomeContent() {
  return (
    <section className="panel panelSticky">
      <div className="panelHeader">
        <h1 className="h1">🎭 Playwright Playground</h1>
        <p className="small">Learn Playwright by interacting with real UI patterns.</p>
      </div>

      <div className="panelBody stack" style={{ gap: 16 }}>
        <div>
          <h2 className="h2">What is this?</h2>
          <p className="small" style={{ maxWidth: "62ch" }}>
            A hands-on playground for QA engineers. Each session gives you a small, realistic UI so you can practice
            writing locators, actions, and assertions — and Track A covers the programming foundations underneath.
          </p>
        </div>

        <div className="grid2">
          <div className="card">
            <h3 className="h2">What you&rsquo;ll practice</h3>
            <ul className="inspectorList" style={{ marginTop: 10 }}>
              <li><b>Foundations:</b> sequence, loops &amp; conditionals as blocks</li>
              <li><b>Locators:</b> role, label, test id, text, CSS, XPath</li>
              <li><b>Actions:</b> click, hover, fill, type, press, select</li>
              <li><b>Assertions:</b> web-first, auto-retrying expectations</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="h2">How to use it</h3>
            <ol className="inspectorList" style={{ marginTop: 10 }}>
              <li>Pick a session from the left sidebar</li>
              <li>Interact with the UI in the center panel</li>
              <li>Hover elements to inspect locator hints</li>
              <li>Translate what you see into Playwright code</li>
            </ol>
          </div>
        </div>

        <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <span className="small" style={{ margin: 0 }}>Start here:</span>
          <Link className="btn btnPrimary" href="/foundations/a3-decomposition">A1 — Problem Decomposition</Link>
          <Link className="btn" href="/sessions/session-1-locators">Session 1 — Locators</Link>
          <Link className="btn" href="/sessions/session-2-basic-operations">Session 2 — Basic Ops</Link>
        </div>
      </div>
    </section>
  );
}
