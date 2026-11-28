"use client";

export default function PrintButton({ label = "Print / Save PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 print:hidden"
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}
