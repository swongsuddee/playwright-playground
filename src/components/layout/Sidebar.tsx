"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { session2Nav } from "@/app/sessions/session-2-basic-operations/practices/registry";
import { A1_BASE, LESSONS } from "@/app/foundations/a1-code-blocks/scratchData";
import { A2_BASE, A2_LESSONS } from "@/app/foundations/a2-flow-diagrams/a2Data";

type Child = { href: string; title: string };

type Track = "A" | "B";

type Session = {
  href: string;
  title: string;
  meta: string;
  track: Track;
  comingSoon?: boolean;
  children?: Child[];
};

const TRACK_LABELS: Record<Track, string> = {
  A: "Track A — Foundations",
  B: "Track B — Web Testing",
};

const SESSION2_PATH = "/sessions/session-2-basic-operations";

const sessions: Session[] = [
  {
    href: "/foundations/a3-decomposition",
    title: "A1 — Problem Decomposition",
    meta: "real case → steps → flow",
    track: "A",
  },
  {
    href: "/foundations/a2-flow-diagrams",
    title: "A2 — Flow Diagrams",
    meta: "read & build flowcharts",
    track: "A",
    children: A2_LESSONS.map((l) => ({ title: `${l.n}. ${l.title}`, href: `${A2_BASE}/${l.slug}` })),
  },
  {
    href: "/foundations/a1-code-blocks",
    title: "A3 — Code Blocks (Scratch)",
    meta: "sequence, loops, conditionals",
    track: "A",
    children: LESSONS.map((l) => ({ title: `${l.n}. ${l.title}`, href: `${A1_BASE}/${l.slug}` })),
  },
  {
    href: "/foundations/a4-languages",
    title: "A4 — Programming Languages",
    meta: "Python · TypeScript · Java",
    track: "A",
  },
  {
    href: "/sessions/session-1-locators",
    title: "Session 1 — Locator Finding",
    meta: "Practice: Seat Booking",
    track: "B",
  },
  {
    href: SESSION2_PATH,
    title: "Session 2 — Basic Operations",
    meta: "click, fill, expect",
    track: "B",
    children: session2Nav.map((p) => ({ title: p.title, href: `${SESSION2_PATH}#${p.key}` })),
  },
  {
    href: "/sessions/session-3-api-basics",
    title: "Session 3 — API Basics",
    meta: "request, response, auth",
    track: "B",
    comingSoon: true,
  },
  {
    href: "/sessions/session-4-pom",
    title: "Session 4 — Page Object Model",
    meta: "pages, fixtures, reuse",
    track: "B",
    comingSoon: true,
  },
  {
    href: "/sessions/session-5-custom-ui",
    title: "Session 5 — Custom UI Elements",
    meta: "toggles, dropdowns, tricky DOM",
    track: "B",
    comingSoon: true,
  },
];

function getHash() {
  if (typeof window === "undefined") return "";
  return window.location.hash || "";
}

export default function Sidebar() {
  const pathname = usePathname();
  const [hash, setHash] = useState<string>("");
  const [navOpen, setNavOpen] = useState(false); // mobile nav collapse
  const [open, setOpen] = useState<Record<string, boolean>>({}); // per-session children expand

  // Keep hash in sync so active child highlight updates on click / back / forward.
  useEffect(() => {
    setHash(getHash());
    const onHashChange = () => setHash(getHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Auto-expand the active session's children; collapse the mobile menu on navigation.
  useEffect(() => {
    setOpen((prev) => {
      const next = { ...prev };
      for (const s of sessions) if (pathname === s.href || pathname.startsWith(s.href + "/")) next[s.href] = true;
      return next;
    });
    setNavOpen(false);
  }, [pathname]);

  return (
    <aside className="sidebar noScrollBar">
      <div className="sidebarHead">
        <div>
          <Link href="/" className="sidebarBrand" style={{ display: "block" }} title="Home" onClick={() => setNavOpen(false)}>
            🎭 Playwright Playground
          </Link>
          <div className="small" style={{ marginTop: 2 }}>Learn by interacting</div>
        </div>
        <button
          type="button"
          className="sidebarToggle"
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          {navOpen ? "✕" : "☰"}
        </button>
      </div>

      <nav className="sidebarNav" data-open={navOpen}>
        <div className="navItem" data-active={pathname === "/"}>
          <Link href="/" className="navTitle" onClick={() => setNavOpen(false)}>
            🏠 Home
          </Link>
          <div className="navMeta">Landing page &amp; overview</div>
        </div>

        {sessions.map((s, i) => {
          const isActive = pathname === s.href || pathname.startsWith(s.href + "/");
          const isOpen = Boolean(open[s.href]);
          const hasChildren = Boolean(s.children?.length);
          const showTrackHeader = i === 0 || sessions[i - 1].track !== s.track;
          const isSession2 = pathname === SESSION2_PATH;

          return (
            <Fragment key={s.href}>
              {showTrackHeader ? <div className="navGroupLabel">{TRACK_LABELS[s.track]}</div> : null}

              <div className="navItem" data-active={isActive}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <Link
                    href={s.href}
                    className="navTitle"
                    data-disabled={s.comingSoon ? true : undefined}
                    aria-disabled={s.comingSoon ? true : undefined}
                    onClick={(e) => {
                      if (s.comingSoon) {
                        e.preventDefault();
                        return;
                      }
                      if (hasChildren) setOpen((prev) => ({ ...prev, [s.href]: true }));
                      setNavOpen(false);
                    }}
                  >
                    {s.title}
                  </Link>

                  {hasChildren ? (
                    <button
                      type="button"
                      className="iconBtn"
                      onClick={() => setOpen((prev) => ({ ...prev, [s.href]: !prev[s.href] }))}
                      aria-label={isOpen ? "Collapse" : "Expand"}
                      title={isOpen ? "Collapse" : "Expand"}
                      disabled={s.comingSoon}
                    >
                      {isOpen ? "−" : "+"}
                    </button>
                  ) : null}
                </div>

                <div className="navMeta">
                  {s.meta}
                  {s.comingSoon ? " · Coming soon" : ""}
                </div>

                {hasChildren && isOpen && !s.comingSoon ? (
                  <div className="stack" style={{ gap: 6, marginTop: 10 }}>
                    {s.children!.map((c) => {
                      const isHashChild = c.href.includes("#");
                      const childHash = isHashChild ? "#" + c.href.split("#")[1] : "";
                      const isChildActive = isHashChild
                        ? pathname === s.href && hash === childHash
                        : pathname === c.href;

                      // On the Session 2 page use a real <a href="#..."> so the browser fires
                      // hashchange and the practice view updates without a full navigation.
                      if (isHashChild && isSession2) {
                        return (
                          <a
                            key={c.href}
                            href={childHash}
                            className="navChild"
                            data-active={isChildActive}
                            onClick={() => setNavOpen(false)}
                          >
                            {c.title}
                          </a>
                        );
                      }
                      return (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="navChild"
                          data-active={isChildActive}
                          onClick={() => setNavOpen(false)}
                        >
                          {c.title}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </Fragment>
          );
        })}
      </nav>
    </aside>
  );
}
