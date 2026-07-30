import {
  interviewQuestionsHeading,
  interviewQuestionsMetaDescription,
  interviewQuestionsMetaTitle,
} from "@/lib/seo-copy";

export type LanguageLevel = "beginner" | "intermediate" | "expert";

export type FeaturedLanguage = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  updatedLabel: string;
  beginner: number;
  intermediate: number;
  expert: number;
};

/** Featured catalog — placeholder counts until API exists */
export const featuredLanguages: FeaturedLanguage[] = [
  {
    slug: "react",
    name: "React",
    description: "Component-based UI library mastery.",
    icon: "R",
    updatedLabel: "Updated 2d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "nextjs",
    name: "Next.js",
    description: "App Router, SSR, and production React apps.",
    icon: "N",
    updatedLabel: "Updated 1d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "nodejs",
    name: "Node.js",
    description: "Event loop, APIs, and backend JavaScript.",
    icon: "No",
    updatedLabel: "Updated 3d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "express",
    name: "Express",
    description: "Routing, middleware, and REST APIs.",
    icon: "Ex",
    updatedLabel: "Updated 4d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "javascript",
    name: "JavaScript",
    description: "Closures, async, and language core concepts.",
    icon: "JS",
    updatedLabel: "Updated 2d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "typescript",
    name: "TypeScript",
    description: "Strict typing and scalable frontend codebases.",
    icon: "TS",
    updatedLabel: "Updated 5d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "csharp",
    name: "C#",
    description: "OOP, LINQ, and .NET interview fundamentals.",
    icon: "C#",
    updatedLabel: "Updated 1w ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "aspnet-core",
    name: "ASP.NET Core",
    description: "Web APIs, middleware, and enterprise patterns.",
    icon: ".N",
    updatedLabel: "Updated 6d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "java",
    name: "Java",
    description: "Collections, concurrency, and JVM basics.",
    icon: "Jv",
    updatedLabel: "Updated 3d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "spring-boot",
    name: "Spring Boot",
    description: "Beans, REST, and production Spring apps.",
    icon: "Sb",
    updatedLabel: "Updated 4d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "python",
    name: "Python",
    description: "Data structures, scripting, and backend basics.",
    icon: "Py",
    updatedLabel: "Updated 2d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "django",
    name: "Django",
    description: "ORM, views, and batteries-included web apps.",
    icon: "Dj",
    updatedLabel: "Updated 1w ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "php",
    name: "PHP",
    description: "Language fundamentals for web backends.",
    icon: "Ph",
    updatedLabel: "Updated 5d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "laravel",
    name: "Laravel",
    description: "Eloquent, routing, and modern PHP frameworks.",
    icon: "La",
    updatedLabel: "Updated 6d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "sql",
    name: "SQL",
    description: "Joins, indexing, and query optimization.",
    icon: "SQL",
    updatedLabel: "Updated 1d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "postgresql",
    name: "PostgreSQL",
    description: "Indexes, transactions, and advanced SQL.",
    icon: "Pg",
    updatedLabel: "Updated 3d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "mongodb",
    name: "MongoDB",
    description: "Documents, aggregation, and NoSQL design.",
    icon: "Mg",
    updatedLabel: "Updated 4d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "docker",
    name: "Docker",
    description: "Images, containers, and local DevOps workflows.",
    icon: "Dk",
    updatedLabel: "Updated 2d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "kubernetes",
    name: "Kubernetes",
    description: "Pods, services, and cluster fundamentals.",
    icon: "K8",
    updatedLabel: "Updated 1w ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "aws",
    name: "AWS",
    description: "Core cloud services for backend interviews.",
    icon: "AWS",
    updatedLabel: "Updated 2d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
  {
    slug: "azure",
    name: "Azure",
    description: "Cloud services and Microsoft stack interviews.",
    icon: "Az",
    updatedLabel: "Updated 5d ago",
    beginner: 20,
    intermediate: 35,
    expert: 50,
  },
];

export function getLanguageBySlug(slug: string) {
  return featuredLanguages.find((lang) => lang.slug === slug) ?? null;
}

export function getTotalQuestions(lang: FeaturedLanguage) {
  return lang.beginner + lang.intermediate + lang.expert;
}

export function getLanguageSeo(lang: FeaturedLanguage) {
  return {
    heading: interviewQuestionsHeading(lang.name),
    metaTitle: interviewQuestionsMetaTitle(lang.name),
    metaDescription: interviewQuestionsMetaDescription(lang.name, lang.description),
  };
}

export type LanguageQuestion = {
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  summary: string;
};

/** Placeholder questions per language until CMS/API exists */
export function getLanguageQuestions(slug: string): LanguageQuestion[] {
  const shared: Record<string, LanguageQuestion[]> = {
    react: [
      {
        slug: "usememo-vs-usecallback",
        title: "Explain the difference between useMemo and useCallback",
        difficulty: "easy",
        summary: "Memoized values vs memoized functions in React.",
      },
      {
        slug: "virtual-dom",
        title: "How does the Virtual DOM help performance?",
        difficulty: "medium",
        summary: "Diffing, batching, and reconciliation.",
      },
      {
        slug: "react-keys",
        title: "Why are keys important in lists?",
        difficulty: "easy",
        summary: "Stable identity for efficient re-renders.",
      },
    ],
    javascript: [
      {
        slug: "closures",
        title: "What is a closure in JavaScript?",
        difficulty: "easy",
        summary: "Functions remembering their lexical scope.",
      },
      {
        slug: "event-loop",
        title: "Explain the JavaScript event loop",
        difficulty: "medium",
        summary: "Call stack, microtasks, and macrotasks.",
      },
    ],
    sql: [
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
        slug: "second-highest-salary",
        title: "Find the second highest salary in SQL",
        difficulty: "medium",
        summary: "Classic ranking / subquery interview prompt.",
      },
    ],
    python: [
      {
        slug: "gil",
        title: "What is the Python GIL?",
        difficulty: "medium",
        summary: "Global Interpreter Lock and concurrency limits.",
      },
      {
        slug: "decorators",
        title: "Explain Python decorators with an example",
        difficulty: "easy",
        summary: "Wrapping functions to add behavior.",
      },
    ],
    aws: [
      {
        slug: "ec2-vs-lambda",
        title: "When do you choose EC2 vs Lambda?",
        difficulty: "medium",
        summary: "Long-running servers vs event-driven compute.",
      },
      {
        slug: "s3-basics",
        title: "What is Amazon S3 used for in interviews?",
        difficulty: "easy",
        summary: "Object storage, durability, and common patterns.",
      },
    ],
  };

  const lang = getLanguageBySlug(slug);
  return (
    shared[slug] ?? [
      {
        slug: `${slug}-basics`,
        title: `Core ${lang?.name ?? slug} interview questions`,
        difficulty: "easy",
        summary: "Placeholder list until questions load from the CMS.",
      },
      {
        slug: `${slug}-advanced`,
        title: `Advanced ${lang?.name ?? slug} interview scenarios`,
        difficulty: "hard",
        summary: "Trade-offs and production patterns interviewers expect.",
      },
    ]
  );
}

export type LanguageDetailContent = {
  topicTitle: string;
  difficultyLabel: "Easy" | "Medium" | "Hard";
  companies: string[];
  questionTitle: string;
  intro: string;
  sections: {
    heading: string;
    body: string;
    codeFile?: string;
    code?: string;
    table?: { headers: string[]; rows: string[][] };
  }[];
};

/** @deprecated Prefer getLanguageQuestions — kept for reference samples */
export function getLanguageDetailContent(slug: string): LanguageDetailContent {
  const lang = getLanguageBySlug(slug);
  const name = lang?.name ?? "This technology";
  const seo = lang ? getLanguageSeo(lang) : { heading: `${name} Interview Questions` };

  return {
    topicTitle: seo.heading,
    difficultyLabel: "Easy",
    companies: ["Google", "Amazon"],
    questionTitle: `What should you know before a ${name} interview?`,
    intro: `${name} interviews usually mix fundamentals, practical trade-offs, and real debugging scenarios.`,
    sections: [],
  };
}
