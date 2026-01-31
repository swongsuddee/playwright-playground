// PracticeScrollIntoView.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

type Item = { id: number; label: string };

const PAGE_SIZE = 10;

function makeItems(startId: number, count: number): Item[] {
  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    return { id, label: `Item ${id}` };
  });
}

export function PracticeScrollIntoView() {
  const [items, setItems] = useState<Item[]>(() => makeItems(1, PAGE_SIZE));
  const [isLoading, setIsLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const acceptBtnRef = useRef<HTMLButtonElement | null>(null);

  // "Scroll into view" target gating
  const [acceptInView, setAcceptInView] = useState(false);

  /**
   * IMPORTANT FIX:
   * - Do NOT put `isLoading` in the effect dependency, otherwise the observer gets recreated,
   *   cleanup runs, and your async callback can get cancelled before it appends new items.
   * - Use refs as a stable lock.
   */
  const loadingLockRef = useRef(false);

  /**
   * Optional but recommended:
   * - Prevent "instant retrigger" if sentinel stays visible after appending items.
   * - We only allow loading when sentinel "enters" viewport (armed=true),
   *   then disarm until it leaves viewport again.
   */
  const armedRef = useRef(true);

  // Infinite load: when sentinel becomes visible, show spinner 3s, then append 10 more
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    let cancelled = false;

    const io = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (!entry) return;

        // Re-arm only after sentinel leaves viewport
        if (!entry.isIntersecting) {
          armedRef.current = true;
          return;
        }

        // Only trigger when entering (armed) and not currently loading
        if (!armedRef.current) return;
        if (loadingLockRef.current) return;

        armedRef.current = false;
        loadingLockRef.current = true;

        setIsLoading(true);

        // ⏳ Force spinner visible for 3 seconds
        await new Promise((r) => setTimeout(r, 3000));
        if (cancelled) return;

        setItems((prev) => [...prev, ...makeItems(prev.length + 1, PAGE_SIZE)]);

        setIsLoading(false);
        loadingLockRef.current = false;
      },
      { root: null, threshold: 0.1 }
    );

    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  // Observe accept button in viewport (to teach: scrollIntoViewIfNeeded)
  useEffect(() => {
    const btn = acceptBtnRef.current;
    if (!btn) return;

    const io = new IntersectionObserver(
      (entries) => {
        setAcceptInView(Boolean(entries[0]?.isIntersecting));
      },
      { threshold: 0.6 }
    );

    io.observe(btn);
    return () => io.disconnect();
  }, []);

  return (
    <div className="stack" style={{ gap: 12 }}>
      {/* Header */}
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Practice: Scroll Into View</div>
            <div className="small" style={{ opacity: 0.85 }}>
              2 columns • 10 items per load • scroll down to load more (spinner 3s) • accept at bottom requires scroll.
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div className="small" style={{ opacity: 0.75 }}>Rendered</div>
            <div data-testid="rendered-count" style={{ fontWeight: 900 }}>
              {items.length}
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <div style={{ fontWeight: 800 }}>Items</div>
          <div className="small" style={{ opacity: 0.75 }}>Tip: scroll down to load more</div>
        </div>

        <div
          data-testid="items-grid"
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              data-testid={`item-${it.id}`}
              className="card"
              style={{
                padding: 12,
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                data-testid={`item-index-${it.id}`}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  background: "rgba(255,140,0,0.12)",
                }}
              >
                {it.id}
              </div>
              <div>
                <div style={{ fontWeight: 900 }}>{it.label}</div>
                <div className="small" style={{ opacity: 0.75 }}>
                  Box index: {it.id}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator (visible for 3 seconds) */}
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
          {isLoading ? (
            <div
              data-testid="loading"
              className="card"
              style={{
                padding: "10px 12px",
                display: "inline-flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Spinner />
              <span style={{ fontWeight: 800 }}>Loading 10 more…</span>
            </div>
          ) : (
            // keep stable testid (hidden)
            <div data-testid="loading" style={{ display: "none" }} />
          )}
        </div>

        {/* Sentinel for infinite loading */}
        <div ref={sentinelRef} data-testid="sentinel" style={{ height: 1, marginTop: 1 }} />
      </div>

      
    </div>
  );
}

/** Tiny loading icon (no external libs) */
function Spinner() {
  return (
    <span
      aria-label="loading"
      style={{
        width: 16,
        height: 16,
        borderRadius: 999,
        border: "2px solid rgba(0,0,0,0.2)",
        borderTopColor: "rgba(0,0,0,0.7)",
        display: "inline-block",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}
