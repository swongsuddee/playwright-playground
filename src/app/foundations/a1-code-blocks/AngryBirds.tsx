"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ── Logical scene (CSS scales it responsively) ──────────────────────────── */
const W = 560;
const H = 380;
const GROUND_Y = 340;

const ANCHOR = { x: 110, y: GROUND_Y - 78 }; // slingshot fork
const BIRD_R = 14;
const PIG_R = 16;
const GRAVITY = 1000; // px/s²
const MAX_PULL = 74; // how far back you can draw the sling
const LAUNCH_K = 11; // pull distance → launch speed
const TOTAL_BIRDS = 3;

// Static level (deterministic — no Math.random, so SSR/hydration match).
const BLOCKS: { x: number; y: number; w: number; h: number }[] = [
  { x: 392, y: 250, w: 22, h: 90 }, // left column
  { x: 476, y: 250, w: 22, h: 90 }, // right column
  { x: 386, y: 232, w: 118, h: 20 }, // beam on top
];
const PIG_SPAWN: { x: number; y: number }[] = [
  { x: 332, y: GROUND_Y - PIG_R }, // on the ground, in front
  { x: 445, y: 216 }, // perched on the beam
  { x: 520, y: GROUND_Y - PIG_R }, // on the ground, behind
];

// Arcade palette — intentional, self-contained.
const C = {
  skyTop: "#bfe6ff",
  skyBot: "#eaf7d8",
  ground: "#7cc44c",
  groundDark: "#5aa233",
  dirt: "#b98a4b",
  wood: "#c08a3e",
  woodDark: "#95672a",
  bird: "#e0402c",
  birdBelly: "#f7d9c4",
  beak: "#f5a623",
  pig: "#7fce4f",
  pigDark: "#5aa233",
  sling: "#7b4a1e",
  band: "#3a2a18",
  text: "#243b12",
  eye: "#ffffff",
  pupil: "#22303a",
};

type Status = "ready" | "flying" | "won" | "lost";
type Vec = { x: number; y: number };
type Bird = { x: number; y: number; vx: number; vy: number };
type Pig = { x: number; y: number };

type Game = {
  bird: Bird;
  pigs: Pig[];
  dragging: boolean;
  drag: Vec; // current pull point (clamped)
  status: Status;
  birdsLeft: number;
  spentAt: number | null; // ms timestamp when the current shot came to rest
  last: number;
};

