"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminSectionTitle,
  AdminStatCard,
  AdminTable,
  AdminTableHead,
  AdminTd,
  AdminTh,
  AdminTr,
  DifficultyBadge,
  StatusBadge,
  AdminLink,
} from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import { QuestionAdminActions } from "@/components/admin/QuestionAdminActions";
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
        setQuestions(qs.items);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Category not found" eyebrow="Categories" />
        <p className="mb-2 rounded-xl border border-hard/20 bg-hard/10 px-4 py-3 text-sm text-hard">
          {error}
        </p>
        <AdminSecondaryButton href="/admin/categories">Back</AdminSecondaryButton>
      </div>
    );
  }
  if (!cat) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div>
      <AdminPageHeader
        title={cat.name}
        eyebrow="Categories"
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

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Languages" value={languages.length} tone={0} />
        <AdminStatCard label="Total questions" value={totalQuestions(cat)} tone={1} />
        <AdminStatCard label="Beginner" value={cat.beginner} tone={2} />
        <AdminStatCard label="Expert" value={cat.expert} tone={3} />
      </div>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <AdminSectionTitle>Languages in this category</AdminSectionTitle>
          <AdminSecondaryButton href={`/admin/languages/new?category=${cat.id}`}>
            Add Language
          </AdminSecondaryButton>
        </div>
        <AdminTable>
          <table className="min-w-full text-left text-sm">
            <AdminTableHead>
              <tr>
                <AdminTh>Language</AdminTh>
                <AdminTh>Questions</AdminTh>
                <AdminTh>Status</AdminTh>
                <AdminTh>Actions</AdminTh>
              </tr>
            </AdminTableHead>
            <tbody>
              {languages.map((lang) => (
                <AdminTr key={lang.id}>
                  <AdminTd className="font-medium text-navy">{lang.name}</AdminTd>
                  <AdminTd>{totalQuestions(lang)}</AdminTd>
                  <AdminTd>
                    <StatusBadge status={lang.status} />
                  </AdminTd>
                  <AdminTd>
                    <div className="flex flex-wrap gap-3">
                      <AdminLink href={`/admin/languages/${lang.id}`}>View</AdminLink>
                      <AdminLink
                        href={`/admin/questions/new?category=${cat.id}&language=${lang.id}`}
                      >
                        Add question
                      </AdminLink>
                    </div>
                  </AdminTd>
                </AdminTr>
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
        </AdminTable>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <AdminSectionTitle>Questions in this category</AdminSectionTitle>
          <AdminSecondaryButton href={`/admin/questions/new?category=${cat.id}`}>
            Add Question
          </AdminSecondaryButton>
        </div>
        <AdminTable>
          <table className="min-w-full text-left text-sm">
            <AdminTableHead>
              <tr>
                <AdminTh>Title</AdminTh>
                <AdminTh>Language</AdminTh>
                <AdminTh>Difficulty</AdminTh>
                <AdminTh>Status</AdminTh>
                <AdminTh>Actions</AdminTh>
              </tr>
            </AdminTableHead>
            <tbody>
              {questions.map((q) => (
                <AdminTr key={q.id}>
                  <AdminTd className="font-medium text-navy">{q.title}</AdminTd>
                  <AdminTd className="text-muted">{q.languageName || "—"}</AdminTd>
                  <AdminTd>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </AdminTd>
                  <AdminTd>
                    <StatusBadge status={q.status} />
                  </AdminTd>
                  <AdminTd>
                    <QuestionAdminActions id={q.id} />
                  </AdminTd>
                </AdminTr>
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
        </AdminTable>
      </section>
    </div>
  );
}
