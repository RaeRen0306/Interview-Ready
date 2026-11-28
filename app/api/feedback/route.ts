// AI feedback on interview answers.
// Runs on the app's server side only, so the API key is never sent to the browser.
// The key lives in the file .env.local as ANTHROPIC_API_KEY=...

const DEFAULT_MODEL = "claude-haiku-4-5";
const MAX_ANSWER_LENGTH = 6000;

interface FeedbackRequest {
  check?: boolean;
  question?: string;
  answer?: string;
  category?: string;
  jobTitle?: string;
  company?: string;
  level?: string;
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

const SYSTEM_PROMPT = `You are an experienced, encouraging interview coach. You review one answer to one interview question and give honest, practical feedback.

Reply with ONLY a JSON object, no other text, in exactly this shape:
{
  "score": <whole number 1-5>,
  "summary": "<one or two plain-language sentences on how the answer comes across>",
  "strengths": ["<what worked>", ...],
  "improvements": ["<specific, actionable suggestion>", ...],
  "improvedAnswer": "<a stronger version of the answer, written in the candidate's own voice, first person>"
}

Scoring guide: 1 = missing or off-topic, 2 = too thin or vague, 3 = acceptable but generic, 4 = strong with a real example, 5 = excellent, specific and memorable.

Rules:
- Use plain, everyday language. No jargon.
- Give 1 to 3 strengths and 1 to 3 improvements. Be specific to what they wrote.
- For "tell me about a time" questions, check for a real example with Situation, Task, Action and Result.
- The improved answer must only use facts the candidate gave. Do not invent jobs, numbers, names or events. Where a detail is missing, write a short bracketed placeholder like [add a specific result] so the candidate can fill it in.
- Keep the improved answer to what someone could say out loud in about 1 to 2 minutes.`;

function extractJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const data = JSON.parse(text.slice(start, end + 1));
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

function toStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.trim() !== "").slice(0, 3) : [];
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

  let body: FeedbackRequest;
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad_request", message: "The request couldn't be read." }, 400);
  }

  // Lets the app ask "is AI set up?" without spending anything.
  if (body.check) return json({ configured: Boolean(apiKey) });

  if (!apiKey) {
    return json(
      { error: "no_key", message: "AI feedback isn't set up yet. See the Settings page for how to add your key." },
      503,
    );
  }

  const question = (body.question ?? "").trim();
  const answer = (body.answer ?? "").trim();
  if (!question || !answer) {
    return json({ error: "bad_request", message: "There's no answer to review." }, 400);
  }
  if (answer.length > MAX_ANSWER_LENGTH) {
    return json({ error: "too_long", message: "That answer is too long to review. Try shortening it." }, 400);
  }

  const context = [
    body.jobTitle ? `Job: ${body.jobTitle}` : "",
    body.company ? `Company: ${body.company}` : "",
    body.level ? `Experience level: ${body.level}` : "",
    body.category ? `Question type: ${body.category}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const userMessage = `${context ? context + "\n\n" : ""}Interview question:\n${question}\n\nCandidate's answer:\n${answer}`;

  let apiResponse: Response;
  try {
    apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL,
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });
  } catch {
    return json({ error: "network", message: "Couldn't reach the AI service. Check your internet connection." }, 502);
  }

  if (!apiResponse.ok) {
    const status = apiResponse.status;
    const message =
      status === 401
        ? "The AI key wasn't accepted. Check that it was copied correctly into .env.local."
        : status === 400 || status === 402 || status === 403
          ? "The AI service turned down the request. Your account may need credit added."
          : status === 429
            ? "The AI service is busy or your usage limit was reached. Wait a minute and try again."
            : "The AI service had a problem. Try again in a moment.";
    return json({ error: "api_error", status, message }, 502);
  }

  const data = (await apiResponse.json()) as { content?: { type: string; text?: string }[] };
  const text = (data.content ?? [])
    .filter((c) => c.type === "text" && c.text)
    .map((c) => c.text)
    .join("\n");
  const parsed = extractJson(text);
  if (!parsed) {
    return json({ error: "bad_reply", message: "The AI's reply couldn't be read. Try again." }, 502);
  }

  const score = Math.min(5, Math.max(1, Math.round(Number(parsed.score) || 3)));
  return json({
    feedback: {
      score,
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      strengths: toStringList(parsed.strengths),
      improvements: toStringList(parsed.improvements),
      improvedAnswer: typeof parsed.improvedAnswer === "string" ? parsed.improvedAnswer : "",
    },
  });
}
