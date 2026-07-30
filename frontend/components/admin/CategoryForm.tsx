"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "@/components/admin/AdminUi";
import type { AdminCategory, PublishStatus } from "@/lib/admin/data";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

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
  const [picture, setPicture] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    return () => {
      if (picture?.startsWith("blob:")) URL.revokeObjectURL(picture);
    };
  }, [picture]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => router.push("/admin/categories"), 500);
  };

  return (
    <div>
      <AdminPageHeader
        title={mode === "create" ? "Add Category" : `Edit ${initial?.name}`}
        description="Name, short description, optional picture — that’s it."
        actions={<AdminSecondaryButton href="/admin/categories">Back</AdminSecondaryButton>}
      />

      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4">
        <AdminCard className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Category name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g. System Design, DSA, Behavioral"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Description</span>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Short description for this category hub…"
            />
          </label>

          <div>
            <p className="mb-1 text-sm font-medium text-navy">Picture</p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center rounded-lg border border-primary/20 bg-surface-tint px-3 py-1.5 text-xs font-semibold text-primary hover:bg-white">
                {picture ? "Change picture" : "Add picture (optional)"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (picture?.startsWith("blob:")) URL.revokeObjectURL(picture);
                    setPicture(file ? URL.createObjectURL(file) : null);
                  }}
                />
              </label>
              {picture ? (
                <button
                  type="button"
                  className="text-xs font-semibold text-hard hover:underline"
                  onClick={() => {
                    if (picture.startsWith("blob:")) URL.revokeObjectURL(picture);
                    setPicture(null);
                  }}
                >
                  Remove
                </button>
              ) : (
                <span className="text-xs text-muted">Optional</span>
              )}
            </div>
            {picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={picture}
                alt="Category preview"
                className="mt-3 max-h-36 rounded-lg border border-border object-contain"
              />
            ) : null}
          </div>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PublishStatus)}
              className={inputClass}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </AdminCard>

        <div className="flex flex-wrap gap-2">
          <AdminPrimaryButton type="submit">
            {saved ? "Saved…" : mode === "create" ? "Save category" : "Save changes"}
          </AdminPrimaryButton>
          <AdminSecondaryButton href="/admin/categories">Cancel</AdminSecondaryButton>
        </div>
      </form>
    </div>
  );
}
