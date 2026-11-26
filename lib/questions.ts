// Built-in question bank and interview generator.
// No API key or internet needed. Later this can be swapped for AI-generated questions.

export type Level = "Entry Level" | "Mid Level" | "Senior Level";
export type InterviewType = "Behavioral" | "Technical" | "Mixed";

export const LEVELS: Level[] = ["Entry Level", "Mid Level", "Senior Level"];
export const INTERVIEW_TYPES: InterviewType[] = ["Behavioral", "Technical", "Mixed"];
export const QUESTION_COUNTS = [5, 10, 15, 20];

export interface Question {
  id: string;
  text: string;
  category: string;
  tip: string;
}

export interface InterviewSettings {
  jobTitle: string;
  company: string;
  level: Level;
  type: InterviewType;
  count: number;
}

interface BankItem {
  text: string;
  category: string;
  tip: string;
  // Which levels this question suits. Leave out for "all levels".
  levels?: Level[];
}

const STAR_TIP =
  "Use the STAR method: Situation, Task, Action, Result. Keep it to about 2 minutes and finish with what you learned.";

// ---------- Behavioral ----------

const BEHAVIORAL: BankItem[] = [
  { text: "Tell me about a time you worked on a team to reach a goal. What was your role?", category: "Teamwork", tip: STAR_TIP },
  { text: "Describe a time you disagreed with a coworker. How did you handle it?", category: "Handling Disagreements", tip: "Show that you listened, stayed respectful, and focused on the shared goal rather than on winning." },
  { text: "Tell me about a mistake you made at work and what you did about it.", category: "Accountability", tip: "Own the mistake plainly, spend most of the answer on how you fixed it and what you changed afterward." },
  { text: "Describe a time you had to learn something new quickly.", category: "Adaptability", tip: "Name the specific steps you took to learn it and how fast you became useful." },
  { text: "Tell me about a time you had several deadlines at once. How did you prioritize?", category: "Time Management", tip: "Explain your method (urgency vs. importance, checking with your manager) and the outcome." },
  { text: "Give an example of a time you went above and beyond what was expected.", category: "Initiative", tip: STAR_TIP },
  { text: "Describe a time you received critical feedback. How did you respond?", category: "Growth", tip: "Show that you took it seriously, made a change, and can point to the improvement." },
  { text: "Tell me about a time you solved a difficult problem.", category: "Problem Solving", tip: "Walk through how you broke the problem down, the options you considered, and why you chose your approach." },
  { text: "Describe a situation where you had to explain something complicated to someone without your background.", category: "Communication", tip: "Mention how you checked their understanding, such as analogies, visuals, or asking them to repeat it back." },
  { text: "Tell me about a time things did not go as planned. How did you adapt?", category: "Adaptability", tip: STAR_TIP },
  { text: "Describe a time you dealt with a difficult customer or client.", category: "Customer Focus", tip: "Stay calm in the story, show empathy, and end with how the relationship or issue was resolved." },
  { text: "What accomplishment are you most proud of, and why?", category: "Motivation", tip: "Pick something relevant to this job and explain the impact, not just the task." },
  { text: "Tell me about a time you had to work with very little direction.", category: "Independence", tip: "Show how you clarified goals on your own and kept others informed." },
  { text: "Describe a time you helped a teammate who was struggling.", category: "Teamwork", tip: STAR_TIP },
  { text: "What is your greatest weakness, and what are you doing about it?", category: "Self-Awareness", tip: "Choose a real but manageable weakness and spend most of the answer on how you are improving it." },
  { text: "Tell me about a goal you set and how you achieved it.", category: "Drive", tip: "Make the goal measurable and show the steps you took to track progress." },
  { text: "Describe a time you had to make a decision without all the information you wanted.", category: "Judgment", tip: "Explain how you weighed the risk, what you did to reduce it, and what happened.", levels: ["Mid Level", "Senior Level"] },
  { text: "Tell me about a time you led a project or initiative.", category: "Leadership", tip: "Focus on how you set direction, kept people aligned, and handled obstacles.", levels: ["Mid Level", "Senior Level"] },
  { text: "Describe a time you mentored or coached someone.", category: "Leadership", tip: "Show what you did specifically and how the other person grew.", levels: ["Mid Level", "Senior Level"] },
  { text: "Tell me about a time you had to push back on a manager or stakeholder.", category: "Influence", tip: "Show that you used data and respect, and that you committed once a decision was made.", levels: ["Mid Level", "Senior Level"] },
  { text: "Describe a time you had to deliver bad news to a team or leadership.", category: "Leadership", tip: "Show honesty, timing, and that you came with a plan, not just the problem.", levels: ["Senior Level"] },
  { text: "Tell me about a time you changed how your team or organization worked.", category: "Strategy", tip: "Describe the problem, how you got buy-in, and the measurable result.", levels: ["Senior Level"] },
  { text: "How have you handled an underperforming team member?", category: "Leadership", tip: "Show fairness: clear expectations, support, documentation, and follow-through.", levels: ["Senior Level"] },
  { text: "Tell me about a school, volunteer, or personal project you are proud of.", category: "Experience", tip: "Treat it like work experience: your role, the challenge, and the result.", levels: ["Entry Level"] },
  { text: "How do you handle stress or pressure?", category: "Resilience", tip: "Give a concrete example and the habits that help you stay steady." },
];

