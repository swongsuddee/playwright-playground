"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { SCENARIOS, type Scenario } from "./scenarios";

/* ── The 4-step method (content section 2) ───────────────────────────────── */
const METHOD: { title: string; body: string }[] = [
  {
    title: "Understand the goal",
    body: "Say in one sentence what “done” looks like. If you can't, you don't understand it yet.",
  },
  {
    title: "List the steps",
    body: "Brain-dump every small action needed — order doesn't matter yet, just get them all down.",
  },
  {
    title: "Put them in order",
    body: "Arrange the steps so each one only needs things the earlier steps already produced.",
  },
  {
    title: "Mark decisions & loops",
    body: "Spot the “if this, then that” choices and the parts you repeat — those become branches and loops.",
  },
];

/* ── A pill/rectangle used by the flow diagram ───────────────────────────── */
function FlowNode({
  kind,
  children,
}: {
  kind: "start" | "end" | "step";
  children: React.ReactNode;
}) {
  const isPill = kind !== "step";
  const palette =
    kind === "start"
      ? { bg: "var(--accent-soft)", border: "var(--accent-border)", color: "var(--accent-text)" }
      : kind === "end"
        ? { bg: "var(--secondary-soft)", border: "var(--secondary-border)", color: "var(--secondary-text)" }
        : { bg: "var(--surface-2)", border: "var(--border-strong)", color: "var(--text)" };

  return (
    <div
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        color: palette.color,
        borderRadius: isPill ? 999 : "var(--radius-sm)",
        padding: isPill ? "8px 22px" : "12px 16px",
        fontWeight: isPill ? 700 : 600,
        fontSize: 13.5,
        textAlign: "center",
        maxWidth: 360,
        width: isPill ? "auto" : "100%",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {children}
    </div>
  );
}

function FlowArrow() {
  return (
    <div
      aria-hidden
      style={{ color: "var(--text-faint)", fontSize: 16, lineHeight: 1, padding: "2px 0" }}
    >
      ↓
    </div>
  );
}

/* ── Interactive: Order the steps ────────────────────────────────────────── */
type GradeResult = { graded: boolean[]; score: number; total: number; complete: boolean };

