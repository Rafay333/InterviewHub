export type Difficulty = "easy" | "medium" | "hard";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/languages", label: "Languages" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
] as const;

export const trendingTopics = [
  { label: "React", href: "/languages/react" },
  { label: "System Design", href: "/categories/system-design" },
  { label: "JavaScript", href: "/languages/javascript" },
  { label: "Python", href: "/languages/python" },
] as const;

/** Home teaser cards — each links to /languages/[slug] (detail page) */
export const topLanguages = [
  {
    slug: "react",
    name: "React",
    description: "Hooks, rendering, and frontend interview patterns.",
    questionCount: 105,
    icon: "R",
  },
  {
    slug: "python",
    name: "Python",
    description: "Data structures, scripting, and backend fundamentals.",
    questionCount: 105,
    icon: "Py",
  },
  {
    slug: "javascript",
    name: "JavaScript",
    description: "Closures, async, and language core concepts.",
    questionCount: 105,
    icon: "JS",
  },
  {
    slug: "sql",
    name: "SQL",
    description: "Joins, indexing, and query optimization.",
    questionCount: 105,
    icon: "SQL",
  },
] as const;

export const focusCategories = [
  {
    slug: "system-design",
    name: "System Design",
    description: "Scalability, availability, and architecture trade-offs.",
    tone: "navy" as const,
  },
  {
    slug: "algorithms-ds",
    name: "Algorithms & DS",
    description: "Arrays, trees, graphs, and complexity analysis.",
    tone: "blue" as const,
  },
  {
    slug: "behavioral",
    name: "Behavioral & Soft Skills",
    description: "STAR answers, leadership, and communication.",
    tone: "soft" as const,
  },
] as const;

export const recentQuestions = [
  {
    slug: "distributed-rate-limiter",
    title: "Design a globally distributed rate limiter",
    difficulty: "hard" as Difficulty,
    tags: ["System Design", "Distributed Systems"],
    sharedAt: "4 mins ago",
  },
  {
    slug: "longest-palindromic-substring",
    title: "Find the longest palindromic substring",
    difficulty: "medium" as Difficulty,
    tags: ["Algorithms", "Strings"],
    sharedAt: "18 mins ago",
  },
  {
    slug: "usememo-vs-usecallback",
    title: "Explain the difference between useMemo and useCallback",
    difficulty: "easy" as Difficulty,
    tags: ["React", "Frontend"],
    sharedAt: "1 hour ago",
  },
] as const;

export const companyNames = [
  "Google",
  "Amazon",
  "Meta",
  "Microsoft",
  "Apple",
  "Netflix",
] as const;
