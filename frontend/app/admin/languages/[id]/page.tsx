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
} from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import { QuestionAdminActions } from "@/components/admin/QuestionAdminActions";
import { totalQuestions, type AdminLanguage, type AdminQuestion } from "@/lib/admin/types";

export default function LanguageDetailPage() {
  const params = useParams<{ id: string }>();
  const [lang, setLang] = useState<AdminLanguage | null>(null);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.getLanguage(params.id),
      adminApi.listQuestions({ languageId: params.id }),
    ])
      .then(([language, qs]) => {
        setLang(language);
        setQuestions(qs.items);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Language not found" eyebrow="Languages" />
        <p className="mb-2 rounded-xl border border-hard/20 bg-hard/10 px-4 py-3 text-sm text-hard">
          {error}
        </p>
        <AdminSecondaryButton href="/admin/languages">Back</AdminSecondaryButton>
      </div>
    );
  }
  if (!lang) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div>
      <AdminPageHeader
        title={lang.name}
        eyebrow="Languages"
        description={lang.seoHeading}
        actions={
          <>
            <AdminPrimaryButton href={`/admin/questions/new?language=${lang.id}`}>
              Add Question
            </AdminPrimaryButton>
            <AdminSecondaryButton href={`/admin/languages/${lang.id}/edit`}>Edit</AdminSecondaryButton>
          </>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Total" value={totalQuestions(lang)} tone={0} />
        <AdminStatCard label="Beginner" value={lang.beginner} tone={1} />
        <AdminStatCard label="Intermediate" value={lang.intermediate} tone={2} />
        <AdminStatCard label="Expert" value={lang.expert} tone={3} />
      </div>

      <AdminSectionTitle>Questions</AdminSectionTitle>
      <AdminTable>
        <table className="min-w-full text-left text-sm">
          <AdminTableHead>
            <tr>
              <AdminTh>Title</AdminTh>
              <AdminTh>Difficulty</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Actions</AdminTh>
            </tr>
          </AdminTableHead>
          <tbody>
            {questions.map((q) => (
              <AdminTr key={q.id}>
                <AdminTd className="font-medium text-navy">{q.title}</AdminTd>
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
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No questions yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </AdminTable>
    </div>
  );
}
