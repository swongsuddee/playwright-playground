import { A2Shell } from "../A2Shell";
import { Connector, Pill, Rect, Diamond, S_DECISION, S_PROCESS, S_TERMINATOR } from "../shapes";

export default function Page() {
  return (
    <A2Shell slug="what">
      <div className="card">
        <p className="small" style={{ margin: 0, fontSize: 13.5 }}>
          A <b>flowchart</b> is a picture of a process: <b>boxes</b> describe the steps and questions, and <b>arrows</b>{" "}
          show the order you do them in. You read it <b>top-to-bottom</b>, following the arrows. When you hit a question the
          flow <b>branches</b> — you take a different path depending on the answer. Programmers sketch flowcharts to plan
          logic before writing a single line of code.
        </p>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>A tiny flowchart</div>
        <div className="scrollX">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 0", minWidth: 260 }}>
            <Pill style={S_TERMINATOR}>Start</Pill>
            <Connector />
            <Rect style={S_PROCESS}>Wake up</Rect>
            <Connector />
            <Diamond style={S_DECISION}>Weekend?</Diamond>
            <div className="grid2" style={{ width: "100%", maxWidth: 460, marginTop: 4, alignItems: "start" }}>
              <div style={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Connector label="No" />
                <Rect style={S_PROCESS}>Go to work</Rect>
              </div>
              <div style={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Connector label="Yes" />
                <Rect style={S_PROCESS}>Relax 😌</Rect>
              </div>
            </div>
            <Connector />
            <Pill style={S_TERMINATOR}>End</Pill>
          </div>
        </div>
      </div>

      <p className="small">Next you'll meet each shape, then read a bigger one — and finally build your own.</p>
    </A2Shell>
  );
}
