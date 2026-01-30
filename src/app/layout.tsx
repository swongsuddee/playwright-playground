import "./globals.css";
import { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
