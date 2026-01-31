"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type Child = { href: string; title: string };

type Session = {
  href: string;
  title: string;
  meta: string;
  comingSoon?: boolean;
  children?: Child[];
};

const sessions: Session[] = [
  {
    href: "/sessions/session-1-locators",
    title: "Session 1 — Locator Finding",
    meta: "Practice: Seat Booking",
  },
  {
    href: "/sessions/session-2-basic-operations",
    title: "Session 2 — Basic Operations",
    meta: "click, fill, expect",
    children: [
      { title: "2.1 Click & Mouse Operations", href: "/sessions/session-2-basic-operations#2-1" },
      { title: "2.2 Text Input & Keyboard", href: "/sessions/session-2-basic-operations#2-2" },
      { title: "2.3 Reading Text & Values", href: "/sessions/session-2-basic-operations#2-3" },
      { title: "2.4 Element State & Visibility", href: "/sessions/session-2-basic-operations#2-4" },
      { title: "2.5 Select, Checkbox, Radio & Dropdown", href: "/sessions/session-2-basic-operations#2-5" },
      { title: "2.6 Date & Time Picker", href: "/sessions/session-2-basic-operations#2-6" },
      { title: "2.7 Toggle Button (Custom UI)", href: "/sessions/session-2-basic-operations#2-7" },
      { title: "2.8 Upload Image", href: "/sessions/session-2-basic-operations#2-8" },
      { title: "2.9 Download File / Image", href: "/sessions/session-2-basic-operations#2-9" },
      { title: "2.10 Scroll Into View", href: "/sessions/session-2-basic-operations#2-10" },
      { title: "2.11 Colossal Carousel", href: "/sessions/session-2-basic-operations#2-11" },
    ],
  },
  {
    href: "/sessions/session-3-api-basics",
    title: "Session 3 — API Basics",
    meta: "request, response, auth",
    comingSoon: true,
  },
  {
    href: "/sessions/session-4-pom",
    title: "Session 4 — Page Object Model",
    meta: "pages, fixtures, reuse",
    comingSoon: true,
  },
  {
    href: "/sessions/session-5-custom-ui",
    title: "Session 5 — Custom UI Elements",
    meta: "toggles, dropdowns, tricky DOM",
    comingSoon: true,
  },
];

const SESSION2_PATH = "/sessions/session-2-basic-operations";

function getHash() {
  if (typeof window === "undefined") return "";
  return window.location.hash || "";
}

export default function Sidebar() {
  const pathname = usePathname();
  const [hash, setHash] = useState<string>("");

  // Keep hash in sync so active child highlight updates on click / back / forward
  useEffect(() => {
    setHash(getHash());
    const onHashChange = () => setHash(getHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Auto-expand the active session section
  const [open, setOpen] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setOpen((prev) => {
      const next = { ...prev };
      for (const s of sessions) {
        const isActiveSession = pathname === s.href;
        if (isActiveSession) next[s.href] = true;
      }
      return next;
    });
  }, [pathname]);

  const activeSession = useMemo(() => sessions.find((s) => pathname === s.href), [pathname]);

  return (
    <aside className="card panelSticky noScrollBar" style={{ padding: 12, position: "sticky", top: 12 }}>
      <div style={{ fontWeight: 900, fontSize: 14 }}>🎭 Playwright Playground</div>
      <div className="small" style={{ opacity: 0.8, marginTop: 6 }}>
        Learn by interacting
      </div>

      <div style={{ height: 12 }} />

      <nav className="stack" style={{ gap: 10 }}>
        {sessions.map((s) => {
          const isActive = pathname === s.href;
          const isOpen = Boolean(open[s.href]);
          const hasChildren = Boolean(s.children?.length);

          return (
            <div key={s.href} className="card" style={{ padding: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <Link
                  href={s.href}
                  aria-disabled={s.comingSoon ? true : undefined}
                  onClick={(e) => {
                    if (s.comingSoon) e.preventDefault();
                    if (hasChildren) {
                      setOpen((prev) => ({ ...prev, [s.href]: true }));
                    }
                  }}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    fontWeight: 900,
                    color: s.comingSoon ? "rgba(15,23,42,0.35)" : isActive ? "#9a3412" : "#0f172a",
                  }}
                >
                  {s.title}
                </Link>

                {hasChildren ? (
                  <button
                    className="btn"
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontWeight: 800,
                      opacity: isActive ? 1 : 0.8,
                    }}
                    onClick={() => setOpen((prev) => ({ ...prev, [s.href]: !prev[s.href] }))}
                    aria-label={isOpen ? "Collapse" : "Expand"}
                    title={isOpen ? "Collapse" : "Expand"}
                    disabled={s.comingSoon}
                    type="button"
                  >
                    {isOpen ? "–" : "+"}
                  </button>
                ) : null}
              </div>

              <div className="small" style={{ opacity: 0.75, marginTop: 6 }}>
                {s.meta}{" "}
                {s.comingSoon ? (
                  <span style={{ marginLeft: 6, fontWeight: 800, color: "rgba(15,23,42,0.45)" }}>• Coming soon</span>
                ) : null}
              </div>

              {/* Children */}
              {hasChildren && isOpen && !s.comingSoon ? (
                <div className="stack" style={{ gap: 6, marginTop: 10 }}>
                  {s.children!.map((c) => {
                    const childHash = new URL(c.href, "http://x").hash; // "#2-1"
                    const isChildActive = isActive && hash === childHash;

                    // ✅ IMPORTANT:
                    // If user is already on session 2 page, use a normal <a href="#...">
                    // so the browser fires hashchange and your practice page updates.
                    const isSession2 = pathname === SESSION2_PATH;
                    if (isSession2) {
                      return (
                        <a
                          key={c.href}
                          href={childHash}
                          style={{
                            textDecoration: "none",
                            padding: "8px 10px",
                            borderRadius: 12,
                            fontWeight: 800,
                            fontSize: 13,
                            background: isChildActive ? "rgba(249,115,22,0.10)" : "transparent",
                            color: isChildActive ? "#9a3412" : "rgba(15,23,42,0.82)",
                            border: isChildActive ? "1px solid rgba(249,115,22,0.25)" : "1px solid transparent",
                            display: "block",
                          }}
                        >
                          {c.title}
                        </a>
                      );
                    }

                    // Otherwise, normal navigation to session 2 (or other routes)
                    return (
                      <Link
                        key={c.href}
                        href={c.href}
                        style={{
                          textDecoration: "none",
                          padding: "8px 10px",
                          borderRadius: 12,
                          fontWeight: 800,
                          fontSize: 13,
                          background: isChildActive ? "rgba(249,115,22,0.10)" : "transparent",
                          color: isChildActive ? "#9a3412" : "rgba(15,23,42,0.82)",
                          border: isChildActive ? "1px solid rgba(249,115,22,0.25)" : "1px solid transparent",
                          display: "block",
                        }}
                      >
                        {c.title}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      {/* Optional quick context */}
      {activeSession?.children?.length ? (
        <div className="card" style={{ padding: 10, marginTop: 12 }}>
          <div className="small" style={{ fontWeight: 900 }}>
            Tip
          </div>
          <div className="small" style={{ opacity: 0.8, marginTop: 6 }}>
            Use the subtopics to switch practices (hash-based) without leaving the page.
          </div>
        </div>
      ) : null}
    </aside>
  );
}
