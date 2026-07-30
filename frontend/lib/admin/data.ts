export type Difficulty = "beginner" | "intermediate" | "expert";
export type PublishStatus = "draft" | "published";

export type AdminLanguage = {
  id: string;
  name: string;
  slug: string;
  seoHeading: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  icon: string;
  status: PublishStatus;
  beginner: number;
  intermediate: number;
  expert: number;
  updatedAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  seoHeading: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  icon: string;
  status: PublishStatus;
  beginner: number;
  intermediate: number;
  expert: number;
  updatedAt: string;
};

export type DataTable = {
  headers: string[];
  rows: string[][];
};

export type AdminQuestion = {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  difficulty: Difficulty;
  languageIds: string[];
  categoryIds: string[];
  status: PublishStatus;
  answer: string;
  /** Extra explanation / tips under the answer */
  description?: string;
  questionImage?: string | null;
  answerImage?: string | null;
  descriptionImage?: string | null;
  code?: string;
  codeLanguage?: string;
  sampleTable?: DataTable;
  resultTable?: DataTable;
  solutionExplanation?: string;
  tips?: string;
  commonMistakes?: string;
  updatedAt: string;
};

export type AdminBlog = {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  excerpt: string;
  body: string;
  authorName: string;
  authorTitle: string;
  readMinutes: number;
  featured: boolean;
  status: PublishStatus;
  publishedAt: string;
  commentPending: number;
};

export type MediaItem = {
  id: string;
  name: string;
  type: "image" | "pdf";
  sizeLabel: string;
  usedIn: string;
  uploadedAt: string;
};

export type PdfImportJob = {
  id: string;
  fileName: string;
  languageId: string;
  categoryId?: string;
  defaultDifficulty: Difficulty;
  status: "uploading" | "extracting" | "review" | "imported" | "failed";
  importedCount: number;
  createdAt: string;
  parsedQuestions?: {
    id: string;
    title: string;
    difficulty: Difficulty;
    answerPreview: string;
    include: boolean;
  }[];
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Admin";
  lastLogin: string;
  active: boolean;
};

export type ActivityItem = {
  id: string;
  action: string;
  target: string;
  actor: string;
  at: string;
};

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

export const adminLanguages: AdminLanguage[] = [
  {
    id: "lang-sql",
    name: "SQL",
    slug: "sql",
    seoHeading: "SQL Interview Questions",
    metaTitle: "SQL Interview Questions | InterviewHub",
    metaDescription: "Practice SQL interview questions with sample tables and solutions.",
    description: "Queries, joins, window functions, and indexes.",
    icon: "SQ",
    status: "published",
    beginner: 24,
    intermediate: 38,
    expert: 22,
    updatedAt: "2026-07-28",
  },
  {
    id: "lang-react",
    name: "React",
    slug: "react",
    seoHeading: "React Interview Questions",
    metaTitle: "React Interview Questions | InterviewHub",
    metaDescription: "Practice React interview questions for hooks, rendering, and state.",
    description: "Components, hooks, and performance.",
    icon: "R",
    status: "published",
    beginner: 20,
    intermediate: 35,
    expert: 50,
    updatedAt: "2026-07-27",
  },
  {
    id: "lang-python",
    name: "Python",
    slug: "python",
    seoHeading: "Python Interview Questions",
    metaTitle: "Python Interview Questions | InterviewHub",
    metaDescription: "Practice Python interview questions for coding rounds.",
    description: "Core Python, OOP, and scripting.",
    icon: "Py",
    status: "published",
    beginner: 28,
    intermediate: 40,
    expert: 30,
    updatedAt: "2026-07-26",
  },
  {
    id: "lang-nodejs",
    name: "Node.js",
    slug: "nodejs",
    seoHeading: "Node.js Interview Questions",
    metaTitle: "Node.js Interview Questions | InterviewHub",
    metaDescription: "Practice Node.js interview questions for backend roles.",
    description: "Event loop, APIs, and async patterns.",
    icon: "No",
    status: "draft",
    beginner: 12,
    intermediate: 18,
    expert: 10,
    updatedAt: "2026-07-25",
  },
];

