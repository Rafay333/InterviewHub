export type Difficulty = "beginner" | "intermediate" | "expert";
export type PublishStatus = "draft" | "published";

export type AdminLanguage = {
  id: string;
  name: string;
  slug: string;
  description: string;
  pictureUrl?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  seoHeading?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: PublishStatus;
  beginner: number;
  intermediate: number;
  expert: number;
  updatedAt: string | null;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  pictureUrl?: string | null;
  seoHeading?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: PublishStatus;
  beginner: number;
  intermediate: number;
  expert: number;
  updatedAt: string | null;
};

export type AdminQuestion = {
  id: string;
  title: string;
  questionText: string;
  answer: string;
  answerText?: string;
  description?: string;
  descriptionText?: string;
  questionImage?: string | null;
  answerImage?: string | null;
  descriptionImage?: string | null;
  difficulty: Difficulty;
  languageId?: string | null;
  languageIds: string[];
  languageName?: string | null;
  categoryId?: string | null;
  categoryIds: string[];
  status: PublishStatus;
  slug?: string;
  updatedAt: string | null;
};

export type AdminBlog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  featuredImageUrl?: string | null;
  authorName: string;
  authorTitle: string;
  readMinutes: number;
  featured: boolean;
  status: PublishStatus;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt: string | null;
  commentPending: number;
};

export type MediaItem = {
  id: string;
  name: string;
  type: "image" | "pdf";
  sizeLabel: string;
  usedIn: string;
  uploadedAt: string | null;
  url?: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Admin";
  lastLogin: string;
  active: boolean;
};

export type DashboardData = {
  traffic: {
    last24h: number;
    last7d: number;
    last30d: number;
    last12m: number;
  };
  trafficSeries: Record<string, number[]>;
  topPages: { path: string; views: number }[];
  adsense: {
    connected: boolean;
    today: number;
    last7d: number;
    last30d: number;
    ytd: number;
    rpm: number;
    ctr: number;
    topEarning: { path: string; earnings: number }[];
  };
  content: {
    languages: number;
    categories: number;
    questions: number;
    blogs: number;
    publishedQuestions: number;
    draftQuestions: number;
    byDifficulty: {
      beginner: number;
      intermediate: number;
      expert: number;
    };
  };
  recentActivity: {
    id: string;
    action: string;
    target: string;
    actor: string;
    at: string;
  }[];
};

export type SiteSettings = {
  id?: string;
  siteName: string;
  metaSuffix: string;
  ga4Connected: boolean;
  ga4MeasurementId?: string;
  adsenseConnected: boolean;
  adsensePublisherId?: string;
};

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

export function totalQuestions(item: {
  beginner: number;
  intermediate: number;
  expert: number;
}) {
  return item.beginner + item.intermediate + item.expert;
}
