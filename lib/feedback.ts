// Browser-side helpers for AI feedback. They talk to the app's own /api/feedback route.

export interface Feedback {
  score: number; // 1 to 5
  summary: string;
  strengths: string[];
  improvements: string[];
  improvedAnswer: string;
}

export interface FeedbackContext {
  jobTitle: string;
  company: string;
  level: string;
}

export async function isAiConfigured(): Promise<boolean> {
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ check: true }),
    });
    const data = await res.json();
    return Boolean(data.configured);
  } catch {
    return false;
  }
}

export async function requestFeedback(
  question: { text: string; category: string },
  answer: string,
  context: FeedbackContext,
): Promise<Feedback> {
  let res: Response;
  try {
    res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question: question.text,
        category: question.category,
        answer,
        jobTitle: context.jobTitle,
        company: context.company,
        level: context.level,
      }),
    });
  } catch {
    throw new Error("Couldn't reach the app. Make sure it's still running in VS Code.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.feedback) {
    throw new Error(data?.message || "Something went wrong getting feedback. Try again.");
  }
  return data.feedback as Feedback;
}

export const SCORE_LABELS: Record<number, string> = {
  1: "Needs work",
  2: "Getting there",
  3: "Solid start",
  4: "Strong",
  5: "Excellent",
};