export const adminCategories: AdminCategory[] = [
  {
    id: "cat-system-design",
    name: "System Design",
    slug: "system-design",
    seoHeading: "System Design Interview Questions",
    metaTitle: "System Design Interview Questions | InterviewHub",
    metaDescription: "Practice system design interview questions.",
    description: "Scalability and architecture trade-offs.",
    icon: "SD",
    status: "published",
    beginner: 18,
    intermediate: 34,
    expert: 34,
    updatedAt: "2026-07-28",
  },
  {
    id: "cat-dsa",
    name: "Algorithms & Data Structures",
    slug: "algorithms-ds",
    seoHeading: "Data Structures and Algorithms Interview Questions",
    metaTitle: "DSA Interview Questions | InterviewHub",
    metaDescription: "Practice DSA interview questions.",
    description: "Arrays, trees, graphs, and DP.",
    icon: "DS",
    status: "published",
    beginner: 40,
    intermediate: 62,
    expert: 40,
    updatedAt: "2026-07-27",
  },
  {
    id: "cat-behavioral",
    name: "Behavioral & Soft Skills",
    slug: "behavioral",
    seoHeading: "Behavioral Interview Questions",
    metaTitle: "Behavioral Interview Questions | InterviewHub",
    metaDescription: "Practice behavioral interview questions.",
    description: "STAR stories and communication.",
    icon: "BH",
    status: "published",
    beginner: 22,
    intermediate: 20,
    expert: 12,
    updatedAt: "2026-07-24",
  },
];

export const adminQuestions: AdminQuestion[] = [
  {
    id: "q-1",
    title: "Find employees who earn more than their manager",
    slug: "employees-earn-more-than-manager",
    metaTitle: "SQL: Employees Who Earn More Than Manager | InterviewHub",
    metaDescription: "Write a SQL query to find employees earning more than their manager.",
    difficulty: "intermediate",
    languageIds: ["lang-sql"],
    categoryIds: ["cat-dsa"],
    status: "published",
    answer:
      "Self-join the employees table so each row can compare salary against the manager row.",
    description: "Watch NULL manager_id for the CEO row. Carol earns more than Alice, so she appears in the result.",
    updatedAt: "2026-07-28",
  },
  {
    id: "q-2",
    title: "What is the difference between useMemo and useCallback?",
    slug: "usememo-vs-usecallback",
    metaTitle: "React useMemo vs useCallback Interview Question | InterviewHub",
    metaDescription: "Explain useMemo vs useCallback for React interviews.",
    difficulty: "beginner",
    languageIds: ["lang-react"],
    categoryIds: [],
    status: "published",
    answer:
      "useMemo memoizes a computed value. useCallback memoizes a function reference.",
    code: `const value = useMemo(() => expensive(a, b), [a, b]);
const onClick = useCallback(() => save(id), [id]);`,
    codeLanguage: "tsx",
    tips: "Only use when you have a measured re-render or dependency problem.",
    updatedAt: "2026-07-27",
  },
  {
    id: "q-3",
    title: "Design a URL shortener",
    slug: "design-url-shortener",
    metaTitle: "System Design: URL Shortener Interview Question | InterviewHub",
    metaDescription: "Walk through designing a URL shortener in a system design interview.",
    difficulty: "expert",
    languageIds: [],
    categoryIds: ["cat-system-design"],
    status: "draft",
    answer:
      "Cover API, encoding strategy, storage, caching, redirects, and scale estimates.",
    tips: "Start with requirements and traffic estimates before diving into storage.",
    updatedAt: "2026-07-26",
  },
  {
    id: "q-4",
    title: "Explain Python GIL and when it matters",
    slug: "python-gil",
    metaTitle: "Python GIL Interview Question | InterviewHub",
    metaDescription: "Explain the Global Interpreter Lock in Python interviews.",
    difficulty: "intermediate",
    languageIds: ["lang-python"],
    categoryIds: [],
    status: "published",
    answer:
      "The GIL allows only one thread to execute Python bytecode at a time in CPython.",
    updatedAt: "2026-07-25",
  },
];

