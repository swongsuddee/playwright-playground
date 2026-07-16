"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ── Logical playfield (CSS scales it responsively) ──────────────────────── */
const W = 380;
const H = 520;
const GROUND = 64; // ground strip height
const SKY_H = H - GROUND;

// Bird
const BIRD_X = 96;
const BIRD_R = 15;
const GRAVITY = 1600; // px/s²
const FLAP_V = -430; // px/s (upward)

// Pipes
const PIPE_W = 62;
const GAP = 158; // vertical opening
const PIPE_SPEED = 158; // px/s leftward
const SPAWN_GAP_X = 210; // horizontal distance between pipes

// Arcade palette — intentional, self-contained (the board looks the same in both themes).
const C = {
  skyTop: "#4ec0ca",
  skyBot: "#9be0c9",
  pipe: "#5aa02c",
  pipeDark: "#3f7a1e",
  pipeCap: "#74c13f",
  ground: "#ded895",
  groundEdge: "#b0a45f",
  bird: "#ffd83d",
  wing: "#f5a623",
  beak: "#e8830c",
  eye: "#ffffff",
  pupil: "#22303a",
  text: "#12343b",
};

type Status = "idle" | "playing" | "dead";
type Pipe = { x: number; gapY: number; passed: boolean };

type Game = {
  y: number;
  v: number;
  pipes: Pipe[];
  last: number; // ms timestamp of previous frame
  running: boolean;
};

function freshGame(): Game {
  return {
    y: SKY_H / 2,
    v: 0,
    pipes: [{ x: W + 40, gapY: SKY_H / 2, passed: false }],
    last: 0,
    running: false,
  };
}

const BEST_KEY = "playground.flappy.best";

