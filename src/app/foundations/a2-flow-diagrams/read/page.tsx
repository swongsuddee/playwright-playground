import { A2Shell } from "../A2Shell";
import { FlowchartTracer } from "../FlowchartTracer";
import { Connector, Diamond, Pill, Rect, S_DECISION, S_ERROR, S_PROCESS, S_TERMINATOR } from "../shapes";

export default function Page() {
  return (
    <A2Shell slug="read">
      <div className="stack" style={{ gap: 8 }}>
        <h2 className="h2">Worked example — logging in</h2>
        <p className="small" style={{ margin: 0 }}>Read it top-to-bottom. The diamond asks a question, and the flow splits into a <b>Yes</b> path and a <b>No</b> path.</p>
        <div className="card">
          <div className="scrollX">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 0", minWidth: 300 }}>
              <Pill style={S_TERMINATOR}>Start</Pill>
              <Connector />
              <Rect style={S_PROCESS}>Type your username &amp; password</Rect>
              <Connector />
              <Rect style={S_PROCESS}>Click the “Log in” button</Rect>
              <Connector />
              <Diamond style={S_DECISION}>Login correct?</Diamond>
              <div className="grid2" style={{ width: "100%", maxWidth: 520, marginTop: 4, alignItems: "start" }}>
                <div style={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Connector label="No" />
                  <Rect style={S_ERROR}>Show “wrong password” error</Rect>
                  <Connector />
                  <span className="small" style={{ margin: 0 }}>↺ go back &amp; try again</span>
                </div>
                <div style={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Connector label="Yes" />
                  <Rect style={S_PROCESS}>Open your dashboard</Rect>
                  <Connector />
                  <Pill style={S_TERMINATOR}>End</Pill>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        <h2 className="h2">Try it — trace the flow</h2>
        <div className="card"><FlowchartTracer /></div>
      </div>
    </A2Shell>
  );
}