function OrderTheSteps() {
  const [scenarioId, setScenarioId] = useState<string>(SCENARIOS[0].id);
  const [built, setBuilt] = useState<number[]>([]); // step indices, in the learner's chosen order
  const [result, setResult] = useState<GradeResult | null>(null);

  const scenario = useMemo<Scenario>(
    () => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId],
  );

  // Chips still available = scenario's fixed shuffled order minus what's already placed.
  const available = scenario.shuffled.filter((i) => !built.includes(i));

  function resetBoard(nextId?: string) {
    if (nextId) setScenarioId(nextId);
    setBuilt([]);
    setResult(null);
  }

  function addStep(i: number) {
    setBuilt((prev) => (prev.includes(i) ? prev : [...prev, i]));
    setResult(null);
  }

  function removeAt(pos: number) {
    setBuilt((prev) => prev.filter((_, p) => p !== pos));
    setResult(null);
  }

  function move(pos: number, dir: -1 | 1) {
    setBuilt((prev) => {
      const next = [...prev];
      const target = pos + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[pos], next[target]] = [next[target], next[pos]];
      return next;
    });
    setResult(null);
  }

  function check() {
    const graded = built.map((stepIdx, pos) => stepIdx === pos);
    const score = graded.filter(Boolean).length;
    const total = scenario.steps.length;
    const complete = built.length === total && graded.every(Boolean);
    setResult({ graded, score, total, complete });
  }

  const allPlaced = built.length === scenario.steps.length;

  return (
    <div className="card stack" style={{ gap: 16 }} data-testid="order-the-steps">
      {/* Scenario picker */}
      <div className="stack" style={{ gap: 8 }}>
        <label htmlFor="scenario-select" className="small" style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>
          Pick a real-world task
        </label>
        <select
          id="scenario-select"
          className="select"
          data-testid="scenario-select"
          value={scenarioId}
          onChange={(e) => resetBoard(e.target.value)}
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <p className="small" style={{ margin: 0 }}>{scenario.intro}</p>
      </div>

      {/* Available chips */}
      <div className="stack" style={{ gap: 8 }}>
        <div className="small" style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>
          1 · Click a step to add it to your sequence
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} data-testid="chip-tray">
          {available.length === 0 ? (
            <span className="small" style={{ margin: 0 }}>All steps placed — check your order below. ↓</span>
          ) : (
            available.map((i) => (
              <button
                key={i}
                type="button"
                className="btn"
                data-testid={`chip-${i}`}
                onClick={() => addStep(i)}
                style={{ borderStyle: "dashed" }}
              >
                + {scenario.steps[i]}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Ordered list the learner is building */}
      <div className="stack" style={{ gap: 8 }}>
        <div className="small" style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>
          2 · Your sequence — reorder with ↑ ↓, drop with ×
        </div>

        {built.length === 0 ? (
          <div
            className="small"
            style={{
              margin: 0,
              padding: "16px",
              borderRadius: "var(--radius-sm)",
              border: "1px dashed var(--border-strong)",
              background: "var(--surface-2)",
              textAlign: "center",
            }}
          >
            No steps yet. Tap the chips above to start building the order.
          </div>
        ) : (
          <ol className="stack" style={{ gap: 8, listStyle: "none", margin: 0, padding: 0 }} data-testid="sequence">
            {built.map((stepIdx, pos) => {
              const graded = result?.graded[pos];
              const border =
                graded === true
                  ? "var(--success-border)"
                  : graded === false
                    ? "var(--danger-border)"
                    : "var(--border)";
              const bg =
                graded === true
                  ? "var(--success-soft)"
                  : graded === false
                    ? "var(--danger-soft)"
                    : "var(--surface)";
              return (
                <li
                  key={stepIdx}
                  data-testid={`seq-item-${pos}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${border}`,
                    background: bg,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      flex: "0 0 auto",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: "var(--surface-2)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--text-muted)",
                      fontWeight: 800,
                      fontSize: 12.5,
                    }}
                  >
                    {pos + 1}
                  </span>
                  <span style={{ flex: "1 1 auto", minWidth: 0, fontSize: 13.5, fontWeight: 500 }}>
                    {scenario.steps[stepIdx]}
                  </span>
                  {graded !== undefined ? (
                    <span
                      className="small"
                      style={{
                        margin: 0,
                        flex: "0 0 auto",
                        fontWeight: 700,
                        color: graded ? "var(--success)" : "var(--danger)",
                      }}
                    >
                      {graded ? "✓" : "✗"}
                    </span>
                  ) : null}
                  <span style={{ display: "inline-flex", gap: 4, flex: "0 0 auto" }}>
                    <button
                      type="button"
                      className="iconBtn"
                      aria-label={`Move "${scenario.steps[stepIdx]}" up`}
                      data-testid={`up-${pos}`}
                      disabled={pos === 0}
                      onClick={() => move(pos, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="iconBtn"
                      aria-label={`Move "${scenario.steps[stepIdx]}" down`}
                      data-testid={`down-${pos}`}
                      disabled={pos === built.length - 1}
                      onClick={() => move(pos, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="iconBtn"
                      aria-label={`Remove "${scenario.steps[stepIdx]}"`}
                      data-testid={`remove-${pos}`}
                      onClick={() => removeAt(pos)}
                    >
                      ×
                    </button>
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <button
          type="button"
          className="btn btnPrimary"
          data-testid="check-btn"
          onClick={check}
          disabled={built.length === 0}
        >
          Check order
        </button>
        <button type="button" className="btn" data-testid="reset-btn" onClick={() => resetBoard()}>
          Reset
        </button>
        {result ? (
          <span
            className="badge"
            data-testid="score"
            style={{
              background: result.complete ? "var(--success-soft)" : "var(--surface-2)",
              borderColor: result.complete ? "var(--success-border)" : "var(--border)",
              color: result.complete ? "var(--success)" : "var(--text-muted)",
            }}
          >
            {result.complete
              ? `Perfect — ${result.score}/${result.total} in place`
              : `${result.score}/${result.total} in the right place${allPlaced ? "" : " so far"}`}
          </span>
        ) : null}
      </div>

      {/* Reveal: the flow diagram (only when fully correct) */}
      {result?.complete ? (
        <div
          className="stack"
          data-testid="flow-reveal"
          style={{
            gap: 0,
            marginTop: 4,
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
          }}
        >
          <div className="small" style={{ margin: "0 0 12px", fontWeight: 700, color: "var(--accent-text)" }}>
            🎉 See it as a flow
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            <FlowNode kind="start">Start</FlowNode>
            <FlowArrow />
            {scenario.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <FlowNode kind="step">{`${i + 1}. ${step}`}</FlowNode>
                <FlowArrow />
              </div>
            ))}
            <FlowNode kind="end">End</FlowNode>
          </div>
          <p className="small" style={{ marginTop: 12, textAlign: "center" }}>
            That is a flowchart — the same ordered steps, drawn as a program would run them.
          </p>
        </div>
      ) : null}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function A3DecompositionPage() {
  return (
    <main className="container">
      <Sidebar />

      <section className="panel">
        <div className="panelHeader">
          <div className="small" style={{ fontWeight: 700, color: "var(--accent-text)", margin: 0 }}>
            Track A · Foundations
          </div>
          <h1 className="h1" style={{ marginTop: 6 }}>A1 — Problem Decomposition</h1>
          <p className="small">Break any real-world task into small, ordered steps — then draw it as a flow.</p>
        </div>

        <div className="panelBody stack" style={{ gap: 18 }}>
          {/* 1 · What is decomposition? */}
          <div className="card stack" style={{ gap: 8 }}>
            <div className="badge" style={{ alignSelf: "flex-start" }}>Concept</div>
            <h2 className="h1" style={{ fontSize: 16 }}>What is decomposition?</h2>
            <p className="small" style={{ margin: 0, fontSize: 13.5 }}>
              Decomposition means splitting one big, fuzzy task into a handful of small, clear steps you can do in
              order. Once the steps are laid out, you can spot the <b>decisions</b> (“if… then…”) and the{" "}
              <b>repeats</b> (things you do again and again). That is exactly how code is written: a program is just
              an ordered list of small steps, with a few branches and loops.
            </p>
          </div>

          {/* 2 · The method */}
          <div className="stack" style={{ gap: 8 }}>
            <h2 className="h1" style={{ fontSize: 16 }}>The method — 4 steps</h2>
            <div className="grid2">
              {METHOD.map((m, i) => (
                <div key={m.title} className="card" style={{ display: "flex", gap: 12, minWidth: 0 }}>
                  <span
                    style={{
                      flex: "0 0 auto",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 30,
                      height: 30,
                      borderRadius: 9,
                      background: "var(--accent-soft)",
                      color: "var(--accent-text)",
                      border: "1px solid var(--accent-border)",
                      fontWeight: 800,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
                      {m.title}
                    </span>
                    <span className="small" style={{ margin: "2px 0 0" }}>{m.body}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 · Interactive practice */}
          <div className="stack" style={{ gap: 8 }}>
            <h2 className="h1" style={{ fontSize: 16 }}>Practice — order the steps</h2>
            <p className="small" style={{ margin: 0 }}>
              Pick a task, then build its correct sequence from the shuffled chips. Hit <b>Check order</b> to grade
              each position; get them all right to unlock the flow diagram.
            </p>
            <div className="scrollX">
              <OrderTheSteps />
            </div>
          </div>
        </div>
      </section>

      <aside className="panel inspector panelSticky noScrollBar" style={{ overflowY: "auto" }}>
        <div className="panelHeader">
          <h2 className="h1">Quick reference</h2>
          <p className="small">How to break down a problem.</p>
        </div>

        <div className="panelBody stack" style={{ gap: 16 }}>
          <div className="card stack" style={{ gap: 10 }}>
            <div className="small" style={{ margin: 0, fontWeight: 700, color: "var(--text)" }}>Takeaways</div>
            <ol className="stack" style={{ gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
              {[
                ["Understand", "Nail the goal in one sentence."],
                ["List", "Dump every small step, order-free."],
                ["Order", "Sequence so each step has what it needs."],
                ["Mark decisions & loops", "Find the “if…” choices and the repeats."],
              ].map(([k, v], i) => (
                <li key={k} style={{ display: "flex", gap: 10, alignItems: "flex-start", minWidth: 0 }}>
                  <span
                    style={{
                      flex: "0 0 auto",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      background: "var(--secondary-soft)",
                      color: "var(--secondary-text)",
                      border: "1px solid var(--secondary-border)",
                      fontWeight: 800,
                      fontSize: 11.5,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <b style={{ fontSize: 13 }}>{k}</b>
                    <span className="small" style={{ margin: "1px 0 0", display: "block" }}>{v}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <Link className="btn btnPrimary" href="/foundations/a2-flow-diagrams" style={{ width: "100%" }}>
            Next → A2 Flow Diagrams
          </Link>

          <div
            className="card"
            style={{
              background: "var(--accent-soft)",
              borderColor: "var(--accent-border)",
            }}
          >
            <div className="small" style={{ margin: 0, color: "var(--accent-text)" }}>
              <b>Tip:</b> if a step needs something that hasn't happened yet, it's too early — slide it down. Ordering
              is just making sure every step has what it needs.
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
