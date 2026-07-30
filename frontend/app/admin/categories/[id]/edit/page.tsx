"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { AdminPageHeader, AdminSecondaryButton } from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type { AdminCategory } from "@/lib/admin/types";

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const [cat, setCat] = useState<AdminCategory | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getCategory(params.id)
      .then(setCat)
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Category not found" />
        <p className="text-sm text-hard">{error}</p>
        <AdminSecondaryButton href="/admin/categories">Back</AdminSecondaryButton>
      </div>
    );
  }
  if (!cat) return <p className="text-sm text-muted">Loading…</p>;
  return <CategoryForm mode="edit" initial={cat} />;
}