// ---------- Technical, by job family ----------

type Family =
  | "software"
  | "web"
  | "data"
  | "it"
  | "management"
  | "design"
  | "law"
  | "healthcare"
  | "education"
  | "trades"
  | "logistics"
  | "customer"
  | "office"
  | "general";

const TECHNICAL: Record<Family, BankItem[]> = {
  software: [
    { text: "Explain the difference between an array and a linked list. When would you use each?", category: "Data Structures", tip: "Cover access speed, insertion and deletion cost, and memory use, then give a real example." },
    { text: "What is Big-O notation? Give an example of an O(n) and an O(log n) operation.", category: "Algorithms", tip: "Define it simply, then use examples like looping a list (O(n)) and binary search (O(log n))." },
    { text: "How would you find and fix a bug that only happens sometimes?", category: "Debugging", tip: "Talk about reproducing it, adding logging, narrowing down the cause, and writing a test so it stays fixed." },
    { text: "What is version control, and how do you use Git day to day?", category: "Tools", tip: "Mention branches, commits, pull requests, and resolving merge conflicts." },
    { text: "Explain what an API is and how a client talks to a server.", category: "Fundamentals", tip: "Describe requests and responses, HTTP methods like GET and POST, and status codes." },
    { text: "What is the difference between a process and a thread?", category: "Fundamentals", tip: "Processes have separate memory; threads share memory inside a process. Mention why that matters for bugs." },
    { text: "How do you write code that is easy for others to read and maintain?", category: "Code Quality", tip: "Naming, small functions, comments that explain why, tests, and code reviews." },
    { text: "What kinds of tests do you write, and why?", category: "Testing", tip: "Unit, integration, and end-to-end tests, plus what each catches." },
    { text: "Walk me through how you would design a URL shortener like bit.ly.", category: "System Design", tip: "Cover the data model, generating short codes, handling lots of traffic, and caching.", levels: ["Mid Level", "Senior Level"] },
    { text: "How would you make a slow database query faster?", category: "Performance", tip: "Measure first, then indexes, query rewriting, caching, and checking the query plan.", levels: ["Mid Level", "Senior Level"] },
    { text: "How do you decide between building something yourself and using an existing library or service?", category: "Architecture", tip: "Weigh cost, maintenance, security, team skills, and how core it is to the product.", levels: ["Senior Level"] },
    { text: "How would you design a system that has to handle millions of users?", category: "System Design", tip: "Load balancing, horizontal scaling, caching, database replication, and monitoring.", levels: ["Senior Level"] },
  ],
  web: [
    { text: "Explain the difference between HTML, CSS, and JavaScript.", category: "Fundamentals", tip: "Structure, style, and behavior. Give a quick example of each." },
    { text: "What happens when you type a website address into a browser and press Enter?", category: "Fundamentals", tip: "DNS lookup, connection, HTTP request, server response, then the browser rendering the page." },
    { text: "What is the difference between state and props in React?", category: "React", tip: "Props come from the parent and are read-only; state belongs to the component and can change." },
    { text: "How do you make a website work well on phones and desktops?", category: "Responsive Design", tip: "Mention flexible layouts, media queries, and testing on real devices." },
    { text: "What does it mean for a website to be accessible? Give some examples.", category: "Accessibility", tip: "Alt text, keyboard navigation, color contrast, labels on form fields, and screen readers." },
    { text: "How would you make a slow web page load faster?", category: "Performance", tip: "Image sizes, caching, lazy loading, smaller JavaScript bundles, and measuring with browser tools." },
    { text: "What is the difference between server-side and client-side rendering?", category: "Architecture", tip: "Explain where the HTML is built and the trade-offs for speed and search engines.", levels: ["Mid Level", "Senior Level"] },
    { text: "How do you keep a web app secure from common attacks?", category: "Security", tip: "Mention cross-site scripting, input validation, HTTPS, and safe handling of passwords and tokens.", levels: ["Mid Level", "Senior Level"] },
  ],
  data: [
    { text: "What is the difference between an inner join and a left join in SQL?", category: "SQL", tip: "Inner keeps only matching rows; left keeps every row from the left table. Draw it out if you can." },
    { text: "How do you handle missing or messy data?", category: "Data Cleaning", tip: "Find out why it is missing, then choose to remove, fill in, or flag it, and explain the trade-off." },
    { text: "Explain the difference between mean, median, and mode. When is median better?", category: "Statistics", tip: "Median is better when outliers would skew the average, like with salaries or house prices." },
    { text: "Walk me through how you would build a dashboard for a manager.", category: "Reporting", tip: "Start with the decisions they need to make, choose a few key numbers, then pick clear charts." },
    { text: "What is the difference between correlation and causation?", category: "Statistics", tip: "Give a simple example of two things that move together without one causing the other." },
    { text: "Which tools do you use for data analysis, and why?", category: "Tools", tip: "Name the tools (Excel, SQL, Python, Power BI, Tableau) and what you use each one for." },
    { text: "How would you check whether an A/B test result is real or just luck?", category: "Experiments", tip: "Mention sample size, statistical significance, and running the test long enough.", levels: ["Mid Level", "Senior Level"] },
    { text: "How would you design a data pipeline that runs every night?", category: "Data Engineering", tip: "Extract, transform, load, plus scheduling, error alerts, and data quality checks.", levels: ["Senior Level"] },
  ],
  it: [
    { text: "A user says their computer is running slowly. How do you troubleshoot it?", category: "Troubleshooting", tip: "Ask questions first, then check startup programs, disk space, memory, updates, and malware." },
    { text: "What is the difference between a router and a switch?", category: "Networking", tip: "A switch connects devices within a network; a router connects different networks." },
    { text: "What is DNS, and what happens when it stops working?", category: "Networking", tip: "DNS turns names into IP addresses. When it fails, sites will not load by name." },
    { text: "How do you explain a technical fix to a frustrated, non-technical user?", category: "Customer Service", tip: "Plain language, patience, and confirming the problem is solved before you close the ticket." },
    { text: "How do you prioritize several support tickets at once?", category: "Prioritization", tip: "Business impact, number of users affected, and urgency, while keeping everyone updated." },
    { text: "What steps would you take if you suspected a computer had a virus?", category: "Security", tip: "Disconnect it from the network, scan, remove, find the cause, and report it per policy." },
    { text: "Explain what Active Directory or user account management involves.", category: "Systems", tip: "Creating users, groups, permissions, password resets, and removing access when people leave.", levels: ["Mid Level", "Senior Level"] },
    { text: "How would you plan a backup and recovery strategy for a small office?", category: "Systems", tip: "The 3-2-1 rule, automatic backups, and regularly testing restores.", levels: ["Mid Level", "Senior Level"] },
  ],
  management: [
    { text: "How do you decide what to work on first when everything seems important?", category: "Prioritization", tip: "Name a framework (impact vs. effort, MoSCoW) and give a real example." },
    { text: "How do you keep a project on schedule?", category: "Planning", tip: "Milestones, regular check-ins, tracking risks early, and clear owners for each task." },
    { text: "Tell me how you would handle a project that is falling behind.", category: "Risk", tip: "Find the cause, re-plan scope or resources, and communicate early with stakeholders." },
    { text: "How do you gather requirements from stakeholders?", category: "Requirements", tip: "Interviews, observing users, writing them down, and confirming you understood correctly." },
    { text: "What tools do you use to manage projects?", category: "Tools", tip: "Name tools like Jira, Trello, or Asana and how you use them to keep things visible." },
    { text: "How do you measure whether a project or product was successful?", category: "Metrics", tip: "Define success before you start, choose a few measurable goals, and review them afterward.", levels: ["Mid Level", "Senior Level"] },
    { text: "How do you manage stakeholders who want different things?", category: "Stakeholders", tip: "Find the shared goal, use data, and make trade-offs visible so decisions are clear.", levels: ["Mid Level", "Senior Level"] },
  ],
  design: [
    { text: "Walk me through your design process from start to finish.", category: "Process", tip: "Research, sketching, prototyping, testing with users, and improving based on feedback." },
    { text: "How do you handle feedback on your designs that you disagree with?", category: "Collaboration", tip: "Ask what problem they are trying to solve, then test options with users if you can." },
    { text: "How do you make sure a design is accessible?", category: "Accessibility", tip: "Color contrast, readable text sizes, keyboard use, and screen reader support." },
    { text: "Tell me about a design decision you made based on user research.", category: "Research", tip: STAR_TIP },
    { text: "How do you work with developers to make sure your design is built correctly?", category: "Collaboration", tip: "Clear specs, a shared design system, early check-ins, and reviewing the build." },
    { text: "How do you measure whether a design is working?", category: "Metrics", tip: "Usability tests, task success rates, analytics, and user feedback.", levels: ["Mid Level", "Senior Level"] },
  ],
  law: [
    { text: "Why do you want a career in law enforcement or public safety?", category: "Motivation", tip: "Be sincere and specific. Connect it to service, a real experience, or values like fairness and protecting people." },
    { text: "How would you calm down a situation where someone is angry and yelling?", category: "De-escalation", tip: "Talk about keeping a safe distance, a calm voice, listening, giving simple choices, and calling for backup if needed." },
    { text: "What would you do if you saw a fellow officer or coworker break the rules?", category: "Integrity", tip: "Interviewers want to hear that you would report it through the chain of command. Integrity comes first." },
    { text: "Why is accurate report writing so important?", category: "Reports", tip: "Reports are used in court, by supervisors, and by other agencies. Mention facts, timelines, clear wording, and no opinions." },
    { text: "How do you stay alert and observant during a long, quiet shift?", category: "Awareness", tip: "Give practical habits: changing routes, noting details, staying fit and rested, and avoiding distractions." },
    { text: "How do you treat people fairly when they are from a very different background than you?", category: "Fairness", tip: "Talk about respect, listening, treating everyone by the same standard, and an example from your own life." },
    { text: "Describe how you would handle a situation where you had to make a split-second decision.", category: "Judgment", tip: "Show that you rely on training, policy, and safety for everyone, then explain how you would review it afterward." },
    { text: "How do you deal with the stress and things you might see in this job?", category: "Resilience", tip: "Name healthy habits: exercise, family, faith, peer support, and being willing to use counseling programs." },
    { text: "How would you train and support a new officer or team member?", category: "Leadership", tip: "Lead by example, explain the why behind policies, give honest feedback, and check in regularly.", levels: ["Mid Level", "Senior Level"] },
    { text: "How would you build trust between your department and the community?", category: "Community", tip: "Community events, being visible and approachable, following up, and being transparent when things go wrong.", levels: ["Senior Level"] },
  ],
  healthcare: [
    { text: "Why did you choose a career in healthcare?", category: "Motivation", tip: "Share a real reason, ideally a moment that showed you why patient care matters to you." },
    { text: "How would you handle a patient who is upset, scared, or refusing care?", category: "Patient Care", tip: "Listen, stay calm, explain clearly, respect their rights, and involve the nurse or doctor when needed." },
    { text: "How do you protect patient privacy?", category: "Privacy", tip: "Mention HIPAA, not discussing patients in public areas, locking screens, and sharing information only with people who need it." },
    { text: "What would you do if you noticed a coworker made a mistake with a patient?", category: "Safety", tip: "Patient safety first: speak up right away, report it through the proper process, and avoid blaming." },
    { text: "How do you prioritize when several patients need you at the same time?", category: "Prioritization", tip: "Urgent and life-threatening needs first, then by condition. Mention communicating with the team and asking for help." },
    { text: "How do you prevent the spread of infection at work?", category: "Infection Control", tip: "Hand hygiene, proper protective equipment, cleaning, and following isolation procedures." },
    { text: "How do you communicate with a patient's family members?", category: "Communication", tip: "Be compassionate and honest, use plain language, and stay within what you are allowed to share." },
    { text: "How do you take care of yourself to avoid burnout?", category: "Resilience", tip: "Give real habits and show you know when to ask for support." },
    { text: "Tell me about a time you had to adjust a care plan because something changed.", category: "Clinical Judgment", tip: STAR_TIP, levels: ["Mid Level", "Senior Level"] },
    { text: "How would you handle staffing shortages on your unit?", category: "Leadership", tip: "Prioritize safety, reassign based on skills, escalate early, and support your team through it.", levels: ["Senior Level"] },
  ],
  education: [
    { text: "Why do you want to work in education?", category: "Motivation", tip: "Talk about a teacher or student who made a difference and what you want to give back." },
    { text: "How do you handle a disruptive student?", category: "Classroom Management", tip: "Clear expectations, calm redirection, understanding the cause, and involving parents or staff when needed." },
    { text: "How do you teach students who learn at different speeds or in different ways?", category: "Differentiation", tip: "Give examples: small groups, visuals, hands-on activities, and extra challenge for students who finish early." },
    { text: "How do you know whether students are actually learning?", category: "Assessment", tip: "Quick checks during the lesson, exit tickets, quizzes, and adjusting your teaching based on the results." },
    { text: "How do you build good relationships with parents?", category: "Communication", tip: "Regular positive contact, not just bad news, clear updates, and treating parents as partners." },
    { text: "How do you use technology in the classroom?", category: "Technology", tip: "Name specific tools and explain how they help learning, not just how they keep students busy." },
    { text: "How do you support a student who is struggling at home?", category: "Student Support", tip: "Be caring, follow school policy, and involve counselors or support staff." },
    { text: "How would you help a struggling new teacher?", category: "Leadership", tip: "Observe, share resources, co-plan lessons, and give encouraging, specific feedback.", levels: ["Mid Level", "Senior Level"] },
    { text: "How would you improve test scores or outcomes across a whole grade or school?", category: "Strategy", tip: "Use data to find gaps, set clear goals, support teachers with training, and track progress.", levels: ["Senior Level"] },
  ],
  trades: [
    { text: "What safety steps do you take before starting a job?", category: "Safety", tip: "Mention PPE, inspecting tools, lockout/tagout, checking the work area, and following OSHA rules." },
    { text: "Walk me through how you troubleshoot something that is not working.", category: "Troubleshooting", tip: "Start with the simple stuff, test step by step, use the right meters or tools, and verify the fix." },
    { text: "What tools and equipment are you most experienced with?", category: "Tools", tip: "Be specific and honest. Mention any certifications or licenses you hold." },
    { text: "How do you read and work from blueprints, schematics, or work orders?", category: "Technical Skills", tip: "Explain what you look for first and give an example of a job you completed from them." },
    { text: "Tell me about a time you found a problem on a job that someone else missed.", category: "Attention to Detail", tip: STAR_TIP },
    { text: "How do you make sure your work passes inspection the first time?", category: "Quality", tip: "Knowing the code, checking your own work, taking photos, and not cutting corners." },
    { text: "How do you handle a customer who is unhappy with the work or the price?", category: "Customer Service", tip: "Listen, explain clearly, stay professional, and involve your supervisor if needed." },
    { text: "What would you do if you were asked to do something you believed was unsafe?", category: "Safety", tip: "Stop, explain the concern, and talk to your supervisor. Safety is never optional." },
    { text: "How do you train an apprentice or a new helper?", category: "Leadership", tip: "Show, then watch them do it, then give feedback. Safety habits come first.", levels: ["Mid Level", "Senior Level"] },
    { text: "How do you estimate time and materials for a job?", category: "Planning", tip: "Review the scope, use past jobs as a guide, add a buffer, and update the customer if things change.", levels: ["Mid Level", "Senior Level"] },
  ],
  logistics: [
    { text: "What safety rules do you follow in a warehouse or on the road?", category: "Safety", tip: "Mention PPE, safe lifting, equipment checks, following speed limits, and reporting hazards." },
    { text: "How do you make sure orders or deliveries are accurate?", category: "Accuracy", tip: "Double-checking labels and counts, scanning, and fixing mistakes right away." },
    { text: "How do you keep up when the workload is heavy or the schedule is tight?", category: "Productivity", tip: "Staying organized, planning your route or pick order, and staying safe instead of rushing." },
    { text: "What equipment are you certified or experienced with?", category: "Equipment", tip: "Name forklifts, pallet jacks, scanners, or your CDL class, and how long you have used them." },
    { text: "What would you do if a shipment arrived damaged or the count was wrong?", category: "Problem Solving", tip: "Document it, take photos, report it, and follow the company process." },
    { text: "How do you handle a customer who is upset about a late delivery?", category: "Customer Service", tip: "Apologize, explain what you know, offer what you can, and stay professional." },
    { text: "Describe your inspection routine before using a vehicle or equipment.", category: "Inspection", tip: "Walk through it step by step: tires, brakes, lights, fluids, and logging any issues." },
    { text: "How would you improve the flow of a warehouse or shipping area?", category: "Process Improvement", tip: "Look for wasted steps, organize by how often items are used, and measure the result.", levels: ["Mid Level", "Senior Level"] },
    { text: "How do you keep a team on track to meet daily shipping goals?", category: "Leadership", tip: "Clear targets, regular check-ins, moving people where needed, and recognizing good work.", levels: ["Senior Level"] },
  ],
  customer: [
    { text: "What does great customer service mean to you?", category: "Service", tip: "Give a short definition and an example of a time you delivered it." },
    { text: "How would you handle an angry customer?", category: "Difficult Customers", tip: "Listen without interrupting, apologize for the experience, solve what you can, and get a manager if needed." },
    { text: "What would you do if a customer asked for something against store policy?", category: "Policy", tip: "Explain the policy kindly, offer alternatives, and involve a manager if appropriate." },
    { text: "How do you stay friendly and positive during a long, busy shift?", category: "Attitude", tip: "Give real habits and show that you understand each customer is new to you, even if you are tired." },
    { text: "How would you sell or recommend a product to a customer who is unsure?", category: "Sales", tip: "Ask questions to learn what they need, then match a product to it. Never pressure them." },
    { text: "How do you handle cash and make sure your drawer balances?", category: "Accuracy", tip: "Count carefully, follow procedures, and report any problems right away." },
    { text: "What would you do if you saw a coworker being rude to a customer?", category: "Teamwork", tip: "Step in to help the customer, then talk with the coworker or a manager privately." },
    { text: "How do you handle several customers who need help at the same time?", category: "Multitasking", tip: "Acknowledge everyone, help them in order, and call for backup when needed." },
    { text: "How would you motivate a team to hit sales or service goals?", category: "Leadership", tip: "Clear goals, friendly competition, coaching, and recognizing wins.", levels: ["Mid Level", "Senior Level"] },
    { text: "How would you improve customer satisfaction at a location with poor reviews?", category: "Strategy", tip: "Read the feedback, find patterns, train staff, fix the top issues, and track results.", levels: ["Senior Level"] },
  ],
  office: [
    { text: "How do you keep yourself organized when juggling many tasks?", category: "Organization", tip: "Name your system: calendar, to-do lists, folders, and how you prioritize." },
    { text: "Which office software are you comfortable with?", category: "Tools", tip: "Be specific: Word, Excel, Outlook, scheduling systems, QuickBooks, and what you have done with each." },
    { text: "How do you handle confidential information?", category: "Confidentiality", tip: "Share only with people who need it, lock screens and files, and follow company policy." },
    { text: "How would you handle a phone call or visitor who is upset?", category: "Customer Service", tip: "Stay calm, listen, write down the details, and connect them with the right person." },
    { text: "Tell me about a time you caught an error before it caused a problem.", category: "Attention to Detail", tip: STAR_TIP },
    { text: "How do you manage scheduling for several people at once?", category: "Scheduling", tip: "Shared calendars, confirming ahead of time, and planning for conflicts." },
    { text: "How do you prioritize when two managers give you urgent work at the same time?", category: "Prioritization", tip: "Ask about deadlines, be open with both, and let them decide if there is a real conflict." },
    { text: "Describe a process or filing system you set up or improved.", category: "Process Improvement", tip: "Explain the before and after and how it saved time or reduced mistakes.", levels: ["Mid Level", "Senior Level"] },
    { text: "How would you manage an office budget or vendor contracts?", category: "Operations", tip: "Track spending, compare vendors, negotiate, and review contracts regularly.", levels: ["Senior Level"] },
  ],
  general: [
    { text: "What tools or software are you most comfortable using in this kind of work?", category: "Tools", tip: "Name specific tools and give a quick example of something you did with each." },
    { text: "Walk me through how you would solve a problem you had never seen before.", category: "Problem Solving", tip: "Define the problem, research, try a small step, check the result, and adjust." },
    { text: "How do you stay current with changes in your field?", category: "Learning", tip: "Name real sources, such as courses, newsletters, communities, or projects." },
    { text: "Describe a process you improved to save time or reduce mistakes.", category: "Process Improvement", tip: "Give before-and-after numbers if you can." },
    { text: "How do you check your own work for accuracy?", category: "Quality", tip: "Checklists, testing, a second review, and comparing results to what you expected." },
    { text: "What would your first 30 days in this role look like?", category: "Planning", tip: "Learn the people and systems first, find quick wins, then make a plan for bigger improvements." },
  ],
};

