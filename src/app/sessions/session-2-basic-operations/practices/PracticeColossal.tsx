"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Banner = { id: number; subtitle: string };

function useBanners() {
  return useMemo<Banner[]>(
    () => [
      { id: 1, subtitle: "Banner 1" },
      { id: 2, subtitle: "Banner 2" },
      { id: 3, subtitle: "Banner 3" },
      { id: 4, subtitle: "Banner 4" },
      { id: 5, subtitle: "Banner 5" },
    ],
    []
  );
}

/**
 * Hold file: render both variants in the same block.
 * 1) Auto change every 3s (snap center + drag)
 * 2) Single banner only (fade in/out on prev/next)
 */
export  function PracticeColossal() {
  return (
    <div className="stack" style={{ gap: 12 }}>
      <PracticeColossalAutoSnap />
      <PracticeColossalSingleFade />
    </div>
  );
}

/* -------------------------------------------------------
 * 1) Auto-snap carousel (every 3 sec)
 * ----------------------------------------------------- */
function PracticeColossalAutoSnap() {
  const banners = useBanners(); // 5 items

  const [active, setActive] = useState(0); // 0..4
  const [anim, setAnim] = useState<"none" | "toNext" | "toPrev">("none");
  const [dragging, setDragging] = useState(false);

  const startXRef = useRef(0);
  const dragXRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  const n = banners.length;
  const mod = (x: number) => (x % n + n) % n;

  // IMPORTANT: Your requirement (swapped sides)
  // left shows NEXT, right shows PREV
  const next = mod(active + 1);
  const prev = mod(active - 1);

  // We render in "visual order": LEFT(next) — CENTER(active) — RIGHT(prev)
  const leftIdx = next;
  const centerIdx = active;
  const rightIdx = prev;

  const stepPx = "calc(var(--bannerW) + var(--gap))";

  const beginToNext = () => {
    if (anim !== "none") return;
    setAnim("toNext");
  };

  const beginToPrev = () => {
    if (anim !== "none") return;
    setAnim("toPrev");
  };

  // After animation ends, commit the new active and reset.
  const onTransitionEnd = () => {
    if (anim === "toNext") setActive((cur) => mod(cur + 1));
    if (anim === "toPrev") setActive((cur) => mod(cur - 1));
    setAnim("none");
  };

  // Buttons: loop forever
  const goNext = () => beginToNext(); // 1 -> 2 -> 3 ...
  const goPrev = () => beginToPrev(); // 1 <- 5 <- 4 ...

  // Drag: move track with pointer, snap on release
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointerIdRef.current = e.pointerId;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);

    setDragging(true);
    setAnim("none"); // cancel any animation while dragging
    startXRef.current = e.clientX;
    dragXRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current === null) return;
    const dx = e.clientX - startXRef.current;
    dragXRef.current = dx;
    // force render by toggling state lightly (no need if you prefer refs + style calc)
    // We'll just rely on "dragging" state and read ref in style.
    if (!dragging) setDragging(true);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current === null) return;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(pointerIdRef.current);
    } catch {}
    pointerIdRef.current = null;

    const dx = dragXRef.current;
    dragXRef.current = 0;
    setDragging(false);

    // Threshold: 25% of banner width (approx). We use a fixed px threshold for simplicity.
    // If you want fully dynamic, we can measure banner width.
    const THRESHOLD = 120;

    // Your side mapping:
    // drag right (dx > 0) reveals LEFT(next) more => commit "next"
    // drag left  (dx < 0) reveals RIGHT(prev) more => commit "prev"
    if (dx > THRESHOLD) beginToNext();
    else if (dx < -THRESHOLD) beginToPrev();
    else setAnim("none");
  };

  // Track transform:
  // - normal: 0 (center is in the middle)
  // - toNext: shift RIGHT by 1 step so LEFT(next) moves into center
  // - toPrev: shift LEFT by 1 step so RIGHT(prev) moves into center
  // - dragging: apply dx directly (no transition)
  const baseTransform =
    anim === "toNext"
      ? `translateX(${stepPx})`
      : anim === "toPrev"
      ? `translateX(calc(-1 * ${stepPx}))`
      : "translateX(0px)";

  const dragTransform = `translateX(${dragXRef.current}px)`;

  const trackTransform = dragging ? dragTransform : baseTransform;

  const transition =
    dragging || anim === "none" ? "none" : "transform 260ms ease";

  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ fontWeight: 900, fontSize: 18 }}>
        Colossal #1 — Drag left or right for change
      </div>
      <div className="small" style={{ marginTop: 4 }}>
        Infinite loop + side previews (left=next, right=prev) + drag + buttons.
      </div>

      <div style={{ height: 12 }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "48px 1fr 48px",
          alignItems: "center",
          gap: 10,
        }}
      >
        <button
          data-testid="colossal-loop-prev"
          className="btnSecondary"
          onClick={goPrev}
          style={{ height: 40 }}
          aria-label="previous"
        >
          &lt;
        </button>

        {/* viewport */}
        <div
          data-testid="colossal-loop-viewport"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            // sizing
            ["--bannerW" as any]: "min(520px, 72vw)",
            ["--gap" as any]: "16px",

            overflow: "hidden",
            userSelect: "none",
            cursor: dragging ? "grabbing" : "grab",
            padding: "8px 0",
          }}
        >
          {/* track (3 items) */}
          <div
            data-testid="colossal-loop-track"
            onTransitionEnd={onTransitionEnd}
            style={{
              display: "flex",
              gap: "var(--gap)",
              justifyContent: "center",
              alignItems: "center",
              transform: trackTransform,
              transition,
              willChange: "transform",
            }}
          >
            <BannerCard
              testid="colossal-loop-left"
              index={leftIdx}
              label={banners[leftIdx].subtitle}
            />
            <BannerCard
              testid="colossal-loop-center"
              index={centerIdx}
              label={banners[centerIdx].subtitle}
              isCenter
            />
            <BannerCard
              testid="colossal-loop-right"
              index={rightIdx}
              label={banners[rightIdx].subtitle}
            />
          </div>
        </div>

        <button
          data-testid="colossal-loop-next"
          className="btnSecondary"
          onClick={goNext}
          style={{ height: 40 }}
          aria-label="next"
        >
          &gt;
        </button>
      </div>

      <div
        className="small"
        data-testid="colossal-loop-active"
        style={{ marginTop: 10, textAlign: "center" }}
      >
        Active: {active + 1}/{banners.length}
      </div>
    </div>
  );
}