export const adminBlogs: AdminBlog[] = [
  {
    id: "blog-1",
    title: "System Design Interview Guide: Monoliths to Microservices",
    slug: "system-design-monoliths-to-microservices",
    metaTitle: "System Design Interview Guide | InterviewHub",
    metaDescription: "Monoliths vs microservices for interviews.",
    category: "System Design",
    excerpt: "Architectural patterns for high-growth startups and senior interviews.",
    body: "Start with a monolith when team size and domain complexity are low...",
    authorName: "Alex Rivera",
    authorTitle: "Staff Engineer",
    readMinutes: 12,
    featured: true,
    status: "published",
    publishedAt: "2026-07-20",
    commentPending: 3,
  },
  {
    id: "blog-2",
    title: "STAR Method for Behavioral Interviews",
    slug: "star-method-behavioral-interviews",
    metaTitle: "STAR Method Interview Guide | InterviewHub",
    metaDescription: "Use STAR stories in behavioral interviews.",
    category: "Soft Skills",
    excerpt: "Structure impact stories interviewers can score.",
    body: "Situation, Task, Action, Result — keep each part concrete...",
    authorName: "Jordan Lee",
    authorTitle: "Engineering Manager",
    readMinutes: 8,
    featured: false,
    status: "published",
    publishedAt: "2026-07-18",
    commentPending: 1,
  },
  {
    id: "blog-3",
    title: "Redis Caching Patterns for Backend Interviews",
    slug: "redis-caching-patterns",
    metaTitle: "Redis Caching Interview Patterns | InterviewHub",
    metaDescription: "Cache-aside, write-through, and TTLs for interviews.",
    category: "Backend Engineering",
    excerpt: "Explain caching trade-offs clearly under pressure.",
    body: "Cache-aside is the most common pattern in interviews...",
    authorName: "Sam Okonkwo",
    authorTitle: "Backend Lead",
    readMinutes: 10,
    featured: false,
    status: "draft",
    publishedAt: "2026-07-15",
    commentPending: 0,
  },
];

export const mediaItems: MediaItem[] = [
  {
    id: "m-1",
    name: "sql-employees-sample.png",
    type: "image",
    sizeLabel: "186 KB",
    usedIn: "SQL question q-1",
    uploadedAt: "2026-07-28",
  },
  {
    id: "m-2",
    name: "sql-interview-pack.pdf",
    type: "pdf",
    sizeLabel: "2.4 MB",
    usedIn: "SQL PDF import",
    uploadedAt: "2026-07-27",
  },
  {
    id: "m-3",
    name: "react-hooks-diagram.png",
    type: "image",
    sizeLabel: "240 KB",
    usedIn: "React question q-2",
    uploadedAt: "2026-07-26",
  },
  {
    id: "m-4",
    name: "system-design-url-shortener.pdf",
    type: "pdf",
    sizeLabel: "1.1 MB",
    usedIn: "Unused",
    uploadedAt: "2026-07-24",
  },
];

