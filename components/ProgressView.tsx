"use client";

import Link from "next/link";
import { clearHistory } from "@/lib/history";
import { useHistory } from "./useHistory";

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function ProgressView() {
  const history = useHistory();

  const sessions = history?.length ?? 0;
  const answered = history?.reduce((sum, s) => sum + s.answered, 0) ?? 0;
  const total = history?.reduce((sum, s) => sum + s.total, 0) ?? 0;
  const rate = total ? Math.round((answered / total) * 100) : 0;

  const stats = [
    { label: "Interviews completed", value: sessions },
    { label: "Questions answered", value: answered },
    { label: "Answer rate", value: `${rate}%` },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Progress</h1>
      <p className="mb-8 text-slate-600">Your practice history is saved in this browser.</p>

      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{history === null ? "–" : s.value}</p>
          </div>
        ))}
      </div>

      {history !== null && history.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          <p className="mb-4">No practice sessions yet.</p>
          <Link
            href="/dashboard/interview"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Start your first interview
          </Link>
        </div>
      )}

      {history !== null && history.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Interview</th>
                  <th className="p-3 font-medium">Job</th>
                  <th className="p-3 font-medium">Level</th>
                  <th className="p-3 font-medium">Answered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {history.map((s) => (
                  <tr key={s.id}>
                    <td className="p-3 text-slate-600">{formatDate(s.date)}</td>
                    <td className="p-3 font-medium text-slate-900">{s.title}</td>
                    <td className="p-3 text-slate-600">
                      {[s.jobTitle, s.company].filter(Boolean).join(" at ") || "—"}
                    </td>
                    <td className="p-3 text-slate-600">{s.level}</td>
                    <td className="p-3 text-slate-600">
                      {s.answered}/{s.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className="mt-6 text-sm text-red-600 hover:underline"
            onClick={() => {
              if (window.confirm("Clear all practice history? This can't be undone.")) clearHistory();
            }}
          >
            Clear history
          </button>
        </>
      )}
    </div>
  );
}
