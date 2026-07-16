"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { A2_BASE, A2_LESSONS, getA2Lesson } from "./a2Data";

export function A2Rail() {
  const pathname = usePathname();
  const [revealed, setRevealed] = useState(false);
  const slug = pathname.startsWith(A2_BASE + "/") ? pathname.slice(A2_BASE.length + 1) : "";
  const lesson = getA2Lesson(slug);
  useEffect(() => setRevealed(false), [slug]);
  const pct = lesson ? Math.round((lesson.n / A2_LESSONS.length) * 100) : 0;

  return (
    <aside className="panel inspector panelSticky noScrollBar" style={{ overflowY: "auto" }}>
      <div className="panelHeader">
        <h2 className="h1">Flowchart companion</h2>
        <p className="small">A cheat-sheet and a quick self-check.</p>
      </div>
      <div className="panelBody stack">
        {lesson ? (
          <>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Step {lesson.n} of {A2_LESSONS.length}</div>
                <div className="small" style={{ margin: 0 }}>{pct}%</div>
              </div>
              <div style={{ marginTop: 8, height: 8, borderRadius: 999, background: "var(--surface-2)", border: "1px solid var(--border)", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent)" }} />
              </div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>In this step</div>
              <p className="small" style={{ margin: 0 }}>{lesson.objective}</p>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>✓ Checkpoint</div>
              <p className="small" style={{ margin: 0 }}>{lesson.checkQ}</p>
              {revealed ? (
                <p className="small" style={{ marginTop: 8, padding: 10, borderRadius: 10, background: "var(--success-soft)", border: "1px solid var(--success-border)", color: "var(--text)" }}>{lesson.checkA}</p>
              ) : (
                <button type="button" className="btn" style={{ marginTop: 10 }} onClick={() => setRevealed(true)}>Show answer</button>
              )}
            </div>
          </>
        ) : (
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>This module</div>
            <p className="small" style={{ margin: 0 }}>Four short steps: what a flowchart is, the shapes, reading one, then building one by drag-and-drop.</p>
            <Link className="btn btnPrimary" href={`${A2_BASE}/${A2_LESSONS[0].slug}`} style={{ marginTop: 10, width: "100%" }}>Start step 1 →</Link>
          </div>
        )}

        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Shapes cheat-sheet</div>
          <ul className="inspectorList" style={{ fontSize: 13, lineHeight: 1.6 }}>
            <li><b>Oval / pill</b> = Start &amp; End</li>
            <li><b>Rectangle</b> = an action step</li>
            <li><b>Diamond</b> = a yes/no decision</li>
            <li><b>Parallelogram</b> = input / output</li>
            <li><b>Arrow</b> = the direction of flow</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
