"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  clearPlaybook,
  getPlaybookRaw,
  parsePlaybook,
  savePlaybook,
  subscribePlaybook,
  SUGGESTED_QUESTIONS,
  type Playbook,
} from "@/lib/playbook";
import type { SavedAnswer } from "@/lib/library";
import { useLibrary } from "./useLibrary";

const input =
  "w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200";
const card = "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";
const smallBtn =
  "rounded-lg border border-blue-600 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50";

function findAnswer(library: SavedAnswer[], pattern: RegExp) {
  return library.find((s) => pattern.test(s.question));
}

export default function PlaybookView() {
  const raw = useSyncExternalStore(subscribePlaybook, getPlaybookRaw, () => null);
  const playbook = useMemo(() => (raw === null ? null : parsePlaybook(raw)), [raw]);
  const library = useLibrary();
  const [newQuestion, setNewQuestion] = useState("");

  if (playbook === null || library === null) return null;
  const pb: Playbook = playbook;
  const lib: SavedAnswer[] = library;

  function update(changes: Partial<Playbook>) {
    savePlaybook({ ...pb, ...changes });
  }

  const introAnswer = findAnswer(lib, /tell me about yourself|walk me through your resume/i);
  const whyAnswer = findAnswer(lib, /why (are you interested|do you want to work)/i);
  const selected = lib.filter((s) => pb.answerIds.includes(s.id));
  // On the printed sheet, skip answers already shown as the introduction or "why this job".
  const shownAbove = [pb.introduction.trim(), pb.whyThisJob.trim()].filter(Boolean);
  const printedAnswers = selected.filter((s) => !shownAbove.includes(s.answer.trim()));

  function toggleAnswer(id: string) {
    update({
      answerIds: pb.answerIds.includes(id) ? pb.answerIds.filter((x) => x !== id) : [...pb.answerIds, id],
    });
  }

  function addQuestion(q: string) {
    const text = q.trim();
    if (!text || pb.questionsToAsk.some((x) => x.toLowerCase() === text.toLowerCase())) return;
    update({ questionsToAsk: [...pb.questionsToAsk, text] });
  }

  const heading = [pb.jobTitle, pb.company].filter(Boolean).join(" at ");

  return (
    <div className="mx-auto max-w-3xl">
      {/* ---------- Edit view (hidden when printing) ---------- */}
      <div className="print:hidden">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-slate-900">Interview Playbook</h1>
            <p className="text-slate-600">
              Your one-page cheat sheet for an upcoming interview. Fill in what you can, then print it or save it as a PDF.
              Everything saves as you type.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              onClick={() => window.print()}
            >
              Print / Save PDF
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Interview details */}
          <section className={card}>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">1. The interview</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pbJob" className="mb-1 block text-sm font-medium text-slate-700">Job title</label>
                <input id="pbJob" className={input} value={pb.jobTitle} onChange={(e) => update({ jobTitle: e.target.value })} placeholder="Hearing Examiner" />
              </div>
              <div>
                <label htmlFor="pbCompany" className="mb-1 block text-sm font-medium text-slate-700">Company</label>
                <input id="pbCompany" className={input} value={pb.company} onChange={(e) => update({ company: e.target.value })} placeholder="WV Division of Highways" />
              </div>
              <div>
                <label htmlFor="pbWhen" className="mb-1 block text-sm font-medium text-slate-700">Date and time</label>
                <input id="pbWhen" className={input} value={pb.when} onChange={(e) => update({ when: e.target.value })} placeholder="Tuesday, Dec 2 at 10:00 AM" />
              </div>
              <div>
                <label htmlFor="pbWhere" className="mb-1 block text-sm font-medium text-slate-700">Location or video link</label>
                <input id="pbWhere" className={input} value={pb.location} onChange={(e) => update({ location: e.target.value })} placeholder="Building 5, Room 200" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="pbWho" className="mb-1 block text-sm font-medium text-slate-700">Interviewer name(s)</label>
                <input id="pbWho" className={input} value={pb.interviewer} onChange={(e) => update({ interviewer: e.target.value })} placeholder="Jane Smith, HR Manager" />
              </div>
            </div>
          </section>

          {/* Company notes */}
          <section className={card}>
            <h2 className="mb-1 text-lg font-semibold text-slate-900">2. About the company</h2>
            <p className="mb-3 text-sm text-slate-600">What they do, recent news, their mission, and anything you want to mention.</p>
            <textarea rows={5} className={input} value={pb.companyNotes} onChange={(e) => update({ companyNotes: e.target.value })} aria-label="Company notes" />
          </section>

          {/* Introduction and why */}
          <section className={card}>
            <h2 className="mb-1 text-lg font-semibold text-slate-900">3. Your introduction</h2>
            <p className="mb-3 text-sm text-slate-600">Your answer to &quot;Tell me about yourself.&quot; Keep it to about 90 seconds.</p>
            {introAnswer && introAnswer.answer !== pb.introduction && (
              <button type="button" className={`${smallBtn} mb-3`} onClick={() => update({ introduction: introAnswer.answer })}>
                Use my saved answer
              </button>
            )}
            <textarea rows={5} className={input} value={pb.introduction} onChange={(e) => update({ introduction: e.target.value })} aria-label="Introduction" />

            <h3 className="mb-1 mt-6 font-semibold text-slate-900">Why you want this job</h3>
            {whyAnswer && whyAnswer.answer !== pb.whyThisJob && (
              <button type="button" className={`${smallBtn} mb-3`} onClick={() => update({ whyThisJob: whyAnswer.answer })}>
                Use my saved answer
              </button>
            )}
            <textarea rows={3} className={input} value={pb.whyThisJob} onChange={(e) => update({ whyThisJob: e.target.value })} aria-label="Why you want this job" />
          </section>

          {/* Best answers */}
          <section className={card}>
            <h2 className="mb-1 text-lg font-semibold text-slate-900">4. Your best answers</h2>
            <p className="mb-4 text-sm text-slate-600">Check the saved answers you want on your cheat sheet.</p>
            {lib.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                Your Answer Library is empty. Practice an interview and save some answers, and they&apos;ll appear here.{" "}
                <Link href="/dashboard/interview" className="font-medium text-blue-600 hover:underline">Start an interview</Link>
              </p>
            ) : (
              <>
                <div className="mb-3 flex gap-3 text-sm">
                  <button type="button" className={smallBtn} onClick={() => update({ answerIds: lib.map((s) => s.id) })}>Select all</button>
                  <button type="button" className={smallBtn} onClick={() => update({ answerIds: [] })}>Clear</button>
                  <span className="self-center text-slate-500">{selected.length} of {lib.length} selected</span>
                </div>
                <ul className="space-y-2">
                  {lib.map((s) => (
                    <li key={s.id}>
                      <label className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                        <input type="checkbox" className="mt-1 h-4 w-4" checked={pb.answerIds.includes(s.id)} onChange={() => toggleAnswer(s.id)} />
                        <span>
                          <span className="block text-xs font-semibold uppercase tracking-wide text-blue-600">{s.category}</span>
                          <span className="block font-medium text-slate-900">{s.question}</span>
                          <span className="line-clamp-2 block text-sm text-slate-600">{s.answer}</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          {/* Questions to ask */}
          <section className={card}>
            <h2 className="mb-1 text-lg font-semibold text-slate-900">5. Questions to ask them</h2>
            <p className="mb-4 text-sm text-slate-600">Interviewers expect you to ask 2 or 3. Click a suggestion to add it, or write your own.</p>

            {pb.questionsToAsk.length > 0 && (
              <ol className="mb-4 space-y-2">
                {pb.questionsToAsk.map((q, i) => (
                  <li key={q} className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-3">
                    <span className="text-slate-800">{i + 1}. {q}</span>
                    <button
                      type="button"
                      className="shrink-0 rounded-lg border border-red-300 bg-white px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                      onClick={() => update({ questionsToAsk: pb.questionsToAsk.filter((x) => x !== q) })}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ol>
            )}

            <div className="mb-4 flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.filter((q) => !pb.questionsToAsk.includes(q)).map((q) => (
                <button
                  key={q}
                  type="button"
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-left text-sm text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                  onClick={() => addQuestion(q)}
                >
                  + {q}
                </button>
              ))}
            </div>

            <form
              className="flex gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                addQuestion(newQuestion);
                setNewQuestion("");
              }}
            >
              <input className={input} value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Write your own question..." aria-label="Your own question" />
              <button type="submit" className="shrink-0 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50" disabled={!newQuestion.trim()}>
                Add
              </button>
            </form>
          </section>

          {/* Reminders */}
          <section className={card}>
            <h2 className="mb-1 text-lg font-semibold text-slate-900">6. Reminders</h2>
            <p className="mb-3 text-sm text-slate-600">Anything else: what to bring, parking, who to ask for at the front desk.</p>
            <textarea rows={3} className={input} value={pb.reminders} onChange={(e) => update({ reminders: e.target.value })} aria-label="Reminders" />
          </section>

          <div className="flex justify-between">
            <button
              type="button"
              className="rounded-lg border border-red-300 bg-white px-5 py-3 font-medium text-red-600 hover:bg-red-50"
              onClick={() => {
                if (window.confirm("Clear this playbook and start fresh for a new interview? Your Answer Library is not affected.")) clearPlaybook();
              }}
            >
              Start a New Playbook
            </button>
            <button type="button" className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700" onClick={() => window.print()}>
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Printed cheat sheet ---------- */}
      <div className="hidden text-[11pt] leading-snug text-black print:block">
        <h1 className="text-2xl font-bold">Interview Playbook{heading ? `: ${heading}` : ""}</h1>
        <p className="mb-4 text-sm">
          {[pb.when, pb.location, pb.interviewer && `Interviewer: ${pb.interviewer}`].filter(Boolean).join("  ·  ")}
        </p>

        {pb.companyNotes.trim() && (
          <section className="mb-4">
            <h2 className="mb-1 border-b border-black font-bold">About the company</h2>
            <p className="whitespace-pre-wrap">{pb.companyNotes}</p>
          </section>
        )}
        {pb.introduction.trim() && (
          <section className="mb-4">
            <h2 className="mb-1 border-b border-black font-bold">My introduction</h2>
            <p className="whitespace-pre-wrap">{pb.introduction}</p>
          </section>
        )}
        {pb.whyThisJob.trim() && (
          <section className="mb-4">
            <h2 className="mb-1 border-b border-black font-bold">Why I want this job</h2>
            <p className="whitespace-pre-wrap">{pb.whyThisJob}</p>
          </section>
        )}
        {printedAnswers.length > 0 && (
          <section className="mb-4">
            <h2 className="mb-1 border-b border-black font-bold">My best answers</h2>
            {printedAnswers.map((s) => (
              <div key={s.id} className="mb-2 break-inside-avoid">
                <p className="font-semibold">{s.question}</p>
                <p className="whitespace-pre-wrap">{s.answer}</p>
              </div>
            ))}
          </section>
        )}
        {pb.questionsToAsk.length > 0 && (
          <section className="mb-4">
            <h2 className="mb-1 border-b border-black font-bold">Questions to ask them</h2>
            <ol className="list-inside list-decimal">
              {pb.questionsToAsk.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </section>
        )}
        {pb.reminders.trim() && (
          <section className="mb-4">
            <h2 className="mb-1 border-b border-black font-bold">Reminders</h2>
            <p className="whitespace-pre-wrap">{pb.reminders}</p>
          </section>
        )}
      </div>
    </div>
  );
}
