"use client";

import { InspectorPanel } from "@/components/layout/InspectorPanel";
import Sidebar from "@/components/layout/Sidebar";
import { LocatorHint } from "@/components/types";
import { useState } from "react";
import { BasicOperationsPractice } from "./basic-operation-practice";

export function Session2BasicOperationsPage() {
  const [hint, setHint] = useState<LocatorHint | null>(null);

  return (
    <main className="container">
      {/* <HeroHeader /> */}
      <Sidebar />
      <BasicOperationsPractice onHoverHint={setHint} />
      <InspectorPanel hint={hint} />
    </main>
  );
}
