"use client";

import { useState } from "react";
import Link from "next/link";
import {
  generateInterview,
  INTERVIEW_TYPES,
  LEVELS,
  QUESTION_COUNTS,
  type InterviewSettings,
  type InterviewType,
  type Level,
  type Question,
} from "@/lib/questions";
import { saveSession } from "@/lib/history";
import { findSaved, saveAnswer } from "@/lib/library";
import { useLibrary } from "./useLibrary";

interface Props {
  title: string;
  description: string;
  // Behavioral and Technical pages lock the type; Custom lets the user pick.
  fixedType?: InterviewType;
  // Resume Center: supplies its own questions and skips the setup form.
  generate?: () => Question[];
  onExit?: () => void;
  historyInfo?: { type: string; level: string; jobTitle: string };
}

const input =
  "w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200";
const primaryBtn =
  "rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryBtn =
  "rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

export default function InterviewPractice({ title, description, fixedType, generate, onExit, historyInfo }: Props) {
  const [settings, setSettings] = useState<InterviewSettings>({
    jobTitle: "",
    company: "",
    level: "Entry Level",
    type: fixedType ?? "Behavioral",
    count: 5,
  });
  // When "generate" is given, this component is only shown after a button click, so creating questions here is safe.
  const [questions, setQuestions] = useState<Question[] | null>(() => (generate ? generate() : null));
  const [answers, setAnswers] = useState<string[]>(() => (questions ? questions.map(() => "") : []));
  const [index, setIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [finished, setFinished] = useState(false);
  const library = useLibrary();

  function update<K extends keyof InterviewSettings>(key: K, value: InterviewSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function start() {
    const qs = generate ? generate() : generateInterview(settings);
    setQuestions(qs);
    setAnswers(qs.map(() => ""));
    setIndex(0);
    setShowTip(false);
    setFinished(false);
  }

  function goTo(i: number) {
    setIndex(i);
    setShowTip(false);
  }

  function finish() {
    if (!questions) return;
    saveSession({
      id: `${Date.now()}`,
      date: new Date().toISOString(),
      title,
      type: historyInfo?.type ?? settings.type,
      jobTitle: historyInfo?.jobTitle ?? settings.jobTitle.trim(),
      company: historyInfo ? "" : settings.company.trim(),
      level: historyInfo?.level ?? settings.level,
      total: questions.length,
      answered: answers.filter((a) => a.trim().length > 0).length,
    });
    setFinished(true);
  }

  function saveToLibrary(i: number) {
    if (!questions || !answers[i].trim()) return;
    saveAnswer({
      question: questions[i].text,
      category: questions[i].category,
      answer: answers[i].trim(),
      jobTitle: historyInfo?.jobTitle ?? settings.jobTitle.trim(),
    });
  }

  // "saved" = library has this exact answer, "changed" = library has a different answer, "none" = not in library.
  function libraryStatus(i: number): "saved" | "changed" | "none" {
    if (!questions || !library) return "none";
    const saved = findSaved(library, questions[i].text);
    if (!saved) return "none";
    return saved.answer.trim() === answers[i].trim() ? "saved" : "changed";
  }

  function backToSetup() {
    if (onExit) {
      onExit();
      return;
    }
    setQuestions(null);
    setFinished(false);
  }

  // ---------- Step 1: setup form ----------
  if (!questions) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mb-8 text-slate-600">{description}</p>

        <form
          className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            start();
          }}
        >
          <div>
            <label htmlFor="jobTitle" className="mb-2 block font-medium text-slate-800">
              Job Title {fixedType ? <span className="font-normal text-slate-500">(optional)</span> : null}
            </label>
            <input
              id="jobTitle"
              type="text"
              placeholder="Software Engineer"
              className={input}
              value={settings.jobTitle}
              onChange={(e) => update("jobTitle", e.target.value)}
              required={!fixedType}
            />
          </div>

          <div>
            <label htmlFor="company" className="mb-2 block font-medium text-slate-800">
              Company Name <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <input
              id="company"
              type="text"
              placeholder="Google"
              className={input}
              value={settings.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="level" className="mb-2 block font-medium text-slate-800">
                Experience Level
              </label>
              <select
                id="level"
                className={input}
                value={settings.level}
                onChange={(e) => update("level", e.target.value as Level)}
              >
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="count" className="mb-2 block font-medium text-slate-800">
                Number of Questions
              </label>
              <select
                id="count"
                className={input}
                value={settings.count}
                onChange={(e) => update("count", Number(e.target.value))}
              >
                {QUESTION_COUNTS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!fixedType && (
            <div>
              <label htmlFor="type" className="mb-2 block font-medium text-slate-800">
                Interview Type
              </label>
              <select
                id="type"
                className={input}
                value={settings.type}
                onChange={(e) => update("type", e.target.value as InterviewType)}
              >
                {INTERVIEW_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className={primaryBtn}>
            Generate Interview
          </button>
        </form>
      </div>
    );
  }

  const answeredCount = answers.filter((a) => a.trim().length > 0).length;
  const unsavedCount = questions.filter((_, i) => answers[i].trim() && libraryStatus(i) !== "saved").length;

  // ---------- Step 3: review ----------
  if (finished) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Interview Complete</h1>
            <p className="mt-1 text-slate-600">
              You answered {answeredCount} of {questions.length} questions. Review your answers below.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 print:hidden">
            {unsavedCount > 0 && (
              <button
                type="button"
                className={secondaryBtn}
                onClick={() => questions.forEach((_, i) => libraryStatus(i) !== "saved" && saveToLibrary(i))}
              >
                Save All to Library ({unsavedCount})
              </button>
            )}
            <button type="button" className={secondaryBtn} onClick={() => window.print()}>
              Print / Save PDF
            </button>
            <button type="button" className={secondaryBtn} onClick={backToSetup}>
              Change Settings
            </button>
            <button type="button" className={primaryBtn} onClick={start}>
              Practice Again
            </button>
          </div>
        </div>

        <ol className="space-y-4">
          {questions.map((q, i) => (
            <li key={q.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                Question {i + 1} · {q.category}
              </p>
              <p className="mb-3 font-medium text-slate-900">{q.text}</p>
              {answers[i].trim() ? (
                <>
                  <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-slate-700">{answers[i]}</p>
                  <div className="mt-2 print:hidden">
                    {libraryStatus(i) === "saved" ? (
                      <span className="inline-block rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700">
                        ✓ Saved to library
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="rounded-lg border border-blue-600 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
                        onClick={() => saveToLibrary(i)}
                      >
                        {libraryStatus(i) === "changed" ? "Replace answer in library" : "Save to library"}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <p className="italic text-slate-400">No answer written.</p>
              )}
              <p className="mt-3 text-sm text-slate-500">
                <span className="font-medium">Tip:</span> {q.tip}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center print:hidden">
          <Link href="/dashboard/progress" className="text-blue-600 hover:underline">
            See your progress
          </Link>
          <span className="mx-3 text-slate-300">|</span>
          <Link href="/dashboard/library" className="text-blue-600 hover:underline">
            Open answer library
          </Link>
        </p>
      </div>
    );
  }

  // ---------- Step 2: one question at a time ----------
  const q = questions[index];
  const savedForThis = library ? findSaved(library, q.text) : undefined;
  const isLast = index === questions.length - 1;
  const percent = Math.round(((index + 1) / questions.length) * 100);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <button type="button" className="text-sm text-slate-500 hover:text-slate-800" onClick={backToSetup}>
          Exit
        </button>
      </div>

      <div className="mb-2 flex justify-between text-sm text-slate-600">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span>{answeredCount} answered</span>
      </div>
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-blue-600 transition-all" style={{ width: `${percent}%` }} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {q.category}
        </span>
        <p className="mb-5 text-xl font-medium text-slate-900">{q.text}</p>

        <button
          type="button"
          className="mb-4 text-sm font-medium text-blue-600 hover:underline"
          onClick={() => setShowTip((v) => !v)}
        >
          {showTip ? "Hide tip" : "Show tip"}
        </button>
        {showTip && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{q.tip}</p>
        )}

        {savedForThis && savedForThis.answer.trim() !== answers[index].trim() && (
          <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
            <p className="mb-2 font-medium">You have a saved answer for this question.</p>
            <p className="mb-3 whitespace-pre-wrap text-teal-800">{savedForThis.answer}</p>
            <button
              type="button"
              className="rounded-lg bg-teal-600 px-3 py-1.5 font-medium text-white hover:bg-teal-700"
              onClick={() => {
                if (answers[index].trim() && !window.confirm("Replace what you've typed with your saved answer?")) return;
                setAnswers((prev) => prev.map((a, i) => (i === index ? savedForThis.answer : a)));
              }}
            >
              Use my saved answer
            </button>
          </div>
        )}

        <label htmlFor="answer" className="mb-2 block text-sm font-medium text-slate-700">
          Your answer
        </label>
        <textarea
          id="answer"
          rows={8}
          className={input}
          placeholder="Type your answer here, or practice saying it out loud and jot down key points."
          value={answers[index]}
          onChange={(e) => {
            const value = e.target.value;
            setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
          }}
        />
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <button type="button" className={secondaryBtn} disabled={index === 0} onClick={() => goTo(index - 1)}>
          Previous
        </button>
        {isLast ? (
          <button type="button" className={primaryBtn} onClick={finish}>
            Finish Interview
          </button>
        ) : (
          <button type="button" className={primaryBtn} onClick={() => goTo(index + 1)}>
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
