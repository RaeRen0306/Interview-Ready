"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/interview", label: "Start Interview" },
  { href: "/dashboard/library", label: "Answer Library" },
  { href: "/dashboard/playbook", label: "Interview Playbook" },
  { href: "/dashboard/interview-day", label: "Interview Day" },
  { href: "/dashboard/resume", label: "Resume Center" },
  { href: "/dashboard/progress", label: "Progress" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active =
          link.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "rounded-lg bg-teal-500/15 px-3 py-2 font-medium text-teal-300"
                : "rounded-lg px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

// Shown for a split second while the page loads.
export function SidebarFallback() {
  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-slate-300">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
