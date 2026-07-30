"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type { AdminBlog, PublishStatus } from "@/lib/admin/types";

const inputClass =
  "w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary";

const blogCategories = [
  "Data Structures",
  "Algorithms",
  "Soft Skills",
  "Backend Engineering",
  "Interview Prep",
  "System Design",
  "Frontend",
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
        <AdminCard className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Title</span>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {blogCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Excerpt</span>
            <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Body</span>
            <textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)} className={inputClass} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Author name</span>
              <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className={inputClass} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Author title</span>
              <input value={authorTitle} onChange={(e) => setAuthorTitle(e.target.value)} className={inputClass} />
            </label>
          </div>
          {error ? <p className="text-sm text-hard">{error}</p> : null}
        </AdminCard>
        <AdminCard className="space-y-3">
          <label className="block text-sm font-medium">
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value as PublishStatus)} className={`${inputClass} mt-1`}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured post
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Read time</span>
            <input
              type="number"
              min={1}
              value={readMinutes}
              onChange={(e) => setReadMinutes(Number(e.target.value))}
              className={inputClass}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Featured image</span>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          </label>
          <AdminPrimaryButton type="submit">{saving ? "Saving…" : "Save post"}</AdminPrimaryButton>
        </AdminCard>
      </form>
    </div>
  );
}
