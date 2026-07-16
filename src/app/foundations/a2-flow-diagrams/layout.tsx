import Sidebar from "@/components/layout/Sidebar";
import type { ReactNode } from "react";
import { A2Rail } from "./A2Rail";

export default function A2Layout({ children }: { children: ReactNode }) {
  return (
    <main className="container">
      <Sidebar />
      {children}
      <A2Rail />
    </main>
  );
}
