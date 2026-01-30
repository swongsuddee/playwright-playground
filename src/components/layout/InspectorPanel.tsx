import { LocatorHint } from "../types";

const emptyHint: LocatorHint = {
  id: "none",
  title: "Hover an element to inspect",
  selectors: [
    `page.getByRole('button', { name: 'Save' })`,
    `page.getByText('Welcome')`,
    `page.locator('[data-testid="price"]')`,
  ],
  purpose: "Use the playground to practice finding stable locators.",
  actions: ["Hover elements in the center panel", "Try to guess the best locator strategy", "Copy selector examples"],
  docsUrl: "https://playwright.dev/docs/intro",
  target: ""
};

export function InspectorPanel({ hint }: { hint: LocatorHint | null }) {
  const h = hint ?? emptyHint;

  return (
    <aside className="panel inspector panelSticky noScrollBar" style={{ overflowY: "auto" }}>
      <div className="panelHeader">
        <h2 className="h1">Inspector</h2>
        <p className="small">Purpose + suggested actions + official docs</p>
      </div>

      <div className="panelBody stack">
        <div className="card">
          <div className="inspectorTitleRow">
            <div className="inspectorTitle">{h.title}</div>
            <span className="badge inspectorBadge">{h.id}</span>
          </div>

          <p className="small" style={{ marginTop: 8 }}>
            {h.purpose}
          </p>
        </div>

        <div className="card">
          <div style={{ fontWeight: 650, marginBottom: 8 }}>Selector examples</div>
          <pre className="code codeWrap" style={{ margin: 0 }}>
            {h.selectors.join("\n")}
          </pre>
        </div>

        <div className="card">
          <div style={{ fontWeight: 650, marginBottom: 8 }}>What you can do</div>
          <ul className="inspectorList">
            {h.actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        <a className="btn btnPrimary" href={h.docsUrl} target="_blank" rel="noreferrer">
          Open official docs<br></br>
          {h.docsUrl.match(/(?:^.*\/docs)(.*)/)?.[1]}
        </a>
      </div>
    </aside>
  );
}
