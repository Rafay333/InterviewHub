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
import {
  adminLanguages,
  adminQuestions,
  pdfImports,
  totalQuestions,
} from "@/lib/admin/data";

export default function LanguageDetailPage() {
  const params = useParams<{ id: string }>();
  const lang = adminLanguages.find((l) => l.id === params.id);
  const [tab, setTab] = useState<"overview" | "questions" | "pdfs" | "seo">("overview");

  const questions = useMemo(
    () => adminQuestions.filter((q) => q.languageIds.includes(params.id)),
    [params.id],
  );
  const imports = useMemo(
    () => pdfImports.filter((p) => p.languageId === params.id),
    [params.id],
  );

  if (!lang) {
    return (
      <div>
        <AdminPageHeader title="Language not found" />
        <AdminSecondaryButton href="/admin/languages">Back to languages</AdminSecondaryButton>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "questions" as const, label: "Questions" },
    { id: "pdfs" as const, label: "PDF Imports" },
    { id: "seo" as const, label: "SEO" },
  ];

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
            <AdminSecondaryButton href={`/admin/questions/import?language=${lang.id}`}>
              Import PDF
            </AdminSecondaryButton>
            <AdminSecondaryButton href={`/admin/languages/${lang.id}/edit`}>Edit</AdminSecondaryButton>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2 border-b border-border pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              tab === t.id ? "bg-primary text-white" : "text-muted hover:bg-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminCard>
            <p className="text-xs uppercase text-muted">Total questions</p>
            <p className="mt-1 text-2xl font-bold">{totalQuestions(lang)}</p>
          </AdminCard>
          <AdminCard>
            <p className="text-xs uppercase text-muted">Beginner</p>
            <p className="mt-1 text-2xl font-bold">{lang.beginner}</p>
          </AdminCard>
          <AdminCard>
            <p className="text-xs uppercase text-muted">Intermediate</p>
            <p className="mt-1 text-2xl font-bold">{lang.intermediate}</p>
          </AdminCard>
          <AdminCard>
            <p className="text-xs uppercase text-muted">Expert</p>
            <p className="mt-1 text-2xl font-bold">{lang.expert}</p>
          </AdminCard>
          <AdminCard className="sm:col-span-2">
            <p className="text-sm text-muted">{lang.description}</p>
            <div className="mt-3">
              <StatusBadge status={lang.status} />
            </div>
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
                  <td className="px-4 py-3 font-medium">{q.title}</td>
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
                    No questions linked yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "pdfs" ? (
        <div className="space-y-3">
          {imports.map((job) => (
            <AdminCard key={job.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-navy">{job.fileName}</p>
                <p className="text-xs text-muted">
                  {job.status} · {job.importedCount} imported · {job.createdAt}
                </p>
              </div>
              <AdminSecondaryButton href={`/admin/questions/import?job=${job.id}`}>
                Open
              </AdminSecondaryButton>
            </AdminCard>
          ))}
          {imports.length === 0 ? (
            <AdminCard>
              <p className="text-sm text-muted">No PDF imports for this language yet.</p>
            </AdminCard>
          ) : null}
        </div>
      ) : null}

      {tab === "seo" ? (
        <AdminCard className="space-y-2 text-sm">
          <p>
            <span className="text-muted">Heading:</span> {lang.seoHeading}
          </p>
          <p>
            <span className="text-muted">Meta title:</span> {lang.metaTitle}
          </p>
          <p>
            <span className="text-muted">Meta description:</span> {lang.metaDescription}
          </p>
          <p>
            <span className="text-muted">Slug:</span> /languages/{lang.slug}
          </p>
        </AdminCard>
      ) : null}
    </div>
  );
}
