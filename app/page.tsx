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
      <Link href="/dashboard" className="mt-4 text-sm text-slate-400 hover:text-white">
        Go to dashboard
      </Link>
    </main>
  );
}
