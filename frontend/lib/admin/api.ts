import { getAdminToken, setAdminSession } from "@/lib/admin/auth";
import type {
  AdminBlog,
  AdminCategory,
  AdminLanguage,
  AdminQuestion,
  AdminUser,
  DashboardData,
  MediaItem,
  SiteSettings,
} from "@/lib/admin/types";

function apiBase() {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL) return "https://interviewhub-production-586d.up.railway.app";
  return "http://localhost:5050";
}

const API_BASE = apiBase();

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { formData?: FormData; skipAuth?: boolean } = {},
): Promise<T> {
  const { formData, skipAuth, headers: headerInit, ...fetchOptions } = options;
  const headers = new Headers(headerInit || {});
  const token = skipAuth ? null : getAdminToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let body = fetchOptions.body;
  if (formData) {
    body = formData;
  } else if (body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}/api/admin${path}`, {
    cache: "no-store",
    ...fetchOptions,
    headers,
    body,
  });

  if (res.status === 401 && path !== "/login") {
    setAdminSession(null);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.message || "Request failed", res.status);
  }
  return data as T;
}

export const adminApi = {
  login(email: string, password: string) {
    return request<{ token: string; admin: { id: string; name: string; email: string } }>(
      "/login",
      {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ email: email.trim(), password }),
      },
    );
  },

  dashboard() {
    return request<DashboardData>("/dashboard");
  },

  listLanguages(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(params).toString();
    return request<AdminLanguage[]>(`/languages${qs ? `?${qs}` : ""}`);
  },
  getLanguage(id: string) {
    return request<AdminLanguage>(`/languages/${id}`);
  },
  createLanguage(form: FormData) {
    return request<AdminLanguage>("/languages", { method: "POST", formData: form });
  },
  updateLanguage(id: string, form: FormData) {
    return request<AdminLanguage>(`/languages/${id}`, { method: "PUT", formData: form });
  },
  deleteLanguage(id: string) {
    return request<void>(`/languages/${id}`, { method: "DELETE" });
  },

  listCategories() {
    return request<AdminCategory[]>("/categories");
  },
  seedCoreCategories() {
    return request<{ created: number; updated: number; categories: AdminCategory[] }>(
      "/categories/seed-core",
      { method: "POST" },
    );
  },
  getCategory(id: string) {
    return request<AdminCategory>(`/categories/${id}`);
  },
  createCategory(form: FormData) {
    return request<AdminCategory>("/categories", { method: "POST", formData: form });
  },
  updateCategory(id: string, form: FormData) {
    return request<AdminCategory>(`/categories/${id}`, { method: "PUT", formData: form });
  },
  deleteCategory(id: string) {
    return request<void>(`/categories/${id}`, { method: "DELETE" });
  },

  listQuestions(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(params).toString();
    return request<{
      items: AdminQuestion[];
      total: number;
      page: number;
      pageSize: number;
    }>(`/questions${qs ? `?${qs}` : ""}`);
  },
  getQuestion(id: string) {
    return request<AdminQuestion>(`/questions/${id}`);
  },
  createQuestion(form: FormData) {
    return request<AdminQuestion>("/questions", { method: "POST", formData: form });
  },
  updateQuestion(id: string, form: FormData) {
    return request<AdminQuestion>(`/questions/${id}`, { method: "PUT", formData: form });
  },
  deleteQuestion(id: string) {
    return request<void>(`/questions/${id}`, { method: "DELETE" });
  },
  importQuestionsPdf(form: FormData) {
    return request<{
      importId: string;
      importedCount: number;
      imagesAttached: number;
      difficulty: string;
      status: string;
      questions: {
        id: string;
        title: string;
        slug: string;
        difficulty: string;
        hasDiagram?: boolean;
      }[];
    }>("/questions/import", { method: "POST", formData: form });
  },
  previewQuestionsPdf(form: FormData) {
    return request<{
      fileName: string;
      fileSizeKb: number;
      difficulty: string;
      count: number;
      imagesFound: number;
      questions: {
        index: number;
        questionText: string;
        answerText: string;
        descriptionText: string;
        descriptionImagePreview?: string | null;
      }[];
      rawPreview: string;
    }>("/questions/import/preview", { method: "POST", formData: form });
  },

  listBlogs() {
    return request<AdminBlog[]>("/blogs");
  },
  getBlog(id: string) {
    return request<AdminBlog>(`/blogs/${id}`);
  },
  createBlog(form: FormData) {
    return request<AdminBlog>("/blogs", { method: "POST", formData: form });
  },
  updateBlog(id: string, form: FormData) {
    return request<AdminBlog>(`/blogs/${id}`, { method: "PUT", formData: form });
  },
  deleteBlog(id: string) {
    return request<void>(`/blogs/${id}`, { method: "DELETE" });
  },

  listMedia() {
    return request<MediaItem[]>("/media");
  },
  uploadMedia(form: FormData) {
    return request<MediaItem[]>("/media", { method: "POST", formData: form });
  },
  deleteMedia(id: string) {
    return request<void>(`/media/${id}`, { method: "DELETE" });
  },

  listUsers() {
    return request<AdminUser[]>("/users");
  },
  createUser(body: { name: string; email: string; password?: string }) {
    return request<AdminUser>("/users", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  setUserActive(id: string, active: boolean) {
    return request<AdminUser>(`/users/${id}/active`, {
      method: "PATCH",
      body: JSON.stringify({ active }),
    });
  },

  getSettings() {
    return request<SiteSettings>("/settings");
  },
  updateSettings(body: Partial<SiteSettings>) {
    return request<SiteSettings>("/settings", {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
};
