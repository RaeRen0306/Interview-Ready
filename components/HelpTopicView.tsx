import type { HelpTopic } from "@/lib/help";

// Shows one help topic. Used by both the Help panel and the How It Works page.
export default function HelpTopicView({ topic, showTitle = true }: { topic: HelpTopic; showTitle?: boolean }) {
  return (
    <div>
      {showTitle && <h2 className="mb-1 text-xl font-semibold text-slate-900">{topic.title}</h2>}
      <p className="mb-4 text-slate-600">{topic.summary}</p>
      <div className="space-y-4">
        {topic.blocks.map((block, i) => (
          <div key={i}>
            {block.heading && <h3 className="mb-1 font-semibold text-slate-900">{block.heading}</h3>}
            {block.text && <p className="text-slate-700">{block.text}</p>}
            {block.steps && (
              <ol className="list-outside list-decimal space-y-1.5 pl-5 text-slate-700">
                {block.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            )}
            {block.bullets && (
              <ul className="list-outside list-disc space-y-1.5 pl-5 text-slate-700">
                {block.bullets.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
            {block.important && (
              <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">
                <span className="font-semibold">Important: </span>
                {block.important}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
