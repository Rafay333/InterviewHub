"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
} from "@/components/admin/AdminUi";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { adminApi } from "@/lib/admin/api";
import type { MediaItem } from "@/lib/admin/types";

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [type, setType] = useState<"all" | "image" | "pdf">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi
      .listMedia()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    return items.filter((item) => (type === "all" ? true : item.type === type));
  }, [items, type]);

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));
    try {
      await adminApi.uploadMedia(form);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Media / Uploads"
        description="Files stored on the API server and tracked in SQL Server."
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
      <div className="mb-4 flex gap-2">
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
      {error ? <p className="mb-3 text-sm text-hard">{error}</p> : null}
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <EmptyState title="No media yet" description="Upload images or PDFs." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <AdminCard key={item.id}>
              <p className="truncate font-semibold text-navy">{item.name}</p>
              <p className="mt-1 text-xs text-muted">
                {item.type} · {item.sizeLabel} · {item.uploadedAt}
              </p>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-primary hover:underline">
                  Open
                </a>
              ) : null}
              <button
                type="button"
                className="ml-3 text-sm text-hard hover:underline"
                onClick={() => setDeleteId(item.id)}
              >
                Delete
              </button>
            </AdminCard>
          ))}
        </div>
      )}
      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete media?"
        message="Removes the media row from SQL Server."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await adminApi.deleteMedia(deleteId);
          setDeleteId(null);
          load();
        }}
      />
    </div>
  );
}
