export type Difficulty = "beginner" | "intermediate" | "expert" | "easy" | "medium" | "hard";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/languages", label: "Languages" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
] as const;

export const trendingTopics = [
  { label: "Languages", href: "/languages" },
  { label: "Categories", href: "/categories" },
  { label: "Blog", href: "/blog" },
] as const;
