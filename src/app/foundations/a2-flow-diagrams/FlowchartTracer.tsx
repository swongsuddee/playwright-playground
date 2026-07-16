"use client";

import { Fragment, useState, type CSSProperties, type ReactNode } from "react";
import { Connector, Diamond, Pill, Rect } from "./shapes";

type NodeType = "terminator" | "process" | "decision";
type FlowNode = { id: string; type: NodeType; label: string; next?: string; yes?: string; no?: string; isEnd?: boolean };

const TEA: Record<string, FlowNode> = {
  start: { id: "start", type: "terminator", label: "Start", next: "boil" },
  boil: { id: "boil", type: "process", label: "Boil the water", next: "pour" },
  pour: { id: "pour", type: "process", label: "Pour into a cup with a tea bag", next: "ask" },
  ask: { id: "ask", type: "decision", label: "Add sugar?", yes: "sugar", no: "plain" },
  sugar: { id: "sugar", type: "process", label: "Stir in a spoon of sugar", next: "end" },
  plain: { id: "plain", type: "process", label: "Serve it plain", next: "end" },
  end: { id: "end", type: "terminator", label: "Enjoy your tea! 🍵", isEnd: true },
};

type Banner = { kind: "info" | "warn" | "success"; text: string };
const INITIAL_BANNER: Banner = { kind: "info", text: "Click the Start node to begin tracing the flow." };
const BANNER_TONE: Record<Banner["kind"], { bg: string; bd: string; fg: string }> = {
  info: { bg: "var(--secondary-soft)", bd: "var(--secondary-border)", fg: "var(--secondary-text)" },
  warn: { bg: "var(--accent-soft)", bd: "var(--warn)", fg: "var(--warn)" },
  success: { bg: "var(--success-soft)", bd: "var(--success-border)", fg: "var(--success)" },
};

type NodeState = "current" | "visited" | "idle";
function nodeStyle(state: NodeState): CSSProperties {
  if (state === "current") return { background: "var(--accent-soft)", borderColor: "var(--accent)", color: "var(--accent-text)", boxShadow: "0 0 0 3px var(--ring)" };
  if (state === "visited") return { background: "var(--success-soft)", borderColor: "var(--success-border)", color: "var(--text)" };
  return { background: "var(--surface)", borderColor: "var(--border-strong)", color: "var(--text)" };
}

function TracerNode({ node, state, onClick }: { node: FlowNode; state: NodeState; onClick: (id: string) => void }) {
  const style = nodeStyle(state);
  const content = (<>{node.label}{state === "visited" ? " ✓" : ""}</>);
  let shape: ReactNode;
  if (node.type === "terminator") shape = <Pill style={style}>{content}</Pill>;
  else if (node.type === "process") shape = <Rect style={style}>{content}</Rect>;
  else shape = <Diamond style={style}>{content}</Diamond>;
  return (
    <button type="button" data-testid={`node-${node.id}`} aria-label={node.label} aria-current={state === "current" ? "step" : undefined} onClick={() => onClick(node.id)} style={{ display: "inline-flex", background: "transparent", border: "none", padding: 0, margin: 0, font: "inherit", color: "inherit", cursor: "pointer" }}>
      {shape}
    </button>
  );
}

