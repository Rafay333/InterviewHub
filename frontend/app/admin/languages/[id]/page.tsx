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
        setQuestions(qs);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Language not found" />
        <p className="text-sm text-hard">{error}</p>
        <AdminSecondaryButton href="/admin/languages">Back</AdminSecondaryButton>
      </div>
    );
  }
  if (!lang) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div>
      <AdminPageHeader
        title={lang.name}
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
      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        <AdminCard>
          <p className="text-xs uppercase text-muted">Total</p>
          <p className="text-2xl font-bold">{totalQuestions(lang)}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs uppercase text-muted">Beginner</p>
          <p className="text-2xl font-bold">{lang.beginner}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs uppercase text-muted">Intermediate</p>
          <p className="text-2xl font-bold">{lang.intermediate}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs uppercase text-muted">Expert</p>
          <p className="text-2xl font-bold">{lang.expert}</p>
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
