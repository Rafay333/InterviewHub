"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type { AdminLanguage, PublishStatus } from "@/lib/admin/types";

type Props = {
  mode: "create" | "edit";
  initial?: AdminLanguage;
};

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

export function LanguageForm({ mode, initial }: Props) {
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

      if (mode === "create") await adminApi.createLanguage(form);
      else if (initial) await adminApi.updateLanguage(initial.id, form);

      router.push("/admin/languages");
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
        title={mode === "create" ? "Add Language" : `Edit ${initial?.name}`}
        description="Saved to SQL Server — name, description, optional picture."
        actions={<AdminSecondaryButton href="/admin/languages">Back</AdminSecondaryButton>}
      />

      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4">
        <AdminCard className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Language name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Description</span>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
          </label>
          <div>
            <p className="mb-1 text-sm font-medium text-navy">Picture</p>
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
              <img src={preview} alt="Preview" className="mt-3 max-h-36 rounded-lg border object-contain" />
            ) : null}
          </div>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as PublishStatus)} className={inputClass}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          {error ? <p className="text-sm text-hard">{error}</p> : null}
        </AdminCard>
        <AdminPrimaryButton type="submit">{saving ? "Saving…" : "Save language"}</AdminPrimaryButton>
      </form>
    </div>
  );
}
