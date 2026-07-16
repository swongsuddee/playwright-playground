"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { A1_BASE, LESSONS, SCRATCH_URL, getLesson } from "./scratchData";

export function A1Rail() {
  const pathname = usePathname();
  const [revealed, setRevealed] = useState(false);

  // Which lesson are we on? (base path = overview)
  const slug = pathname.startsWith(A1_BASE + "/") ? pathname.slice(A1_BASE.length + 1) : "";
  const lesson = getLesson(slug);

  // Reset the checkpoint reveal whenever the lesson changes.
  useEffect(() => setRevealed(false), [slug]);

  const pct = lesson ? Math.round((lesson.n / LESSONS.length) * 100) : 0;

  return (
    <aside className="panel inspector panelSticky noScrollBar" style={{ overflowY: "auto" }}>
      <div className="panelHeader">
        <h2 className="h1">Scratch companion</h2>
        <p className="small">Your workspace launcher and a quick self-check.</p>
      </div>

      <div className="panelBody stack">
        <a className="btn btnPrimary" href={SCRATCH_URL} target="_blank" rel="noreferrer" style={{ width: "100%" }}>
          Open Scratch editor ↗
        </a>
        <p className="small" style={{ margin: 0 }}>Opens in a new tab — build alongside the lesson.</p>

        {lesson ? (
          <>
            {/* Position progress */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Step {lesson.n} of {LESSONS.length}</div>
                <div className="small" style={{ margin: 0 }}>{pct}%</div>
              </div>
              <div style={{ marginTop: 8, height: 8, borderRadius: 999, background: "var(--surface-2)", border: "1px solid var(--border)", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent)", transition: "width 0.25s ease" }} />
              </div>
            </div>

            {/* In this lesson */}
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>In this step</div>
              <p className="small" style={{ margin: 0 }}>{lesson.objective}</p>
            </div>

            {/* Checkpoint self-check */}
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>✓ Checkpoint</div>
              <p className="small" style={{ margin: 0 }}>{lesson.checkQ}</p>
              {revealed ? (
                <p className="small" style={{ marginTop: 8, padding: 10, borderRadius: 10, background: "var(--success-soft)", border: "1px solid var(--success-border)", color: "var(--text)" }}>
                  {lesson.checkA}
                </p>
              ) : (
                <button type="button" className="btn" style={{ marginTop: 10 }} onClick={() => setRevealed(true)}>
                  Show answer
                </button>
              )}
            </div>
          </>
        ) : (
          /* Overview mode */
          <>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>This session</div>
              <p className="small" style={{ margin: 0 }}>
                A few short lessons, five hands-on Scratch practices, and a bonus game — work through them in order.
              </p>
            </div>
            <Link className="btn" href={`${A1_BASE}/${LESSONS[0].slug}`} style={{ width: "100%" }}>
              Start Lesson 1 →
            </Link>
          </>
        )}

        {/* One handy reminder */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 13 }}>Remember</div>
          <p className="small">Green flag ⚑ runs everything. Red ⏹ stops it. If a block won’t snap, it doesn’t belong there.</p>
        </div>
      </div>
    </aside>
  );
}
