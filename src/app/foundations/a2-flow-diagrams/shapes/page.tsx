import { A2Shell } from "../A2Shell";
import { Diamond, Parallelogram, Pill, Rect, S_DECISION, S_IO, S_PROCESS, S_TERMINATOR } from "../shapes";

const CELL = { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center", minWidth: 0 } as const;
const HEAD = { minHeight: 74, display: "grid", placeItems: "center" } as const;

export default function Page() {
  return (
    <A2Shell slug="shapes">
      <p className="small" style={{ margin: 0 }}>Five shapes cover almost everything you'll read or draw:</p>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
        <div className="card" style={CELL}>
          <div style={HEAD}><Pill style={S_TERMINATOR}>Start</Pill></div>
          <div><div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>Terminator</div><div className="small" style={{ margin: "4px 0 0" }}>Rounded pill — the Start or End of the flow.</div></div>
        </div>
        <div className="card" style={CELL}>
          <div style={HEAD}><Rect style={S_PROCESS}>Do a step</Rect></div>
          <div><div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>Process</div><div className="small" style={{ margin: "4px 0 0" }}>Rectangle — one action or step to carry out.</div></div>
        </div>
        <div className="card" style={CELL}>
          <div style={HEAD}><Diamond size={74} style={S_DECISION}>Yes / No?</Diamond></div>
          <div><div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>Decision</div><div className="small" style={{ margin: "4px 0 0" }}>Diamond — a yes/no question that branches.</div></div>
        </div>
        <div className="card" style={CELL}>
          <div style={HEAD}><Parallelogram style={S_IO}>Data</Parallelogram></div>
          <div><div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>Input / Output</div><div className="small" style={{ margin: "4px 0 0" }}>Parallelogram — data going in or coming out.</div></div>
        </div>
        <div className="card" style={CELL}>
          <div style={HEAD}><span style={{ fontSize: 30, fontWeight: 800, color: "var(--accent-text)" }}>→</span></div>
          <div><div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>Arrow</div><div className="small" style={{ margin: "4px 0 0" }}>Connector — the direction the flow moves.</div></div>
        </div>
      </div>
      <p className="small">The diamond is the important one — it's where a program makes a choice.</p>
    </A2Shell>
  );
}
