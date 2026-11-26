// Answer library: answers the user chose to keep, saved in the browser (localStorage).

export interface SavedAnswer {
  id: string;
  question: string;
  category: string;
  answer: string;
  jobTitle: string;
  savedAt: string; // ISO date of first save
  updatedAt: string; // ISO date of last change
}

const KEY = "interview-ready-library";
const EVENT = "interview-ready-library-changed";

export function getLibraryRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

// Category names that were renamed, so older saved answers show under the new name.
const RENAMED: Record<string, string> = { Conflict: "Handling Disagreements" };

export function parseLibrary(raw: string): SavedAnswer[] {
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.map((s: SavedAnswer) => (RENAMED[s.category] ? { ...s, category: RENAMED[s.category] } : s));
  } catch {
    return [];
  }
}

function write(list: SavedAnswer[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage unavailable (private mode). Nothing is saved.
  }
}

function sameQuestion(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function findSaved(list: SavedAnswer[], question: string): SavedAnswer | undefined {
  return list.find((s) => sameQuestion(s.question, question));
}

// Saves an answer. If the same question is already in the library, its answer is replaced.
export function saveAnswer(entry: { question: string; category: string; answer: string; jobTitle: string }) {
  const list = parseLibrary(getLibraryRaw());
  const now = new Date().toISOString();
  const existing = findSaved(list, entry.question);
  if (existing) {
    existing.answer = entry.answer;
    existing.category = entry.category;
    if (entry.jobTitle) existing.jobTitle = entry.jobTitle;
    existing.updatedAt = now;
  } else {
    list.unshift({
      id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      question: entry.question,
      category: entry.category,
      answer: entry.answer,
      jobTitle: entry.jobTitle,
      savedAt: now,
      updatedAt: now,
    });
  }
  write(list);
}

export function updateAnswer(id: string, answer: string) {
  const list = parseLibrary(getLibraryRaw());
  const item = list.find((s) => s.id === id);
  if (!item) return;
  item.answer = answer;
  item.updatedAt = new Date().toISOString();
  write(list);
}

export function deleteAnswer(id: string) {
  write(parseLibrary(getLibraryRaw()).filter((s) => s.id !== id));
}

// For React's useSyncExternalStore.
export function subscribeLibrary(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
