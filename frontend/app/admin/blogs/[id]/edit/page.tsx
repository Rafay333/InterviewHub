"use client";

import { useParams } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { AdminPageHeader, AdminSecondaryButton } from "@/components/admin/AdminUi";
import { adminBlogs } from "@/lib/admin/data";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const post = adminBlogs.find((b) => b.id === params.id);
  if (!post) {
    return (
      <div>
        <AdminPageHeader title="Post not found" />
        <AdminSecondaryButton href="/admin/blogs">Back</AdminSecondaryButton>
      </div>
    );
  }
  return <BlogForm mode="edit" initial={post} />;
}
