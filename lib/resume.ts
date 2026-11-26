// Reads resume text and builds interview questions about the person's own experience.
// Built-in rules only: no AI service, no internet needed.

import type { Question } from "./questions";

export interface ResumeJob {
  title: string;
  company: string;
  dates: string;
  startYear?: number;
  endYear?: number; // undefined = present
}

export interface ParsedResume {
  jobs: ResumeJob[];
  skills: string[];
  certifications: string[];
  education: string[];
  awards: string[];
  yearsOfExperience?: number;
}

const MONTH = "(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\.?";
const DATE = `(?:${MONTH}\\s*\\d{4}|\\d{1,2}/\\d{4}|\\d{4})`;
const END = `(?:${DATE}|present|current|now|today)`;
const RANGE = new RegExp(`(${DATE})\\s*(?:-|–|—|to|through|thru)\\s*(${END})`, "i");
const YEAR = /(19|20)\d{2}/;

const SECTION_PATTERNS: [string, RegExp][] = [
  ["jobs", /^(professional |work |employment |relevant |career |military )?(experience|history|employment|service)( history)?:?$/i],
  ["skills", /^((core |key |technical |professional )?(skills|competencies|strengths|abilities|qualifications)|areas of expertise|skills (and|&) abilities):?$/i],
  ["certifications", /^(certifications?|licenses?( (and|&) certifications?)?|certifications? (and|&) licenses?|training( (and|&) certifications?)?):?$/i],
  ["education", /^(education( ?(and|&|\/) ?training)?|academic background|training):?$/i],
  ["awards", /^(awards?( (and|&) (commendations|honors|recognition))?|honors( (and|&) awards)?|commendations|achievements):?$/i],
  ["other", /^(summary|professional summary|objective|career objective|profile|references|volunteer( experience)?|interests|activities|contact( information)?):?$/i],
];

