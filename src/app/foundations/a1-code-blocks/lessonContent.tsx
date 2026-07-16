"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, HOW_TO, PRACTICES, SCRATCH_URL, SHAPES } from "./scratchData";

function Chips({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {items.map((t) => (
        <span key={t} className="code" style={{ padding: "3px 8px", fontSize: 11.5, borderRadius: 999, whiteSpace: "nowrap" }}>
          {t}
        </span>
      ))}
    </div>
  );
}

/* Lesson 1 — What is a code block? */
export function CodeBlockLesson() {
  return (
    <div className="stack" style={{ gap: 14 }}>
      <p className="small" style={{ maxWidth: "70ch", fontSize: 13.5 }}>
        A <b>code block</b> is a single instruction shaped like a puzzle piece — for example <i>“move 10 steps”</i> or{" "}
        <i>“say Hello”</i>. Instead of writing code as text, you <b>drag blocks and snap them together</b>.
      </p>
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 13 }}>Why beginners start here</div>
        <ul className="inspectorList" style={{ marginTop: 8 }}>
          <li><b>No syntax errors.</b> A block only snaps where it fits, so you can’t build a broken program.</li>
          <li><b>You see it run.</b> Press a button and a character moves — instant feedback.</li>
          <li><b>Same big ideas as real code:</b> doing things <b>in order</b>, <b>repeating</b> them, and <b>making decisions</b>.</li>
        </ul>
      </div>
      <p className="small">Those three ideas — sequence, loops, and conditionals — are the whole point of this session.</p>
    </div>
  );
}

/* Lesson 2 — What is Scratch? */
export function ScratchLesson() {
  return (
    <div className="stack" style={{ gap: 14 }}>
      <p className="small" style={{ maxWidth: "70ch", fontSize: 13.5 }}>
        <b>Scratch</b> is a free, block-based programming environment made by MIT. You program characters called{" "}
        <b>sprites</b> (the famous cat) that act on a <b>stage</b>. You drag blocks from a palette to give a sprite
        instructions, then press the <b>green flag ⚑</b> to run them. It runs in your browser — nothing to install.
      </p>
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 13 }}>The three parts you’ll use</div>
        <ul className="inspectorList" style={{ marginTop: 8 }}>
          <li><b>Stage</b> — the area (top-right) where your sprite performs.</li>
          <li><b>Sprite</b> — the character you give instructions to.</li>
          <li><b>Blocks palette</b> — the colored blocks on the left you drag into the code area.</li>
        </ul>
      </div>
      <a className="btn btnPrimary" href={SCRATCH_URL} target="_blank" rel="noreferrer">
        Open the Scratch editor (Get Started tutorial) ↗
      </a>
      <p className="small">Opens in a new tab. Keep it side-by-side with this page while you learn.</p>
    </div>
  );
}

/* Lesson 3 — The kinds of blocks */
export function BlocksLesson() {
  return (
    <div className="stack" style={{ gap: 16 }}>
      <p className="small">
        Scratch groups blocks into nine colored categories. The five marked <b>Start here</b> are all you need for the
        practices.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10 }}>
        {CATEGORIES.map((c) => (
          <div key={c.name} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 12, background: "var(--surface)", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: 5, background: c.color, flex: "0 0 auto" }} />
              <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{c.name}</span>
              {c.beginner ? (
                <span className="badge" style={{ marginLeft: "auto", fontSize: 10, background: "var(--accent-soft)", borderColor: "var(--accent-border)", color: "var(--accent-text)" }}>
                  Start here
                </span>
              ) : null}
            </div>
            <p className="small" style={{ marginTop: 6 }}>{c.blurb}</p>
            <Chips items={c.examples} />
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 13 }}>Block shapes — how pieces connect</div>
        <div className="stack" style={{ gap: 8, marginTop: 10 }}>
          {SHAPES.map((s) => (
            <div key={s.name} style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: 13, minWidth: 74 }}>{s.name}</span>
              <span className="badge" style={{ fontSize: 10.5 }}>{s.hint}</span>
              <span className="small" style={{ margin: 0, flex: "1 1 240px" }}>{s.blurb}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Lesson 4 — How to use them */
export function UsingLesson() {
  return (
    <div className="stack" style={{ gap: 14 }}>
      <p className="small">Follow these steps in the editor. It’s all drag-and-drop — no typing.</p>
      <ol className="inspectorList" style={{ display: "grid", gap: 8 }}>
        {HOW_TO.map((step) => (
          <li key={step} className="small" style={{ margin: 0, fontSize: 13 }}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

/* Practice lessons — one exercise per page (progress shared via localStorage) */
const PRACTICE_KEY = "a1-practice-progress";

export function SinglePractice({ practiceId }: { practiceId: string }) {
  const p = PRACTICES.find((x) => x.id === practiceId);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PRACTICE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  if (!p) return null;
  const isDone = Boolean(done[p.id]);

  const toggle = () =>
    setDone((prev) => {
      const next = { ...prev, [p.id]: !prev[p.id] };
      try {
        localStorage.setItem(PRACTICE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  return (
    <div className="stack" style={{ gap: 12 }}>
      <p className="small">Build this one in the Scratch editor, then mark it done. Use the companion panel to jump to Scratch.</p>

      <div className="card" style={{ borderColor: isDone ? "var(--success-border)" : "var(--border)" }}>
        <span className="badge" style={{ background: "var(--accent-soft)", borderColor: "var(--accent-border)", color: "var(--accent-text)" }}>
          {p.concept}
        </span>

        <p className="small" style={{ marginTop: 10 }}><b>Goal:</b> {p.goal}</p>

        <div className="small" style={{ marginTop: 8, fontWeight: 650, color: "var(--text)" }}>Blocks you’ll need</div>
        <Chips items={p.blocks} />

        <ol className="inspectorList" style={{ marginTop: 10, display: "grid", gap: 6 }}>
          {p.steps.map((s) => (
            <li key={s} className="small" style={{ margin: 0 }}>{s}</li>
          ))}
        </ol>

        <p className="small" style={{ marginTop: 8, fontStyle: "italic" }}>💡 {p.hint}</p>

        <button type="button" className={isDone ? "btn btnPrimary" : "btn"} style={{ marginTop: 12 }} aria-pressed={isDone} onClick={toggle}>
          {isDone ? "✓ Done" : "Mark as done"}
        </button>
      </div>
    </div>
  );
}
