"use client";

import { useMemo, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  EmptyState,
} from "@/components/admin/AdminUi";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { mediaItems, type MediaItem } from "@/lib/admin/data";

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>(mediaItems);
  const [type, setType] = useState<"all" | "image" | "pdf">("all");
  const [q, setQ] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (type !== "all" && item.type !== type) return false;
      const term = q.trim().toLowerCase();
      if (term && !item.name.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [items, type, q]);

  const onUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const next: MediaItem[] = Array.from(files).map((file, i) => ({
      id: `m-local-${Date.now()}-${i}`,
      name: file.name,
      type: file.type.includes("pdf") ? "pdf" : "image",
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      usedIn: "Unused",
      uploadedAt: new Date().toISOString().slice(0, 10),
    }));
    setItems((prev) => [...next, ...prev]);
  };

  return (
    <div>
      <AdminPageHeader
        title="Media / Uploads"
        description="Images for answers & covers, plus PDFs for bulk import and resources. SQL table screenshots welcome."
        actions={
          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
            Upload files
            <input
              type="file"
              accept="image/*,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => onUpload(e.target.files)}
            />
          </label>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search media…"
          className="w-full max-w-md rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        />
        {(["all", "image", "pdf"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize ${
              type === t ? "bg-primary text-white" : "border border-border bg-white text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No media yet"
          description="Upload images for SQL tables/solutions or PDF question packs."
          action={<AdminPrimaryButton href="/admin/questions/import">Import PDF pack</AdminPrimaryButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <AdminCard key={item.id}>
              <div
                className={`mb-3 flex h-28 items-center justify-center rounded-lg ${
                  item.type === "pdf" ? "bg-[#fff7ed] text-accent" : "bg-surface-tint text-primary"
                }`}
              >
                <span className="text-sm font-bold uppercase">{item.type}</span>
              </div>
              <p className="truncate font-semibold text-navy" title={item.name}>
                {item.name}
              </p>
              <p className="mt-1 text-xs text-muted">
                {item.sizeLabel} · {item.uploadedAt}
              </p>
              <p className="mt-1 text-xs text-muted">Used in: {item.usedIn}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    void navigator.clipboard?.writeText(`/media/${item.name}`);
                    setCopied(item.id);
                    setTimeout(() => setCopied(null), 1200);
                  }}
                >
                  {copied === item.id ? "Copied" : "Copy URL"}
                </button>
                <button
                  type="button"
                  className="text-hard hover:underline"
                  onClick={() => setDeleteId(item.id)}
                >
                  Delete
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete media?"
        message="Remove this file from the library (mock UI)."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          setItems((prev) => prev.filter((m) => m.id !== deleteId));
          setDeleteId(null);
        }}
      />
    </div>
  );
}
