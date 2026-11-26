"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { getPlaybookRaw, parsePlaybook, subscribePlaybook } from "@/lib/playbook";
import { generateInterview } from "@/lib/questions";
import { useLibrary } from "./useLibrary";

// ---------- Checklist (saved in the browser) ----------

const CHECK_KEY = "interview-ready-day-checklist";
const CHECK_EVENT = "interview-ready-day-checklist-changed";

function getChecksRaw() {
  try {
    return localStorage.getItem(CHECK_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}
function saveChecks(ids: string[]) {
  try {
    localStorage.setItem(CHECK_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(CHECK_EVENT));
  } catch {
    // ignore
  }
}
function subscribeChecks(cb: () => void) {
  window.addEventListener(CHECK_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHECK_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const CHECKLIST: { group: string; items: { id: string; text: string }[] }[] = [
  {
    group: "The night before",
    items: [
      { id: "clothes", text: "Lay out your clothes (clean, pressed, one step nicer than the job's dress code)" },
      { id: "print", text: "Print your Interview Playbook and 3 copies of your resume" },
      { id: "route", text: "Plan your route, parking, and how long it takes to get there" },
      { id: "sleep", text: "Get a good night's sleep" },
    ],
  },
  {
    group: "What to bring",
    items: [
      { id: "resume", text: "Copies of your resume" },
      { id: "id", text: "Photo ID" },
      { id: "pen", text: "Pen and a small notepad" },
      { id: "references", text: "List of references with phone numbers" },
      { id: "certs", text: "Copies of certifications or licenses, if the job needs them" },
    ],
  },
  {
    group: "The morning of",
    items: [
      { id: "eat", text: "Eat a good breakfast" },
      { id: "review", text: "Read through your Playbook one last time" },
      { id: "warmup", text: "Do the 3-question warm-up below" },
      { id: "phone", text: "Put your phone on silent" },
      { id: "early", text: "Arrive 10 to 15 minutes early" },
    ],
  },
];

const TIPS = [
  "Take a slow, deep breath before you walk in. It's fine to pause before answering.",
  "Firm handshake, eye contact, and a smile. Greet the receptionist kindly too; they often share their impression.",
  "For 'tell me about a time' questions, use STAR: Situation, Task, Action, Result.",
  "If you don't understand a question, it's okay to ask them to repeat it.",
  "Speak about your own actions: say \"I did\", not just \"we did\".",
  "At the end, ask 2 or 3 of your prepared questions and thank them for their time.",
];

const AFTER = [
  "Send a short thank-you email or note within 24 hours.",
  "Write down the questions they asked while they're fresh, and save good answers to your Answer Library.",
  "Note the next steps and when they said you'd hear back.",
];

const card = "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";

interface WarmupCard {
  question: string;
  answer?: string;
}

export default function InterviewDay() {
  const playbookRaw = useSyncExternalStore(subscribePlaybook, getPlaybookRaw, () => null);
  const checksRaw = useSyncExternalStore(subscribeChecks, getChecksRaw, () => null);
  const library = useLibrary();
  const [warmup, setWarmup] = useState<WarmupCard[] | null>(null);
  const [revealed, setRevealed] = useState<number[]>([]);

  const playbook = useMemo(() => (playbookRaw === null ? null : parsePlaybook(playbookRaw)), [playbookRaw]);
  const checks = useMemo<string[]>(() => {
    if (checksRaw === null) return [];
    try {
      const data = JSON.parse(checksRaw);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }, [checksRaw]);

  if (playbook === null || library === null) return null;

  const totalItems = CHECKLIST.reduce((n, g) => n + g.items.length, 0);
  const doneCount = checks.filter((id) => CHECKLIST.some((g) => g.items.some((i) => i.id === id))).length;
  const heading = [playbook.jobTitle, playbook.company].filter(Boolean).join(" at ");
  const hasPlaybook = Boolean(heading || playbook.when || playbook.introduction);

  function toggle(id: string) {
    saveChecks(checks.includes(id) ? checks.filter((x) => x !== id) : [...checks, id]);
  }

  function startWarmup() {
    let cards: WarmupCard[];
    if (library && library.length >= 3) {
      const shuffled = [...library].sort(() => Math.random() - 0.5);
      cards = shuffled.slice(0, 3).map((s) => ({ question: s.question, answer: s.answer }));
    } else {
      cards = generateInterview({
        jobTitle: playbook?.jobTitle ?? "",
        company: playbook?.company ?? "",
        level: "Mid Level",
        type: "Mixed",
        count: 3,
      }).map((q) => ({ question: q.text }));
    }
    setWarmup(cards);
    setRevealed([]);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Interview Day</h1>
      <p className="mb-8 text-slate-600">Everything you need for the big day, in one place. You&apos;ve prepared. You&apos;ve got this.</p>

      {/* The interview */}
      <section className="mb-6 rounded-xl bg-slate-900 p-6 text-white">
        {hasPlaybook ? (
          <>
            <p className="text-sm uppercase tracking-wide text-teal-300">Today&apos;s interview</p>
            <h2 className="mt-1 text-2xl font-semibold">{heading || "Your interview"}</h2>
            <div className="mt-3 space-y-1 text-slate-300">
              {playbook.when && <p>When: {playbook.when}</p>}
              {playbook.location && <p>Where: {playbook.location}</p>}
              {playbook.interviewer && <p>With: {playbook.interviewer}</p>}
            </div>
            <Link href="/dashboard/playbook" className="mt-4 inline-block text-sm font-medium text-teal-300 hover:underline">
              Open your Playbook
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Add your interview details</h2>
            <p className="mt-2 text-slate-300">
              Fill in your Interview Playbook (job, company, time and place) and it will show up here.
            </p>
            <Link
              href="/dashboard/playbook"
              className="mt-4 inline-block rounded-lg bg-teal-500 px-5 py-2.5 font-medium text-white hover:bg-teal-600"
            >
              Go to Playbook
            </Link>
          </>
        )}
      </section>

      {/* Checklist */}
      <section className={`${card} mb-6`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Checklist</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">
              {doneCount} of {totalItems} done
            </span>
            {doneCount > 0 && (
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => saveChecks([])}
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-teal-500 transition-all" style={{ width: `${Math.round((doneCount / totalItems) * 100)}%` }} />
        </div>
        <div className="space-y-5">
          {CHECKLIST.map((group) => (
            <div key={group.group}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">{group.group}</h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const done = checks.includes(item.id);
                  return (
                    <li key={item.id}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-slate-50">
                        <input type="checkbox" className="mt-1 h-5 w-5" checked={done} onChange={() => toggle(item.id)} />
                        <span className={done ? "text-slate-400 line-through" : "text-slate-800"}>{item.text}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Quick review */}
      {(playbook.introduction || playbook.whyThisJob || playbook.questionsToAsk.length > 0) && (
        <section className={`${card} mb-6`}>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick review</h2>
          {playbook.introduction && (
            <div className="mb-4">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-600">Your introduction</h3>
              <p className="whitespace-pre-wrap text-slate-800">{playbook.introduction}</p>
            </div>
          )}
          {playbook.whyThisJob && (
            <div className="mb-4">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-600">Why you want this job</h3>
              <p className="whitespace-pre-wrap text-slate-800">{playbook.whyThisJob}</p>
            </div>
          )}
          {playbook.questionsToAsk.length > 0 && (
            <div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-600">Questions to ask them</h3>
              <ol className="list-inside list-decimal text-slate-800">
                {playbook.questionsToAsk.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}

      {/* Warm-up */}
      <section className={`${card} mb-6`}>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">3-question warm-up</h2>
        <p className="mb-4 text-sm text-slate-600">
          {library.length >= 3
            ? "Three questions from your Answer Library. Say your answer out loud, then click to see what you saved."
            : "Three quick practice questions. Answer each one out loud to get your mind ready."}
        </p>
        {warmup === null ? (
          <button type="button" className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700" onClick={startWarmup}>
            Start Warm-Up
          </button>
        ) : (
          <>
            <ol className="space-y-3">
              {warmup.map((c, i) => (
                <li key={c.question} className="rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">
                    {i + 1}. {c.question}
                  </p>
                  {c.answer &&
                    (revealed.includes(i) ? (
                      <p className="mt-2 whitespace-pre-wrap rounded-lg bg-teal-50 p-3 text-teal-900">{c.answer}</p>
                    ) : (
                      <button
                        type="button"
                        className="mt-2 rounded-lg border border-teal-600 bg-white px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50"
                        onClick={() => setRevealed((r) => [...r, i])}
                      >
                        Show my saved answer
                      </button>
                    ))}
                </li>
              ))}
            </ol>
            <button
              type="button"
              className="mt-4 rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
              onClick={startWarmup}
            >
              New Questions
            </button>
          </>
        )}
      </section>

      {/* Tips */}
      <section className={`${card} mb-6`}>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">In the room</h2>
        <ul className="list-inside list-disc space-y-2 text-slate-800">
          {TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">After the interview</h2>
        <ul className="list-inside list-disc space-y-2 text-slate-800">
          {AFTER.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