export const pdfImports: PdfImportJob[] = [
  {
    id: "pdf-1",
    fileName: "sql-interview-pack.pdf",
    languageId: "lang-sql",
    defaultDifficulty: "intermediate",
    status: "imported",
    importedCount: 18,
    createdAt: "2026-07-27",
  },
  {
    id: "pdf-2",
    fileName: "react-hooks-qa.pdf",
    languageId: "lang-react",
    defaultDifficulty: "beginner",
    status: "review",
    importedCount: 0,
    createdAt: "2026-07-29",
    parsedQuestions: [
      {
        id: "pq-1",
        title: "What are React hooks?",
        difficulty: "beginner",
        answerPreview: "Hooks let you use state and other React features in function components...",
        include: true,
      },
      {
        id: "pq-2",
        title: "Explain useEffect cleanup",
        difficulty: "intermediate",
        answerPreview: "Return a function from useEffect to cancel subscriptions...",
        include: true,
      },
      {
        id: "pq-3",
        title: "Duplicate / low quality item",
        difficulty: "beginner",
        answerPreview: "Incomplete extracted text...",
        include: false,
      },
    ],
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "u-1",
    name: "Founder Admin",
    email: "admin@interviewhub.com",
    role: "Admin",
    lastLogin: "2026-07-29 09:12",
    active: true,
  },
  {
    id: "u-2",
    name: "Content Editor",
    email: "editor@interviewhub.com",
    role: "Admin",
    lastLogin: "2026-07-28 16:40",
    active: true,
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "a-1",
    action: "Published question",
    target: "Employees who earn more than manager",
    actor: "Founder Admin",
    at: "2h ago",
  },
  {
    id: "a-2",
    action: "Imported PDF",
    target: "sql-interview-pack.pdf (18 questions)",
    actor: "Content Editor",
    at: "1d ago",
  },
  {
    id: "a-3",
    action: "Updated language",
    target: "React SEO heading",
    actor: "Founder Admin",
    at: "2d ago",
  },
  {
    id: "a-4",
    action: "Drafted blog",
    target: "Redis Caching Patterns",
    actor: "Content Editor",
    at: "3d ago",
  },
];

export const insightStats = {
  traffic: {
    last24h: 1842,
    last7d: 12640,
    last30d: 48210,
    last12m: 512300,
  },
  trafficSeries: {
    "24h": [42, 55, 60, 48, 70, 88, 92, 80, 75, 95, 110, 102],
    "7d": [1400, 1620, 1580, 1900, 2100, 1980, 2060],
    "30d": [1200, 1300, 1450, 1600, 1550, 1700, 1800, 1750, 1900, 2000, 2100, 1950],
    "12m": [28000, 31000, 34000, 36000, 39000, 42000, 45000, 47000, 49000, 50000, 52000, 51200],
  },
  topPages: [
    { path: "/languages/sql", views: 4200 },
    { path: "/categories/system-design", views: 3800 },
    { path: "/languages/react", views: 3500 },
    { path: "/blog/star-method-behavioral-interviews", views: 2100 },
  ],
  adsense: {
    connected: false,
    today: 12.4,
    last7d: 86.2,
    last30d: 312.5,
    ytd: 1840.0,
    rpm: 4.2,
    ctr: 1.8,
    topEarning: [
      { path: "/languages/sql", earnings: 48.2 },
      { path: "/categories/system-design", earnings: 41.5 },
      { path: "/languages/react", earnings: 36.1 },
    ],
  },
  content: {
    languages: adminLanguages.length,
    categories: adminCategories.length,
    questions: adminQuestions.length,
    blogs: adminBlogs.length,
    publishedQuestions: adminQuestions.filter((q) => q.status === "published").length,
    draftQuestions: adminQuestions.filter((q) => q.status === "draft").length,
    byDifficulty: {
      beginner: adminQuestions.filter((q) => q.difficulty === "beginner").length,
      intermediate: adminQuestions.filter((q) => q.difficulty === "intermediate").length,
      expert: adminQuestions.filter((q) => q.difficulty === "expert").length,
    },
  },
};

export const defaultSettings = {
  siteName: "InterviewHub",
  metaSuffix: "| InterviewHub",
  difficultyLabels: ["Beginner", "Intermediate", "Expert"] as const,
  ga4Connected: false,
  adsenseConnected: false,
  adsensePublisherId: "",
};

export function languageName(id: string) {
  return adminLanguages.find((l) => l.id === id)?.name ?? "—";
}

export function categoryName(id: string) {
  return adminCategories.find((c) => c.id === id)?.name ?? "—";
}

export function totalQuestions(lang: Pick<AdminLanguage, "beginner" | "intermediate" | "expert">) {
  return lang.beginner + lang.intermediate + lang.expert;
}