function familyFor(jobTitle: string): Family {
  const t = jobTitle.toLowerCase();
  // Order matters: the first match wins.
  const rules: [Family, RegExp][] = [
    ["it", /(cyber|security analyst|security engineer|information security)/],
    ["law", /(police|law enforcement|sheriff|deputy|trooper|correction|detective|security (guard|officer)|\bguard\b|dispatch|probation|parole|patrol|public safety|federal agent|border)/],
    ["healthcare", /(nurse|nursing|\brn\b|\blpn\b|\bcna\b|medical|health|patient|caregiver|\bemt\b|paramedic|pharmac|dental|therapist|physician|clinic|hospital|phlebotom|home care)/],
    ["education", /(teach|tutor|instructor|professor|school|education|paraprofessional|principal|daycare|child ?care)/],
    ["trades", /(electrician|plumb|hvac|mechanic|weld|carpent|maintenance|construction|machinist|millwright|lineman|installer|apprentice|roofer|painter|automotive|diesel|technician.*(hvac|auto))/],
    ["logistics", /(warehouse|forklift|driver|\bcdl\b|truck|delivery|logistics|shipping|receiving|supply chain|material handler|picker|packer|dock)/],
    ["customer", /(retail|cashier|sales|customer|call center|waiter|waitress|server|bartender|barista|host|hospitality|hotel|restaurant|store|teller|cook|chef|food)/],
    ["web", /(front.?end|web|react|ui developer|javascript)/],
    ["it", /(\bit\b|help ?desk|desktop support|tech support|technical support|computer|network|(system|sys|network) ?admin)/],
    ["office", /(admin|assistant|receptionist|secretary|clerk|office|bookkeep|accounting|accountant|payroll|human resources|\bhr\b|recruit|billing|data entry)/],
    ["data", /(data|analyst|analytics|scientist|\bbi\b|sql)/],
    ["design", /(\bux\b|\bui\b|designer|design)/],
    ["management", /(manager|product|project|scrum|program|supervisor)/],
    ["software", /(software|developer|engineer|programmer|coder|back.?end|full.?stack)/],
  ];
  for (const [family, pattern] of rules) {
    if (pattern.test(t)) return family;
  }
  return "general";
}

