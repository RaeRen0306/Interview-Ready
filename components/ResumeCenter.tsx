"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import InterviewPractice from "./InterviewPractice";
import { readResumeFile } from "@/lib/docx";
import {
  generateResumeQuestions,
  getSavedResume,
  parseResume,
  resumeQuestionCount,
  saveResumeText,
  subscribeResume,
} from "@/lib/resume";
import { QUESTION_COUNTS } from "@/lib/questions";

const primaryBtn =
  "rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryBtn =
  "rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800">{children}</span>;
}

export default function ResumeCenter() {
  // The resume saved in this browser (null while the page is still loading).
  const saved = useSyncExternalStore(subscribeResume, getSavedResume, () => null);
  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "error" | "info"; text: string } | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [count, setCount] = useState(10);
  const [practicing, setPracticing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const text = draft ?? saved ?? "";
  const parsed = useMemo(() => (saved ? parseResume(saved) : null), [saved]);
  const unsavedChanges = draft !== null && draft !== (saved ?? "");

  async function onFileChosen(file: File | undefined) {
    if (!file) return;
    setLoadingFile(true);
    setStatus(null);
    try {
      const content = await readResumeFile(file);
      if (!content.trim()) throw new Error("That file appears to be empty.");
      setDraft(null);
      saveResumeText(content);
      setStatus({ kind: "info", text: `Read "${file.name}". Check what we found below.` });
    } catch (e) {
      setStatus({ kind: "error", text: e instanceof Error ? e.message : "Sorry, that file couldn't be read." });
    } finally {
      setLoadingFile(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function readPasted() {
    if (draft === null) return;
    saveResumeText(draft);
    setDraft(null);
    setStatus({ kind: "info", text: "Resume read. Check what we found below." });
  }

  function clearResume() {
    if (!window.confirm("Remove your resume from this app? Your saved answers and progress are not affected.")) return;
    saveResumeText("");
    setDraft(null);
    setStatus(null);
  }

  const latestJob = parsed?.jobs[0];
  const available = parsed ? resumeQuestionCount(parsed) : 0;
  const countOptions = QUESTION_COUNTS.filter((n) => n <= Math.max(5, available));
  const effectiveCount = Math.min(count, countOptions[countOptions.length - 1]);

  if (practicing && parsed) {
    return (
      <InterviewPractice
        title="Resume Interview"
        description=""
        generate={() => generateResumeQuestions(parsed, effectiveCount)}
        onExit={() => setPracticing(false)}
        historyInfo={{ type: "Resume", level: "Resume", jobTitle: latestJob?.title ?? "" }}
      />
    );
  }

  const found =
    parsed &&
    (parsed.jobs.length ||
      parsed.skills.length ||
      parsed.certifications.length ||
      parsed.education.length ||
      parsed.awards.length);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Resume Center</h1>
      <p className="mb-8 text-slate-600">
        Add your resume and practice answering questions about your own jobs, skills and experience.
      </p>

      {/* Step 1: add the resume */}
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">1. Add your resume</h2>
        <p className="mb-4 text-sm text-slate-600">
          Choose a Word (.docx) or text file from your computer, or copy and paste your resume into the box.
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            ref={fileInput}
            type="file"
            accept=".docx,.txt,.doc,.pdf"
            className="hidden"
            onChange={(e) => onFileChosen(e.target.files?.[0])}
          />
          <button type="button" className={primaryBtn} disabled={loadingFile} onClick={() => fileInput.current?.click()}>
            {loadingFile ? "Reading file..." : "Choose File"}
          </button>
          {saved && (
            <button
              type="button"
              className="rounded-lg border border-red-300 bg-white px-5 py-3 font-medium text-red-600 hover:bg-red-50"
              onClick={clearResume}
            >
              Remove Resume
            </button>
          )}
        </div>

        {status && (
          <p
            className={
              status.kind === "error"
                ? "mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800"
                : "mb-4 rounded-lg bg-teal-50 p-3 text-sm text-teal-900"
            }
          >
            {status.text}
          </p>
        )}

        <label htmlFor="resumeText" className="mb-2 block text-sm font-medium text-slate-700">
          Resume text
        </label>
        <textarea
          id="resumeText"
          rows={10}
          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Paste your resume here, or use Choose File above."
          value={text}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" className={secondaryBtn} disabled={!unsavedChanges || !text.trim()} onClick={readPasted}>
            Read My Resume
          </button>
          {unsavedChanges && <span className="text-sm text-amber-700">Click Read My Resume to use your changes.</span>}
        </div>
        <p className="mt-3 text-xs text-slate-500">Your resume stays in this browser on this computer. It is not uploaded anywhere.</p>
      </section>

      {/* Step 2: what we found, and start */}
      {parsed && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-slate-900">2. What we found</h2>
          <p className="mb-5 text-sm text-slate-600">
            If something is missing or wrong, fix it in the resume text above and click Read My Resume again.
          </p>

          {!found ? (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              We couldn&apos;t find job titles, dates or skills in this text. Make sure each job has its dates (for example
              &quot;2015 - 2020&quot;) and that sections are labeled, like &quot;Experience&quot; and &quot;Skills&quot;. You
              can still practice general questions about your background.
            </p>
          ) : (
            <div className="space-y-5">
              {parsed.jobs.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">Jobs</h3>
                  <ul className="space-y-2">
                    {parsed.jobs.map((job, i) => (
                      <li key={i} className="rounded-lg bg-slate-50 p-3">
                        <p className="font-medium text-slate-900">{job.title || "(job title not found)"}</p>
                        <p className="text-sm text-slate-600">
                          {[job.company, job.dates].filter(Boolean).join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {parsed.skills.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {parsed.skills.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </div>
              )}
              {parsed.certifications.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {parsed.certifications.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </div>
              )}
              {parsed.awards.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">Awards</h3>
                  <ul className="list-inside list-disc text-sm text-slate-700">
                    {parsed.awards.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {parsed.education.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">Education</h3>
                  <ul className="list-inside list-disc text-sm text-slate-700">
                    {parsed.education.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-end gap-4 border-t border-slate-200 pt-6">
            <div>
              <label htmlFor="resumeCount" className="mb-2 block text-sm font-medium text-slate-700">
                Number of questions
              </label>
              <select
                id="resumeCount"
                className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                value={effectiveCount}
                onChange={(e) => setCount(Number(e.target.value))}
              >
                {countOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className={primaryBtn} onClick={() => setPracticing(true)}>
              Start Resume Interview
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
