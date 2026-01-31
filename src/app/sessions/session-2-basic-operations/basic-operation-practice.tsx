"use client";

import type { LocatorHint } from "@/components/types";
import { useEffect, useMemo, useState } from "react";
import {
  Practice21,
  Practice22,
  Practice23,
  Practice24,
  Practice25,
  Practice26,
  Practice27,
  PracticeUploadFile,
  PracticeDownloadFile,
  PracticeScrollIntoView,
  PracticeColossal,
} from "./practices";

type TopicKey =
  | "2-1"
  | "2-2"
  | "2-3"
  | "2-4"
  | "2-5"
  | "2-6"
  | "2-7"
  | "2-8"
  | "2-9"
  | "2-10"
  | "2-11";

function safeHash(): TopicKey {
  if (typeof window === "undefined") return "2-1";
  const raw = window.location.hash?.replace("#", "");
  const allowed: TopicKey[] = ["2-1", "2-2", "2-3", "2-4", "2-5", "2-6", "2-7", "2-8", "2-9", "2-10", "2-11"];
  return allowed.includes(raw as TopicKey) ? (raw as TopicKey) : "2-1";
}

export function BasicOperationsPractice({
  onHoverHint,
}: {
  onHoverHint: (h: LocatorHint | null) => void;
}) {
  const [active, setActive] = useState<TopicKey>("2-1");

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

  return (
    <section className="panel">
      <div className="panelHeader" onMouseEnter={() => onHoverHint(headerHint)} onMouseLeave={() => onHoverHint(null)}>
        <h1 className="h1">Session 2 — Basic Operations</h1>
        <p className="small">Practice each interaction and always finish with an assertion.</p>
      </div>

      <div className="panelBody stack">
        {active === "2-1" && <Practice21 onHoverHint={onHoverHint} />}
        {active === "2-2" && <Practice22 onHoverHint={onHoverHint} />}
        {active === "2-3" && <Practice23 />}
        {active === "2-4" && <Practice24 />}
        {active === "2-5" && <Practice25 />}
        {active === "2-6" && <Practice26 />}
        {active === "2-7" && <Practice27 />}
        {active === "2-8" && <PracticeUploadFile />}
        {active === "2-9" && <PracticeDownloadFile />}
        {active === "2-10" && <PracticeScrollIntoView />}
        {active === "2-11" && <PracticeColossal />}
      </div>
    </section>
  );
}
