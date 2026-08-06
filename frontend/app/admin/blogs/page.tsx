"use client";

import { useEffect, useState } from "react";
import {
  AdminLink,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminTable,
  AdminTableHead,
  AdminTd,
  AdminTh,
  AdminTr,
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
        description="Guides and articles for the public blog."
        actions={<AdminPrimaryButton href="/admin/blogs/new">New Blog Post</AdminPrimaryButton>}
      />
      {error ? (
        <p className="mb-3 rounded-xl border border-hard/20 bg-hard/10 px-3 py-2 text-sm text-hard">
          {error}
        </p>
      ) : null}
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="No blog posts"
          description="Publish your first guide."
          action={<AdminPrimaryButton href="/admin/blogs/new">New Blog Post</AdminPrimaryButton>}
        />
      ) : (
        <AdminTable>
          <table className="min-w-full text-left text-sm">
            <AdminTableHead>
              <tr>
                <AdminTh>Title</AdminTh>
                <AdminTh>Category</AdminTh>
                <AdminTh>Status</AdminTh>
                <AdminTh>Date</AdminTh>
                <AdminTh>Actions</AdminTh>
              </tr>
            </AdminTableHead>
            <tbody>
              {items.map((post) => (
                <AdminTr key={post.id}>
                  <AdminTd className="font-medium text-navy">{post.title}</AdminTd>
                  <AdminTd>
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
                      {post.category || "—"}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <StatusBadge status={post.status} />
                  </AdminTd>
                  <AdminTd className="text-muted">{post.publishedAt || "—"}</AdminTd>
                  <AdminTd>
                    <div className="flex gap-3">
                      <AdminLink href={`/admin/blogs/${post.id}/edit`}>Edit</AdminLink>
                      <button
                        type="button"
                        className="font-semibold text-hard hover:text-red-700"
                        onClick={() => setDeleteId(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </table>
        </AdminTable>
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
