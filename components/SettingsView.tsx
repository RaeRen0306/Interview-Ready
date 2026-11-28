"use client";

import { useEffect, useState } from "react";
import { isAiConfigured } from "@/lib/feedback";

const card = "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";

export default function SettingsView() {
  const [aiReady, setAiReady] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let active = true;
    isAiConfigured().then((ready) => {
      if (active) setAiReady(ready);
    });
    return () => {
      active = false;
    };
  }, []);

  async function recheck() {
    setChecking(true);
    setAiReady(await isAiConfigured());
    setChecking(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Settings</h1>
      <p className="mb-8 text-slate-600">Set up the AI coach and see how your information is handled.</p>

      <section className={`${card} mb-6`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">AI Coach</h2>
          {aiReady === null ? (
            <span className="text-sm text-slate-500">Checking...</span>
          ) : aiReady ? (
            <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800">✓ Connected</span>
          ) : (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">Not set up yet</span>
          )}
        </div>

        <p className="mb-4 text-slate-700">
          The AI coach scores your practice answers, explains what worked and what to improve, and writes a stronger
          version you can save. Each review costs around a penny, paid from your own AI account.
        </p>

        {aiReady === false && (
          <>
            <h3 className="mb-2 font-semibold text-slate-900">How to set it up</h3>
            <ol className="mb-4 list-inside list-decimal space-y-2 text-slate-700">
              <li>Sign up for a developer account at platform.claude.com.</li>
              <li>Add a small amount of credit (about $5 is plenty to start).</li>
              <li>Create an API key and copy it. Treat it like a password: never share it or paste it into a chat.</li>
              <li>
                In VS Code, create a new file named <code className="rounded bg-slate-100 px-1">.env.local</code> in the
                Interview-Ready folder (right-click an empty spot in the file list, choose New File). Type{" "}
                <code className="rounded bg-slate-100 px-1">ANTHROPIC_API_KEY=</code> and paste the key right after the
                = sign, all on one line. Save with Ctrl + S.
              </li>
              <li>
                Restart the app: click in the terminal, press Ctrl + C, then run{" "}
                <code className="rounded bg-slate-100 px-1">npm.cmd run dev</code>.
              </li>
            </ol>
            <p className="mb-4 text-sm text-slate-500">
              The key stays in that file on this computer. It is never uploaded to GitHub.
            </p>
          </>
        )}

        <button
          type="button"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          disabled={checking}
          onClick={recheck}
        >
          {checking ? "Checking..." : "Check Again"}
        </button>
      </section>

      <section className={card}>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Your information</h2>
        <ul className="list-inside list-disc space-y-2 text-slate-700">
          <li>Your answers, resume, Playbook and progress are saved only in this browser, on this computer.</li>
          <li>
            When you click <span className="font-medium">Get AI Feedback</span>, that question and your answer are sent to
            the AI service to be reviewed. Your resume is not sent.
          </li>
          <li>Nothing is shared with anyone else.</li>
        </ul>
      </section>
    </div>
  );
}
