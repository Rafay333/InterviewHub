export type CategoryTopic = {
  slug: string;
  name: string;
  /** H1 / card title matched to common Google searches */
  seoHeading: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  icon: string;
  questionCount: number;
  easy: number;
  medium: number;
  hard: number;
  focus: string;
};

/**
 * Interview topic categories — complementary to Languages.
 * seoHeading uses high-intent search phrases like "{Topic} Interview Questions".
 */
export const featuredCategories: CategoryTopic[] = [
  {
    slug: "system-design",
    name: "System Design",
    seoHeading: "System Design Interview Questions",
    metaTitle: "System Design Interview Questions | InterviewHub",
    metaDescription:
      "Practice system design interview questions — URL shortener, rate limiter, chat, news feed, and scalability trade-offs.",
    description: "Scalability, availability, caching, and architecture trade-offs.",
    icon: "SD",
    questionCount: 86,
    easy: 18,
    medium: 34,
    hard: 34,
    focus: "Senior & L5+ interviews",
  },
  {
    slug: "algorithms-ds",
    name: "Algorithms & Data Structures",
    seoHeading: "Data Structures and Algorithms Interview Questions",
    metaTitle: "DSA Interview Questions | InterviewHub",
    metaDescription:
      "Practice data structures and algorithms interview questions — arrays, trees, graphs, DP, and coding patterns.",
    description: "Arrays, trees, graphs, DP, and complexity analysis.",
    icon: "DS",
    questionCount: 142,
    easy: 40,
    medium: 62,
    hard: 40,
    focus: "Coding rounds",
  },
  {
    slug: "behavioral",
    name: "Behavioral & Soft Skills",
    seoHeading: "Behavioral Interview Questions",
    metaTitle: "Behavioral Interview Questions for Developers | InterviewHub",
    metaDescription:
      "Practice behavioral interview questions for software engineers — STAR stories, teamwork, leadership, and conflict.",
    description: "STAR stories, leadership, conflict, and communication.",
    icon: "BH",
    questionCount: 64,
    easy: 28,
    medium: 24,
    hard: 12,
    focus: "Hiring manager rounds",
  },
  {
    slug: "oop",
    name: "Object-Oriented Programming",
    seoHeading: "OOP Interview Questions",
    metaTitle: "OOP Interview Questions and Answers | InterviewHub",
    metaDescription:
      "Practice OOP interview questions — SOLID, encapsulation, polymorphism, inheritance, and design patterns.",
    description: "SOLID, design patterns, inheritance, and modeling.",
    icon: "OO",
    questionCount: 72,
    easy: 22,
    medium: 30,
    hard: 20,
    focus: "Language-agnostic concepts",
  },
  {
    slug: "databases",
    name: "Databases & SQL",
    seoHeading: "SQL Interview Questions",
    metaTitle: "SQL Interview Questions and Answers | InterviewHub",
    metaDescription:
      "Practice SQL interview questions — joins, indexing, WHERE vs HAVING, transactions, and query optimization.",
    description: "Schema design, indexing, transactions, and query tuning.",
    icon: "DB",
    questionCount: 98,
    easy: 30,
    medium: 40,
    hard: 28,
    focus: "Backend interviews",
  },
  {
    slug: "frontend",
    name: "Frontend Engineering",
    seoHeading: "Frontend Interview Questions",
    metaTitle: "Frontend Interview Questions | InterviewHub",
    metaDescription:
      "Practice frontend interview questions — rendering, state management, performance, and UI architecture.",
    description: "Rendering, state, performance, and UI architecture.",
    icon: "FE",
    questionCount: 88,
    easy: 26,
    medium: 38,
    hard: 24,
    focus: "React / JS roles",
  },
  {
    slug: "backend-apis",
    name: "Backend & APIs",
    seoHeading: "Backend Interview Questions",
    metaTitle: "Backend Interview Questions | InterviewHub",
    metaDescription:
      "Practice backend interview questions — REST APIs, auth, services, queues, and reliability patterns.",
    description: "REST, auth, services, queues, and reliability patterns.",
    icon: "BE",
    questionCount: 94,
    easy: 24,
    medium: 42,
    hard: 28,
    focus: "Server-side roles",
  },
  {
    slug: "operating-systems",
    name: "Operating Systems",
    seoHeading: "Operating System Interview Questions",
    metaTitle: "Operating System Interview Questions | InterviewHub",
    metaDescription:
      "Practice operating system interview questions — processes, threads, memory, scheduling, and deadlocks.",
    description: "Processes, memory, scheduling, and file systems.",
    icon: "OS",
    questionCount: 56,
    easy: 16,
    medium: 24,
    hard: 16,
    focus: "CS fundamentals",
  },
  {
    slug: "networking",
    name: "Computer Networking",
    seoHeading: "Computer Network Interview Questions",
    metaTitle: "Computer Network Interview Questions | InterviewHub",
    metaDescription:
      "Practice computer networking interview questions — HTTP, TCP/IP, DNS, load balancing, and latency.",
    description: "HTTP, TCP/IP, DNS, load balancing, and latency.",
    icon: "NW",
    questionCount: 52,
    easy: 14,
    medium: 22,
    hard: 16,
    focus: "Systems interviews",
  },
  {
    slug: "concurrency",
    name: "Concurrency & Multithreading",
    seoHeading: "Multithreading Interview Questions",
    metaTitle: "Multithreading Interview Questions | InterviewHub",
    metaDescription:
      "Practice multithreading and concurrency interview questions — locks, race conditions, and async patterns.",
    description: "Locks, race conditions, async patterns, and parallelism.",
    icon: "CC",
    questionCount: 48,
    easy: 10,
    medium: 20,
    hard: 18,
    focus: "Advanced coding rounds",
  },
  {
    slug: "testing",
    name: "Testing & Quality",
    seoHeading: "Software Testing Interview Questions",
    metaTitle: "Software Testing Interview Questions | InterviewHub",
    metaDescription:
      "Practice software testing interview questions — unit tests, integration tests, mocking, and TDD.",
    description: "Unit tests, integration tests, mocking, and TDD habits.",
    icon: "QA",
    questionCount: 40,
    easy: 16,
    medium: 16,
    hard: 8,
    focus: "Engineering craft",
  },
  {
    slug: "devops-cloud",
    name: "DevOps & Cloud",
    seoHeading: "DevOps Interview Questions",
    metaTitle: "DevOps Interview Questions | InterviewHub",
    metaDescription:
      "Practice DevOps interview questions — CI/CD, Docker, Kubernetes basics, observability, and cloud.",
    description: "CI/CD, containers, observability, and cloud basics.",
    icon: "DV",
    questionCount: 70,
    easy: 20,
    medium: 30,
    hard: 20,
    focus: "Platform & SRE tracks",
  },
  {
    slug: "security",
    name: "Application Security",
    seoHeading: "Cyber Security Interview Questions",
    metaTitle: "Application Security Interview Questions | InterviewHub",
    metaDescription:
      "Practice application security interview questions — OWASP, auth, XSS, encryption, and secure design.",
    description: "OWASP, auth threats, encryption, and secure design.",
    icon: "SEC",
    questionCount: 44,
    easy: 12,
    medium: 18,
    hard: 14,
    focus: "Secure coding",
  },
  {
    slug: "machine-learning",
    name: "Machine Learning Basics",
    seoHeading: "Machine Learning Interview Questions",
    metaTitle: "Machine Learning Interview Questions | InterviewHub",
    metaDescription:
      "Practice machine learning interview questions — overfitting, evaluation metrics, and ML basics.",
    description: "Models, evaluation, overfitting, and ML system design.",
    icon: "ML",
    questionCount: 38,
    easy: 12,
    medium: 16,
    hard: 10,
    focus: "ML / data roles",
  },
  {
    slug: "coding-patterns",
    name: "Coding Patterns",
    seoHeading: "Coding Interview Questions",
    metaTitle: "Coding Interview Questions and Patterns | InterviewHub",
    metaDescription:
      "Practice coding interview questions — sliding window, two pointers, BFS/DFS, and common patterns.",
    description: "Sliding window, two pointers, BFS/DFS, and greedy templates.",
    icon: "CP",
    questionCount: 80,
    easy: 24,
    medium: 36,
    hard: 20,
    focus: "Pattern-based prep",
  },
];

