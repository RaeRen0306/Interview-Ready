"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getHistoryRaw, parseHistory, subscribeHistory } from "@/lib/history";

// Returns saved sessions, or null while the page is still loading in the browser.
export function useHistory() {
  const raw = useSyncExternalStore(subscribeHistory, getHistoryRaw, () => null);
  return useMemo(() => (raw === null ? null : parseHistory(raw)), [raw]);
}
