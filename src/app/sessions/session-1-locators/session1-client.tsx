"use client";

import { LocatorPlayground } from "@/app/sessions/session-1-locators/LocatorPlayground";
import { InspectorPanel } from "@/components/layout/InspectorPanel";
import Sidebar from "@/components/layout/Sidebar";
import { LocatorHint } from "@/components/types";
import { useState } from "react";

export function Session1LocatorFindingPage() {
  const [hint, setHint] = useState<LocatorHint | null>(null);

  return (
    <main className="container">
      {/* <HeroHeader /> */}
      <Sidebar />
      <LocatorPlayground onHoverHint={setHint} />
      <InspectorPanel hint={hint} />
    </main>
  );
}