export function getCategoryBySlug(slug: string) {
  return featuredCategories.find((category) => category.slug === slug) ?? null;
}

export function getCategoriesTotalQuestions() {
  return featuredCategories.reduce((sum, category) => sum + category.questionCount, 0);
}

export type CategoryQuestion = {
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  summary: string;
};

/** Placeholder questions per category until CMS/API exists */
export function getCategoryQuestions(slug: string): CategoryQuestion[] {
  const shared: Record<string, CategoryQuestion[]> = {
    "system-design": [
      {
        slug: "distributed-rate-limiter",
        title: "Design a globally distributed rate limiter",
        difficulty: "hard",
        summary: "Cover quotas, consistency, and failure modes across regions.",
      },
      {
        slug: "url-shortener",
        title: "Design a URL shortener like bit.ly",
        difficulty: "medium",
        summary: "Discuss encoding, storage, redirects, and analytics.",
      },
      {
        slug: "news-feed",
        title: "Design a social media news feed",
        difficulty: "hard",
        summary: "Fan-out strategies, ranking, and read-heavy traffic.",
      },
      {
        slug: "chat-system",
        title: "Design a real-time chat system",
        difficulty: "medium",
        summary: "WebSockets, delivery guarantees, and presence.",
      },
    ],
    "algorithms-ds": [
      {
        slug: "longest-palindromic-substring",
        title: "Find the longest palindromic substring",
        difficulty: "medium",
        summary: "Expand-around-center vs DP trade-offs.",
      },
      {
        slug: "two-sum",
        title: "Two Sum — return indices of the pair",
        difficulty: "easy",
        summary: "Hash map approach and edge cases.",
      },
      {
        slug: "merge-intervals",
        title: "Merge overlapping intervals",
        difficulty: "medium",
        summary: "Sorting + linear scan pattern.",
      },
      {
        slug: "lru-cache",
        title: "Implement an LRU Cache",
        difficulty: "hard",
        summary: "Hash map + doubly linked list.",
      },
    ],
    behavioral: [
      {
        slug: "star-conflict",
        title: "Tell me about a time you handled conflict on a team",
        difficulty: "medium",
        summary: "Use STAR: situation, task, action, result.",
      },
      {
        slug: "ownership-example",
        title: "Describe a project you owned end-to-end",
        difficulty: "easy",
        summary: "Highlight decisions, impact, and learning.",
      },
      {
        slug: "failed-project",
        title: "Talk about a failure and what you learned",
        difficulty: "medium",
        summary: "Show accountability without blaming others.",
      },
    ],
    oop: [
      {
        slug: "solid-principles",
        title: "Explain the SOLID principles with examples",
        difficulty: "easy",
        summary: "Connect each principle to maintainable design.",
      },
      {
        slug: "strategy-pattern",
        title: "When would you use the Strategy pattern?",
        difficulty: "medium",
        summary: "Swap algorithms without changing clients.",
      },
    ],
    databases: [
      {
        slug: "where-vs-having",
        title: "What is the difference between WHERE and HAVING?",
        difficulty: "easy",
        summary: "Pre-filter rows vs post-filter aggregates.",
      },
      {
        slug: "indexing-basics",
        title: "How do indexes improve query performance?",
        difficulty: "medium",
        summary: "B-Tree trade-offs and write costs.",
      },
      {
        slug: "normalization",
        title: "Explain database normalization and when to denormalize",
        difficulty: "medium",
        summary: "Integrity vs read performance.",
      },
    ],
    frontend: [
      {
        slug: "usememo-vs-usecallback",
        title: "Explain the difference between useMemo and useCallback",
        difficulty: "easy",
        summary: "Memoized values vs memoized functions.",
      },
      {
        slug: "virtual-dom",
        title: "How does the Virtual DOM help performance?",
        difficulty: "medium",
        summary: "Diffing, batching, and reconciliation.",
      },
    ],
    "backend-apis": [
      {
        slug: "rest-vs-graphql",
        title: "REST vs GraphQL — when do you choose each?",
        difficulty: "medium",
        summary: "Over-fetching, caching, and tooling.",
      },
      {
        slug: "idempotent-apis",
        title: "What makes an API endpoint idempotent?",
        difficulty: "medium",
        summary: "Safe retries and duplicate requests.",
      },
    ],
    "operating-systems": [
      {
        slug: "process-vs-thread",
        title: "Process vs thread — key differences",
        difficulty: "easy",
        summary: "Memory isolation and scheduling.",
      },
      {
        slug: "deadlock",
        title: "What causes deadlock and how do you prevent it?",
        difficulty: "medium",
        summary: "Four conditions and avoidance strategies.",
      },
    ],
    networking: [
      {
        slug: "https-handshake",
        title: "Explain the HTTPS / TLS handshake at a high level",
        difficulty: "medium",
        summary: "Certificates, keys, and secure channels.",
      },
      {
        slug: "tcp-vs-udp",
        title: "TCP vs UDP — when is each appropriate?",
        difficulty: "easy",
        summary: "Reliability vs latency trade-offs.",
      },
    ],
    concurrency: [
      {
        slug: "race-condition",
        title: "What is a race condition? Give an example",
        difficulty: "medium",
        summary: "Shared state without synchronization.",
      },
      {
        slug: "mutex-vs-semaphore",
        title: "Mutex vs semaphore",
        difficulty: "medium",
        summary: "Ownership and counting permits.",
      },
    ],
    testing: [
      {
        slug: "unit-vs-integration",
        title: "Unit tests vs integration tests",
        difficulty: "easy",
        summary: "Scope, speed, and confidence.",
      },
      {
        slug: "test-pyramid",
        title: "Explain the testing pyramid",
        difficulty: "medium",
        summary: "Balance fast unit coverage with fewer E2E tests.",
      },
    ],
    "devops-cloud": [
      {
        slug: "ci-cd-pipeline",
        title: "What belongs in a solid CI/CD pipeline?",
        difficulty: "easy",
        summary: "Build, test, security checks, deploy.",
      },
      {
        slug: "containers-vs-vms",
        title: "Containers vs virtual machines",
        difficulty: "medium",
        summary: "Isolation, density, and startup time.",
      },
    ],
    security: [
      {
        slug: "owasp-top-10",
        title: "Name common OWASP Top 10 risks you watch for",
        difficulty: "medium",
        summary: "Injection, broken auth, XSS, and more.",
      },
      {
        slug: "jwt-security",
        title: "How do you store and validate JWTs safely?",
        difficulty: "medium",
        summary: "Expiry, signature checks, and storage choices.",
      },
    ],
    "machine-learning": [
      {
        slug: "overfitting",
        title: "What is overfitting and how do you reduce it?",
        difficulty: "easy",
        summary: "Regularization, more data, simpler models.",
      },
      {
        slug: "train-test-split",
        title: "Why do we use train / validation / test splits?",
        difficulty: "easy",
        summary: "Honest evaluation and model selection.",
      },
    ],
    "coding-patterns": [
      {
        slug: "sliding-window",
        title: "Explain the sliding window pattern with an example",
        difficulty: "easy",
        summary: "Subarray / substring problems.",
      },
      {
        slug: "two-pointers",
        title: "When should you use two pointers?",
        difficulty: "easy",
        summary: "Sorted arrays and pair searches.",
      },
      {
        slug: "bfs-vs-dfs",
        title: "BFS vs DFS — when to use each",
        difficulty: "medium",
        summary: "Shortest path vs exploration depth.",
      },
    ],
  };

  return (
    shared[slug] ?? [
      {
        slug: `${slug}-intro`,
        title: `Core interview questions in this category`,
        difficulty: "easy",
        summary: "Placeholder content until questions are loaded from the CMS.",
      },
    ]
  );
}
