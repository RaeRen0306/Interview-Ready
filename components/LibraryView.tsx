"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteAnswer, updateAnswer, type SavedAnswer } from "@/lib/library";
import { useLibrary } from "./useLibrary";

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function AnswerCard({ item }: { item: SavedAnswer }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.answer);

  return (
    <li className="break-inside-avoid rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-3 font-medium text-slate-900">{item.question}</p>

      {editing ? (
        <>
          <textarea
            rows={8}
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Edit answer"
          />
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={!draft.trim()}
              onClick={() => {
                updateAnswer(item.id, draft.trim());
                setEditing(false);
              }}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setDraft(item.answer);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-slate-700">{item.answer}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-slate-500">
          {item.jobTitle ? `${item.jobTitle} · ` : ""}Updated {formatDate(item.updatedAt)}
        </span>
        {!editing && (
          <div className="flex gap-3 print:hidden">
            <button
              type="button"
              className="rounded-lg border border-blue-600 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
              onClick={() => {
                setDraft(item.answer);
                setEditing(true);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              onClick={() => {
                if (window.confirm("Delete this saved answer? This can't be undone.")) deleteAnswer(item.id);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

export default function LibraryView() {
  const library = useLibrary();
  const [search, setSearch] = useState("");

  const term = search.trim().toLowerCase();
  const filtered = (library ?? []).filter(
    (s) =>
      !term ||
      s.question.toLowerCase().includes(term) ||
      s.answer.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term) ||
      s.jobTitle.toLowerCase().includes(term),
  );

  // Group by category, categories in alphabetical order.
  const groups = new Map<string, SavedAnswer[]>();
  for (const item of filtered) {
    const list = groups.get(item.category) ?? [];
    list.push(item);
    groups.set(item.category, list);
  }
  const categories = [...groups.keys()].sort((a, b) => a.localeCompare(b));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Answer Library</h1>
          <p className="text-slate-600">
            Your best answers, saved so you can review and improve them before an interview.
          </p>
        </div>
        {library && library.length > 0 && (
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 print:hidden"
            onClick={() => window.print()}
          >
            Print / Save PDF
          </button>
        )}
      </div>

      {library === null ? null : library.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          <p className="mb-2 font-medium text-slate-800">No saved answers yet.</p>
          <p className="mb-6">
            Finish a practice interview, then click <span className="font-medium">Save to library</span> under any
            answer you want to keep.
          </p>
          <Link
            href="/dashboard/interview"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Start an interview
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-4 print:hidden">
            <input
              type="search"
              placeholder="Search your answers..."
              className="flex-1 rounded-lg border border-slate-300 bg-white p-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search saved answers"
            />
            <span className="text-sm text-slate-500">
              {filtered.length} of {library.length} saved
            </span>
          </div>

          {filtered.length === 0 && <p className="text-slate-600">No saved answers match your search.</p>}

          <div className="space-y-8">
            {categories.map((category) => (
              <section key={category}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
                  {category} ({groups.get(category)!.length})
                </h2>
                <ul className="space-y-4">
                  {groups.get(category)!.map((item) => (
                    <AnswerCard key={item.id} item={item} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
