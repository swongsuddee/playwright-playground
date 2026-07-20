import { Fragment } from "react";
import Link from "next/link";
import { GAME_GUIDES, type FlowNode } from "./gameGuides";
import { Pill, Rect, Diamond, Connector, S_TERMINATOR, S_PROCESS, S_DECISION } from "../a2-flow-diagrams/shapes";

/**
 * Renders the plan for one A3 bonus game, in the same order a real feature is built:
 *   Acceptance criteria → Break it down (A1) → Flow diagram (A2) → [Physics] → Pseudocode.
 * The decomposition + flow steps come BEFORE any code, so learners think in
 * sub-problems and flowcharts first. Data lives in gameGuides.ts.
 */

const badge = (style: React.CSSProperties): React.CSSProperties => ({ ...style });

// Render a string with literal "\n" line breaks preserved.
const ML = ({ text }: { text: string }) => <span style={{ whiteSpace: "pre-line" }}>{text}</span>;

function FlowShape({ node }: { node: FlowNode }) {
  if (node.kind === "decision") return <Diamond size={150} style={S_DECISION}><ML text={node.text} /></Diamond>;
  if (node.kind === "process") return <Rect style={S_PROCESS}><ML text={node.text} /></Rect>;
  return <Pill style={S_TERMINATOR}><ML text={node.text} /></Pill>; // start | end
}

