import Link from "next/link";
import { A1_BASE, LESSONS, SCRATCH_URL } from "./scratchData";

const KIND: Record<string, string> = { learn: "Learn", build: "Practice", play: "Game" };

export default function Page() {
  return (
    <section className="panel">
      <div className="panelHeader">
        <h1 className="h1">A3 — Code Blocks with Scratch</h1>
        <p className="small">
          Your first taste of programming — no typing, no syntax errors. Bite-size lessons, hands-on practice, and a
          bonus game take you from “what is a block?” to building your own projects in the real Scratch editor.
        </p>
      </div>

      <div className="panelBody stack" style={{ gap: 16 }}>
        <p className="small" style={{ maxWidth: "70ch", fontSize: 13.5 }}>
          Go through the steps in order — each takes a couple of minutes. The <b>Learn</b> steps explain an idea, the{" "}
          <b>Practice</b> steps have you build it in Scratch, and the final <b>Game</b> is a fun challenge.
        </p>

        <div className="stack" style={{ gap: 10 }}>
          {LESSONS.map((l) => (
            <Link
              key={l.slug}
              href={`${A1_BASE}/${l.slug}`}
              className="card"
              style={{ display: "flex", gap: 12, alignItems: "center", textDecoration: "none" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  background: "var(--accent-soft)",
                  color: "var(--accent-text)",
                  border: "1px solid var(--accent-border)",
                  fontWeight: 800,
                  flex: "0 0 auto",
                }}
              >
                {l.n}
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{l.title}</span>
                <span className="small" style={{ margin: 0 }}>{l.summary}</span>
              </span>
              <span className="badge" style={{ marginLeft: "auto", flex: "0 0 auto" }}>{KIND[l.kind]}</span>
              <span className="small" style={{ margin: 0, color: "var(--accent-text)", flex: "0 0 auto" }}>→</span>
            </Link>
          ))}
        </div>

        <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <Link className="btn btnPrimary" href={`${A1_BASE}/${LESSONS[0].slug}`}>Start Lesson 1 →</Link>
          <a className="btn" href={SCRATCH_URL} target="_blank" rel="noreferrer">Open Scratch editor ↗</a>
        </div>
      </div>
    </section>
  );
}