// ---------- Role and company questions ----------

function roleQuestions(jobTitle: string, company: string): BankItem[] {
  const role = jobTitle.trim();
  const items: BankItem[] = [
    {
      text: role ? `Why are you interested in the ${role} position?` : "Why are you interested in this position?",
      category: "Motivation",
      tip: "Connect your skills and past experience to what the job actually involves.",
    },
    {
      text: role ? `What makes you a strong fit for the ${role} role?` : "What makes you a strong fit for this role?",
      category: "Fit",
      tip: "Pick your top two or three strengths and back each one with a short example.",
    },
    { text: "Where do you see yourself in three to five years?", category: "Goals", tip: "Show ambition that fits with growing in this role, not leaving it right away." },
  ];
  if (company.trim()) {
    const c = company.trim();
    items.push(
      { text: `Why do you want to work at ${c}?`, category: "Company", tip: `Mention something specific about ${c}: a product, its mission, or recent news, and why it matters to you.` },
      { text: `What do you know about ${c} and what it does?`, category: "Company", tip: `Research ${c}'s website, recent news, and its competitors before the interview.` },
    );
  }
  return items;
}

// ---------- Generator ----------

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function forLevel(items: BankItem[], level: Level): BankItem[] {
  return items.filter((q) => !q.levels || q.levels.includes(level));
}

