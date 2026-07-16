"use client";

import { useEffect, useRef, useState } from "react";

// A single-corridor maze. '#'=wall, '.'=path, 'S'=start, 'E'=end(goal).
const MAZE = [
  "#############",
  "#E.........##",
  "#########.###",
  "#.........###",
  "#.###########",
  "#...........#",
  "###########.#",
  "#S..........#",
  "#############",
];
const ROWS = MAZE.length;
const COLS = MAZE[0].length;

// Arcade game palette — intentional, self-contained (the board is dark in both themes).
const GAME = { wall: "#0b1020", path: "#22d3ee", start: "#22c55e", goal: "#ef4444" };

type Status = "idle" | "playing" | "won" | "failed";

export function MazeGame() {
  const [status, setStatus] = useState<Status>("idle");
  const [hits, setHits] = useState(0);
  const statusRef = useRef<Status>("idle");
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const enter = (ch: string) => {
    const s = statusRef.current;
    if (ch === "S") {
      if (s !== "playing") setStatus("playing"); // touch START to (re)arm
    } else if (ch === "E") {
      if (s === "playing") setStatus("won");
    } else if (ch === "#") {
      if (s === "playing") {
        setStatus("failed");
        setHits((h) => h + 1);
      }
    }
    // '.' path is safe — no handler needed
  };

  const boardLeave = () => {
    if (statusRef.current === "playing") {
      setStatus("failed");
      setHits((h) => h + 1);
    }
  };

  const reset = () => {
    setStatus("idle");
    setHits(0);
  };

  const message: Record<Status, string> = {
    idle: "Move your mouse onto the green START square to begin.",
    playing: "Go! Trace the path to the red goal — don’t touch the walls.",
    failed: "💥 You hit a wall! Move back onto START to try again.",
    won: `🎉 You reached the goal! Walls hit: ${hits}.`,
  };
  const soft = status === "won" ? "var(--success-soft)" : status === "failed" ? "var(--danger-soft)" : "var(--accent-soft)";
  const bd = status === "won" ? "var(--success-border)" : status === "failed" ? "var(--danger-border)" : "var(--accent-border)";
  const fg = status === "won" ? "var(--success)" : status === "failed" ? "var(--danger)" : "var(--accent-text)";

  return (
    <div className="stack" style={{ gap: 12 }}>
      <p className="small">
        A classic mouse-maze. <b>Touch the green START</b> to arm it, steer to the <b>red goal</b> to win, and never let
        your cursor touch the <b>black walls</b> — that sends you back to the start. 🖱️ Best on a desktop with a mouse.
      </p>

      <div
        data-testid="maze-status"
        className="card"
        style={{ padding: "10px 12px", background: soft, border: `1px solid ${bd}`, color: fg, fontWeight: 650, fontSize: 13 }}
      >
        {message[status]}
      </div>

      <div
        data-testid="maze-board"
        onMouseLeave={boardLeave}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          aspectRatio: `${COLS} / ${ROWS}`,
          width: "100%",
          maxWidth: 640,
          background: GAME.wall,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--border)",
          cursor: status === "playing" ? "crosshair" : "pointer",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        {MAZE.map((row, r) =>
          row.split("").map((ch, c) => {
            const bg = ch === "#" ? GAME.wall : ch === "S" ? GAME.start : ch === "E" ? GAME.goal : GAME.path;
            const label = ch === "S" ? "S" : ch === "E" ? "★" : "";
            return (
              <div
                key={`${r}-${c}`}
                data-cell={ch}
                onMouseEnter={() => enter(ch)}
                style={{
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(9px, 2.4vw, 15px)",
                  fontWeight: 800,
                  color: ch === "E" ? "#fff" : "#05221a",
                  lineHeight: 1,
                }}
              >
                {label}
              </div>
            );
          }),
        )}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="btn" onClick={reset} data-testid="maze-reset">↺ Reset</button>
        <span className="small" style={{ margin: 0 }}>Walls hit: <b>{hits}</b></span>
      </div>

      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {[
          { c: GAME.start, t: "Start (touch to begin)" },
          { c: GAME.path, t: "Safe path" },
          { c: GAME.goal, t: "Goal — win!" },
          { c: GAME.wall, t: "Wall — back to start" },
        ].map((l) => (
          <span key={l.t} className="small" style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: l.c, border: "1px solid var(--border)", flex: "0 0 auto" }} />
            {l.t}
          </span>
        ))}
      </div>

      <p className="small" style={{ fontStyle: "italic" }}>
        Bonus: this is the same “chase &amp; reach the goal” idea as practice #5. Try rebuilding a version of it in Scratch!
      </p>
    </div>
  );
}
