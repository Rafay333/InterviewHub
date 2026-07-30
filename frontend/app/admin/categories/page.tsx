"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  EmptyState,
  StatusBadge,
} from "@/components/admin/AdminUi";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { adminCategories, totalQuestions, type AdminCategory } from "@/lib/admin/data";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<AdminCategory[]>(adminCategories);
  const [q, setQ] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.seoHeading.toLowerCase().includes(term),
    );
  }, [items, q]);

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Topic hubs with Beginner / Intermediate / Expert questions."
        actions={<AdminPrimaryButton href="/admin/categories/new">Add Category</AdminPrimaryButton>}
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search categories…"
        className="mb-4 w-full max-w-md rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
      />
      {filtered.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Add System Design, DSA, Behavioral, and more."
          action={<AdminPrimaryButton href="/admin/categories/new">Add Category</AdminPrimaryButton>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-soft text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Beginner</th>
                <th className="px-4 py-3">Intermediate</th>
                <th className="px-4 py-3">Expert</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cat) => (
                <tr key={cat.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-navy">{cat.name}</div>
                    <div className="text-xs text-muted">{cat.seoHeading}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{totalQuestions(cat)}</td>
                  <td className="px-4 py-3">{cat.beginner}</td>
                  <td className="px-4 py-3">{cat.intermediate}</td>
                  <td className="px-4 py-3">{cat.expert}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={cat.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/categories/${cat.id}`} className="text-primary hover:underline">
                        View
                      </Link>
                      <Link href={`/admin/categories/${cat.id}/edit`} className="text-primary hover:underline">
                        Edit
                      </Link>
                      <button type="button" className="text-hard hover:underline" onClick={() => setDeleteId(cat.id)}>
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
        title="Delete category?"
        message="This removes the category from the admin list (mock UI)."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          setItems((prev) => prev.filter((c) => c.id !== deleteId));
          setDeleteId(null);
        }}
      />
    </div>
  );
}
