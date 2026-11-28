import { HELP_TOPICS } from "@/lib/help";
import HelpTopicView from "./HelpTopicView";
import PrintButton from "./PrintButton";

// The full "How It Works" guide: every help topic on one page, printable as a booklet.
export default function HelpGuide() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">How It Works</h1>
          <p className="text-slate-600">
            A guide to every part of Interview Ready. You can also click the Help button in the corner of any page.
          </p>
        </div>
        <PrintButton />
      </div>

      <nav className="mb-8 rounded-xl border border-slate-200 bg-white p-5 print:hidden">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Jump to</p>
        <ul className="grid gap-1 sm:grid-cols-2">
          {HELP_TOPICS.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="text-blue-600 hover:underline">
                {t.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-6">
        {HELP_TOPICS.map((t) => (
          <section
            key={t.id}
            id={t.id}
            className="scroll-mt-6 break-inside-avoid rounded-xl border border-slate-200 bg-white p-6 shadow-sm print:border-0 print:p-0 print:shadow-none"
          >
            <HelpTopicView topic={t} />
          </section>
        ))}
      </div>
    </div>
  );
}
