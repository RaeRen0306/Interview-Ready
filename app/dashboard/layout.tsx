import { Suspense } from "react";
import Link from "next/link";
import Sidebar, { SidebarFallback } from "@/components/Sidebar";
import HelpPanel from "@/components/HelpPanel";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 shrink-0 bg-slate-900 p-5 print:hidden">
        <Link href="/" className="mb-8 block text-xl font-bold text-white">
          Interview <span className="text-teal-400">Ready</span>
        </Link>
        <Suspense fallback={<SidebarFallback />}>
          <Sidebar />
        </Suspense>
      </aside>

      <main className="flex-1 p-6 pb-24 sm:p-10 sm:pb-24">{children}</main>

      <Suspense fallback={null}>
        <HelpPanel />
      </Suspense>
    </div>
  );
}
