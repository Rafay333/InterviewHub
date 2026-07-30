export type BlogCategory =
  | "All Posts"
  | "Data Structures"
  | "Algorithms"
  | "Soft Skills"
  | "Backend Engineering"
  | "Interview Prep"
  | "System Design"
  | "Frontend";

export type BlogPost = {
  slug: string;
  /** SEO H1 — search-style title */
  seoHeading: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: Exclude<BlogCategory, "All Posts">;
  readMinutes: number;
  publishedAt: string;
  publishedLabel: string;
  authorName: string;
  authorTitle: string;
  featured?: boolean;
  readsLabel?: string;
  /** Placeholder gradient tone for image area */
  tone: "navy" | "blue" | "teal" | "orange" | "slate";
  body: string[];
};

export const blogFilterCategories: BlogCategory[] = [
  "All Posts",
  "Data Structures",
  "Algorithms",
  "Soft Skills",
  "Backend Engineering",
];

export const recommendedTopics = [
  { label: "Python", href: "/languages/python" },
  { label: "GraphQL", href: "/categories/backend-apis" },
  { label: "Kubernetes", href: "/languages/kubernetes" },
  { label: "React", href: "/languages/react" },
  { label: "Distributed Systems", href: "/categories/system-design" },
  { label: "Career Advice", href: "/blog" },
] as const;

/**
 * Blog posts use search-intent titles (e.g. system design, Redis, STAR method).
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "system-design-monoliths-to-microservices",
    seoHeading: "System Design Interview Guide: Monoliths to Microservices",
    metaTitle: "System Design Interview Guide: Monoliths to Microservices | InterviewHub",
    metaDescription:
      "Learn system design interview patterns — monoliths vs microservices, trade-offs, and how to explain architecture clearly.",
    excerpt:
      "An exhaustive guide on architectural patterns for high-growth startups and senior engineering interviews.",
    category: "System Design",
    readMinutes: 12,
    publishedAt: "2024-10-28",
    publishedLabel: "Oct 28, 2024",
    authorName: "Sarah Jenkins",
    authorTitle: "Principal Architect @ CloudScale",
    featured: true,
    readsLabel: "45k Reads",
    tone: "navy",
    body: [
      "System design interviews often start with a simple product and end in trade-offs: monolith vs microservices, consistency vs availability, and cost vs latency.",
      "Begin by clarifying requirements, estimate scale, sketch a high-level design, then deepen one or two hard parts — storage, caching, or failure modes.",
      "This guide walks through when a monolith is enough, when services help, and how to explain your choices like a senior engineer.",
    ],
  },
  {
    slug: "red-black-trees-interview-questions",
    seoHeading: "Red-Black Trees Explained for Coding Interviews",
    metaTitle: "Red-Black Trees Explained for Coding Interviews | InterviewHub",
    metaDescription:
      "Understand red-black trees for coding interviews — balancing rules, operations, and when interviewers expect this knowledge.",
    excerpt:
      "A visual walkthrough of balancing rules and why they appear in advanced DSA rounds.",
    category: "Algorithms",
    readMinutes: 9,
    publishedAt: "2024-10-24",
    publishedLabel: "Oct 24, 2024",
    authorName: "Alex Rivera",
    authorTitle: "Staff Engineer",
    readsLabel: "38k Reads",
    tone: "blue",
    body: [
      "Red-black trees show up when interviewers want to know you understand balanced BSTs beyond surface-level map APIs.",
      "Focus on the color invariants, rotations, and the practical takeaway: guaranteed logarithmic height.",
    ],
  },
  {
    slug: "star-method-behavioral-interview",
    seoHeading: "STAR Method for Behavioral Interviews (With Examples)",
    metaTitle: "STAR Method for Behavioral Interviews | InterviewHub",
    metaDescription:
      "Use the STAR method for behavioral interview questions — situation, task, action, result — with developer examples.",
    excerpt:
      "Turn vague stories into clear answers hiring managers remember.",
    category: "Soft Skills",
    readMinutes: 7,
    publishedAt: "2024-10-22",
    publishedLabel: "Oct 22, 2024",
    authorName: "Priya Nair",
    authorTitle: "Engineering Manager",
    readsLabel: "52k Reads",
    tone: "orange",
    body: [
      "Behavioral rounds reward structure. STAR keeps your answer focused: Situation, Task, Action, Result.",
      "Pick stories with measurable outcomes — reduced latency, shipped a migration, resolved a conflict — and rehearse out loud.",
    ],
  },
  {
    slug: "redis-caching-interview-questions",
    seoHeading: "Redis Caching Strategies for High Traffic Systems",
    metaTitle: "Redis Caching Strategies Interview Guide | InterviewHub",
    metaDescription:
      "Learn Redis caching strategies for interviews — cache-aside, TTLs, stampedes, and high-traffic backend design.",
    excerpt:
      "Cache-aside, TTLs, and stampede prevention explained for backend interviews.",
    category: "Backend Engineering",
    readMinutes: 10,
    publishedAt: "2024-10-19",
    publishedLabel: "Oct 19, 2024",
    authorName: "Marcus Chen",
    authorTitle: "Backend Lead",
    tone: "teal",
    body: [
      "Redis questions test whether you can reduce load without creating new failure modes.",
      "Cover cache-aside vs write-through, eviction, TTLs, and how you handle cache stampedes under traffic spikes.",
    ],
  },
  {
    slug: "technical-conflict-design-reviews",
    seoHeading: "How to Handle Technical Conflict in Design Reviews",
    metaTitle: "Technical Conflict in Design Reviews | InterviewHub",
    metaDescription:
      "Prepare for behavioral interviews about design reviews — disagreeing respectfully and aligning on trade-offs.",
    excerpt:
      "A practical framework for disagreeing without derailing the team.",
    category: "Soft Skills",
    readMinutes: 6,
    publishedAt: "2024-10-15",
    publishedLabel: "Oct 15, 2024",
    authorName: "Elena Vance",
    authorTitle: "Senior Engineer",
    tone: "slate",
    body: [
      "Interviewers ask about conflict to see if you can argue with data and still ship.",
      "Describe the disagreement, how you listened, what evidence you used, and how the team decided.",
    ],
  },
  {
    slug: "data-structures-cheat-sheet-interviews",
    seoHeading: "Data Structures Cheat Sheet for Coding Interviews",
    metaTitle: "Data Structures Cheat Sheet for Coding Interviews | InterviewHub",
    metaDescription:
      "Quick data structures cheat sheet for coding interviews — arrays, hash maps, trees, heaps, and when to use each.",
    excerpt:
      "Pick the right structure under pressure with this interview-focused sheet.",
    category: "Data Structures",
    readMinutes: 8,
    publishedAt: "2024-10-12",
    publishedLabel: "Oct 12, 2024",
    authorName: "Jamal Okoro",
    authorTitle: "SDE II",
    tone: "blue",
    body: [
      "Most coding interviews are pattern + structure selection.",
      "Memorize when hash maps, heaps, and trees win — and the Big-O trade-offs you should say out loud.",
    ],
  },
];

export function getBlogBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export function getFeaturedPost() {
  return blogPosts.find((post) => post.featured) ?? blogPosts[0];
}

export function getPopularPosts() {
  return blogPosts
    .filter((post) => post.readsLabel)
    .slice(0, 3);
}

export function getPostsByCategory(category: BlogCategory) {
  if (category === "All Posts") return blogPosts.filter((post) => !post.featured);
  return blogPosts.filter(
    (post) => !post.featured && post.category === category
  );
}
