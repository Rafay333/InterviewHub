"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  EmptyState,
  StatusBadge,
} from "@/components/admin/AdminUi";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { adminApi } from "@/lib/admin/api";
import type { AdminBlog } from "@/lib/admin/types";

export default function AdminBlogsPage() {
  const [items, setItems] = useState<AdminBlog[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi
      .listBlogs()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <AdminPageHeader
        title="Blogs"
        description="Live data from SQL Server."
        actions={<AdminPrimaryButton href="/admin/blogs/new">New Blog Post</AdminPrimaryButton>}
      />
      {error ? <p className="mb-3 text-sm text-hard">{error}</p> : null}
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="No blog posts"
          description="Publish your first guide."
          action={<AdminPrimaryButton href="/admin/blogs/new">New Blog Post</AdminPrimaryButton>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-soft text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-navy">{post.title}</td>
                  <td className="px-4 py-3 text-muted">{post.category}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{post.publishedAt || "—"}</td>
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
        message="This deletes the post from SQL Server."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await adminApi.deleteBlog(deleteId);
          setDeleteId(null);
          load();
        }}
      />
    </div>
  );
}
