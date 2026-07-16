import Link from "next/link";
import { A2_BASE, A2_LESSONS } from "./a2Data";

export default function Page() {
  return (
    <section className="panel">
      <div className="panelHeader">
        <div className="small" style={{ margin: 0, fontWeight: 700, color: "var(--accent-text)" }}>Track A · Foundations</div>
        <h1 className="h1" style={{ marginTop: 6 }}>A2 — Flow Diagrams</h1>
        <p className="small">Learn to read flowcharts, meet the shapes, then build one by dragging shapes onto a grid.</p>
      </div>

      <div className="panelBody stack" style={{ gap: 16 }}>
        <p className="small" style={{ maxWidth: "62ch", fontSize: 13.5 }}>
          A flowchart is how you plan logic before writing code. Work through the four short steps in order — the last one
          lets you build your own flow by drag-and-drop.
        </p>

        <div className="stack" style={{ gap: 10 }}>
          {A2_LESSONS.map((l) => (
            <Link key={l.slug} href={`${A2_BASE}/${l.slug}`} className="card" style={{ display: "flex", gap: 12, alignItems: "center", textDecoration: "none" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 9, background: "var(--accent-soft)", color: "var(--accent-text)", border: "1px solid var(--accent-border)", fontWeight: 800, flex: "0 0 auto" }}>{l.n}</span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{l.title}</span>
                <span className="small" style={{ margin: 0 }}>{l.summary}</span>
              </span>
              <span className="small" style={{ margin: 0, marginLeft: "auto", color: "var(--accent-text)", flex: "0 0 auto" }}>→</span>
            </Link>
          ))}
        </div>

        <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <Link className="btn btnPrimary" href={`${A2_BASE}/${A2_LESSONS[0].slug}`}>Start step 1 →</Link>
          <Link className="btn" href="/foundations/a3-decomposition">← Back to A1</Link>
        </div>
      </div>
    </section>
  );
}
