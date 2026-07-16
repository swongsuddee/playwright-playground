import { GAME_GUIDES } from "./gameGuides";

/**
 * Renders the acceptance criteria + build guide for one A3 bonus game.
 * Data lives in gameGuides.ts, keyed by the lesson slug ("maze" | "flappy" | "angry-birds").
 */
export function GameGuide({ slug }: { slug: string }) {
  const guide = GAME_GUIDES[slug];
  if (!guide) return null;

  return (
    <div className="stack" style={{ gap: 16, borderTop: "1px solid var(--border)", paddingTop: 18 }} data-testid="game-guide">
      {/* Acceptance criteria */}
      <div className="card stack" style={{ gap: 10 }} data-testid="acceptance-criteria">
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span
            className="badge"
            style={{ background: "var(--accent-soft)", borderColor: "var(--accent-border)", color: "var(--accent-text)" }}
          >
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
                style={{
                  flex: "0 0 auto",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: "var(--success-soft)",
                  border: "1px solid var(--success-border)",
                  color: "var(--success)",
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                ✓
              </span>
              <span className="small" style={{ margin: 0, fontSize: 13.5, minWidth: 0 }}>{ac}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Build guide */}
      <div className="card stack" style={{ gap: 12 }} data-testid="build-guide">
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span
            className="badge"
            style={{ background: "var(--secondary-soft)", borderColor: "var(--secondary-border)", color: "var(--secondary-text)" }}
          >
            How to build it
          </span>
          <span className="small" style={{ margin: 0 }}>Step by step, in pseudocode — the shape works in any language.</span>
        </div>

        <ol className="stack" style={{ gap: 14, margin: 0, padding: 0, listStyle: "none" }}>
          {guide.build.map((step, i) => (
            <li key={i} className="stack" style={{ gap: 8, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", minWidth: 0 }}>
                <span
                  style={{
                    flex: "0 0 auto",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    background: "var(--accent-soft)",
                    color: "var(--accent-text)",
                    border: "1px solid var(--accent-border)",
                    fontWeight: 800,
                    fontSize: 12.5,
                  }}
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
