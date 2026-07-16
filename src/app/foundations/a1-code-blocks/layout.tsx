import Sidebar from "@/components/layout/Sidebar";
import type { ReactNode } from "react";
import { A1Rail } from "./A1Rail";

export default function A1Layout({ children }: { children: ReactNode }) {
  return (
    <main className="container">
      <Sidebar />
      {children}
      <A1Rail />
    </main>
  );
}
