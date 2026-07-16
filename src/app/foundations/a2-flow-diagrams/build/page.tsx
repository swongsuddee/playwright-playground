import { A2Shell } from "../A2Shell";
import { FlowBuilder } from "../FlowBuilder";

export default function Page() {
  return (
    <A2Shell slug="build">
      <div className="stack" style={{ gap: 8 }}>
        <p className="small" style={{ margin: 0, fontSize: 13.5 }}>
          Now build a flowchart you can actually <b>run</b>. <b>Drag</b> shapes onto the grid (they snap); <b>Start</b> is
          pinned to the top and <b>End</b> to the bottom. <b>Click a shape to edit it</b>:
        </p>
        <ul className="inspectorList" style={{ fontSize: 13, lineHeight: 1.6 }}>
          <li><b>Process</b> — type a statement to declare or change a variable, e.g. <code>count = 0</code>.</li>
          <li><b>Input</b> — asks the user for a value in a dialog and stores it in a variable.</li>
          <li><b>Output</b> — shows a value in a dialog, e.g. <code>&quot;Hello, &quot; + name</code>.</li>
          <li><b>Decision</b> — a condition like <code>count &lt; 5</code>; connect its <b>Y</b> and <b>N</b> handles to branch.</li>
        </ul>
        <p className="small" style={{ margin: 0, fontSize: 13.5 }}>
          Connect shapes with the <b>●</b> handles, then press <b>▶ Run</b> — the flow executes, prompting and showing
          dialogs, with a live variables + output panel.
        </p>
      </div>
      <div className="card">
        <FlowBuilder />
      </div>
      <p className="small">
        This is a real (tiny) program — the same ideas as A1's Scratch blocks: variables, input/output, and branching.
      </p>
    </A2Shell>
  );
}
