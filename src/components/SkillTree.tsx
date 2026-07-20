"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * A game-style "skill path" of the playground's content — a central hub that
 * branches into domains (Basic Programming, QA, Front End, Back End). Real
 * lessons are unlocked & clickable; not-yet-built domains show as locked
 * "coming soon" nodes. Fixed layout that scales to fit; scrolls on small
 * screens. Hover a node to light its branch and preview it; click to open.
 */

type Kind = "hub" | "domain" | "leaf";

type TreeNode = {
  id: string;
  title: string;
  meta?: string; // short line under the title / in the tooltip
  x: number; // 0..1 across the board
  y: number; // 0..1 down the board
  kind: Kind;
  color: string; // a CSS var reference, e.g. "var(--c-indigo)"
  icon?: string;
  href?: string;
  locked?: boolean;
};

// Domain palette (uses the app's playful category accents so light + dark both work).
const C = {
  core: "var(--accent)",
  prog: "var(--c-indigo)",
  qa: "var(--accent)",
  front: "var(--c-sky)",
  back: "var(--c-coral)",
} as const;

const NODES: TreeNode[] = [
  // ── Center hub ──────────────────────────────────────────────
  { id: "core", title: "Start Here", meta: "Pick a path", x: 0.5, y: 0.5, kind: "hub", color: C.core, icon: "🎭" },

  // ── Front End (top) — locked ────────────────────────────────
  { id: "front", title: "Front End", meta: "Coming soon", x: 0.5, y: 0.145, kind: "domain", color: C.front, icon: "🎨", locked: true },
  { id: "front-html", title: "HTML & CSS", meta: "Coming soon", x: 0.375, y: 0.045, kind: "leaf", color: C.front, locked: true },
  { id: "front-react", title: "React & UI", meta: "Coming soon", x: 0.625, y: 0.045, kind: "leaf", color: C.front, locked: true },

  // ── Back End (bottom) — locked ──────────────────────────────
  { id: "back", title: "Back End", meta: "Coming soon", x: 0.5, y: 0.855, kind: "domain", color: C.back, icon: "🗄️", locked: true },
  { id: "back-api", title: "APIs & Auth", meta: "Coming soon", x: 0.375, y: 0.955, kind: "leaf", color: C.back, locked: true },
  { id: "back-db", title: "Databases", meta: "Coming soon", x: 0.625, y: 0.955, kind: "leaf", color: C.back, locked: true },

  // ── Basic Programming (left) — unlocked ─────────────────────
  { id: "prog", title: "Basic Programming", meta: "Foundations", x: 0.3, y: 0.5, kind: "domain", color: C.prog, icon: "🧩" },
  { id: "prog-dec", title: "Problem Decomposition", meta: "real case → steps → flow", x: 0.115, y: 0.215, kind: "leaf", color: C.prog, href: "/foundations/a3-decomposition" },
  { id: "prog-flow", title: "Flow Diagrams", meta: "read & build flowcharts", x: 0.055, y: 0.405, kind: "leaf", color: C.prog, href: "/foundations/a2-flow-diagrams" },
  { id: "prog-code", title: "Code Blocks (Scratch)", meta: "sequence, loops, conditionals", x: 0.055, y: 0.595, kind: "leaf", color: C.prog, href: "/foundations/a1-code-blocks" },
  { id: "prog-lang", title: "Programming Languages", meta: "Python · TypeScript · Java", x: 0.115, y: 0.785, kind: "leaf", color: C.prog, href: "/foundations/a4-languages" },

  // ── QA (right) — unlocked ───────────────────────────────────
  { id: "qa", title: "QA", meta: "Test the web", x: 0.7, y: 0.5, kind: "domain", color: C.qa, icon: "🎯" },
  { id: "qa-manual", title: "Manual QA", meta: "Coming soon", x: 0.84, y: 0.245, kind: "leaf", color: C.qa, locked: true },
  { id: "qa-auto", title: "Automation", meta: "Playwright", x: 0.82, y: 0.685, kind: "domain", color: C.qa, icon: "⚡" },
  { id: "qa-loc", title: "Locators", meta: "Session 1 · Seat Booking", x: 0.945, y: 0.43, kind: "leaf", color: C.qa, href: "/sessions/session-1-locators" },
  { id: "qa-ops", title: "Basic Operations", meta: "Session 2 · click, fill, expect", x: 0.965, y: 0.585, kind: "leaf", color: C.qa, href: "/sessions/session-2-basic-operations" },
  { id: "qa-api", title: "API Basics", meta: "Coming soon", x: 0.945, y: 0.74, kind: "leaf", color: C.qa, locked: true },
  { id: "qa-pom", title: "Page Object Model", meta: "Coming soon", x: 0.865, y: 0.845, kind: "leaf", color: C.qa, locked: true },
];

const EDGES: [string, string][] = [
  ["core", "front"],
  ["core", "back"],
  ["core", "prog"],
  ["core", "qa"],
  ["front", "front-html"],
  ["front", "front-react"],
  ["back", "back-api"],
  ["back", "back-db"],
  ["prog", "prog-dec"],
  ["prog", "prog-flow"],
  ["prog", "prog-code"],
  ["prog", "prog-lang"],
  ["qa", "qa-manual"],
  ["qa", "qa-auto"],
  ["qa-auto", "qa-loc"],
  ["qa-auto", "qa-ops"],
  ["qa-auto", "qa-api"],
  ["qa-auto", "qa-pom"],
];

