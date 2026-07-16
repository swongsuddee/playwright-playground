"use client";

import type { LocatorHint } from "@/components/types";
import { useEffect, useMemo, useState } from "react";
import {
  defaultSession2Key,
  getSession2Practice,
  session2Keys,
} from "./practices/registry";

function safeHash(): string {
  if (typeof window === "undefined") return defaultSession2Key;
  const raw = window.location.hash?.replace("#", "");
  return session2Keys.includes(raw) ? raw : defaultSession2Key;
}

export function BasicOperationsPractice({
  onHoverHint,
}: {
  onHoverHint: (h: LocatorHint | null) => void;
}) {
  const [active, setActive] = useState<string>(defaultSession2Key);

  useEffect(() => {
    setActive(safeHash());
    const onHashChange = () => setActive(safeHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const headerHint = useMemo<LocatorHint>(
    () => ({
      title: "Session 2 — Basic Operations",
      description: "Use the left sidebar to switch topics. Each practice teaches Action → Assertion.",
      actions: ["Use stable locators", "Assert final UI state"],
      selectors: ["getByRole()", "getByLabel()", "getByTestId()"],
      docsUrl: "https://playwright.dev/docs/test-assertions",
      target: "session-2-header",
      id: "",
      purpose: "",
    }),
    []
  );

  const activePractice = getSession2Practice(active);

  return (
    <section className="panel">
      <div className="panelHeader" onMouseEnter={() => onHoverHint(headerHint)} onMouseLeave={() => onHoverHint(null)}>
        <h1 className="h1">Session 2 — Basic Operations</h1>
        <p className="small">Practice each interaction and always finish with an assertion.</p>
      </div>

      <div className="panelBody stack">{activePractice.render({ onHoverHint })}</div>
    </section>
  );
}
