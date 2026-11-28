"use client";

import { useState } from "react";
import { SCORE_LABELS, type Feedback } from "@/lib/feedback";

export interface FeedbackState {
  status: "loading" | "done" | "error";
  feedback?: Feedback;
  error?: string;
}

interface Props {
  state?: FeedbackState;
  onRequest: () => void;
  onSaveImproved: (text: string) => void;
}

function scoreColor(score: number) {
  if (score >= 4) return "bg-teal-100 text-teal-800";
  if (score === 3) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

export default function FeedbackPanel({ state, onRequest, onSaveImproved }: Props) {
  const [saved, setSaved] = useState(false);

  if (!state) {
    return (
      <button
        type="button"
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 print:hidden"
        onClick={onRequest}
      >
        Get AI Feedback
      </button>
    );
  }

  if (state.status === "loading") {
    return (
      <p className="flex items-center gap-2 text-sm text-indigo-700 print:hidden">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-700" />
        Reviewing your answer... this takes a few seconds.
      </p>
    );
  }

  if (state.status === "error" || !state.feedback) {
    return (
      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 print:hidden">
        <p className="mb-2">{state.error ?? "Something went wrong."}</p>
        <button
          type="button"
          className="rounded-lg border border-red-300 bg-white px-3 py-1.5 font-medium text-red-700 hover:bg-red-50"
          onClick={onRequest}
        >
          Try Again
        </button>
      </div>
    );
  }

  const f = state.feedback;
  return (
    <div className="mt-1 rounded-lg border border-indigo-200 bg-indigo-50/50 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${scoreColor(f.score)}`}>
          {f.score} / 5 · {SCORE_LABELS[f.score]}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">AI Coach</span>
      </div>

      {f.summary && <p className="mb-3 text-slate-800">{f.summary}</p>}

      {f.strengths.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-sm font-semibold text-teal-800">What worked</p>
          <ul className="space-y-1 text-sm text-slate-800">
            {f.strengths.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-teal-600">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {f.improvements.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-sm font-semibold text-amber-800">To make it stronger</p>
          <ul className="space-y-1 text-sm text-slate-800">
            {f.improvements.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-amber-600">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {f.improvedAnswer && (
        <div>
          <p className="mb-1 text-sm font-semibold text-indigo-800">A stronger version</p>
          <p className="whitespace-pre-wrap rounded-lg bg-white p-3 text-sm text-slate-800">{f.improvedAnswer}</p>
          {f.improvedAnswer.includes("[") && (
            <p className="mt-1 text-xs text-slate-500">
              Fill in the parts in [brackets] with your own details. You can edit it in the Answer Library after saving.
            </p>
          )}
          <div className="mt-2 print:hidden">
            {saved ? (
              <span className="inline-block rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700">
                ✓ Saved to library
              </span>
            ) : (
              <button
                type="button"
                className="rounded-lg border border-indigo-600 bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                onClick={() => {
                  onSaveImproved(f.improvedAnswer);
                  setSaved(true);
                }}
              >
                Save Stronger Version to Library
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
