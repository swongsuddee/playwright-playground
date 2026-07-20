"use client";

import { ReactNode } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="appRoot">
      {/* Top bar */}
      <header className="topBar">{/* HeroHeader already rendered in pages, keep this empty or remove HeroHeader from pages */}
        {/* If you are already rendering <HeroHeader/> in each page, delete this header entirely. */}
      </header>

      {/* Main grid */}
      <div className="appGrid">{children}</div>

      {/* Reveal-on-scroll for [data-reveal] elements (respects reduced motion) */}
      <ScrollReveal />
    </div>
  );
}
