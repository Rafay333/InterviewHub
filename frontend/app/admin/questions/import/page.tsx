"use client";

import { FormEvent, Suspense, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "@/components/admin/AdminUi";
import { adminApi, ApiError } from "@/lib/admin/api";
import type { AdminLanguage, Difficulty } from "@/lib/admin/types";

function PdfImportInner() {
  const search = useSearchParams();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [languageId, setLanguageId] = useState(search.get("language") || "");
  const [difficulty, setDifficulty] = useState<Difficulty | "auto">("beginner");
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    importedCount: number;
    difficulty: string;
    questions: { id: string; title: string; slug: string }[];
  } | null>(null);

  useEffect(() => {
    adminApi.listLanguages().then((rows) => {
      setLanguages(rows);
      if (!languageId && rows[0]) setLanguageId(rows[0].id);
    });
  }, []);

  function clearFile() {
    setFile(null);
    setFileKey((k) => k + 1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!languageId) {
      setError("Select a language.");
      return;
    }
    if (!file) {
      setError("Choose a PDF file first (use the Choose PDF button).");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("languageId", languageId);
    form.append("status", "published");
    if (difficulty !== "auto") form.append("difficulty", difficulty);

    setBusy(true);
    try {
      const data = await adminApi.importQuestionsPdf(form);
      setResult({
        importedCount: data.importedCount,
        difficulty: data.difficulty,
        questions: data.questions,
      });
      clearFile();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="PDF Bulk Import"
        description="Upload a PDF with Question / Answer / Explanation blocks. Questions are created for the selected language."
        actions={<AdminSecondaryButton href="/admin/questions">Back</AdminSecondaryButton>}
      />

      <AdminCard className="max-w-xl">
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Language</span>
            <select
              value={languageId}
              onChange={(e) => setLanguageId(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              required
            >
              {languages.length === 0 ? (
                <option value="">No languages yet</option>
              ) : null}
              {languages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Difficulty</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | "auto")}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="auto">Auto from filename (Beginner/…)</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </label>

          <div className="block text-sm">
            <span className="mb-1 block font-medium">PDF file</span>
            <input
              key={fileKey}
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor={fileInputId}
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-primary/30 bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary-dark"
              >
                Choose PDF
              </label>
              {file ? (
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-sm font-medium text-muted hover:text-navy"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <p className="mt-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy">
              {file ? (
                <>
                  Selected: <span className="font-semibold">{file.name}</span> (
                  {Math.max(1, Math.round(file.size / 1024))} KB)
                </>
              ) : (
                <span className="text-muted">No file selected yet</span>
              )}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface-tint/40 p-3 text-xs leading-relaxed text-muted">
            Expected format per question:
            <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] text-navy">
{`Question 1: What is SQL?
Answer: SQL manages relational databases.
Explanation: It is used to query and modify data.`}
            </pre>
          </div>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <AdminPrimaryButton type="submit" disabled={busy || !languageId || !file}>
            {busy ? "Importing…" : "Import PDF"}
          </AdminPrimaryButton>
        </form>
      </AdminCard>

      {result ? (
        <AdminCard className="mt-6 max-w-2xl space-y-3">
          <p className="text-sm font-semibold text-navy">
            Imported {result.importedCount} question
            {result.importedCount === 1 ? "" : "s"} as {result.difficulty}.
          </p>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {result.questions.map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                <span className="min-w-0 truncate text-navy">{q.title}</span>
                <Link
                  href={`/admin/questions/${q.id}/edit`}
                  className="shrink-0 font-semibold text-primary hover:text-primary-dark"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <AdminSecondaryButton href={`/admin/questions?languageId=${languageId}`}>
              View language questions
            </AdminSecondaryButton>
            <AdminSecondaryButton href="/admin/questions">All questions</AdminSecondaryButton>
          </div>
        </AdminCard>
      ) : null}
    </div>
  );
}

export default function PdfImportPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <PdfImportInner />
    </Suspense>
  );
}
