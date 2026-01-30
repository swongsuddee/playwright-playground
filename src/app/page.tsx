import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <section className="panel" style={{ gridColumn: "1 / -1" }}>
        <div className="panelHeader">
          <h1 className="h1">Playwright Beginner Playground</h1>
          <p className="small">Start with Session 1 — Locator Finding</p>
        </div>
        <div className="panelBody">
          <Link className="btn btnPrimary" href="/sessions/session-1-locators">
            Go to Session 1
          </Link>
        </div>
      </section>
    </main>
  );
}