function FlowChart({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div className="scrollX" style={{ paddingBottom: 4 }}>
      <div style={{ display: "inline-grid", gridTemplateColumns: "max-content max-content", justifyContent: "center", margin: "0 auto", columnGap: 8 }}>
        {nodes.map((n, i) => {
          const shapeRow = 2 * i + 1;
          const connRow = 2 * i + 2;
          return (
            <Fragment key={i}>
              <div style={{ gridColumn: 1, gridRow: shapeRow, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <FlowShape node={n} />
              </div>

              {n.kind === "decision" ? (
                <div style={{ gridColumn: 2, gridRow: shapeRow, display: "flex", alignItems: "center", gap: 6, paddingLeft: 4 }}>
                  <span aria-hidden style={{ color: "var(--text-faint)" }}>──</span>
                  <span className="badge" style={{ padding: "1px 8px", background: "var(--success-soft)", borderColor: "var(--success-border)", color: "var(--success)", fontSize: 11 }}>yes</span>
                  <span aria-hidden style={{ color: "var(--text-faint)" }}>▸</span>
                  {n.yesEnd ? <Pill style={S_TERMINATOR}><ML text={n.yes} /></Pill> : <Rect style={S_PROCESS}><ML text={n.yes} /></Rect>}
                </div>
              ) : null}

              {i < nodes.length - 1 ? (
                <div style={{ gridColumn: 1, gridRow: connRow, display: "flex", justifyContent: "center" }}>
                  <Connector label={n.kind === "decision" ? (n.no ?? "no") : undefined} />
                </div>
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function GameGuide({ slug }: { slug: string }) {
  const guide = GAME_GUIDES[slug];
  if (!guide) return null;

  return (
    <div className="stack" style={{ gap: 16, borderTop: "1px solid var(--border)", paddingTop: 18 }} data-testid="game-guide">
      {/* 1 · Acceptance criteria */}
      <div className="card stack" style={{ gap: 10 }} data-testid="acceptance-criteria">
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="badge" style={badge({ background: "var(--accent-soft)", borderColor: "var(--accent-border)", color: "var(--accent-text)" })}>
            Acceptance criteria
          </span>
          <span className="small" style={{ margin: 0 }}>What “done” means — the checklist you could later turn into tests.</span>
        </div>
        <p className="small" style={{ margin: 0, fontSize: 13.5 }}>{guide.intro}</p>
        <ul className="stack" style={{ gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
          {guide.acceptance.map((ac, i) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", minWidth: 0 }}>
              <span
                aria-hidden
                style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 6, background: "var(--success-soft)", border: "1px solid var(--success-border)", color: "var(--success)", fontWeight: 800, fontSize: 12 }}
              >
                ✓
              </span>
              <span className="small" style={{ margin: 0, fontSize: 13.5, minWidth: 0 }}>{ac}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 2 · Break it down (A1 — Problem Decomposition) */}
      <div className="card stack" style={{ gap: 12 }} data-testid="decomposition">
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="badge" style={badge({ background: "var(--success-soft)", borderColor: "var(--success-border)", color: "var(--success)" })}>
            Break it down
          </span>
          <span className="small" style={{ margin: 0 }}>
            Split the whole game into smaller sub-problems first — the skill from{" "}
            <Link href="/foundations/a3-decomposition" style={{ color: "var(--accent-text)", fontWeight: 600, textDecoration: "underline" }}>A1 · Problem Decomposition</Link>.
          </span>
        </div>
        <ol className="stack" style={{ gap: 10, margin: 0, padding: 0, listStyle: "none" }}>
          {guide.decompose.map((d, i) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", minWidth: 0 }}>
              <span
                aria-hidden
                style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 8, background: "var(--secondary-soft)", color: "var(--secondary-text)", border: "1px solid var(--secondary-border)", fontWeight: 800, fontSize: 12 }}
              >
                {i + 1}
              </span>
              <span className="small" style={{ margin: 0, fontSize: 13.5, minWidth: 0 }}>
                <span style={{ fontWeight: 700, color: "var(--text)" }}>{d.part}</span> — {d.detail}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* 3 · Flow diagram (A2 — Flow Diagrams) */}
      <div className="card stack" style={{ gap: 14 }} data-testid="flow-diagram">
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="badge" style={badge({ background: "var(--secondary-soft)", borderColor: "var(--secondary-border)", color: "var(--secondary-text)" })}>
            Flow diagram
          </span>
          <span className="small" style={{ margin: 0 }}>
            Map the logic as a flowchart before any code — the shapes from{" "}
            <Link href="/foundations/a2-flow-diagrams" style={{ color: "var(--accent-text)", fontWeight: 600, textDecoration: "underline" }}>A2 · Flow Diagrams</Link>. A diamond’s side branch is “yes”; the arrow down is “no”.
          </span>
        </div>
        <FlowChart nodes={guide.flow} />
      </div>

      {/* 4 · Physics (Angry Birds only) */}
      {guide.physics ? (
        <div className="card stack" style={{ gap: 12 }} data-testid="physics-formulas">
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span className="badge" style={badge({ background: "color-mix(in srgb, var(--c-amber) 22%, transparent)", borderColor: "color-mix(in srgb, var(--c-amber) 55%, transparent)", color: "var(--accent-text)" })}>
              📐 Projectile physics
            </span>
            <span className="small" style={{ margin: 0 }}>The math that turns a drag into a flight path.</span>
          </div>
          <p className="small" style={{ margin: 0, fontSize: 13.5 }}>{guide.physics.intro}</p>
          <div className="stack" style={{ gap: 12 }}>
            {guide.physics.formulas.map((f, i) => (
              <div key={i} className="stack" style={{ gap: 6, minWidth: 0 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>{f.name}</span>
                <pre className="code codeWrap" style={{ margin: 0 }}>{f.expr}</pre>
                {f.note ? <span className="small" style={{ margin: 0 }}>{f.note}</span> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 5 · How to build it (pseudocode) */}
      <div className="card stack" style={{ gap: 12 }} data-testid="build-guide">
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="badge" style={badge({ background: "var(--surface-3)", borderColor: "var(--border-strong)", color: "var(--text)" })}>
            How to build it
          </span>
          <span className="small" style={{ margin: 0 }}>Now the code shape — step by step, in pseudocode that works in any language.</span>
        </div>

        <ol className="stack" style={{ gap: 14, margin: 0, padding: 0, listStyle: "none" }}>
          {guide.build.map((step, i) => (
            <li key={i} className="stack" style={{ gap: 8, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", minWidth: 0 }}>
                <span
                  style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent-text)", border: "1px solid var(--accent-border)", fontWeight: 800, fontSize: 12.5 }}
                >
                  {i + 1}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{step.title}</span>
                  <span className="small" style={{ margin: "2px 0 0" }}>{step.detail}</span>
                </span>
              </div>
              {step.pseudo ? (
                <pre className="code codeWrap" style={{ margin: "0 0 0 36px" }}>
                  {step.pseudo}
                </pre>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