export function FlowchartTracer() {
  const [path, setPath] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, "yes" | "no">>({});
  const [banner, setBanner] = useState<Banner>(INITIAL_BANNER);

  const current = path.length ? path[path.length - 1] : null;
  const done = current === "end";

  const advance = (id: string) => {
    setPath((p) => [...p, id]);
    const node = TEA[id];
    if (node.isEnd) setBanner({ kind: "success", text: "🎉 You reached the End — you traced the whole flowchart!" });
    else if (node.type === "decision") setBanner({ kind: "info", text: "You're at a decision. Answer “Add sugar?” with the Yes / No buttons." });
    else setBanner({ kind: "info", text: `Good — now follow the arrow out of “${node.label}”.` });
  };

  const handleNodeClick = (id: string) => {
    if (current === null) {
      if (id === "start") advance("start");
      else setBanner({ kind: "warn", text: "Every flowchart begins at the Start node — click Start first." });
      return;
    }
    if (id === current) { setBanner({ kind: "info", text: "You're already on this node — look for the next one." }); return; }
    const cur = TEA[current];
    if (cur.isEnd) { setBanner({ kind: "success", text: "You're already at the End. Press Reset to trace it again." }); return; }
    if (cur.type === "decision") { setBanner({ kind: "warn", text: "This is a decision — answer the question with the Yes / No buttons below." }); return; }
    if (id === cur.next) advance(id);
    else setBanner({ kind: "warn", text: `That's not the next step. Follow the arrow out of “${cur.label}”.` });
  };

  const handleAnswer = (choice: "yes" | "no") => {
    if (current === null) return;
    const cur = TEA[current];
    if (cur.type !== "decision") return;
    setAnswers((a) => ({ ...a, [current]: choice }));
    advance(choice === "yes" ? cur.yes! : cur.no!);
  };

  const reset = () => { setPath([]); setAnswers({}); setBanner(INITIAL_BANNER); };
  const stateOf = (id: string): NodeState => (current === id ? "current" : path.includes(id) ? "visited" : "idle");
  const tone = BANNER_TONE[banner.kind];

  return (
    <div className="stack" style={{ gap: 12 }}>
      <p className="small" style={{ margin: 0 }}>
        Walk the flowchart by clicking nodes in order, starting at <b>Start</b>. Only the correct next node advances; a wrong click gives a gentle nudge. At the diamond, answer with the <b>Yes</b> / <b>No</b> buttons.
      </p>
      <div data-testid="tracer-status" role="status" className="card" style={{ padding: "10px 14px", background: tone.bg, border: `1px solid ${tone.bd}`, color: tone.fg, fontWeight: 650, fontSize: 13 }}>
        {banner.text}
      </div>
      <div className="scrollX">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 0", minWidth: 300 }}>
          <TracerNode node={TEA.start} state={stateOf("start")} onClick={handleNodeClick} />
          <Connector />
          <TracerNode node={TEA.boil} state={stateOf("boil")} onClick={handleNodeClick} />
          <Connector />
          <TracerNode node={TEA.pour} state={stateOf("pour")} onClick={handleNodeClick} />
          <Connector />
          <TracerNode node={TEA.ask} state={stateOf("ask")} onClick={handleNodeClick} />
          <div className="grid2" style={{ width: "100%", maxWidth: 520, marginTop: 4, alignItems: "start" }}>
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Connector label="No" />
              <TracerNode node={TEA.plain} state={stateOf("plain")} onClick={handleNodeClick} />
            </div>
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Connector label="Yes" />
              <TracerNode node={TEA.sugar} state={stateOf("sugar")} onClick={handleNodeClick} />
            </div>
          </div>
          <Connector />
          <TracerNode node={TEA.end} state={stateOf("end")} onClick={handleNodeClick} />
        </div>
      </div>
      {current === "ask" ? (
        <div className="card" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span className="small" style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>Add sugar?</span>
          <button type="button" className="btn btnPrimary" data-testid="answer-yes" onClick={() => handleAnswer("yes")}>Yes</button>
          <button type="button" className="btn" data-testid="answer-no" onClick={() => handleAnswer("no")}>No</button>
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="btn" data-testid="tracer-reset" onClick={reset}>↺ Reset</button>
        {done ? <span className="small" style={{ margin: 0, color: "var(--success)", fontWeight: 650 }}>Path complete!</span> : null}
      </div>
      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <span className="small" style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>Path:</span>
        {path.length === 0 ? (
          <span className="small" style={{ margin: 0 }}>No steps yet — click Start.</span>
        ) : (
          path.map((id, i) => (
            <Fragment key={`${id}-${i}`}>
              <span className="badge" style={{ background: "var(--accent-soft)", borderColor: "var(--accent-border)", color: "var(--accent-text)" }}>
                {TEA[id].label}{answers[id] ? ` · ${answers[id] === "yes" ? "Yes" : "No"}` : ""}
              </span>
              {i < path.length - 1 ? <span aria-hidden style={{ color: "var(--text-faint)" }}>→</span> : null}
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
}
