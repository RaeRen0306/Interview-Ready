import Link from "next/link";
import RecentActivity from "@/components/RecentActivity";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Welcome to Interview Ready</h1>
      <p className="mb-8 text-slate-600">Practice. Improve. Get Hired.</p>

      <div className="mb-10 rounded-xl bg-slate-900 p-8 text-white">
        <h2 className="mb-2 text-2xl font-semibold">Ready to practice?</h2>
        <p className="mb-6 text-slate-300">
          Build a mock interview for the job you want, answer one question at a time, and review your answers at the end.
        </p>
        <Link
          href="/dashboard/interview"
          className="inline-block rounded-lg bg-teal-500 px-6 py-3 font-medium text-white hover:bg-teal-600"
        >
          Start Interview
        </Link>
      </div>

      <RecentActivity />
    </div>
  );
}
