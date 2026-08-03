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
import {
  totalQuestions,
  type AdminCategory,
  type AdminLanguage,
  type AdminQuestion,
} from "@/lib/admin/types";

export default function CategoryDetailPage() {
  const params = useParams<{ id: string }>();
  const [cat, setCat] = useState<AdminCategory | null>(null);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.getCategory(params.id),
      adminApi.listLanguages({ categoryId: params.id }),
      adminApi.listQuestions({ categoryId: params.id }),
    ])
      .then(([category, langs, qs]) => {
        setCat(category);
        setLanguages(langs);
        setQuestions(qs);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Category not found" />
        <p className="mb-2 text-sm text-hard">{error}</p>
        <AdminSecondaryButton href="/admin/categories">Back</AdminSecondaryButton>
      </div>
    );
  }
  if (!cat) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div>
      <AdminPageHeader
        title={cat.name}
        description="This category has its own languages and questions."
        actions={
          <>
            <AdminPrimaryButton href={`/admin/languages/new?category=${cat.id}`}>
              Add Language
            </AdminPrimaryButton>
            <AdminPrimaryButton href={`/admin/questions/new?category=${cat.id}`}>
              Add Question
            </AdminPrimaryButton>
            <AdminSecondaryButton href={`/admin/categories/${cat.id}/edit`}>Edit</AdminSecondaryButton>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <AdminCard>
          <p className="text-xs uppercase text-muted">Languages</p>
          <p className="text-2xl font-bold">{languages.length}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs uppercase text-muted">Total questions</p>
          <p className="text-2xl font-bold">{totalQuestions(cat)}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs uppercase text-muted">Beginner</p>
          <p className="text-2xl font-bold">{cat.beginner}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs uppercase text-muted">Expert</p>
          <p className="text-2xl font-bold">{cat.expert}</p>
        </AdminCard>
      </div>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-navy">Languages in this category</h2>
          <AdminSecondaryButton href={`/admin/languages/new?category=${cat.id}`}>
            Add Language
          </AdminSecondaryButton>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-soft text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3 text-left">Language</th>
                <th className="px-4 py-3 text-left">Questions</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((lang) => (
                <tr key={lang.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-navy">{lang.name}</td>
                  <td className="px-4 py-3">{totalQuestions(lang)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lang.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/languages/${lang.id}`} className="text-primary hover:underline">
                        View
                      </Link>
                      <Link
                        href={`/admin/questions/new?category=${cat.id}&language=${lang.id}`}
                        className="text-primary hover:underline"
                      >
                        Add question
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {languages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">
                    No languages in this category yet. Click Add Language.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-navy">Questions in this category</h2>
          <AdminSecondaryButton href={`/admin/questions/new?category=${cat.id}`}>
            Add Question
          </AdminSecondaryButton>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-soft text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Language</th>
                <th className="px-4 py-3 text-left">Difficulty</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-t border-border">
                  <td className="px-4 py-3">{q.title}</td>
                  <td className="px-4 py-3 text-muted">{q.languageName || "—"}</td>
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
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    No questions yet. Click Add Question.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
