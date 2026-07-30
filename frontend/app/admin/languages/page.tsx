"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  EmptyState,
  StatusBadge,
} from "@/components/admin/AdminUi";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { adminApi } from "@/lib/admin/api";
import { totalQuestions, type AdminLanguage } from "@/lib/admin/types";

export default function AdminLanguagesPage() {
  const [items, setItems] = useState<AdminLanguage[]>([]);
  const [q, setQ] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi
      .listLanguages()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (l) => l.name.toLowerCase().includes(term) || l.slug.includes(term),
    );
  }, [items, q]);

  return (
    <div>
      <AdminPageHeader
        title="Languages"
        description="Live data from SQL Server."
        actions={<AdminPrimaryButton href="/admin/languages/new">Add Language</AdminPrimaryButton>}
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search languages…"
        className="mb-4 w-full max-w-md rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
      />
      {error ? <p className="mb-3 text-sm text-hard">{error}</p> : null}
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No languages yet"
          description="Add your first language hub."
          action={<AdminPrimaryButton href="/admin/languages/new">Add Language</AdminPrimaryButton>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-soft text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Beginner</th>
                <th className="px-4 py-3">Intermediate</th>
                <th className="px-4 py-3">Expert</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lang) => (
                <tr key={lang.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-navy">{lang.name}</div>
                    <div className="text-xs text-muted">{lang.seoHeading}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{totalQuestions(lang)}</td>
                  <td className="px-4 py-3">{lang.beginner}</td>
                  <td className="px-4 py-3">{lang.intermediate}</td>
                  <td className="px-4 py-3">{lang.expert}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lang.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/languages/${lang.id}`} className="text-primary hover:underline">
                        View
                      </Link>
                      <Link href={`/admin/languages/${lang.id}/edit`} className="text-primary hover:underline">
                        Edit
                      </Link>
                      <button type="button" className="text-hard hover:underline" onClick={() => setDeleteId(lang.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete language?"
        message="This deletes the language from SQL Server."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await adminApi.deleteLanguage(deleteId);
            setDeleteId(null);
            load();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
