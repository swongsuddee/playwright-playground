import Link from "next/link";
import type { ReactNode } from "react";
import { A2_BASE, A2_LESSONS } from "./a2Data";

export function A2Shell({ slug, children }: { slug: string; children: ReactNode }) {
  const idx = A2_LESSONS.findIndex((l) => l.slug === slug);
  const lesson = A2_LESSONS[idx];
  const prev = idx > 0 ? A2_LESSONS[idx - 1] : null;
  const next = idx < A2_LESSONS.length - 1 ? A2_LESSONS[idx + 1] : null;
  const prevHref = prev ? `${A2_BASE}/${prev.slug}` : A2_BASE;
  const nextHref = next ? `${A2_BASE}/${next.slug}` : "/foundations/a1-code-blocks";

  return (
    <section className="panel">
      <div className="panelHeader">
        <div className="small" style={{ margin: 0, fontWeight: 700, color: "var(--accent-text)" }}>A2 · Step {lesson.n} of {A2_LESSONS.length}</div>
        <h1 className="h1" style={{ marginTop: 6 }}>{lesson.title}</h1>
      </div>
      <div className="panelBody stack" style={{ gap: 18 }}>
        {children}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <Link className="btn" href={prevHref}>← {prev ? `${prev.n}. ${prev.title}` : "Overview"}</Link>
          <Link className={next ? "btn btnPrimary" : "btn btnPrimary"} href={nextHref}>{next ? `${next.n}. ${next.title} →` : "Finish → A3 Code Blocks"}</Link>
        </div>
      </div>
    </section>
  );
}
