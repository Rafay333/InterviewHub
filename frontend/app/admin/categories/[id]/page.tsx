"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  DifficultyBadge,
  StatusBadge,
} from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import { totalQuestions, type AdminCategory, type AdminQuestion } from "@/lib/admin/types";

export default function CategoryDetailPage() {
  const params = useParams<{ id: string }>();
  const [cat, setCat] = useState<AdminCategory | null>(null);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.getCategory(params.id),
      adminApi.listQuestions({ categoryId: params.id }),
    ])
      .then(([category, qs]) => {
        setCat(category);
        setQuestions(qs);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Category not found" />
        <AdminSecondaryButton href="/admin/categories">Back</AdminSecondaryButton>
      </div>
    );
  }
  if (!cat) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div>
      <AdminPageHeader
        title={cat.name}
        description={cat.seoHeading}
        actions={
          <>
            <AdminPrimaryButton href={`/admin/questions/new?category=${cat.id}`}>
              Add Question
            </AdminPrimaryButton>
            <AdminSecondaryButton href={`/admin/categories/${cat.id}/edit`}>Edit</AdminSecondaryButton>
          </>
        }
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        <AdminCard>
          <p className="text-xs uppercase text-muted">Total</p>
          <p className="text-2xl font-bold">{totalQuestions(cat)}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs uppercase text-muted">Beginner</p>
          <p className="text-2xl font-bold">{cat.beginner}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs uppercase text-muted">Intermediate</p>
          <p className="text-2xl font-bold">{cat.intermediate}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs uppercase text-muted">Expert</p>
          <p className="text-2xl font-bold">{cat.expert}</p>
        </AdminCard>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-soft text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Difficulty</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="border-t border-border">
                <td className="px-4 py-3">{q.title}</td>
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={q.difficulty} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={q.status} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/questions/${q.id}/edit`} className="text-primary hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {questions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No questions yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
