import Link from "next/link";
import type { ReactNode } from "react";
import { A1_BASE, LESSONS } from "./scratchData";

export function A1LessonShell({ slug, children }: { slug: string; children: ReactNode }) {
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  const lesson = LESSONS[idx];
  const prev = idx > 0 ? LESSONS[idx - 1] : null;
  const next = idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null;

  const prevHref = prev ? `${A1_BASE}/${prev.slug}` : A1_BASE;
  const nextHref = next ? `${A1_BASE}/${next.slug}` : A1_BASE;

  return (
    <section className="panel">
      <div className="panelHeader">
        <div className="small" style={{ margin: 0, fontWeight: 700, color: "var(--accent-text)" }}>
          A3 · Step {lesson.n} of {LESSONS.length}
        </div>
        <h1 className="h1" style={{ marginTop: 6 }}>{lesson.title}</h1>
      </div>

      <div className="panelBody stack" style={{ gap: 18 }}>
        {children}

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <Link className="btn" href={prevHref}>← {prev ? `${prev.n}. ${prev.title}` : "Overview"}</Link>
          <Link className={next ? "btn btnPrimary" : "btn"} href={nextHref}>
            {next ? `${next.n}. ${next.title} →` : "Finish · back to overview ↺"}
          </Link>
        </div>
      </div>
    </section>
  );
}