function freshBird(): Bird {
  return { x: ANCHOR.x, y: ANCHOR.y, vx: 0, vy: 0 };
}
function freshGame(): Game {
  return {
    bird: freshBird(),
    pigs: PIG_SPAWN.map((p) => ({ ...p })),
    dragging: false,
    drag: { ...ANCHOR },
    status: "ready",
    birdsLeft: TOTAL_BIRDS,
    spentAt: null,
    last: 0,
  };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// Resolve a moving circle against a static rect: push out + reflect with damping.
function collideRect(b: Bird, r: { x: number; y: number; w: number; h: number }) {
  const cx = clamp(b.x, r.x, r.x + r.w);
  const cy = clamp(b.y, r.y, r.y + r.h);
  let dx = b.x - cx;
  let dy = b.y - cy;
  let d2 = dx * dx + dy * dy;
  if (d2 >= BIRD_R * BIRD_R) return;

  let nx: number, ny: number, overlap: number;
  if (d2 > 0.0001) {
    const d = Math.sqrt(d2);
    nx = dx / d;
    ny = dy / d;
    overlap = BIRD_R - d;
  } else {
    // Center is inside the rect — push out along the shallowest axis.
    const left = b.x - r.x;
    const right = r.x + r.w - b.x;
    const top = b.y - r.y;
    const bottom = r.y + r.h - b.y;
    const min = Math.min(left, right, top, bottom);
    if (min === left) { nx = -1; ny = 0; }
    else if (min === right) { nx = 1; ny = 0; }
    else if (min === top) { nx = 0; ny = -1; }
    else { nx = 0; ny = 1; }
    overlap = BIRD_R + min;
  }
  b.x += nx * overlap;
  b.y += ny * overlap;
  const vn = b.vx * nx + b.vy * ny;
  if (vn < 0) {
    b.vx -= 1.45 * vn * nx; // (1 + restitution 0.45)
    b.vy -= 1.45 * vn * ny;
    b.vx *= 0.84; // tangential friction
    b.vy *= 0.84;
  }
}

const BEST_KEY = "playground.angrybirds.best";

export function AngryBirds() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game>(freshGame());
  const rafRef = useRef<number | null>(null);

  const [status, setStatus] = useState<Status>("ready");
  const [birdsLeft, setBirdsLeft] = useState(TOTAL_BIRDS);
  const [pigsLeft, setPigsLeft] = useState(PIG_SPAWN.length);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BEST_KEY);
      if (raw) setBest(Number(raw) || 0);
    } catch {
      /* ignore */
    }
  }, []);

  const syncHud = useCallback(() => {
    const g = gameRef.current;
    setStatus(g.status);
    setBirdsLeft(g.birdsLeft);
    setPigsLeft(g.pigs.length);
    const popped = PIG_SPAWN.length - g.pigs.length;
    const sc = popped * 100 + (g.status === "won" ? g.birdsLeft * 250 : 0);
    setScore(sc);
    if (g.status === "won") {
      setBest((b) => {
        const nb = Math.max(b, sc);
        try {
          window.localStorage.setItem(BEST_KEY, String(nb));
        } catch {
          /* ignore */
        }
        return nb;
      });
    }
  }, []);

  /* ── Rendering ─────────────────────────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = gameRef.current;

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, C.skyTop);
    sky.addColorStop(1, C.skyBot);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = C.dirt;
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    ctx.fillStyle = C.ground;
    ctx.fillRect(0, GROUND_Y, W, 10);

    // Blocks (wood)
    for (const r of BLOCKS) {
      ctx.fillStyle = C.wood;
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = C.woodDark;
      ctx.lineWidth = 3;
      ctx.strokeRect(r.x + 1.5, r.y + 1.5, r.w - 3, r.h - 3);
    }

    // Pigs
    for (const p of g.pigs) {
      ctx.fillStyle = C.pig;
      ctx.beginPath();
      ctx.arc(p.x, p.y, PIG_R, 0, Math.PI * 2);
      ctx.fill();
      // ears
      ctx.beginPath();
      ctx.arc(p.x - 8, p.y - 12, 4, 0, Math.PI * 2);
      ctx.arc(p.x + 8, p.y - 12, 4, 0, Math.PI * 2);
      ctx.fill();
      // snout
      ctx.fillStyle = C.pigDark;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 3, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // eyes
      ctx.fillStyle = C.eye;
      ctx.beginPath();
      ctx.arc(p.x - 5, p.y - 4, 3, 0, Math.PI * 2);
      ctx.arc(p.x + 5, p.y - 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = C.pupil;
      ctx.beginPath();
      ctx.arc(p.x - 5, p.y - 4, 1.3, 0, Math.PI * 2);
      ctx.arc(p.x + 5, p.y - 4, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Slingshot forks
    ctx.strokeStyle = C.sling;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ANCHOR.x, GROUND_Y);
    ctx.lineTo(ANCHOR.x, ANCHOR.y - 4);
    ctx.stroke();

    const b = g.bird;
    // Sling band (only meaningful while the bird sits in the sling)
    if (g.status === "ready") {
      ctx.strokeStyle = C.band;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ANCHOR.x - 8, ANCHOR.y - 6);
      ctx.lineTo(b.x, b.y);
      ctx.moveTo(ANCHOR.x + 8, ANCHOR.y - 6);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      // Trajectory preview while dragging
      if (g.dragging) {
        const vx = (ANCHOR.x - b.x) * LAUNCH_K;
        const vy = (ANCHOR.y - b.y) * LAUNCH_K;
        let px = b.x;
        let py = b.y;
        let pvx = vx;
        let pvy = vy;
        ctx.fillStyle = "rgba(36,59,18,0.5)";
        for (let i = 0; i < 28; i++) {
          px += pvx * 0.04;
          py += pvy * 0.04;
          pvy += GRAVITY * 0.04;
          if (i % 2 === 0 && py < GROUND_Y) {
            ctx.beginPath();
            ctx.arc(px, py, 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // Bird
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.fillStyle = C.bird;
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.birdBelly;
    ctx.beginPath();
    ctx.arc(2, 5, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.eye;
    ctx.beginPath();
    ctx.arc(5, -4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.pupil;
    ctx.beginPath();
    ctx.arc(6.5, -4, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.beak;
    ctx.beginPath();
    ctx.moveTo(11, -1);
    ctx.lineTo(19, 2);
    ctx.lineTo(11, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Banner text
    if (g.status === "won" || g.status === "lost") {
      ctx.fillStyle = C.text;
      ctx.textAlign = "center";
      ctx.font = "800 34px system-ui, sans-serif";
      ctx.fillText(g.status === "won" ? "Level cleared! 🎉" : "Out of birds", W / 2, 90);
      ctx.font = "600 15px system-ui, sans-serif";
      ctx.fillText("Press Reset to play again", W / 2, 118);
      ctx.textAlign = "start";
    }
  }, []);

  /* ── Main loop ─────────────────────────────────────────────────────────── */
  const loop = useCallback(
    (t: number) => {
      const g = gameRef.current;
      if (g.last === 0) g.last = t;
      const dt = Math.min(0.024, (t - g.last) / 1000);
      g.last = t;

      if (g.status === "flying") {
        const b = g.bird;
        b.vy += GRAVITY * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // ground
        if (b.y + BIRD_R > GROUND_Y) {
          b.y = GROUND_Y - BIRD_R;
          if (b.vy > 0) b.vy = -b.vy * 0.4;
          b.vx *= 0.82;
        }
        // blocks
        for (const r of BLOCKS) collideRect(b, r);
        // pigs
        if (g.pigs.length) {
          const survivors = g.pigs.filter((p) => Math.hypot(p.x - b.x, p.y - b.y) > PIG_R + BIRD_R);
          if (survivors.length !== g.pigs.length) {
            g.pigs = survivors;
            b.vx *= 0.7;
            b.vy *= 0.7;
            syncHud();
          }
        }

        // came to rest / left the scene → shot is spent
        const resting = b.y + BIRD_R >= GROUND_Y - 0.5 && Math.hypot(b.vx, b.vy) < 26;
        const gone = b.x > W + 40 || b.x < -40 || b.y > H + 80;
        if ((resting || gone) && g.spentAt == null) g.spentAt = t;

        // after a short pause, resolve the shot
        if (g.spentAt != null && t - g.spentAt > 650) {
          g.spentAt = null;
          if (g.pigs.length === 0) {
            g.status = "won";
          } else {
            g.birdsLeft -= 1;
            if (g.birdsLeft <= 0) {
              g.status = "lost";
            } else {
              g.bird = freshBird();
              g.status = "ready";
            }
          }
          syncHud();
        }
      }

      draw();
      rafRef.current = requestAnimationFrame(loop);
    },
    [draw, syncHud],
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [loop]);

  /* ── Pointer / drag aiming ─────────────────────────────────────────────── */
  const toLocal = (e: React.PointerEvent): Vec => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  };

  const setPull = (pt: Vec) => {
    const g = gameRef.current;
    let dx = pt.x - ANCHOR.x;
    let dy = pt.y - ANCHOR.y;
    const dist = Math.hypot(dx, dy);
    if (dist > MAX_PULL) {
      dx = (dx / dist) * MAX_PULL;
      dy = (dy / dist) * MAX_PULL;
    }
    g.bird.x = ANCHOR.x + dx;
    g.bird.y = ANCHOR.y + dy;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const g = gameRef.current;
    if (g.status !== "ready") return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    g.dragging = true;
    setPull(toLocal(e));
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const g = gameRef.current;
    if (!g.dragging) return;
    setPull(toLocal(e));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const g = gameRef.current;
    if (!g.dragging) return;
    g.dragging = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const pulled = Math.hypot(g.bird.x - ANCHOR.x, g.bird.y - ANCHOR.y);
    if (pulled < 8) {
      // barely a tap — snap back, stay ready
      g.bird = freshBird();
      return;
    }
    g.bird.vx = (ANCHOR.x - g.bird.x) * LAUNCH_K;
    g.bird.vy = (ANCHOR.y - g.bird.y) * LAUNCH_K;
    g.status = "flying";
    g.spentAt = null;
    syncHud();
  };

  const reset = () => {
    gameRef.current = freshGame();
    gameRef.current.last = 0;
    syncHud();
    draw();
  };

  const message: Record<Status, string> = {
    ready: "Drag the red bird back on the slingshot to aim, then release to launch. Knock out every green pig.",
    flying: "In flight! The bird arcs under gravity and bounces off the wooden blocks.",
    won: "🎉 All pigs cleared! Press Reset for another round.",
    lost: "😦 Out of birds with pigs still standing. Press Reset to try again.",
  };
  const soft = status === "won" ? "var(--success-soft)" : status === "lost" ? "var(--danger-soft)" : status === "flying" ? "var(--accent-soft)" : "var(--surface-2)";
  const bd = status === "won" ? "var(--success-border)" : status === "lost" ? "var(--danger-border)" : status === "flying" ? "var(--accent-border)" : "var(--border)";
  const fg = status === "won" ? "var(--success)" : status === "lost" ? "var(--danger)" : status === "flying" ? "var(--accent-text)" : "var(--text-muted)";

  return (
    <div className="stack" style={{ gap: 12 }}>
      <p className="small">
        A mini <b>Angry Birds</b>. <b>Drag the red bird</b> back on the slingshot — pull direction and distance set the
        angle and power — then <b>let go</b> to fire. Clear all three green pigs before you run out of birds. 🖱️ Best
        with a mouse or touch.
      </p>

      <div
        data-testid="angry-status"
        role="status"
        aria-live="polite"
        className="card"
        style={{ padding: "10px 12px", background: soft, border: `1px solid ${bd}`, color: fg, fontWeight: 650, fontSize: 13 }}
      >
        {message[status]}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span className="small" style={{ margin: 0 }}>
          Birds left: <b data-testid="angry-birds-left" style={{ fontSize: 15, color: "var(--text)" }}>{birdsLeft}</b>
        </span>
        <span className="small" style={{ margin: 0 }}>
          Pigs left: <b data-testid="angry-pigs-left" style={{ fontSize: 15, color: "var(--text)" }}>{pigsLeft}</b>
        </span>
        <span className="small" style={{ margin: 0 }}>
          Score: <b data-testid="angry-score" style={{ fontSize: 15, color: "var(--text)" }}>{score}</b>
        </span>
        <span className="small" style={{ margin: 0 }}>
          Best: <b data-testid="angry-best" style={{ fontSize: 15, color: "var(--text)" }}>{best}</b>
        </span>
      </div>

      <div
        data-testid="angry-board"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          width: "100%",
          maxWidth: W,
          aspectRatio: `${W} / ${H}`,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          cursor: status === "ready" ? "grab" : "default",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          aria-label="Angry Birds slingshot playfield"
          role="img"
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="btn btnPrimary" data-testid="angry-reset" onClick={reset}>
          ↺ Reset level
        </button>
        <span className="small" style={{ margin: 0 }}>Aim high and long for the perched pig.</span>
      </div>

      <p className="small" style={{ fontStyle: "italic" }}>
        The same building blocks as any program hide in here: a <b>loop</b> that redraws every frame,{" "}
        <b>variables</b> for the bird's position and speed, and <b>if</b> checks for “did it hit a pig / a block / the
        ground?”. Try modelling the launch as a Scratch script!
      </p>
    </div>
  );
}