export function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game>(freshGame());
  const rafRef = useRef<number | null>(null);
  const statusRef = useRef<Status>("idle");

  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Load best score once on the client (guarded — avoids SSR/hydration issues).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BEST_KEY);
      if (raw) setBest(Number(raw) || 0);
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, []);

  /* ── Rendering ─────────────────────────────────────────────────────────── */
  const draw = useCallback((s: Status) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = gameRef.current;

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, SKY_H);
    sky.addColorStop(0, C.skyTop);
    sky.addColorStop(1, C.skyBot);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, SKY_H);

    // Pipes
    for (const p of g.pipes) {
      const topH = p.gapY - GAP / 2;
      const botY = p.gapY + GAP / 2;
      ctx.fillStyle = C.pipe;
      ctx.fillRect(p.x, 0, PIPE_W, topH);
      ctx.fillRect(p.x, botY, PIPE_W, SKY_H - botY);
      // caps
      ctx.fillStyle = C.pipeCap;
      ctx.fillRect(p.x - 4, topH - 22, PIPE_W + 8, 22);
      ctx.fillRect(p.x - 4, botY, PIPE_W + 8, 22);
      // edge shading
      ctx.fillStyle = C.pipeDark;
      ctx.fillRect(p.x + PIPE_W - 6, 0, 6, topH);
      ctx.fillRect(p.x + PIPE_W - 6, botY, 6, SKY_H - botY);
    }

    // Ground
    ctx.fillStyle = C.ground;
    ctx.fillRect(0, SKY_H, W, GROUND);
    ctx.fillStyle = C.groundEdge;
    ctx.fillRect(0, SKY_H, W, 5);

    // Bird
    const by = g.y;
    ctx.save();
    ctx.translate(BIRD_X, by);
    const tilt = Math.max(-0.5, Math.min(0.9, g.v / 600));
    ctx.rotate(tilt);
    // body
    ctx.fillStyle = C.bird;
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
    ctx.fill();
    // wing
    ctx.fillStyle = C.wing;
    ctx.beginPath();
    ctx.ellipse(-3, 3, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // eye
    ctx.fillStyle = C.eye;
    ctx.beginPath();
    ctx.arc(6, -5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.pupil;
    ctx.beginPath();
    ctx.arc(7.5, -5, 2.2, 0, Math.PI * 2);
    ctx.fill();
    // beak
    ctx.fillStyle = C.beak;
    ctx.beginPath();
    ctx.moveTo(12, -1);
    ctx.lineTo(20, 2);
    ctx.lineTo(12, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Overlay hints on the canvas
    ctx.fillStyle = C.text;
    ctx.textAlign = "center";
    if (s === "idle") {
      ctx.font = "700 20px system-ui, sans-serif";
      ctx.fillText("Tap / Space to flap", W / 2, SKY_H / 2 - 40);
    } else if (s === "dead") {
      ctx.font = "800 30px system-ui, sans-serif";
      ctx.fillText("Game over", W / 2, SKY_H / 2 - 26);
      ctx.font = "600 15px system-ui, sans-serif";
      ctx.fillText("Press Reset to play again", W / 2, SKY_H / 2 + 2);
    }
    ctx.textAlign = "start";
  }, []);

  /* ── Physics step + main loop ──────────────────────────────────────────── */
  const die = useCallback(() => {
    gameRef.current.running = false;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setStatus("dead");
    setScore((sc) => {
      setBest((b) => {
        const nb = Math.max(b, sc);
        try {
          window.localStorage.setItem(BEST_KEY, String(nb));
        } catch {
          /* ignore */
        }
        return nb;
      });
      return sc;
    });
    draw("dead");
  }, [draw]);

  const step = useCallback(
    (t: number) => {
      const g = gameRef.current;
      if (!g.running) return;
      if (g.last === 0) g.last = t;
      const dt = Math.min(0.032, (t - g.last) / 1000);
      g.last = t;

      // integrate bird
      g.v += GRAVITY * dt;
      g.y += g.v * dt;

      // move + recycle pipes
      for (const p of g.pipes) p.x -= PIPE_SPEED * dt;
      if (g.pipes[0] && g.pipes[0].x + PIPE_W < 0) g.pipes.shift();
      const lastPipe = g.pipes[g.pipes.length - 1];
      if (!lastPipe || lastPipe.x < W - SPAWN_GAP_X) {
        const gapY = 70 + Math.random() * (SKY_H - 140);
        g.pipes.push({ x: W, gapY, passed: false });
      }

      // scoring
      for (const p of g.pipes) {
        if (!p.passed && p.x + PIPE_W < BIRD_X - BIRD_R) {
          p.passed = true;
          setScore((s) => s + 1);
        }
      }

      // collisions: ground / ceiling
      if (g.y + BIRD_R >= SKY_H) {
        g.y = SKY_H - BIRD_R;
        draw("playing");
        die();
        return;
      }
      if (g.y - BIRD_R <= 0) {
        g.y = BIRD_R;
        g.v = 0;
      }

      // collisions: pipes (circle vs the two rects)
      for (const p of g.pipes) {
        const withinX = BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W;
        if (withinX) {
          const topH = p.gapY - GAP / 2;
          const botY = p.gapY + GAP / 2;
          if (g.y - BIRD_R < topH || g.y + BIRD_R > botY) {
            draw("playing");
            die();
            return;
          }
        }
      }

      draw("playing");
      rafRef.current = requestAnimationFrame(step);
    },
    [draw, die],
  );

  /* ── Input ─────────────────────────────────────────────────────────────── */
  const flap = useCallback(() => {
    const s = statusRef.current;
    if (s === "dead") return; // must Reset first
    if (s === "idle") {
      gameRef.current = freshGame();
      gameRef.current.running = true;
      gameRef.current.v = FLAP_V;
      setScore(0);
      setStatus("playing");
      rafRef.current = requestAnimationFrame(step);
      return;
    }
    gameRef.current.v = FLAP_V; // already playing
  }, [step]);

  const reset = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    gameRef.current = freshGame();
    setScore(0);
    setStatus("idle");
    draw("idle");
  }, [draw]);

  // Draw the initial idle frame; clean up the loop on unmount.
  useEffect(() => {
    draw("idle");
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space" || e.code === "ArrowUp" || e.key === " " || e.key === "ArrowUp") {
      e.preventDefault();
      flap();
    }
  };

  const message: Record<Status, string> = {
    idle: "Tap the board (or press Space) to launch the bird and start flapping.",
    playing: "Flap! Keep the bird between the pipes — don't hit a pipe or the ground.",
    dead: `💥 You crashed after ${score} ${score === 1 ? "pipe" : "pipes"}. Press Reset to try again.`,
  };
  const soft = status === "dead" ? "var(--danger-soft)" : status === "playing" ? "var(--accent-soft)" : "var(--surface-2)";
  const bd = status === "dead" ? "var(--danger-border)" : status === "playing" ? "var(--accent-border)" : "var(--border)";
  const fg = status === "dead" ? "var(--danger)" : status === "playing" ? "var(--accent-text)" : "var(--text-muted)";

  return (
    <div className="stack" style={{ gap: 12 }}>
      <p className="small">
        The classic <b>Flappy Bird</b>. <b>Tap the board</b> or press <b>Space / ↑</b> to flap upward; gravity always
        pulls you down. Slip through the gaps in the pipes — one touch of a pipe or the ground ends the run. 🖱️⌨️
      </p>

      <div
        data-testid="flappy-status"
        role="status"
        aria-live="polite"
        className="card"
        style={{ padding: "10px 12px", background: soft, border: `1px solid ${bd}`, color: fg, fontWeight: 650, fontSize: 13 }}
      >
        {message[status]}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span className="small" style={{ margin: 0 }}>
          Score: <b data-testid="flappy-score" style={{ fontSize: 15, color: "var(--text)" }}>{score}</b>
        </span>
        <span className="small" style={{ margin: 0 }}>
          Best: <b data-testid="flappy-best" style={{ fontSize: 15, color: "var(--text)" }}>{best}</b>
        </span>
      </div>

      <div
        data-testid="flappy-board"
        role="button"
        tabIndex={0}
        aria-label="Flappy Bird playfield — tap or press Space to flap"
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).focus();
          flap();
        }}
        style={{
          width: "100%",
          maxWidth: W,
          aspectRatio: `${W} / ${H}`,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          cursor: "pointer",
          userSelect: "none",
          touchAction: "none",
          outline: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="btn btnPrimary" data-testid="flappy-flap" onClick={flap} disabled={status === "dead"}>
          {status === "idle" ? "Start / Flap" : "Flap"}
        </button>
        <button type="button" className="btn" data-testid="flappy-reset" onClick={reset}>
          ↺ Reset
        </button>
      </div>

      <p className="small" style={{ fontStyle: "italic" }}>
        Under the hood this is the same shape as a Scratch script: a <b>forever</b> loop (the game loop),{" "}
        <b>gravity</b> as a variable added to the bird's speed each tick, and an <b>if</b> that ends the game when the
        bird touches a pipe. Try rebuilding a simpler version in Scratch!
      </p>
    </div>
  );
}
