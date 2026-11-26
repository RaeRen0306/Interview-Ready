import Link from "next/link";

const options = [
  {
    href: "/dashboard/interview/behavioral",
    title: "Behavioral Interview",
    text: "Teamwork, conflict, leadership and 'tell me about a time' questions.",
  },
  {
    href: "/dashboard/interview/technical",
    title: "Technical Interview",
    text: "Skill questions matched to your job title: software, web, data, IT, design and more.",
  },
  {
    href: "/dashboard/interview/custom",
    title: "Custom Interview",
    text: "Pick the job, company, level and mix of questions yourself.",
  },
];

export default function Interview() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Start Interview</h1>
      <p className="mb-8 text-slate-600">Choose the type of interview you want to practice.</p>

      <div className="grid gap-5 md:grid-cols-3">
        {options.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-400 hover:shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-blue-700">{o.title}</h2>
            <p className="text-sm text-slate-600">{o.text}</p>
            <p className="mt-4 text-sm font-medium text-blue-600">Start →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
