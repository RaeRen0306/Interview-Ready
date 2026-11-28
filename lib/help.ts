// Help content shown in the Help panel and on the How It Works page.
// Written in plain, everyday language.

export interface HelpBlock {
  heading?: string;
  text?: string;
  steps?: string[];
  bullets?: string[];
  important?: string;
}

export interface HelpTopic {
  id: string;
  title: string;
  summary: string;
  blocks: HelpBlock[];
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    summary: "The quickest way to get the most out of Interview Ready.",
    blocks: [
      {
        heading: "Suggested first steps",
        steps: [
          "Resume Center: add your resume so you can practice questions about your own jobs.",
          "Start Interview: choose Custom Interview and enter the job title, company and your experience level.",
          "Answer the questions one at a time. Short notes are fine; you can also say your answer out loud.",
          "On the review screen, click Get AI Feedback to see a score and how to improve.",
          "Save your best answers to the Answer Library, and keep improving them.",
          "Before a real interview, fill in your Interview Playbook and print it.",
          "On the day, open Interview Day for your checklist and a quick warm-up.",
        ],
      },
      {
        heading: "Getting help any time",
        text: "Click the Help button in the bottom-right corner on any page. It opens beside the page, so you won't lose your place, even in the middle of an interview.",
      },
    ],
  },
  {
    id: "start-interview",
    title: "Choosing an Interview",
    summary: "The three kinds of practice interviews.",
    blocks: [
      {
        bullets: [
          "Behavioral: \"Tell me about a time when...\" questions about teamwork, problems, leadership and more.",
          "Technical: skill questions for your line of work, based on the job title you enter.",
          "Custom: you choose the job title, company, experience level and mix of questions.",
        ],
      },
      {
        heading: "Tip",
        text: "Custom Interview gives the best results with the AI coach, because it knows your job title and experience level. Without them, the coach may assume you're just starting out.",
      },
    ],
  },
  {
    id: "practicing",
    title: "Practicing an Interview",
    summary: "How the setup, question and review screens work.",
    blocks: [
      {
        heading: "Setting up",
        text: "Fill in the job title, company (optional), experience level and number of questions, then click Generate Interview.",
      },
      {
        heading: "Answering questions",
        bullets: [
          "Questions come one at a time. The bar at the top shows how far along you are.",
          "Show tip gives advice on how to answer that kind of question.",
          "Type your answer in the box. You can skip a question and come back with Previous.",
          "If you've saved an answer to this question before, a green box shows it. Click Use my saved answer to start from it.",
          "On the last question, click Finish Interview.",
        ],
      },
      {
        important:
          "Don't click the sidebar links in the middle of an interview: leaving the page ends the interview and your typed answers are lost. Use the Help button instead; it keeps your place.",
      },
      {
        heading: "The review screen",
        bullets: [
          "See every question with your answer and a tip.",
          "Save to library keeps an answer. Replace answer in library swaps out an answer you saved before.",
          "Get AI Feedback scores your answer and suggests improvements (see AI Coach).",
          "Practice Again gives you new questions with the same settings. Change Settings goes back to the setup form.",
          "Print / Save PDF prints your answers.",
        ],
      },
    ],
  },
  {
    id: "ai-coach",
    title: "AI Coach",
    summary: "Scores your answers and shows you how to make them stronger.",
    blocks: [
      {
        heading: "What you get",
        bullets: [
          "A score from 1 to 5: 1 Needs work, 2 Getting there, 3 Solid start, 4 Strong, 5 Excellent.",
          "What worked, and what to do to make it stronger.",
          "A stronger version of your answer. It only uses facts you gave; anything it doesn't know is left in [brackets] for you to fill in.",
          "Save Stronger Version to Library replaces your saved answer for that question with the improved one.",
        ],
      },
      {
        heading: "Tips",
        bullets: [
          "The more detail you give, the better the feedback. A sentence or two isn't much to work with.",
          "After saving a stronger version, open the Answer Library, click Edit, and replace the [brackets] with your own details. Remove the [ ] marks too.",
          "Then practice the question again and get feedback to see your score go up.",
        ],
      },
      {
        heading: "Setup and cost",
        text: "The AI coach needs to be set up once on the Settings page. Each review costs around a penny, paid from your own AI account. Only the question and your answer are sent to be reviewed.",
      },
    ],
  },
  {
    id: "answer-library",
    title: "Answer Library",
    summary: "Your best answers, saved and ready to review.",
    blocks: [
      {
        bullets: [
          "Answers are saved from the review screen after an interview.",
          "They're grouped by type of question. Use the search box to find one.",
          "Click Edit to change an answer, then click Save Changes under the text box.",
          "Click Delete to remove one. This can't be undone.",
          "Print / Save PDF makes a copy you can study on paper.",
        ],
      },
      {
        heading: "Good to know",
        text: "Editing an answer here doesn't change past practice sessions. Your updated answer shows up the next time that question comes up, in the green \"saved answer\" box.",
      },
    ],
  },
  {
    id: "resume",
    title: "Resume Center",
    summary: "Practice questions about your own work history.",
    blocks: [
      {
        steps: [
          "Click Choose File and pick your resume (Word .docx or a text file). Or paste the text into the box.",
          "Check \"What we found\": your jobs, skills, certifications, awards and education.",
          "If something is wrong, fix it in the text box and click Read My Resume.",
          "Pick the number of questions and click Start Resume Interview.",
        ],
      },
      {
        heading: "Good to know",
        bullets: [
          "PDF files can't be read. Open the PDF, select all the text (Ctrl + A), copy it and paste it into the box.",
          "Your resume stays in this browser on this computer. Remove Resume clears it.",
        ],
      },
    ],
  },
  {
    id: "playbook",
    title: "Interview Playbook",
    summary: "A one-page cheat sheet for a real interview.",
    blocks: [
      {
        bullets: [
          "Fill in the interview details, notes about the company, your introduction and why you want the job.",
          "Use my saved answer fills in your introduction from the Answer Library.",
          "Check the saved answers you want on the sheet.",
          "Add questions to ask the interviewer: click a suggestion or write your own.",
          "Everything saves as you type.",
          "Print / Save PDF prints a clean, one-page sheet.",
          "Start a New Playbook clears it for your next interview. Your Answer Library isn't affected.",
        ],
      },
    ],
  },
  {
    id: "interview-day",
    title: "Interview Day",
    summary: "Everything for the big day in one place.",
    blocks: [
      {
        bullets: [
          "Shows your interview details from your Playbook.",
          "A checklist for the night before, what to bring, and the morning of. Your checks are remembered.",
          "A quick review of your introduction and questions to ask.",
          "A 3-question warm-up from your Answer Library: say your answer out loud, then check what you saved.",
          "Tips for in the room and after the interview.",
        ],
      },
    ],
  },
  {
    id: "progress",
    title: "Progress",
    summary: "Your practice history.",
    blocks: [
      {
        bullets: [
          "Every finished interview is listed with the date, job, level and how many questions you answered.",
          "Clear history removes the list. Your Answer Library isn't affected.",
        ],
      },
    ],
  },
  {
    id: "good-to-know",
    title: "Good to Know",
    summary: "Where your information is kept, and quick fixes.",
    blocks: [
      {
        bullets: [
          "Your answers, resume, Playbook and progress are saved in this browser, on this computer. They don't move to your other computers.",
          "Clearing your browser's history or data can erase them, so print anything important.",
          "If a page looks out of date, press Ctrl + F5 to refresh it.",
          "The small badge in the bottom-left corner is a developer notice. You can ignore it.",
        ],
      },
    ],
  },
];

// Which help topic fits the page you're on.
export function topicForPath(pathname: string): string {
  if (pathname.startsWith("/dashboard/interview-day")) return "interview-day";
  if (pathname === "/dashboard/interview") return "start-interview";
  if (pathname.startsWith("/dashboard/interview/")) return "practicing";
  if (pathname.startsWith("/dashboard/library")) return "answer-library";
  if (pathname.startsWith("/dashboard/playbook")) return "playbook";
  if (pathname.startsWith("/dashboard/resume")) return "resume";
  if (pathname.startsWith("/dashboard/progress")) return "progress";
  if (pathname.startsWith("/dashboard/settings")) return "ai-coach";
  return "getting-started";
}
