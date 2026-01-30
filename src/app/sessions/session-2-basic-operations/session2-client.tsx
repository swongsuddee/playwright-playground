"use client";

import { InspectorPanel } from "@/components/layout/InspectorPanel";
import { HeroHeader } from "@/components/layout/HeroHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { LocatorHint } from "@/components/types";
import { useState } from "react";
import { BasicOperationsPractice } from "./basicOperationsPractice";

export function Session2BasicOperationsPage() {
  const [hint, setHint] = useState<LocatorHint | null>(null);

  return (
    <main className="container">
      {/* <HeroHeader /> */}
      <Sidebar activeHref="/sessions/session-2-basic-operations" />
      <BasicOperationsPractice onHoverHint={setHint} />
      <InspectorPanel hint={hint} />
    </main>
  );
}
