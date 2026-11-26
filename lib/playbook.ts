// Interview Playbook: a one-page cheat sheet for an upcoming interview, saved in the browser.

export interface Playbook {
  jobTitle: string;
  company: string;
  when: string;
  location: string;
  interviewer: string;
  companyNotes: string;
  introduction: string;
  whyThisJob: string;
  answerIds: string[]; // saved answers from the Answer Library to include
  questionsToAsk: string[];
  reminders: string;
}

export const EMPTY_PLAYBOOK: Playbook = {
  jobTitle: "",
  company: "",
  when: "",
  location: "",
  interviewer: "",
  companyNotes: "",
  introduction: "",
  whyThisJob: "",
  answerIds: [],
  questionsToAsk: [],
  reminders: "",
};

export const SUGGESTED_QUESTIONS = [
  "What does a typical day look like in this role?",
  "What would success look like in the first 90 days?",
  "What are the biggest challenges facing the team right now?",
  "How would you describe the team I would be working with?",
  "What training or support is available for new employees?",
  "What do you enjoy most about working here?",
  "Is there anything about my background that gives you concerns I can address?",
  "What are the next steps in the hiring process?",
];

const KEY = "interview-ready-playbook";
const EVENT = "interview-ready-playbook-changed";

export function getPlaybookRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function parsePlaybook(raw: string): Playbook {
  if (!raw) return EMPTY_PLAYBOOK;
  try {
    const data = JSON.parse(raw);
    return { ...EMPTY_PLAYBOOK, ...(data && typeof data === "object" ? data : {}) };
  } catch {
    return EMPTY_PLAYBOOK;
  }
}

export function savePlaybook(playbook: Playbook) {
  try {
    localStorage.setItem(KEY, JSON.stringify(playbook));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage unavailable.
  }
}

export function clearPlaybook() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // ignore
  }
}

export function subscribePlaybook(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
