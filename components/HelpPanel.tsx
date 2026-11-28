"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HELP_TOPICS, topicForPath } from "@/lib/help";
import HelpTopicView from "./HelpTopicView";

// A Help button that opens a panel beside the page.
// It doesn't leave the page, so an interview in progress is not lost.
export default function HelpPanel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);

  // The topic for this page, unless the user picked another one.
  const topicId = chosen ?? topicForPath(pathname);
  const topic = HELP_TOPICS.find((t) => t.id === topicId) ?? HELP_TOPICS[0];

  // Close with the Escape key.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function openPanel() {
    setChosen(null); // start on the help for this page
    setOpen(true);
  }

  return (
    <div className="print:hidden">
      {!open && (
        <button
          type="button"
          onClick={openPanel}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-medium text-white shadow-lg hover:bg-slate-700"
          aria-label="Open help"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-400 text-sm font-bold text-slate-900">
            ?
          </span>
          Help
        </button>
      )}

      {open && (
        <>
          {/* Dim the page a little; clicking it closes the panel. */}
          <div className="fixed inset-0 z-40 bg-slate-900/20" onClick={() => setOpen(false)} />

          <aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            role="dialog"
            aria-label="Help"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="text-lg font-semibold text-slate-900">Help</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close ✕
              </button>
            </div>

            <div className="border-b border-slate-200 px-5 py-3">
              <label htmlFor="helpTopic" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Topic
              </label>
              <select
                id="helpTopic"
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900"
                value={topic.id}
                onChange={(e) => setChosen(e.target.value)}
              >
                {HELP_TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <HelpTopicView topic={topic} />
            </div>

            <div className="border-t border-slate-200 px-5 py-3 text-sm text-slate-600">
              Your place on the page is kept while Help is open.{" "}
              {!pathname.startsWith("/dashboard/interview/") && (
                <Link href="/dashboard/help" className="font-medium text-blue-600 hover:underline" onClick={() => setOpen(false)}>
                  Read the full guide
                </Link>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
