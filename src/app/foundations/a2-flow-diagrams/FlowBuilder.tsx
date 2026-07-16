"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { coerceInput, evalExpr, runStatement, type Vars } from "./flowEval";

/* ------------------------------------------------------------------ *
 * A2 — interactive, runnable flowchart builder.
 * • Drag shapes from the palette onto a grid canvas (snap to grid).
 * • Start (top) & End (bottom) are fixed; the canvas grows downward.
 * • Edit each shape: Process = a statement (declare/assign a variable),
 *   Input = ask for a value (dialog), Output = show a value (dialog),
 *   Decision = a condition that branches Yes / No.
 * • Connect shapes, then ▶ Run to execute the flow.
 * All UI colours come from CSS-var tokens; no eval() is used.
 * ------------------------------------------------------------------ */

const GRID = 20;
const CANVAS_W = 580;
const MIN_H = 460;
const START_Y = GRID * 2;
const STEP_CAP = 2000;

type NType = "process" | "input" | "output" | "decision";
type AnyType = NType | "terminator";
type Data = { text?: string; varName?: string; prompt?: string; cond?: string };
type BNode = { id: string; type: NType; x: number; y: number; data: Data };
type Edge = { from: string; to: string; branch?: "yes" | "no" };

const DIMS: Record<AnyType, { w: number; h: number }> = {
  terminator: { w: 150, h: 44 },
  process: { w: 200, h: 56 },
  input: { w: 200, h: 54 },
  output: { w: 200, h: 54 },
  decision: { w: 176, h: 108 },
};
const DEFAULTS: Record<NType, Data> = {
  process: { text: "count = 0" },
  input: { varName: "name", prompt: "Enter a value" },
  output: { text: '"Hello, " + name' },
  decision: { cond: "count < 5" },
};
const PALETTE: { type: NType; label: string }[] = [
  { type: "process", label: "Process" },
  { type: "input", label: "Input" },
  { type: "output", label: "Output" },
  { type: "decision", label: "Decision" },
];

const snap = (v: number) => Math.round(v / GRID) * GRID;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const centerX = (w: number) => snap((CANVAS_W - w) / 2);
const truthy = (v: unknown) => (typeof v === "boolean" ? v : typeof v === "number" ? v !== 0 : Boolean(v));

function display(n: BNode): string {
  if (n.type === "process") return n.data.text || "…";
  if (n.type === "input") return `${n.data.varName || "x"} ⟵ ask`;
  if (n.type === "output") return `show ${n.data.text || "…"}`;
  return n.data.cond || "…?";
}

type ConnectFrom = { id: string; branch?: "yes" | "no" } | null;
type Drag = { kind: "new"; type: NType } | { kind: "move"; id: string; dx: number; dy: number };
type Awaiting = { kind: "input"; nodeId: string; prompt: string; varName: string } | { kind: "output"; nodeId: string; message: string } | null;
type RunStatus = { kind: "idle" | "running" | "done" | "error"; msg: string };