const OPENER: BankItem = {
  text: "Tell me about yourself.",
  category: "Introduction",
  tip: "Keep it to about 90 seconds: who you are now, what you have done that fits this job, and why you are here today.",
};

// Call this from a button click, never while the page is rendering (it uses Math.random).
export function generateInterview(s: InterviewSettings): Question[] {
  const behavioral = shuffle(forLevel(BEHAVIORAL, s.level));
  const family = familyFor(s.jobTitle);
  const technical = shuffle([
    ...forLevel(TECHNICAL[family], s.level),
    ...(family === "general" ? [] : shuffle(forLevel(TECHNICAL.general, s.level)).slice(0, 2)),
  ]);
  const role = shuffle(roleQuestions(s.jobTitle, s.company));

  const picked: BankItem[] = [];
  if (s.type !== "Technical") picked.push(OPENER);

  // How many role/company questions to include.
  const roleCount = Math.min(role.length, Math.max(1, Math.round(s.count / 5)));
  picked.push(...role.slice(0, roleCount));

  const remaining = s.count - picked.length;
  let pool: BankItem[];
  if (s.type === "Behavioral") {
    pool = [...behavioral, ...technical];
  } else if (s.type === "Technical") {
    pool = [...technical, ...behavioral];
  } else {
    // Mixed: alternate behavioral and technical.
    pool = [];
    const max = Math.max(behavioral.length, technical.length);
    for (let i = 0; i < max; i++) {
      if (behavioral[i]) pool.push(behavioral[i]);
      if (technical[i]) pool.push(technical[i]);
    }
  }
  picked.push(...pool.slice(0, remaining));

  return picked.slice(0, s.count).map((q, i) => ({
    id: `q${i + 1}`,
    text: q.text,
    category: q.category,
    tip: q.tip,
  }));
}
