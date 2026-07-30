"use client";

import { useParams } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { AdminPageHeader, AdminSecondaryButton } from "@/components/admin/AdminUi";
import { adminCategories } from "@/lib/admin/data";

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const cat = adminCategories.find((c) => c.id === params.id);
  if (!cat) {
    return (
      <div>
        <AdminPageHeader title="Category not found" />
        <AdminSecondaryButton href="/admin/categories">Back</AdminSecondaryButton>
      </div>
    );
  }
  return <CategoryForm mode="edit" initial={cat} />;
}
