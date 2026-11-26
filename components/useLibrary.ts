"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getLibraryRaw, parseLibrary, subscribeLibrary } from "@/lib/library";

// Returns saved answers, or null while the page is still loading in the browser.
export function useLibrary() {
  const raw = useSyncExternalStore(subscribeLibrary, getLibraryRaw, () => null);
  return useMemo(() => (raw === null ? null : parseLibrary(raw)), [raw]);
}
