/**
 * Canonical interview topic hubs shown in admin and on /categories.
 * Order is the learning path (1–10).
 */
const CORE_CATEGORIES = [
  {
    sortOrder: 1,
    name: "Programming Fundamentals",
    slug: "programming-fundamentals",
    aliases: ["fundamentals", "programming basics", "basics"],
    description: "Variables, data types, operators, conditions, loops, functions",
    icon: "PF",
    iconUrl: "/category-icons/programming-fundamentals.svg",
  },
  {
    sortOrder: 2,
    name: "Object-Oriented Programming (OOP)",
    slug: "object-oriented-programming-oop",
    aliases: ["oop", "object oriented programming", "object-oriented programming"],
    description: "Classes, objects, inheritance, polymorphism, abstraction, encapsulation",
    icon: "OO",
    iconUrl: "/category-icons/object-oriented-programming-oop.svg",
  },
  {
    sortOrder: 3,
    name: "Data Structures & Algorithms",
    slug: "data-structures-algorithms",
    aliases: ["dsa", "data structures", "algorithms", "data structures and algorithms"],
    description: "Arrays, linked lists, stacks, queues, trees, graphs, sorting, searching",
    icon: "DS",
    iconUrl: "/category-icons/data-structures-algorithms.svg",
  },
  {
    sortOrder: 4,
    name: "Database & SQL",
    slug: "database-sql",
    aliases: ["database", "sql", "databases"],
    description: "Queries, joins, indexes, normalization, transactions, stored procedures",
    icon: "DB",
    iconUrl: "/category-icons/database-sql.svg",
  },
  {
    sortOrder: 5,
    name: "Web Development",
    slug: "web-development",
    aliases: ["web", "frontend", "web dev"],
    description: "HTML, CSS, HTTP, APIs, authentication, browser concepts",
    icon: "WD",
    iconUrl: "/category-icons/web-development.svg",
  },
  {
    sortOrder: 6,
    name: "Frameworks & Libraries",
    slug: "frameworks-libraries",
    aliases: ["frameworks", "libraries"],
    description: "React, Angular, Vue, Next.js, Spring Boot, .NET, Django, etc.",
    icon: "FW",
    iconUrl: "/category-icons/frameworks-libraries.svg",
  },
  {
    sortOrder: 7,
    name: "System Design",
    slug: "system-design",
    aliases: ["architecture", "system architecture"],
    description: "Scalability, caching, load balancing, microservices, architecture",
    icon: "SD",
    iconUrl: "/category-icons/system-design.svg",
  },
  {
    sortOrder: 8,
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    aliases: ["cloud", "devops", "aws", "azure"],
    description: "AWS, Azure, Docker, Kubernetes, CI/CD, deployment",
    icon: "CD",
    iconUrl: "/category-icons/cloud-devops.svg",
  },
  {
    sortOrder: 9,
    name: "Testing & Debugging",
    slug: "testing-debugging",
    aliases: ["testing", "debugging", "qa"],
    description: "Unit testing, integration testing, API testing, debugging, test automation",
    icon: "TD",
    iconUrl: "/category-icons/testing-debugging.svg",
  },
  {
    sortOrder: 10,
    name: "Security & Authentication",
    slug: "security-authentication",
    aliases: ["security", "authentication", "auth"],
    description: "JWT, OAuth, HTTPS, authentication, authorization, common vulnerabilities",
    icon: "SA",
    iconUrl: "/category-icons/security-authentication.svg",
  },
];

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchCoreCategory(existing, spec) {
  const name = normalize(existing.name);
  const slug = normalize(existing.slug).replace(/\s+/g, "-");
  if (slug === spec.slug || name === normalize(spec.name)) return true;
  return spec.aliases.some((alias) => {
    const n = normalize(alias);
    return name === n || slug === n.replace(/\s+/g, "-");
  });
}

module.exports = { CORE_CATEGORIES, matchCoreCategory, normalize };