function BannerCard({
  testid,
  index,
  label,
  isCenter,
}: {
  testid: string;
  index: number;
  label: string;
  isCenter?: boolean;
}) {
  return (
    <div
      data-testid={testid}
      style={{
        flex: "0 0 auto",
        width: "var(--bannerW)",
        height: 120,
        borderRadius: 18,
        border: "2px solid var(--accent, #ff7a18)",
        display: "grid",
        placeItems: "center",
        background: "white",
        opacity: isCenter ? 1 : 0.92,
        transform: isCenter ? "scale(1)" : "scale(0.96)",
        transition: "transform 200ms ease, opacity 200ms ease",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 28 }}>{index + 1}</div>
        <div className="small" style={{ marginTop: 6 }}>
          {label}
        </div>
      </div>
    </div>
  );
}


/* -------------------------------------------------------
 * 2) Single banner only (fade in/out)
 * ----------------------------------------------------- */
function PracticeColossalSingleFade() {
  const banners = useBanners();

  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const animatingRef = useRef(false);

  const clamp = (n: number) => Math.max(0, Math.min(banners.length - 1, n));

  const transitionTo = (next: number) => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    setPhase("out");
    window.setTimeout(() => {
      setActive(next);
      setPhase("in");
      window.setTimeout(() => {
        animatingRef.current = false;
      }, 220);
    }, 220);
  };

  const goPrev = () => transitionTo(clamp(active - 1));
  const goNext = () => transitionTo(clamp(active + 1));

  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ fontWeight: 900, fontSize: 18 }}>Colossal #2 — Single banner (fade)</div>
      <div className="small" style={{ marginTop: 4 }}>
        Only one banner visible. Click &lt;/&gt; to fade out → change → fade in.
      </div>

      <div style={{ height: 12 }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "48px 1fr 48px",
          alignItems: "center",
          gap: 10,
        }}
      >
        <button
          data-testid="colossal-single-prev"
          className="btnSecondary"
          onClick={goPrev}
          disabled={active === 0}
          style={{ height: 40 }}
        >
          &lt;
        </button>

        <div data-testid="colossal-single-stage" style={{ height: 140, display: "grid", placeItems: "center" }}>
          <div
            data-testid="colossal-single-banner"
            style={{
              width: "min(520px, 72vw)",
              height: 120,
              borderRadius: 18,
              border: "2px solid var(--accent, #ff7a18)",
              display: "grid",
              placeItems: "center",
              background: "white",
              opacity: phase === "in" ? 1 : 0,
              transform: phase === "in" ? "translateY(0px)" : "translateY(6px)",
              transition: "opacity 220ms ease, transform 220ms ease",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div data-testid="colossal-single-index" style={{ fontWeight: 900, fontSize: 28 }}>
                {active + 1}
              </div>
              <div className="small" style={{ marginTop: 6 }}>
                {banners[active].subtitle}
              </div>
            </div>
          </div>
        </div>

        <button
          data-testid="colossal-single-next"
          className="btnSecondary"
          onClick={goNext}
          disabled={active === banners.length - 1}
          style={{ height: 40 }}
        >
          &gt;
        </button>
      </div>

      <div className="small" data-testid="colossal-single-active" style={{ marginTop: 10, textAlign: "center" }}>
        Active: {active + 1}/{banners.length}
      </div>
    </div>
  );
}