const BY_ID: Record<string, TreeNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));

// BFS distance from the hub, so the entrance animation ripples outward.
const RING: Record<string, number> = (() => {
  const adj: Record<string, string[]> = {};
  for (const [a, b] of EDGES) {
    (adj[a] ||= []).push(b);
    (adj[b] ||= []).push(a);
  }
  const ring: Record<string, number> = { core: 0 };
  const queue = ["core"];
  while (queue.length) {
    const n = queue.shift()!;
    for (const m of adj[n] || []) {
      if (ring[m] == null) {
        ring[m] = ring[n] + 1;
        queue.push(m);
      }
    }
  }
  return ring;
})();

const STEP = 120; // ms per ring
const nodeDelay = (id: string) => 60 + (RING[id] ?? 0) * STEP;
const edgeDelay = (a: string, b: string) =>
  Math.max(RING[a] ?? 0, RING[b] ?? 0) * STEP; // draw an edge as its far node arrives

// Coordinate-space design size; the board scales to fit but keeps this aspect.
const VW = 1300;
const VH = 900;
const PAD = 82; // inset so edge nodes are not clipped

function place(n: TreeNode, w: number, h: number) {
  return { x: PAD + n.x * (w - 2 * PAD), y: PAD + n.y * (h - 2 * PAD) };
}

// Gentle curve between two points, easing along the dominant axis for an organic look.
function curve(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const cx = a.x + dx * 0.5;
    return `M ${a.x} ${a.y} C ${cx} ${a.y} ${cx} ${b.y} ${b.x} ${b.y}`;
  }
  const cy = a.y + dy * 0.5;
  return `M ${a.x} ${a.y} C ${a.x} ${cy} ${b.x} ${cy} ${b.x} ${b.y}`;
}

export function SkillTree() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: VW, h: VH });
  const [hovered, setHovered] = useState<string | null>(null);

  // Measure the board so edges (SVG px) align with nodes (absolute px). The
  // ResizeObserver fires once on observe, so we never setState synchronously.
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setSize({ w: cr.width, h: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;

  return (
    <div className="tree">
      <div className="treeScroll noScrollBar">
        <div className="treeBoard" ref={boardRef}>
          <svg className="treeEdges" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
            {EDGES.map(([aId, bId]) => {
              const a = BY_ID[aId];
              const b = BY_ID[bId];
              const pa = place(a, w, h);
              const pb = place(b, w, h);
              const active = hovered === aId || hovered === bId;
              const locked = Boolean(b.locked);
              const delay = edgeDelay(aId, bId);
              return (
                <path
                  key={`${aId}-${bId}`}
                  className="treeEdge"
                  d={curve(pa, pb)}
                  data-active={active}
                  data-locked={locked}
                  data-draw={locked ? undefined : true}
                  pathLength={locked ? undefined : 1}
                  style={{
                    ["--edge-delay" as string]: `${delay}ms`,
                    ...(active ? { stroke: b.color } : null),
                  }}
                />
              );
            })}
          </svg>

          {NODES.map((n) => {
            const p = place(n, w, h);
            const dim = hovered !== null && hovered !== n.id;
            const tipBelow = n.y < 0.32;

            const inner = (
              <>
                {n.icon ? <span className="treeNodeIcon" aria-hidden="true">{n.icon}</span> : null}
                <span className="treeNodeTitle">{n.title}</span>
                {n.locked ? <span className="treeLock" aria-hidden="true">🔒</span> : null}

                <span className="treeTooltip" data-below={tipBelow} role="tooltip">
                  <span className="treeTooltipTitle">{n.title}</span>
                  {n.meta ? <span className="treeTooltipMeta">{n.meta}</span> : null}
                  <span className="treeTooltipCta">{n.locked ? "Coming soon" : "Open →"}</span>
                </span>
              </>
            );

            const commonProps = {
              className: "treeNode",
              "data-kind": n.kind,
              "data-locked": n.locked ? true : undefined,
              "data-dim": dim ? true : undefined,
              style: {
                left: p.x,
                top: p.y,
                ["--node" as string]: n.color,
                ["--node-delay" as string]: `${nodeDelay(n.id)}ms`,
              },
              onMouseEnter: () => setHovered(n.id),
              onMouseLeave: () => setHovered((cur) => (cur === n.id ? null : cur)),
              onFocus: () => setHovered(n.id),
              onBlur: () => setHovered((cur) => (cur === n.id ? null : cur)),
            };

            if (n.href && !n.locked) {
              return (
                <Link key={n.id} href={n.href} {...commonProps} aria-label={`${n.title} — ${n.meta ?? "open"}`}>
                  {inner}
                </Link>
              );
            }
            return (
              <div
                key={n.id}
                {...commonProps}
                role={n.locked ? "img" : undefined}
                aria-label={n.locked ? `${n.title} — coming soon` : n.title}
                tabIndex={n.locked ? -1 : 0}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>

      <div className="treeLegend" aria-hidden="true">
        <span className="treeLegendItem"><i style={{ background: C.prog }} /> Basic Programming</span>
        <span className="treeLegendItem"><i style={{ background: C.qa }} /> QA</span>
        <span className="treeLegendItem"><i style={{ background: C.front }} /> Front End</span>
        <span className="treeLegendItem"><i style={{ background: C.back }} /> Back End</span>
        <span className="treeLegendItem treeLegendLocked">🔒 Coming soon</span>
      </div>
    </div>
  );
}
