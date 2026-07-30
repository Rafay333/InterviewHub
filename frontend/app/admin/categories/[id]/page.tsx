"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  DifficultyBadge,
  StatusBadge,
} from "@/components/admin/AdminUi";
import { adminCategories, adminQuestions, totalQuestions } from "@/lib/admin/data";

export default function CategoryDetailPage() {
  const params = useParams<{ id: string }>();
  const cat = adminCategories.find((c) => c.id === params.id);
  const [tab, setTab] = useState<"overview" | "questions" | "seo">("overview");
  const questions = useMemo(
    () => adminQuestions.filter((q) => q.categoryIds.includes(params.id)),
    [params.id],
  );

  if (!cat) {
    return (
      <div>
        <AdminPageHeader title="Category not found" />
        <AdminSecondaryButton href="/admin/categories">Back</AdminSecondaryButton>
      </div>
    );
  }

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
            <AdminSecondaryButton href={`/admin/questions/import?category=${cat.id}`}>
              Import PDF
            </AdminSecondaryButton>
            <AdminSecondaryButton href={`/admin/categories/${cat.id}/edit`}>Edit</AdminSecondaryButton>
          </>
        }
      />
      <div className="mb-4 flex gap-2 border-b border-border pb-2">
        {(["overview", "questions", "seo"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ${
              tab === t ? "bg-primary text-white" : "text-muted hover:bg-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "overview" ? (
        <div className="grid gap-4 sm:grid-cols-4">
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
      ) : null}
      {tab === "questions" ? (
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
      ) : null}
      {tab === "seo" ? (
        <AdminCard className="space-y-2 text-sm">
          <p>
            <span className="text-muted">Heading:</span> {cat.seoHeading}
          </p>
          <p>
            <span className="text-muted">Meta title:</span> {cat.metaTitle}
          </p>
          <p>
            <span className="text-muted">Meta description:</span> {cat.metaDescription}
          </p>
        </AdminCard>
      ) : null}
    </div>
  );
}
