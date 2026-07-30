"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { AdminPageHeader, AdminSecondaryButton } from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type { AdminBlog } from "@/lib/admin/types";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<AdminBlog | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getBlog(params.id)
      .then(setPost)
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Post not found" />
        <AdminSecondaryButton href="/admin/blogs">Back</AdminSecondaryButton>
      </div>
    );
  }
  if (!post) return <p className="text-sm text-muted">Loading…</p>;
  return <BlogForm mode="edit" initial={post} />;
}
