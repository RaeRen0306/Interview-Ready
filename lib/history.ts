// Saves finished practice sessions in the browser (localStorage) for the Progress page.

export interface SessionRecord {
  id: string;
  date: string; // ISO date
  title: string;
  type: string;
  jobTitle: string;
  company: string;
  level: string;
  total: number;
  answered: number;
}

const KEY = "interview-ready-history";
const EVENT = "interview-ready-history-changed";

export function getHistoryRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function parseHistory(raw: string): SessionRecord[] {
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveSession(record: SessionRecord) {
  try {
    const list = parseHistory(getHistoryRaw());
    list.unshift(record);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage can be unavailable (private mode). Practice still works, it just isn't saved.
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // ignore
  }
}

// For React's useSyncExternalStore.
export function subscribeHistory(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
