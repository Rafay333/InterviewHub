"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "@/components/admin/AdminUi";
import type { AdminBlog, PublishStatus } from "@/lib/admin/data";

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
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription ?? "");
  const [category, setCategory] = useState(initial?.category ?? blogCategories[0]);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [authorName, setAuthorName] = useState(initial?.authorName ?? "");
  const [authorTitle, setAuthorTitle] = useState(initial?.authorTitle ?? "");
  const [readMinutes, setReadMinutes] = useState(initial?.readMinutes ?? 8);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [status, setStatus] = useState<PublishStatus>(initial?.status ?? "draft");
  const [saved, setSaved] = useState(false);

  const onTitleBlur = () => {
    if (!slug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      );
    }
    if (!metaTitle && title) setMetaTitle(`${title} | InterviewHub`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => router.push("/admin/blogs"), 600);
  };

  return (
    <div>
      <AdminPageHeader
        title={mode === "create" ? "New Blog Post" : "Edit Blog Post"}
        description="SEO-friendly posts for organic traffic."
        actions={<AdminSecondaryButton href="/admin/blogs">Back</AdminSecondaryButton>}
      />
      <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <AdminCard className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">SEO heading / title</span>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} onBlur={onTitleBlur} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Slug</span>
            <input required value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Meta title</span>
            <input required value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Meta description</span>
            <textarea required rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className={inputClass} />
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
        </AdminCard>
        <div className="space-y-4">
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
              <span className="mb-1 block font-medium">Read time (minutes)</span>
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
              <input type="file" accept="image/*" className="block w-full text-sm text-muted" />
            </label>
            <AdminPrimaryButton type="submit">{saved ? "Saved…" : "Save post"}</AdminPrimaryButton>
          </AdminCard>
          {initial && initial.commentPending > 0 ? (
            <AdminCard>
              <p className="text-sm font-semibold text-navy">Comments</p>
              <p className="mt-1 text-sm text-muted">{initial.commentPending} pending moderation</p>
              <AdminSecondaryButton href="/admin/blogs">Moderate later</AdminSecondaryButton>
            </AdminCard>
          ) : null}
        </div>
      </form>
    </div>
  );
}
