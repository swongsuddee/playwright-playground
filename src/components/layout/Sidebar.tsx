// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
    ],
  },
  { href: "#", title: "Session 3 — API", meta: "request, auth, assertions", comingSoon: true },
  { href: "#", title: "Session 4 — POM", meta: "page objects, fixtures", comingSoon: true },
];

function isActiveSession(activeHref: string, sessionHref: string) {
  const clean = (activeHref || "").split("#")[0];
  if (sessionHref === "#") return false;
  return clean === sessionHref || clean.startsWith(sessionHref + "/");
}

function getHash(href: string): string {
  const i = href.indexOf("#");
  return i >= 0 ? href.slice(i) : "";
}

export function Sidebar({ activeHref }: { activeHref: string }) {
  const session2IsActive = isActiveSession(activeHref, "/sessions/session-2-basic-operations");

  // Accordion expansion state (default expand when user is on Session 2)
  const [openSessionHref, setOpenSessionHref] = useState<string | null>(null);

  // Track hash so we can highlight active child (2.1–2.9)
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    const update = () => setActiveHash(window.location.hash || "");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  useEffect(() => {
    // Auto-expand Session 2 when visiting Session 2
    if (session2IsActive) setOpenSessionHref("/sessions/session-2-basic-operations");
  }, [session2IsActive]);

  return (
    <aside className="panel panelSticky noScrollBar" style={{  overflowY: "auto" }}>
      <div className="panelHeader">
        <h2 className="h1">Sessions</h2>
        <p className="small">Left menu for quick navigation</p>
      </div>

      <div className="panelBody stack">
        <div className="stack">
          {sessions.map((s) => {
            const active = isActiveSession(activeHref, s.href);
            const isRealLink = s.href !== "#";
            const hasChildren = !!s.children?.length;

            const expanded = openSessionHref === s.href;

            return (
              <div key={s.title} className="stack" style={{ gap: 10 }}>
                {/* Main card */}
                <div
                  className="card"
                  style={{
                    borderColor: active ? "rgba(110,231,255,0.35)" : undefined,
                    boxShadow: active ? "0 0 0 3px rgba(110,231,255,0.08)" : undefined,
                    opacity: isRealLink ? 1 : 0.6,
                    cursor: isRealLink ? "pointer" : "not-allowed",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Title area link */}
                    <Link
                      href={s.href}
                      onClick={(e) => {
                        if (!isRealLink) e.preventDefault();
                      }}
                      style={{ flex: 1, textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          marginBottom: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span>{s.title}</span>
                        {s.comingSoon && (
                          <span
                            className="small"
                            style={{
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: "rgba(148,163,184,0.15)",
                              border: "1px solid rgba(148,163,184,0.25)",
                            }}
                          >
                            Soon
                          </span>
                        )}
                      </div>
                      <div className="small">{s.meta}</div>
                    </Link>

                    {/* Expand/collapse button (only if has children) */}
                    {hasChildren && (
                      <button
                        type="button"
                        aria-label={expanded ? "Collapse" : "Expand"}
                        onClick={() => setOpenSessionHref(expanded ? null : s.href)}
                        className="small"
                        style={{
                          borderRadius: 10,
                          padding: "8px 10px",
                          border: "1px solid rgba(148,163,184,0.25)",
                          background: "rgba(2,6,23,0.02)",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        {expanded ? "−" : "+"}
                      </button>
                    )}
                  </div>

                  {/* Expanded children */}
                  {hasChildren && expanded && (
                    <div style={{ marginTop: 12 }}>
                      <div className="hr" style={{ margin: "10px 0" }} />

                      <div className="stack" style={{ gap: 8 }}>
                        {s.children!.map((c) => {
                          const childHash = getHash(c.href);
                          const childActive = !!childHash && childHash === activeHash;

                          return (
                            <a
                              key={c.href}
                              href={c.href}
                              className="card"
                              style={{
                                padding: "10px 12px",
                                display: "block",
                                textDecoration: "none",
                                color: "inherit",
                                background: childActive ? "rgba(249,115,22,0.10)" : "rgba(2,6,23,0.02)",
                                borderColor: childActive ? "rgba(249,115,22,0.35)" : "rgba(148,163,184,0.22)",
                                boxShadow: childActive ? "0 0 0 3px rgba(249,115,22,0.08)" : undefined,
                              }}
                            >
                              <div style={{ fontWeight: 600 }}>{c.title}</div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hr" />
      </div>
    </aside>
  );
}