export function FlowBuilder() {
  const [nodes, setNodes] = useState<BNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [connectFrom, setConnectFrom] = useState<ConnectFrom>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [ghost, setGhost] = useState<{ type: NType; x: number; y: number } | null>(null);

  // run state (for rendering)
  const [runStatus, setRunStatus] = useState<RunStatus>({ kind: "idle", msg: "" });
  const [runVars, setRunVars] = useState<Vars>({});
  const [runLog, setRunLog] = useState<string[]>([]);
  const [awaiting, setAwaiting] = useState<Awaiting>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const movedRef = useRef(false);
  const nodesRef = useRef<BNode[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const connectRef = useRef<ConnectFrom>(null);
  const idRef = useRef(0);
  // run refs
  const varsRef = useRef<Vars>({});
  const logRef = useRef<string[]>([]);
  const cursorRef = useRef<string>("start");
  const stepsRef = useRef(0);

  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);
  useEffect(() => { connectRef.current = connectFrom; }, [connectFrom]);

  const contentBottom = nodes.reduce((m, n) => Math.max(m, n.y + DIMS[n.type].h), START_Y + DIMS.terminator.h);
  const canvasH = Math.max(MIN_H, contentBottom + GRID * 6);
  const endY = canvasH - DIMS.terminator.h - GRID * 2;
  const canvasHRef = useRef(canvasH);
  useEffect(() => { canvasHRef.current = canvasH; }, [canvasH]);

  // ---- pointer drag (place / move) ----
  const onMove = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    if (d.kind === "new") { setGhost((g) => (g ? { ...g, x: e.clientX, y: e.clientY } : g)); return; }
    movedRef.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { w, h } = DIMS[nodesRef.current.find((n) => n.id === d.id)?.type ?? "process"];
    const eY = canvasHRef.current - DIMS.terminator.h - GRID * 2;
    const x = clamp(snap(e.clientX - rect.left - d.dx), GRID, CANVAS_W - w - GRID);
    const y = clamp(snap(e.clientY - rect.top - d.dy), START_Y + DIMS.terminator.h + GRID, eY - h - GRID);
    setNodes((ns) => ns.map((n) => (n.id === d.id ? { ...n, x, y } : n)));
  }, []);

  const onUp = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    dragRef.current = null;
    setGhost(null);
    if (!d || d.kind !== "new") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
    const { w, h } = DIMS[d.type];
    const eY = canvasHRef.current - DIMS.terminator.h - GRID * 2;
    const x = clamp(snap(e.clientX - rect.left - w / 2), GRID, CANVAS_W - w - GRID);
    const y = clamp(snap(e.clientY - rect.top - h / 2), START_Y + DIMS.terminator.h + GRID, eY - h - GRID);
    idRef.current += 1;
    const id = `n${idRef.current}`;
    setNodes((ns) => [...ns, { id, type: d.type, x, y, data: { ...DEFAULTS[d.type] } }]);
    setSelected(id);
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [onMove, onUp]);

  const startNew = (type: NType, e: React.PointerEvent) => { e.preventDefault(); dragRef.current = { kind: "new", type }; setGhost({ type, x: e.clientX, y: e.clientY }); };
  const startMove = (id: string, e: React.PointerEvent) => {
    if (connectRef.current) return;
    e.preventDefault();
    movedRef.current = false;
    const rect = canvasRef.current?.getBoundingClientRect();
    const n = nodesRef.current.find((x) => x.id === id);
    if (!rect || !n) return;
    dragRef.current = { kind: "move", id, dx: e.clientX - rect.left - n.x, dy: e.clientY - rect.top - n.y };
  };

  const onNodeClick = (id: string) => {
    const cf = connectRef.current;
    if (cf) {
      if (cf.id === id || id === "start") { setConnectFrom(null); return; }
      setEdges((es) => [...es.filter((e) => !(e.from === cf.id && (e.branch ?? null) === (cf.branch ?? null))), { from: cf.id, to: id, branch: cf.branch }]);
      setConnectFrom(null);
      return;
    }
    if (movedRef.current) { movedRef.current = false; return; }
    setSelected(id === "start" || id === "end" ? null : id);
  };

  const removeNode = (id: string) => { setNodes((ns) => ns.filter((n) => n.id !== id)); setEdges((es) => es.filter((e) => e.from !== id && e.to !== id)); setSelected((s) => (s === id ? null : s)); };
  const removeEdge = (e: Edge) => setEdges((es) => es.filter((x) => !(x.from === e.from && x.to === e.to && x.branch === e.branch)));
  const updateData = (id: string, patch: Data) => setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));
  const clearAll = () => { setNodes([]); setEdges([]); setConnectFrom(null); setSelected(null); resetRun(); };

  // ---- run engine ----
  const getNode = (id: string): BNode | { id: string; type: "terminator" } | null =>
    id === "start" || id === "end" ? { id, type: "terminator" } : nodesRef.current.find((n) => n.id === id) ?? null;
  const outEdge = (id: string, branch?: "yes" | "no"): string | null => {
    const e = edgesRef.current.find((x) => x.from === id && (branch ? x.branch === branch : true));
    return e?.to ?? null;
  };
  const sync = () => { setRunVars({ ...varsRef.current }); setRunLog([...logRef.current]); setActiveId(cursorRef.current); };
  const fail = (msg: string) => { setRunStatus({ kind: "error", msg }); setAwaiting(null); sync(); };

  const resetRun = () => { setRunStatus({ kind: "idle", msg: "" }); setRunVars({}); setRunLog([]); setAwaiting(null); setActiveId(null); };

  const pump = () => {
    for (;;) {
      if (stepsRef.current++ > STEP_CAP) return fail("This looks like an endless loop — make sure a path reaches End.");
      const id = cursorRef.current;
      if (id === "end") { setRunStatus({ kind: "done", msg: "🏁 Finished — the flow reached End." }); setActiveId("end"); sync(); return; }
      const node = getNode(id);
      if (!node) return fail("A connected shape is missing.");
      if (id === "start") { const t = outEdge("start"); if (!t) return fail("Connect Start to the first shape."); cursorRef.current = t; continue; }
      const bn = node as BNode;
      if (bn.type === "process") {
        try { runStatement(bn.data.text ?? "", varsRef.current); } catch (err) { return fail(`Process “${bn.data.text}”: ${(err as Error).message}`); }
        const t = outEdge(id); if (!t) return fail(`Connect an arrow out of “${display(bn)}”.`);
        cursorRef.current = t; continue;
      }
      if (bn.type === "decision") {
        let b: boolean;
        try { b = truthy(evalExpr(bn.data.cond ?? "", varsRef.current)); } catch (err) { return fail(`Decision “${bn.data.cond}”: ${(err as Error).message}`); }
        const t = outEdge(id, b ? "yes" : "no"); if (!t) return fail(`Add a ${b ? "Yes" : "No"} arrow from “${bn.data.cond}”.`);
        cursorRef.current = t; continue;
      }
      if (bn.type === "input") { setActiveId(id); sync(); setInputValue(""); setAwaiting({ kind: "input", nodeId: id, prompt: bn.data.prompt ?? "Enter a value", varName: bn.data.varName ?? "x" }); return; }
      // output
      let v: unknown;
      try { v = evalExpr(bn.data.text ?? "", varsRef.current); } catch (err) { return fail(`Output “${bn.data.text}”: ${(err as Error).message}`); }
      setActiveId(id); setAwaiting({ kind: "output", nodeId: id, message: String(v) }); return;
    }
  };

  const run = () => {
    varsRef.current = {}; logRef.current = []; cursorRef.current = "start"; stepsRef.current = 0;
    setRunStatus({ kind: "running", msg: "Running…" }); setAwaiting(null); sync();
    pump();
  };
  const stopRun = () => { setAwaiting(null); setRunStatus({ kind: "idle", msg: "" }); setActiveId(null); };

  const submitInput = () => {
    if (!awaiting || awaiting.kind !== "input") return;
    const val = coerceInput(inputValue);
    varsRef.current[awaiting.varName] = val;
    logRef.current.push(`${awaiting.varName} = ${JSON.stringify(val)}`);
    const t = outEdge(awaiting.nodeId); setAwaiting(null);
    if (!t) return fail("Connect an arrow out of the Input shape.");
    cursorRef.current = t; sync(); pump();
  };
  const ackOutput = () => {
    if (!awaiting || awaiting.kind !== "output") return;
    logRef.current.push(awaiting.message);
    const t = outEdge(awaiting.nodeId); setAwaiting(null);
    if (!t) return fail("Connect an arrow out of the Output shape.");
    cursorRef.current = t; sync(); pump();
  };

  const geomOf = (id: string) => {
    const t = DIMS.terminator;
    if (id === "start") return { x: centerX(t.w), y: START_Y, w: t.w, h: t.h };
    if (id === "end") return { x: centerX(t.w), y: endY, w: t.w, h: t.h };
    const n = nodes.find((x) => x.id === id);
    return n ? { x: n.x, y: n.y, w: DIMS[n.type].w, h: DIMS[n.type].h } : null;
  };

  const sel = nodes.find((n) => n.id === selected) ?? null;
  const st = runStatus;
  const statusStyle: CSSProperties =
    st.kind === "error" ? { background: "var(--danger-soft)", border: "1px solid var(--danger-border)", color: "var(--danger)" }
    : st.kind === "done" ? { background: "var(--success-soft)", border: "1px solid var(--success-border)", color: "var(--success)" }
    : st.kind === "running" ? { background: "var(--secondary-soft)", border: "1px solid var(--secondary-border)", color: "var(--secondary-text)" }
    : connectFrom ? { background: "var(--secondary-soft)", border: "1px solid var(--secondary-border)", color: "var(--secondary-text)" }
    : { background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)" };

  return (
    <div className="stack" style={{ gap: 12 }} onClick={() => { if (!connectFrom) setSelected(null); }}>
      {/* palette + run controls */}
      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
        <span className="small" style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>Drag a shape:</span>
        {PALETTE.map((p) => (
          <div key={p.type} data-testid={`palette-${p.type}`} onPointerDown={(e) => startNew(p.type, e)} title={`Drag to add a ${p.label} shape`}
            style={{ cursor: "grab", userSelect: "none", touchAction: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 11px", borderRadius: 999, border: "1px dashed var(--border-strong)", ...fillFor(p.type), fontWeight: 700, fontSize: 12 }}>
            <ShapeGlyph type={p.type} /> {p.label}
          </div>
        ))}
        <span style={{ flex: 1 }} />
        <button type="button" className="btn btnPrimary" data-testid="builder-run" onClick={run}>▶ Run</button>
        <button type="button" className="btn" data-testid="builder-clear" onClick={clearAll}>↺ Clear</button>
      </div>

      {/* status */}
      <div className="card" data-testid="builder-status" style={{ padding: "10px 14px", fontWeight: 650, fontSize: 13, ...statusStyle }}>
        {st.kind !== "idle" ? st.msg
          : connectFrom ? "Connecting… click the target shape (or the same handle to cancel)."
          : "Drag shapes, edit them below, connect with the ● handles, then ▶ Run. Fill Process to declare a variable; Input asks for a value; Output shows one; Decision branches Yes/No."}
      </div>

      {/* canvas */}
      <div className="scrollX">
        <div ref={canvasRef} data-testid="builder-canvas"
          style={{ position: "relative", width: CANVAS_W, height: canvasH, borderRadius: "var(--radius)", border: "1px solid var(--border-strong)", background: "var(--surface)", backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: `${GRID}px ${GRID}px`, overflow: "hidden" }}>
          <svg width={CANVAS_W} height={canvasH} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <defs>
              <marker id="flowArrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-muted)" /></marker>
            </defs>
            {edges.map((e) => {
              const a = geomOf(e.from), b = geomOf(e.to);
              if (!a || !b) return null;
              const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y;
              const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
              return (
                <g key={`${e.from}-${e.to}-${e.branch ?? ""}`}>
                  <path d={`M${x1},${y1} C${x1},${y1 + 34} ${x2},${y2 - 34} ${x2},${y2}`} stroke="var(--text-muted)" strokeWidth="2" fill="none" markerEnd="url(#flowArrow)" />
                  <path d={`M${x1},${y1} C${x1},${y1 + 34} ${x2},${y2 - 34} ${x2},${y2}`} stroke="transparent" strokeWidth="16" fill="none" style={{ pointerEvents: "stroke", cursor: "pointer" }} onClick={() => removeEdge(e)}><title>Click to remove this arrow</title></path>
                  {e.branch ? <text x={mx} y={my} dy="-4" textAnchor="middle" fontSize="11" fontWeight="700" fill={e.branch === "yes" ? "var(--success)" : "var(--danger)"}>{e.branch === "yes" ? "Yes" : "No"}</text> : null}
                </g>
              );
            })}
          </svg>

          <CanvasNode id="start" type="terminator" label="Start" x={centerX(DIMS.terminator.w)} y={START_Y} fixed active={activeId === "start"} connecting={connectFrom} onHandle={setConnectFrom} onClick={onNodeClick} />
          <CanvasNode id="end" type="terminator" label="End" x={centerX(DIMS.terminator.w)} y={endY} fixed isEnd active={activeId === "end"} connecting={connectFrom} onHandle={setConnectFrom} onClick={onNodeClick} />
          {nodes.map((n) => (
            <CanvasNode key={n.id} id={n.id} type={n.type} label={display(n)} x={n.x} y={n.y}
              selected={selected === n.id} active={activeId === n.id} connecting={connectFrom}
              onHandle={setConnectFrom} onClick={onNodeClick} onDown={(e) => startMove(n.id, e)} onRemove={() => removeNode(n.id)} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
        <span className="small" style={{ margin: 0 }}>{nodes.length} shape{nodes.length === 1 ? "" : "s"} · {edges.length} arrow{edges.length === 1 ? "" : "s"}</span>
      </div>

      {/* edit panel for the selected shape */}
      {sel ? (
        <div className="card" data-testid="edit-panel" onClick={(e) => e.stopPropagation()} style={{ borderColor: "var(--accent-border)" }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "var(--accent-text)", textTransform: "capitalize" }}>Edit {sel.type}</div>
          {sel.type === "process" ? (
            <Field label="Statement (declare or change a variable)" hint='e.g. count = 0 · total = total + count · name = "Sam"'>
              <input className="input" data-testid="field-text" value={sel.data.text ?? ""} onChange={(e) => updateData(sel.id, { text: e.target.value })} />
            </Field>
          ) : sel.type === "input" ? (
            <div className="grid2">
              <Field label="Store into variable"><input className="input" data-testid="field-var" value={sel.data.varName ?? ""} onChange={(e) => updateData(sel.id, { varName: e.target.value })} /></Field>
              <Field label="Prompt shown in the dialog"><input className="input" data-testid="field-prompt" value={sel.data.prompt ?? ""} onChange={(e) => updateData(sel.id, { prompt: e.target.value })} /></Field>
            </div>
          ) : sel.type === "output" ? (
            <Field label="Show this (expression)" hint='e.g. "Hello, " + name · count · total / 2'>
              <input className="input" data-testid="field-text" value={sel.data.text ?? ""} onChange={(e) => updateData(sel.id, { text: e.target.value })} />
            </Field>
          ) : (
            <Field label="Condition (true → Yes, false → No)" hint="e.g. count < 5 · age >= 18 · name == &quot;Sam&quot;">
              <input className="input" data-testid="field-cond" value={sel.data.cond ?? ""} onChange={(e) => updateData(sel.id, { cond: e.target.value })} />
            </Field>
          )}
          <p className="small" style={{ marginTop: 8 }}>Tip: for a Decision, connect its <b style={{ color: "var(--success)" }}>Y</b> handle and <b style={{ color: "var(--danger)" }}>N</b> handle to two different shapes.</p>
        </div>
      ) : null}

      {/* variables + output (during/after a run) */}
      {st.kind !== "idle" ? (
        <div className="grid2" onClick={(e) => e.stopPropagation()}>
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Variables</div>
            {Object.keys(runVars).length === 0 ? <p className="small" style={{ margin: 0 }}>No variables yet.</p> : (
              <div className="stack" style={{ gap: 4 }}>
                {Object.entries(runVars).map(([k, v]) => (
                  <div key={k} className="small" style={{ margin: 0, display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ fontWeight: 700, color: "var(--text)" }}>{k}</span>
                    <code className="code" style={{ padding: "1px 7px" }}>{JSON.stringify(v)}</code>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Output</div>
            {runLog.length === 0 ? <p className="small" style={{ margin: 0 }}>Nothing shown yet.</p> : (
              <pre className="code codeWrap" style={{ margin: 0 }}>{runLog.join("\n")}</pre>
            )}
          </div>
        </div>
      ) : null}

      {/* ghost while dragging from palette */}
      {ghost ? (
        <div style={{ position: "fixed", left: ghost.x, top: ghost.y, transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 50, opacity: 0.85 }}>
          <div style={{ padding: "8px 14px", borderRadius: ghost.type === "process" ? "var(--radius-sm)" : 999, ...fillFor(ghost.type), border: "1px solid var(--border-strong)", fontWeight: 700, fontSize: 12, boxShadow: "var(--shadow)" }}>{PALETTE.find((p) => p.type === ghost.type)?.label}</div>
        </div>
      ) : null}

      {/* run dialogs (input / output) */}
      {awaiting ? (
        <div role="dialog" aria-modal="true" data-testid="run-dialog" onClick={(e) => e.stopPropagation()}
          style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(10,10,15,0.45)", display: "grid", placeItems: "center", padding: 16 }}>
          <div className="panel" style={{ width: "min(420px, 100%)", padding: 20, boxShadow: "var(--shadow-lg)" }}>
            {awaiting.kind === "input" ? (
              <>
                <div style={{ fontWeight: 700, marginBottom: 10 }}>{awaiting.prompt}</div>
                <input autoFocus className="input" data-testid="dialog-input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submitInput(); }} placeholder="Type a value…" />
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
                  <button type="button" className="btn" onClick={stopRun}>Stop</button>
                  <button type="button" className="btn btnPrimary" data-testid="dialog-ok" onClick={submitInput}>OK</button>
                </div>
              </>
            ) : (
              <>
                <div className="small" style={{ margin: 0, fontWeight: 700, color: "var(--accent-text)" }}>Output</div>
                <div style={{ fontWeight: 700, fontSize: 18, margin: "8px 0 4px", wordBreak: "break-word" }}>{awaiting.message}</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
                  <button type="button" className="btn" onClick={stopRun}>Stop</button>
                  <button type="button" className="btn btnPrimary" data-testid="dialog-ok" onClick={ackOutput}>OK</button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="stack" style={{ gap: 5 }}>
      <span className="small" style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>{label}</span>
      {children}
      {hint ? <span className="small" style={{ margin: 0 }}>{hint}</span> : null}
    </label>
  );
}

function fillFor(type: AnyType): CSSProperties {
  if (type === "decision") return { background: "var(--secondary-soft)", color: "var(--secondary-text)" };
  if (type === "input") return { background: "var(--secondary-soft)", color: "var(--secondary-text)" };
  if (type === "output") return { background: "var(--accent-soft)", color: "var(--accent-text)" };
  if (type === "terminator") return { background: "var(--accent-soft)", color: "var(--accent-text)" };
  return { background: "var(--surface-2)", color: "var(--text)" };
}

function ShapeGlyph({ type }: { type: NType }) {
  const c = "var(--text-faint)";
  const base: CSSProperties = { display: "inline-block", width: 13, height: 10, border: `2px solid ${c}` };
  if (type === "decision") return <span style={{ ...base, width: 11, height: 11, transform: "rotate(45deg)" }} />;
  if (type === "input") return <span style={{ ...base, transform: "skewX(-16deg)" }} />;
  if (type === "output") return <span style={{ ...base, transform: "skewX(16deg)" }} />;
  return <span style={{ ...base, borderRadius: 2 }} />;
}

function CanvasNode({
  id, type, label, x, y, fixed, isEnd, selected, active, connecting, onHandle, onClick, onDown, onRemove,
}: {
  id: string; type: AnyType; label: string; x: number; y: number; fixed?: boolean; isEnd?: boolean; selected?: boolean; active?: boolean;
  connecting: ConnectFrom; onHandle: (c: ConnectFrom) => void; onClick: (id: string) => void; onDown?: (e: React.PointerEvent) => void; onRemove?: () => void;
}) {
  const { w, h } = DIMS[type];
  const ring = active ? "0 0 0 3px var(--accent)" : selected ? "0 0 0 3px var(--ring)" : "var(--shadow-sm)";
  const wrap: CSSProperties = { position: "absolute", left: x, top: y, width: w, height: h, display: "grid", placeItems: "center", textAlign: "center", padding: 8, cursor: fixed ? (connecting ? "pointer" : "default") : connecting ? "pointer" : "grab", userSelect: "none", touchAction: "none", boxShadow: ring, borderRadius: type === "terminator" ? 999 : type === "decision" ? 0 : "var(--radius-sm)" };
  const skew = type === "input" ? "skewX(-14deg)" : type === "output" ? "skewX(14deg)" : "none";
  const bg: CSSProperties =
    type === "terminator" ? (isEnd ? { background: "var(--success-soft)", border: "1px solid var(--success-border)", color: "var(--success)" } : { background: "var(--accent-soft)", border: "1px solid var(--accent-border)", color: "var(--accent-text)" })
    : type === "decision" ? { background: "transparent", border: "none" }
    : type === "input" ? { background: "var(--secondary-soft)", border: "1px solid var(--secondary-border)", color: "var(--secondary-text)", transform: skew }
    : type === "output" ? { background: "var(--accent-soft)", border: "1px solid var(--accent-border)", color: "var(--accent-text)", transform: skew }
    : { background: "var(--surface-2)", border: "1px solid var(--border-strong)", color: "var(--text)" };

  const text = <span style={{ position: "relative", maxWidth: w - 22, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 700, fontSize: 12, transform: type === "input" ? "skewX(14deg)" : type === "output" ? "skewX(-14deg)" : "none" }}>{label}</span>;

  return (
    <div data-testid={`bnode-${id}`} onPointerDown={onDown} onClick={(e) => { e.stopPropagation(); onClick(id); }} style={{ ...wrap }}>
      {type === "decision" ? (
        <>
          <span style={{ position: "absolute", inset: 0, margin: "auto", width: h * 0.74, height: h * 0.74, transform: "rotate(45deg)", background: "var(--secondary-soft)", border: "1px solid var(--secondary-border)", borderRadius: 8 }} />
          <span style={{ position: "relative", maxWidth: w - 30, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 700, fontSize: 12, color: "var(--secondary-text)" }}>{label}</span>
        </>
      ) : (
        <span style={{ position: "absolute", inset: 0, ...bg, borderRadius: type === "terminator" ? 999 : "var(--radius-sm)" }} />
      )}
      {type !== "decision" && type !== "terminator" ? text : type === "terminator" ? <span style={{ position: "relative", fontWeight: 700, fontSize: 12 }}>{label}</span> : null}

      {/* delete */}
      {!fixed && onRemove ? (
        <button type="button" aria-label="Remove" data-testid={`bnode-del-${id}`} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ position: "absolute", top: -9, right: -9, width: 20, height: 20, borderRadius: 999, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-muted)", cursor: "pointer", fontSize: 11, lineHeight: 1, zIndex: 3 }}>✕</button>
      ) : null}

      {/* connect handles */}
      {type === "decision" ? (
        <>
          <Handle testid={`bnode-handle-${id}-yes`} title="Yes branch" color="var(--success)" style={{ bottom: -9, left: "30%" }} onDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onHandle(connecting?.id === id && connecting.branch === "yes" ? null : { id, branch: "yes" }); }} label="Y" active={connecting?.id === id && connecting.branch === "yes"} />
          <Handle testid={`bnode-handle-${id}-no`} title="No branch" color="var(--danger)" style={{ bottom: -9, left: "70%" }} onDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onHandle(connecting?.id === id && connecting.branch === "no" ? null : { id, branch: "no" }); }} label="N" active={connecting?.id === id && connecting.branch === "no"} />
        </>
      ) : !isEnd ? (
        <Handle testid={`bnode-handle-${id}`} title="Connect from here" color="var(--secondary)" style={{ bottom: -9, left: "50%", transform: "translateX(-50%)" }} onDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onHandle(connecting?.id === id ? null : { id }); }} active={connecting?.id === id} />
      ) : null}
    </div>
  );
}

function Handle({ testid, title, color, style, onDown, onClick, label, active }: { testid: string; title: string; color: string; style: CSSProperties; onDown: (e: React.PointerEvent) => void; onClick: (e: React.MouseEvent) => void; label?: string; active?: boolean }) {
  return (
    <button type="button" aria-label={title} data-testid={testid} title={title} onPointerDown={onDown} onClick={onClick}
      style={{ position: "absolute", width: 17, height: 17, transform: (style.transform as string) ?? undefined, borderRadius: 999, border: "2px solid var(--surface)", background: active ? "var(--accent)" : color, cursor: "pointer", padding: 0, zIndex: 3, fontSize: 9, fontWeight: 800, color: "#fff", lineHeight: 1, ...style }}>{label}</button>
  );
}
