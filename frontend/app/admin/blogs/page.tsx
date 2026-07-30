"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  EmptyState,
  StatusBadge,
} from "@/components/admin/AdminUi";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { adminBlogs, type AdminBlog } from "@/lib/admin/data";

export default function AdminBlogsPage() {
  const [items, setItems] = useState<AdminBlog[]>(adminBlogs);
  const [q, setQ] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((b) => b.title.toLowerCase().includes(term));
  }, [items, q]);

  return (
    <div>
      <AdminPageHeader
        title="Blogs"
        description="Create and publish SEO blog posts. Moderate public comments."
        actions={<AdminPrimaryButton href="/admin/blogs/new">New Blog Post</AdminPrimaryButton>}
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search posts…"
        className="mb-4 w-full max-w-md rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
      />
      {filtered.length === 0 ? (
        <EmptyState
          title="No blog posts"
          description="Publish guides that support your interview question hubs."
          action={<AdminPrimaryButton href="/admin/blogs/new">New Blog Post</AdminPrimaryButton>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-soft text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Comments</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-navy">{post.title}</td>
                  <td className="px-4 py-3 text-muted">{post.category}</td>
                  <td className="px-4 py-3">{post.featured ? "Yes" : "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-4 py-3">{post.commentPending} pending</td>
                  <td className="px-4 py-3 text-muted">{post.publishedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/blogs/${post.id}/edit`} className="text-primary hover:underline">
                        Edit
                      </Link>
                      <button type="button" className="text-hard hover:underline" onClick={() => setDeleteId(post.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete blog post?"
        message="This removes the post from the admin list (mock)."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          setItems((prev) => prev.filter((p) => p.id !== deleteId));
          setDeleteId(null);
        }}
      />
    </div>
  );
}
