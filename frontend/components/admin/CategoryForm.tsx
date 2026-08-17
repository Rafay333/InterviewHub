"use client";

import { FormEvent, useEffect, useState } from "react";
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
import type { AdminCategory, PublishStatus } from "@/lib/admin/types";
import { coreCategories } from "@/lib/core-categories";

const inputClass = adminInputClass;

export function CategoryForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: AdminCategory;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<PublishStatus>(initial?.status ?? "published");
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.pictureUrl ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("description", description);
      form.append("status", status);
      if (pictureFile) form.append("picture", pictureFile);
      if (mode === "create") await adminApi.createCategory(form);
      else if (initial) await adminApi.updateCategory(initial.id, form);
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={mode === "create" ? "Add Category" : `Edit ${initial?.name}`}
        description="Saved to SQL Server — name, description, optional picture."
        actions={<AdminSecondaryButton href="/admin/categories">Back</AdminSecondaryButton>}
      />
      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4">
        <AdminCard className="space-y-4 bg-gradient-to-br from-primary/5 to-white">
          <label className="block text-sm">
            <span className={adminLabelClass}>Category name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </label>
          {mode === "create" ? (
            <div>
              <p className={adminLabelClass}>Core topics</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {coreCategories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => {
                      setName(cat.name);
                      setDescription(cat.description);
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      name === cat.name
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-primary/15 bg-white text-navy hover:border-primary/40"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <label className="block text-sm">
            <span className={adminLabelClass}>Description</span>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </label>
          <div>
            <p className={adminLabelClass}>Picture</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
                setPictureFile(file);
                setPreview(file ? URL.createObjectURL(file) : initial?.pictureUrl ?? null);
              }}
              className="block w-full text-sm text-muted"
            />
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Preview"
                className="mt-3 max-h-36 rounded-xl border border-primary/15 object-contain shadow-sm"
              />
            ) : null}
          </div>
          <label className="block text-sm">
            <span className={adminLabelClass}>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PublishStatus)}
              className={inputClass}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          {error ? (
            <p className="rounded-xl border border-hard/20 bg-hard/10 px-3 py-2 text-sm text-hard">
              {error}
            </p>
          ) : null}
        </AdminCard>
        <AdminPrimaryButton type="submit">{saving ? "Saving…" : "Save category"}</AdminPrimaryButton>
      </form>
    </div>
  );
}
