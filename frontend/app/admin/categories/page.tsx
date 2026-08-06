"use client";

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
import { totalQuestions, type AdminCategory } from "@/lib/admin/types";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [q, setQ] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi
      .listCategories()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((c) => c.name.toLowerCase().includes(term));
  }, [items, q]);

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Topic hubs: System Design, DSA, Behavioral, and more."
        actions={<AdminPrimaryButton href="/admin/categories/new">Add Category</AdminPrimaryButton>}
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search categories…"
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
          title="No categories yet"
          description="Add System Design, DSA, Behavioral, and more."
          action={<AdminPrimaryButton href="/admin/categories/new">Add Category</AdminPrimaryButton>}
        />
      ) : (
        <AdminTable>
          <table className="min-w-full text-left text-sm">
            <AdminTableHead>
              <tr>
                <AdminTh>Category</AdminTh>
                <AdminTh>Total</AdminTh>
                <AdminTh>Beginner</AdminTh>
                <AdminTh>Intermediate</AdminTh>
                <AdminTh>Expert</AdminTh>
                <AdminTh>Status</AdminTh>
                <AdminTh>Actions</AdminTh>
              </tr>
            </AdminTableHead>
            <tbody>
              {filtered.map((cat) => (
                <AdminTr key={cat.id}>
                  <AdminTd>
                    <div className="font-semibold text-navy">{cat.name}</div>
                    <div className="text-xs text-muted">{cat.seoHeading}</div>
                  </AdminTd>
                  <AdminTd className="font-bold text-primary">{totalQuestions(cat)}</AdminTd>
                  <AdminTd>
                    <span className="rounded-full bg-easy/15 px-2 py-0.5 text-xs font-semibold text-easy">
                      {cat.beginner}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <span className="rounded-full bg-medium/15 px-2 py-0.5 text-xs font-semibold text-medium">
                      {cat.intermediate}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <span className="rounded-full bg-hard/15 px-2 py-0.5 text-xs font-semibold text-hard">
                      {cat.expert}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <StatusBadge status={cat.status} />
                  </AdminTd>
                  <AdminTd>
                    <div className="flex flex-wrap gap-3">
                      <AdminLink href={`/admin/categories/${cat.id}`}>View</AdminLink>
                      <AdminLink href={`/admin/categories/${cat.id}/edit`}>Edit</AdminLink>
                      <button
                        type="button"
                        className="font-semibold text-hard hover:text-red-700"
                        onClick={() => setDeleteId(cat.id)}
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
        title="Delete category?"
        message="This deletes the category from SQL Server."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await adminApi.deleteCategory(deleteId);
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
