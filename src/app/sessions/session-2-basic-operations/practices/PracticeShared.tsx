"use client";

export function PracticeTitle({ title, goal }: { title: string; goal: string }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>
      <div className="small" style={{ marginTop: 6 }}>
        {goal}
      </div>
    </div>
  );
}

export function CodeBox({ code }: { code: string }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ fontWeight: 800 }}>Assertion example</div>
      <pre className="code" style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
        {code}
      </pre>
    </div>
  );
}
