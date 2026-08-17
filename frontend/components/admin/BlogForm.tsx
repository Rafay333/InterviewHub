"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminInputClass,
  adminLabelClass,
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type { AdminBlog, PublishStatus } from "@/lib/admin/types";

const inputClass = adminInputClass;

const blogCategories = [
  "AI",
  "Interview Prep",
  "Data Structures",
  "Algorithms",
  "Backend Engineering",
  "System Design",
  "Frontend",
  "Soft Skills",
];

export function BlogForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: AdminBlog;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category || blogCategories[0]);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [authorName, setAuthorName] = useState(initial?.authorName ?? "");
  const [authorTitle, setAuthorTitle] = useState(initial?.authorTitle ?? "");
  const [readMinutes, setReadMinutes] = useState(initial?.readMinutes ?? 8);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [status, setStatus] = useState<PublishStatus>(initial?.status ?? "draft");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("category", category);
      form.append("excerpt", excerpt);
      form.append("body", body);
      form.append("authorName", authorName);
      form.append("authorTitle", authorTitle);
      form.append("readMinutes", String(readMinutes));
      form.append("featured", String(featured));
      form.append("status", status);
      if (imageFile) form.append("featuredImage", imageFile);
      if (mode === "create") await adminApi.createBlog(form);
      else if (initial) await adminApi.updateBlog(initial.id, form);
      router.push("/admin/blogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={mode === "create" ? "New Blog Post" : "Edit Blog Post"}
        description="Saved to SQL Server."
        actions={<AdminSecondaryButton href="/admin/blogs">Back</AdminSecondaryButton>}
      />
      <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <AdminCard className="space-y-4 bg-gradient-to-br from-primary/5 to-white">
          <label className="block text-sm">
            <span className={adminLabelClass}>Title</span>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className={adminLabelClass}>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {blogCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className={adminLabelClass}>Excerpt</span>
            <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className={adminLabelClass}>Body</span>
            <textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)} className={inputClass} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className={adminLabelClass}>Author name</span>
              <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className={inputClass} />
            </label>
            <label className="block text-sm">
              <span className={adminLabelClass}>Author title</span>
              <input value={authorTitle} onChange={(e) => setAuthorTitle(e.target.value)} className={inputClass} />
            </label>
          </div>
          {error ? (
            <p className="rounded-xl border border-hard/20 bg-hard/10 px-3 py-2 text-sm text-hard">
              {error}
            </p>
          ) : null}
        </AdminCard>
        <AdminCard className="space-y-3 bg-gradient-to-br from-accent/5 to-white">
          <label className="block text-sm">
            <span className={adminLabelClass}>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PublishStatus)}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-primary/15 bg-white px-3 py-2.5 text-sm font-medium">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-primary"
            />
            Featured post
          </label>
          <label className="block text-sm">
            <span className={adminLabelClass}>Read time</span>
            <input
              type="number"
              min={1}
              value={readMinutes}
              onChange={(e) => setReadMinutes(Number(e.target.value))}
              className={inputClass}
            />
          </label>
          <label className="block text-sm">
            <span className={adminLabelClass}>Featured image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted"
            />
          </label>
          <AdminPrimaryButton type="submit">{saving ? "Saving…" : "Save post"}</AdminPrimaryButton>
        </AdminCard>
      </form>
    </div>
  );
}
