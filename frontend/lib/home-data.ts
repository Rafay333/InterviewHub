export type Difficulty = "beginner" | "intermediate" | "expert" | "easy" | "medium" | "hard";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/languages", label: "Languages" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
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
