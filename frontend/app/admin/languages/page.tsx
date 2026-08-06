"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  adminInputClass,
  AdminLink,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminTable,
  AdminTableHead,
  AdminTd,
  AdminTh,
  AdminTr,
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
        description="Publish language hubs with logos and question levels."
        actions={<AdminPrimaryButton href="/admin/languages/new">Add Language</AdminPrimaryButton>}
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search languages…"
        className={`mb-4 max-w-md ${adminInputClass}`}
      />
      {error ? (
        <p className="mb-3 rounded-xl border border-hard/20 bg-hard/10 px-3 py-2 text-sm text-hard">
          {error}
        </p>
      ) : null}
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No languages yet"
          description="Add your first language hub."
          action={<AdminPrimaryButton href="/admin/languages/new">Add Language</AdminPrimaryButton>}
        />
      ) : (
        <AdminTable>
          <table className="min-w-full text-left text-sm">
            <AdminTableHead>
              <tr>
                <AdminTh>Language</AdminTh>
                <AdminTh>Total</AdminTh>
                <AdminTh>Beginner</AdminTh>
                <AdminTh>Intermediate</AdminTh>
                <AdminTh>Expert</AdminTh>
                <AdminTh>Status</AdminTh>
                <AdminTh>Actions</AdminTh>
              </tr>
            </AdminTableHead>
            <tbody>
              {filtered.map((lang) => (
                <AdminTr key={lang.id}>
                  <AdminTd>
                    <div className="font-semibold text-navy">{lang.name}</div>
                    <div className="text-xs text-muted">{lang.seoHeading}</div>
                  </AdminTd>
                  <AdminTd className="font-bold text-primary">{totalQuestions(lang)}</AdminTd>
                  <AdminTd>
                    <span className="rounded-full bg-easy/15 px-2 py-0.5 text-xs font-semibold text-easy">
                      {lang.beginner}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <span className="rounded-full bg-medium/15 px-2 py-0.5 text-xs font-semibold text-medium">
                      {lang.intermediate}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <span className="rounded-full bg-hard/15 px-2 py-0.5 text-xs font-semibold text-hard">
                      {lang.expert}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <StatusBadge status={lang.status} />
                  </AdminTd>
                  <AdminTd>
                    <div className="flex flex-wrap gap-3">
                      <AdminLink href={`/admin/languages/${lang.id}`}>View</AdminLink>
                      <AdminLink href={`/admin/languages/${lang.id}/edit`}>Edit</AdminLink>
                      <button
                        type="button"
                        className="font-semibold text-hard hover:text-red-700"
                        onClick={() => setDeleteId(lang.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </table>
        </AdminTable>
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
