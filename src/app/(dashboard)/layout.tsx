import type { ReactNode } from "react";
import Header from "@/components/layout/public/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
    </div>
  );
}
