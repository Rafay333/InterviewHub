import type { Difficulty } from "@/lib/home-data";

export type PublicLanguage = {
  id: string;
  slug: string;
  name: string;
  description: string;
  pictureUrl?: string | null;
  icon: string;
  seoHeading: string;
  metaTitle: string;
  metaDescription: string;
  beginner: number;
  intermediate: number;
  expert: number;
  questionCount: number;
  updatedLabel?: string;
};

export type PublicCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  pictureUrl?: string | null;
  icon: string;
  seoHeading: string;
  metaTitle: string;
  metaDescription: string;
  beginner: number;
  intermediate: number;
  expert: number;
  easy: number;
  medium: number;
  hard: number;
  questionCount: number;
  focus: string;
};

export type PublicQuestionListItem = {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  summary: string;
  languageName?: string | null;
  categoryName?: string | null;
  questionText?: string;
  answer?: string;
  description?: string;
  questionImage?: string | null;
  answerImage?: string | null;
  descriptionImage?: string | null;
};

export type PublicQuestionDetail = {
  id: string;
  slug: string;
  title: string;
  questionText: string;
  answer: string;
  description: string;
  difficulty: Difficulty;
  questionImage?: string | null;
  answerImage?: string | null;
  descriptionImage?: string | null;
  languageName?: string | null;
  languageSlug?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  metaTitle: string;
  metaDescription: string;
};

export type PublicBlog = {
  id: string;
  slug: string;
  title: string;
  seoHeading: string;
  excerpt: string;
  body: string;
  bodyParagraphs: string[];
  category: string;
  authorName: string;
  authorTitle: string;
  readMinutes: number;
  featured: boolean;
  featuredImageUrl?: string | null;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string | null;
  publishedLabel: string;
  tone: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5050";

async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api/public${path}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Public API ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchLanguages() {
  try {
    return await publicGet<PublicLanguage[]>("/languages");
  } catch {
    return [];
  }
}

export async function fetchLanguage(slug: string) {
  try {
    return await publicGet<PublicLanguage>(`/languages/${slug}`);
  } catch {
    return null;
  }
}

export async function fetchLanguageQuestions(slug: string) {
  try {
    return await publicGet<PublicQuestionListItem[]>(`/languages/${slug}/questions`);
  } catch {
    return [];
  }
}

export async function fetchCategories() {
  try {
    return await publicGet<PublicCategory[]>("/categories");
  } catch {
    return [];
  }
}

export async function fetchCategory(slug: string) {
  try {
    return await publicGet<PublicCategory>(`/categories/${slug}`);
  } catch {
    return null;
  }
}

export async function fetchCategoryQuestions(slug: string) {
  try {
    return await publicGet<PublicQuestionListItem[]>(`/categories/${slug}/questions`);
  } catch {
    return [];
  }
}

export async function fetchRecentQuestions(limit = 8) {
  try {
    return await publicGet<PublicQuestionListItem[]>(`/questions/recent?limit=${limit}`);
  } catch {
    return [];
  }
}

export async function fetchQuestion(slug: string) {
  try {
    return await publicGet<PublicQuestionDetail>(`/questions/${slug}`);
  } catch {
    return null;
  }
}

export async function fetchBlogs() {
  try {
    return await publicGet<PublicBlog[]>("/blogs");
  } catch {
    return [];
  }
}

export async function fetchBlog(slug: string) {
  try {
    return await publicGet<PublicBlog>(`/blogs/${slug}`);
  } catch {
    return null;
  }
}
