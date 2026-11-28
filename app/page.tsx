import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 text-center text-white">
      <h1 className="mb-4 text-5xl font-bold sm:text-6xl">
        Interview <span className="text-teal-400">Ready</span>
      </h1>
      <p className="text-xl text-slate-400 sm:text-2xl">Practice. Improve. Get Hired.</p>

      <Link
        href="/dashboard/interview"
        className="mt-10 rounded-lg bg-teal-500 px-8 py-3 text-lg font-medium text-white hover:bg-teal-600"
      >
        Start Interview
      </Link>
      <div className="mt-5 flex items-center gap-4 text-sm">
        <Link href="/dashboard/help" className="text-teal-300 hover:text-white hover:underline">
          How it works
        </Link>
        <span className="text-slate-600">|</span>
        <Link href="/dashboard" className="text-slate-400 hover:text-white hover:underline">
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