const COMPANY_HINT =
  /\b(inc|llc|ltd|corp|corporation|company|co\.|group|department|dept|police|sheriff|county|city of|state of|hospital|medical|clinic|school|university|college|bank|church|services|solutions|systems|store|restaurant|center|centre|agency|army|navy|air force|marines|national guard|walmart|amazon|kroger|lowe's|home depot)\b/i;

// Common skills to look for anywhere in the resume if there's no skills section.
const KNOWN_SKILLS = [
  "customer service", "leadership", "team leadership", "communication", "problem solving", "time management",
  "microsoft office", "excel", "word", "powerpoint", "outlook", "quickbooks", "data entry", "scheduling",
  "project management", "training", "supervision", "budgeting", "sales", "inventory", "cash handling",
  "report writing", "de-escalation", "first aid", "cpr", "firearms", "patrol", "investigations", "emergency response",
  "patient care", "forklift", "cdl", "osha", "safety", "maintenance", "troubleshooting", "networking",
  "javascript", "python", "sql", "react", "customer relations", "conflict resolution", "public speaking",
  "mentoring", "coaching", "negotiation", "logistics", "quality control", "bilingual", "spanish",
];

function clean(line: string) {
  return line.replace(/^[\s•·▪●◦\-*–—]+/, "").replace(/\s+/g, " ").trim();
}

function toYear(text: string): number | undefined {
  const m = text.match(YEAR);
  return m ? Number(m[0]) : undefined;
}

function splitList(line: string): string[] {
  return line
    .split(/\s*[,;|•·▪●]\s*|\s{2,}|\t/)
    .map((s) => clean(s).replace(/\.$/, ""))
    .filter((s) => s.length > 1 && s.length <= 40 && s.split(" ").length <= 5);
}

// Removes a trailing location like ", Huntington, WV" or "Columbus OH".
function stripLocation(text: string) {
  return text
    .replace(/,\s*[A-Za-z .'-]+,\s*[A-Z]{2}\.?$/, "")
    .replace(/,?\s+[A-Z][a-z]+(?: [A-Z][a-z]+)?,?\s+[A-Z]{2}\.?$/, "")
    .replace(/,\s*[A-Z]{2}\.?$/, "")
    .trim();
}

// For resumes where each job is one paragraph: "Employer City, ST. Dates Job Title Description..."
// Pulls the job title from the text right after the dates.
function titleFromDescription(after: string): string {
  const t = after.trim();
  const rank = t.match(/^Rank:\s*(\S+(?:\s*\((?:RET|Ret\.?|Retired)\))?)/);
  if (rank) return rank[1].replace(/\s*\((RET|Ret\.?|Retired)\)/, "").trim();
  const stops = [
    t.search(/\s(?:I|My|Duties|Duty|Responsibilities|Responsible|Upon|After|While|Protect|Protected|Provide|Provided|Conduct|Conducted|Supervise|Supervised|Served|Worked|Performed|Managed|Assisted|Handled|Led|Oversaw|Maintained|Coordinated|Including|Where)\b/),
    t.search(/[.;:]\s/),
  ].filter((i) => i > 0);
  const end = stops.length ? Math.min(...stops) : t.length;
  return t.slice(0, end).split(" ").slice(0, 8).join(" ").replace(/[,.;:]+$/, "").trim();
}

function companyFromLead(before: string): string {
  return before
    .replace(/[,.\s]+$/, "")
    .replace(/\s+[A-Z][a-z]+,\s*[A-Z]{2}\.?$/, "") // " Huntington, WV"
    .replace(/,\s*[A-Z][a-z]+(?: [A-Z][a-z]+)?\.?$/, "") // ", South Korea", ", North Carolina"
    .replace(/[,.\s]+$/, "")
    .trim();
}

function titleAndCompany(text: string): { title: string; company: string } {
  const t = stripLocation(text.replace(/[,|–—\-:]+$/, "").trim()).replace(/[,|–—\-:]+$/, "").trim();
  if (!t) return { title: "", company: "" };

  const at = t.match(/^(.+?)\s+(?:at|@)\s+(.+)$/i);
  if (at) return { title: at[1].trim(), company: at[2].trim() };

  const parts = t
    .split(/\s*(?:\||–|—|\s-\s|,)\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 1) {
    return COMPANY_HINT.test(parts[0]) ? { title: "", company: parts[0] } : { title: parts[0], company: "" };
  }
  // Two or more parts: figure out which looks like the company.
  const [a, b] = parts;
  if (COMPANY_HINT.test(a) && !COMPANY_HINT.test(b)) return { title: b, company: a };
  return { title: a, company: b };
}

export function parseResume(text: string): ParsedResume {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map(clean)
    .filter((l) => l.length > 0);

  const result: ParsedResume = { jobs: [], skills: [], certifications: [], education: [], awards: [] };
  let section: string = "none";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const heading = SECTION_PATTERNS.find(([, re]) => re.test(line));
    if (heading && line.length < 50) {
      section = heading[0];
      continue;
    }

    const range = line.match(RANGE);
    const inJobs = section === "jobs" || section === "none";

    if (range && inJobs && range.index !== undefined) {
      const before = line.slice(0, range.index).trim();
      const after = line.slice(range.index + range[0].length).trim();
      if (before && after.length > 60) {
        // One-paragraph style: employer, dates, title, description.
        const endText = range[2];
        const ended = !/present|current|now|today/i.test(endText);
        result.jobs.push({
          title: titleFromDescription(after).slice(0, 60),
          company: companyFromLead(before).slice(0, 70),
          dates: range[0],
          startYear: toYear(range[1]),
          endYear: ended ? toYear(endText) : undefined,
        });
        continue;
      }
      const rest = line.replace(RANGE, "").replace(/[()]/g, "").trim();
      let { title, company } = titleAndCompany(rest);
      // Title/company is often on the line(s) just above the dates.
      const prev = lines[i - 1] ?? "";
      const prev2 = lines[i - 2] ?? "";
      const prevIsFree = (l: string) => l && !RANGE.test(l) && !SECTION_PATTERNS.some(([, re]) => re.test(l)) && l.length < 80;
      if (!title && !company && prevIsFree(prev)) {
        ({ title, company } = titleAndCompany(prev));
        if ((!title || !company) && prevIsFree(prev2)) {
          const extra = titleAndCompany(prev2);
          if (!company) company = extra.company || extra.title;
          if (!title) title = extra.title || extra.company;
          // Usually the company is above the title, or the title is above the company. Keep the one with a company hint as company.
          if (COMPANY_HINT.test(title) && !COMPANY_HINT.test(company)) [title, company] = [company, title];
        }
      } else if ((!title || !company) && prevIsFree(prev)) {
        const extra = titleAndCompany(prev);
        if (!title) title = extra.title || extra.company;
        else if (!company) company = extra.company || extra.title;
      }
      if (title || company) {
        const endText = range[2];
        const ended = !/present|current|now|today/i.test(endText);
        result.jobs.push({
          title: title.slice(0, 60),
          company: company.slice(0, 60),
          dates: range[0],
          startYear: toYear(range[1]),
          endYear: ended ? toYear(endText) : undefined,
        });
      }
      continue;
    }

    if (section === "skills") {
      result.skills.push(...splitList(line));
    } else if (section === "certifications") {
      const c = line
        .replace(RANGE, "")
        .replace(/,?\s*(19|20)\d{2}\s*$/, "")
        .replace(/\s*-?\s*certified$/i, " certification")
        .trim();
      if (c.length > 2 && c.length < 80) result.certifications.push(c);
    } else if (section === "awards") {
      const a = line.replace(/,?\s*(19|20)\d{2}\s*$/, "").trim();
      if (a.length > 3 && a.length < 90) result.awards.push(a);
    } else if (section === "education" && /^courses? completed/i.test(line)) {
      // Skip long lists of courses.
    } else if (section === "education" && /\b(certification|certificate|certified|license|hour course|course)\b/i.test(line) && !/\b(degree|bachelor|associate|master)\b/i.test(line)) {
      const c = line
        .replace(new RegExp(`,?\\s*(?:${MONTH}\\s*)?(19|20)\\d{2}\\s*$`, "i"), "")
        .trim();
      if (c.length > 3 && c.length < 90) result.certifications.push(c);
    } else if (section === "education") {
      const looksLikeSchool =
        /\b(university|college|school|academy|institute|degree|diploma|ged|associate|bachelor|master|b\.?a\.?|b\.?s\.?|m\.?a\.?|m\.?s\.?|mba|certificate|program)\b/i;
      if (line.length > 3 && line.length < 100 && looksLikeSchool.test(line)) {
        let e = line.replace(new RegExp(`,?\\s*(?:${MONTH}\\s*)?(19|20)\\d{2}.*$`, "i"), "").trim();
        if (e.length > 45 && e.includes(",")) e = e.split(",")[0].trim();
        result.education.push(e);
      }
    }
  }

  // No skills section? Look for well-known skills anywhere in the text.
  if (result.skills.length === 0) {
    const lower = text.toLowerCase();
    if (/\bsupervis(e|ed|ing|or|ion)\b/.test(lower)) result.skills.push("Supervision");
    if (/\b(taught|instructor|teaching)\b/.test(lower)) result.skills.push("Teaching and Instruction");
    result.skills.push(...KNOWN_SKILLS.filter((s) => new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(lower)).map(
      (s) => s.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bCpr\b/, "CPR").replace(/\bCdl\b/, "CDL").replace(/\bOsha\b/, "OSHA").replace(/\bSql\b/, "SQL"),
    ));
  }

  // Remove duplicates and limit list sizes.
  const unique = (list: string[]) => [...new Map(list.filter(Boolean).map((s) => [s.toLowerCase(), s])).values()];
  result.skills = unique(result.skills).slice(0, 15);
  result.certifications = unique(result.certifications).slice(0, 8);
  // Degrees first, then school names.
  const isDegree = (e: string) => /\b(degree|bachelor|associate|master|b\.?a\.?|b\.?s\.?|mba|diploma|ged)\b/i.test(e);
  result.education = unique(result.education)
    .filter((e) => e.length > 3)
    .sort((a, b) => Number(isDegree(b)) - Number(isDegree(a)))
    .slice(0, 4);
  result.awards = unique(result.awards).slice(0, 6);
  result.jobs = result.jobs.slice(0, 8);

  const starts = result.jobs.map((j) => j.startYear).filter((y): y is number => !!y);
  if (starts.length) {
    const now = new Date().getFullYear();
    const ends = result.jobs.map((j) => j.endYear ?? now);
    result.yearsOfExperience = Math.max(...ends) - Math.min(...starts);
  }
  return result;
}

// ---------- Questions ----------

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Draft {
  text: string;
  category: string;
  tip: string;
  priority: number; // lower = more important
}

const STAR = "Use the STAR method: Situation, Task, Action, Result. Use a real example from this job.";

function jobLabel(job: ResumeJob) {
  if (job.title && job.company) return `your role as ${job.title} at ${job.company}`;
  if (job.title) return `your role as ${job.title}`;
  return `your time at ${job.company}`;
}
function place(job: ResumeJob) {
  return job.company || `your ${job.title} job`;
}

// Call from a button click, not while the page is rendering (it uses Math.random).
export function generateResumeQuestions(resume: ParsedResume, count: number): Question[] {
  const drafts: Draft[] = [
    {
      text: "Walk me through your resume.",
      category: "Your Background",
      tip: "Go in order, about 2 minutes total. For each job: what you did and one thing you are proud of. End with why you are here today.",
      priority: 0,
    },
  ];

  resume.jobs.forEach((job, index) => {
    const recent = index === 0;
    const p = recent ? 1 : 2 + index;
    drafts.push({
      text: `Tell me about ${jobLabel(job)}.`,
      category: "Your Experience",
      tip: "Describe your main duties, who you worked with, and one result you are proud of.",
      priority: p,
    });
    drafts.push({
      text: `What was your biggest accomplishment at ${place(job)}?`,
      category: "Your Experience",
      tip: STAR,
      priority: p + 0.5,
    });
    drafts.push({
      text: `What was the hardest part of working at ${place(job)}, and how did you handle it?`,
      category: "Your Experience",
      tip: "Pick a real challenge, focus on what you did about it, and end on what you learned.",
      priority: p + 2,
    });
    if (job.title) {
      drafts.push({
        text: `What did you learn as ${job.title} that you would bring to this job?`,
        category: "Your Experience",
        tip: "Connect a specific skill or lesson from that job to what this new job needs.",
        priority: p + 1,
      });
    }
    if (job.endYear) {
      drafts.push({
        text: `Why did you leave ${place(job)}?`,
        category: "Career History",
        tip: "Stay positive and brief. Focus on what you were moving toward, never on complaints about the old employer.",
        priority: p + 1.5,
      });
    }
    if (job.startYear && (job.endYear ?? new Date().getFullYear()) - job.startYear >= 8) {
      drafts.push({
        text: `You spent many years at ${place(job)}. What kept you there, and why make a change now?`,
        category: "Career History",
        tip: "Long service shows loyalty. Explain what you valued there and why this new step makes sense now.",
        priority: p + 1,
      });
    }
  });

  // Gaps of more than a year between jobs (jobs are usually listed newest first).
  const dated = resume.jobs.filter((j) => j.startYear).sort((a, b) => (b.startYear ?? 0) - (a.startYear ?? 0));
  for (let i = 0; i < dated.length - 1; i++) {
    const newer = dated[i];
    const older = dated[i + 1];
    if (older.endYear && newer.startYear && newer.startYear - older.endYear > 1) {
      drafts.push({
        text: `I see a gap between ${older.endYear} and ${newer.startYear}. What were you doing during that time?`,
        category: "Career History",
        tip: "Be honest and brief. Mention anything productive you did, such as family care, training, or volunteering, then move on to why you are ready now.",
        priority: 2.5,
      });
      break;
    }
  }

  if (resume.yearsOfExperience && resume.yearsOfExperience >= 20) {
    drafts.push({
      text: "You have a lot of experience. How do you stay current and open to new ways of doing things?",
      category: "Your Background",
      tip: "Show you are still learning: recent training, new tools you have picked up, and being open to feedback from younger coworkers.",
      priority: 3,
    });
  }

  shuffle(resume.skills).forEach((skill, i) => {
    drafts.push({
      text: `Give me an example of a time you used your ${skill} skills on the job.`,
      category: "Your Skills",
      tip: STAR,
      priority: 2 + i,
    });
  });

  resume.certifications.forEach((cert, i) => {
    drafts.push({
      text: `Tell me about your ${cert}. How has it helped you in your work?`,
      category: "Certifications",
      tip: "Explain what it covers, why you earned it, and a time it made a difference.",
      priority: 3 + i,
    });
  });

  resume.education.slice(0, 2).forEach((edu, i) => {
    drafts.push({
      text: `How has your education (${edu}) prepared you for this role?`,
      category: "Education",
      tip: "Connect specific classes, projects, or skills to what this job needs.",
      priority: 4 + i,
    });
  });

  resume.awards.slice(0, 3).forEach((award, i) => {
    drafts.push({
      text: `Your resume lists "${award}". Tell me what you did to earn it.`,
      category: "Awards",
      tip: "Tell the story behind it: the situation, what you did, and the result. Let the facts show your character.",
      priority: 2 + i,
    });
  });

  drafts.push({
    text: "Looking at your whole career, what are you most proud of?",
    category: "Your Background",
    tip: "Pick one achievement that shows the kind of worker you are, and explain why it matters to you.",
    priority: 3.5,
  });

  // Keep the opener first, then mix the most important questions.
  const [opener, ...rest] = drafts;
  const picked = rest
    .map((d) => ({ d, sort: d.priority + Math.random() * 2.5 }))
    .sort((a, b) => a.sort - b.sort)
    .map((x) => x.d);

  const unique = [opener, ...picked].filter((d, i, all) => all.findIndex((x) => x.text === d.text) === i);
  return unique.slice(0, count).map((d, i) => ({ id: `r${i + 1}`, text: d.text, category: d.category, tip: d.tip }));
}

export function resumeQuestionCount(resume: ParsedResume) {
  // Rough number of distinct questions available, used to limit the count options.
  return (
    2 +
    resume.jobs.length * 4 +
    resume.skills.length +
    resume.certifications.length +
    Math.min(2, resume.education.length) +
    Math.min(3, resume.awards.length)
  );
}

// ---------- Saving the resume text in this browser ----------

const KEY = "interview-ready-resume";
const EVENT = "interview-ready-resume-changed";

export function getSavedResume(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveResumeText(text: string) {
  try {
    if (text.trim()) localStorage.setItem(KEY, text);
    else localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage unavailable. The resume still works until the page is closed.
  }
}

export function subscribeResume(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
