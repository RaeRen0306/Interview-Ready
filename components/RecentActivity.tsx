"use client";

import Link from "next/link";
import { useHistory } from "./useHistory";

export default function RecentActivity() {
  const history = useHistory();
  if (history === null) return null;

  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
        No practice sessions yet. Your finished interviews will show up here.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent practice</h2>
        <Link href="/dashboard/progress" className="text-sm text-blue-600 hover:underline">
          See all
        </Link>
      </div>
      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {history.slice(0, 3).map((s) => (
          <li key={s.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-slate-900">{s.title}</p>
              <p className="text-sm text-slate-500">
                {[s.jobTitle, s.company, s.level].filter(Boolean).join(" · ")}
              </p>
            </div>
            <p className="text-sm text-slate-600">
              {s.answered}/{s.total} answered
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
