import type { CSSProperties, ReactNode } from "react";

/* Shared flowchart shapes + token-only fills, reused across the A2 lessons. */

export const S_TERMINATOR: CSSProperties = { background: "var(--accent-soft)", borderColor: "var(--accent-border)", color: "var(--accent-text)" };
export const S_PROCESS: CSSProperties = { background: "var(--surface-2)", borderColor: "var(--border-strong)", color: "var(--text)" };
export const S_DECISION: CSSProperties = { background: "var(--secondary-soft)", borderColor: "var(--secondary-border)", color: "var(--secondary-text)" };
export const S_IO: CSSProperties = { background: "var(--surface-2)", borderColor: "var(--border-strong)", color: "var(--text)" };
export const S_ERROR: CSSProperties = { background: "var(--danger-soft)", borderColor: "var(--danger-border)", color: "var(--danger)" };

export function Pill({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: "10px 22px", borderRadius: 999, textAlign: "center", fontWeight: 700, fontSize: 13, lineHeight: 1.3, border: "1px solid transparent", ...style }}>
      {children}
    </div>
  );
}

export function Rect({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 48, padding: "12px 18px", borderRadius: "var(--radius-sm)", textAlign: "center", fontWeight: 600, fontSize: 13, lineHeight: 1.3, border: "1px solid transparent", ...style }}>
      {children}
    </div>
  );
}

export function Diamond({ children, size = 132, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  const s = size * 0.7;
  return (
    <div style={{ width: size, height: size, display: "grid", placeItems: "center", flex: "0 0 auto" }}>
      <div style={{ width: s, height: s, transform: "rotate(45deg)", borderRadius: 10, display: "grid", placeItems: "center", border: "1px solid transparent", ...style }}>
        <div style={{ transform: "rotate(-45deg)", width: size * 0.82, textAlign: "center", fontWeight: 700, fontSize: 12.5, lineHeight: 1.25 }}>{children}</div>
      </div>
    </div>
  );
}

export function Parallelogram({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: "10px 26px", borderRadius: 6, transform: "skewX(-14deg)", border: "1px solid transparent", ...style }}>
      <span style={{ display: "inline-block", transform: "skewX(14deg)", fontWeight: 600, fontSize: 12.5 }}>{children}</span>
    </div>
  );
}

export function Connector({ label, height = 22 }: { label?: string; height?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: "var(--text-faint)" }}>
      {label ? <span className="badge" style={{ padding: "2px 9px" }}>{label}</span> : null}
      <span style={{ width: 2, height, background: "var(--border-strong)", display: "block" }} />
      <span aria-hidden style={{ fontSize: 13, lineHeight: 1, marginTop: -6 }}>▼</span>
    </div>
  );
}
