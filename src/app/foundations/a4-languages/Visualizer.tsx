"use client";

import { useEffect, useState } from "react";
import { LangTabs } from "./LangTabs";
import { ANCHORS, PROGRAMS, TRACE, type Lang } from "./languageData";

const PLAY_MS = 1100;
const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// Python-Tutor-style step-through of the canned TRACE. No real interpreter runs —
// each step is a fixed snapshot from languageData.ts. Highlighting resolves the
// step's anchor to a line number for whichever language is currently selected.
export function Visualizer({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const lastStep = TRACE.length - 1;
  const current = TRACE[step];
  const activeLine = ANCHORS[lang][current.anchor]; // 1-based
  const lines = PROGRAMS[lang];

  // Auto-advance while playing.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => (s >= lastStep ? s : s + 1));
    }, PLAY_MS);
    return () => clearInterval(id);
  }, [playing, lastStep]);

  // Stop at the end.
  useEffect(() => {
    if (step >= lastStep) setPlaying(false);
  }, [step, lastStep]);

  const goPrev = () => {
    setPlaying(false);
    setStep((s) => Math.max(0, s - 1));
  };
  const goNext = () => {
    setPlaying(false);
    setStep((s) => Math.min(lastStep, s + 1));
  };
  const reset = () => {
    setPlaying(false);
    setStep(0);
  };

  const varRows: { name: string; value: string }[] = [];
  if (current.vars.n !== null) varRows.push({ name: "n", value: String(current.vars.n) });
  varRows.push({ name: "total", value: String(current.vars.total) });

  return (
    <div className="card stack" style={{ gap: 14 }} data-testid="a4-visualizer">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Step-through visualizer</div>
          <p className="small" style={{ margin: "4px 0 0" }}>
            Walk the program one line at a time and watch the variables and output change.
          </p>
        </div>
        <span className="badge" data-testid="a4-step-counter" style={{ flex: "0 0 auto" }}>
          Step {step + 1} / {TRACE.length}
        </span>
      </div>

      <LangTabs lang={lang} setLang={setLang} idPrefix="viz" />

      {/* Controls */}
      <div className="scrollX" style={{ display: "flex", gap: 8, padding: 2 }}>
        <button type="button" className="btn" onClick={goPrev} disabled={step === 0} data-testid="a4-prev" style={{ flex: "0 0 auto" }}>
          ← Prev
        </button>
        <button type="button" className="btn" onClick={goNext} disabled={step >= lastStep} data-testid="a4-next" style={{ flex: "0 0 auto" }}>
          Next →
        </button>
        <button
          type="button"
          className="btn btnPrimary"
          onClick={() => setPlaying((p) => !p)}
          disabled={step >= lastStep}
          data-testid="a4-play"
          style={{ flex: "0 0 auto" }}
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
        <button type="button" className="btn" onClick={reset} disabled={step === 0 && !playing} data-testid="a4-reset" style={{ flex: "0 0 auto" }}>
          ↺ Reset
        </button>
      </div>

      {/* Numbered code with the active line highlighted */}
      <div
        className="code"
        data-testid="a4-code"
        style={{ padding: 0, overflowX: "auto" }}
        aria-label="Program with the running line highlighted"
      >
        <div style={{ minWidth: "max-content" }}>
          {lines.map((text, i) => {
            const n = i + 1;
            const isActive = n === activeLine;
            return (
              <div
                key={n}
                data-active={isActive}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "2px 12px",
                  whiteSpace: "pre",
                  background: isActive ? "var(--accent-soft)" : "transparent",
                  borderLeft: isActive ? "3px solid var(--accent)" : "3px solid transparent",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    userSelect: "none",
                    textAlign: "right",
                    width: 22,
                    flex: "0 0 auto",
                    color: isActive ? "var(--accent-text)" : "var(--text-faint)",
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {n}
                </span>
                <span style={{ color: isActive ? "var(--accent-text)" : "var(--code-text)" }}>{text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narration */}
      <div
        className="small"
        data-testid="a4-note"
        style={{
          margin: 0,
          padding: "10px 12px",
          borderRadius: "var(--radius-sm)",
          background: "var(--secondary-soft)",
          border: "1px solid var(--secondary-border)",
          color: "var(--secondary-text)",
        }}
      >
        {current.note}
      </div>

      {/* Variables + Output side by side */}
      <div className="grid2">
        <div className="card" style={{ boxShadow: "none", background: "var(--surface-2)" }}>
          <div style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 8 }}>Variables</div>
          <table className="table" data-testid="a4-vars" style={{ fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ width: "50%" }}>Name</th>
                <th style={{ width: "50%" }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {varRows.map((r) => (
                <tr key={r.name}>
                  <td style={{ fontFamily: MONO }}>{r.name}</td>
                  <td style={{ fontFamily: MONO }}>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ boxShadow: "none", background: "var(--surface-2)", minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 8 }}>Output</div>
          <div
            className="code"
            data-testid="a4-output"
            style={{ margin: 0, minHeight: 96, background: "var(--code-bg)" }}
          >
            {current.output.length === 0 ? (
              <span style={{ color: "var(--text-faint)" }}>(nothing printed yet)</span>
            ) : (
              current.output.map((line, i) => (
                <div key={i} style={{ whiteSpace: "pre" }}>
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
