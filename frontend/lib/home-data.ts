export type Difficulty = "beginner" | "intermediate" | "expert" | "easy" | "medium" | "hard";

export const navLinks = [
  { href: "/languages", label: "Languages" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

export const popularLanguages = [
  { label: "JavaScript", href: "/languages?q=JavaScript" },
  { label: "TypeScript", href: "/languages?q=TypeScript" },
  { label: "Python", href: "/languages?q=Python" },
  { label: "Java", href: "/languages?q=Java" },
  { label: "SQL", href: "/languages?q=SQL" },
  { label: "React", href: "/languages?q=React" },
  { label: "C#", href: "/languages?q=C%23" },
  { label: "Node.js", href: "/languages?q=Node" },
  { label: "C++", href: "/languages?q=C%2B%2B" },
  { label: "Go", href: "/languages?q=Go" },
  { label: "Rust", href: "/languages?q=Rust" },
  { label: "Kotlin", href: "/languages?q=Kotlin" },
] as const;

export const interviewCompanies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Uber",
  "Tesla",
  "Stripe",
  "Shopify",
] as const;

/** Featured stacks on the home page (React, JavaScript, SQL, Python). */
export const homeFeaturedLanguages = [
  { label: "React", match: /\breact\b/i },
  { label: "JavaScript", match: /\bjavascript\b|\bjava[\s-]?script\b/i },
  { label: "SQL", match: /(^|[\s/-])sql([\s/-]|$)/i },
  { label: "Python", match: /\bpython\b/i },
] as const;

/** Popular tech tags shown under the hero search (matches design mockup). */
export const trendingTopics = [
  { label: "React", href: "/languages?q=React" },
  { label: "Node.js", href: "/languages?q=Node" },
  { label: "Java", href: "/languages?q=Java" },
  { label: "Python", href: "/languages?q=Python" },
  { label: ".NET", href: "/languages?q=NET" },
  { label: "SQL", href: "/languages?q=SQL" },
  { label: "JavaScript", href: "/languages?q=JavaScript" },
] as const;
