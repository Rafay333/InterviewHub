"use client";

import { FormEvent, Suspense, useEffect, useId, useMemo, useRef, useState } from "react";
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

type PreviewItem = {
  index: number;
  questionText: string;
  answerText: string;
  descriptionText: string;
  descriptionImagePreview?: string | null;
};

type PreviewData = {
  fileName: string;
  fileSizeKb: number;
  difficulty: string;
  count: number;
  imagesFound?: number;
  questions: PreviewItem[];
};

type ImportResult = {
  importedCount: number;
  imagesAttached?: number;
  difficulty: string;
  questions: { id: string; title: string; slug: string; hasDiagram?: boolean }[];
};

function PdfImportInner() {
  const search = useSearchParams();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [languageId, setLanguageId] = useState(search.get("language") || "");
  const [difficulty, setDifficulty] = useState<Difficulty | "auto">("beginner");
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [showPdfPreview, setShowPdfPreview] = useState(true);
  const [busy, setBusy] = useState<"preview" | "import" | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const pdfObjectUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
    };
  }, [pdfObjectUrl]);

  useEffect(() => {
    adminApi.listLanguages().then((rows) => {
      setLanguages(rows);
      if (!languageId && rows[0]) setLanguageId(rows[0].id);
    });
  }, []);

  function clearFile() {
    setFile(null);
    setPreview(null);
    setFileKey((k) => k + 1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onFileChange(selected: File | null) {
    setFile(selected);
    setPreview(null);
    setResult(null);
    setError("");
    setShowPdfPreview(true);
  }

  function buildForm() {
    const form = new FormData();
    if (file) form.append("file", file);
    form.append("languageId", languageId);
    form.append("status", "published");
    if (difficulty !== "auto") form.append("difficulty", difficulty);
    return form;
  }

  async function onPreview() {
    setError("");
    setResult(null);
    if (!file) {
      setError("Choose a PDF first.");
      return;
    }
    setBusy("preview");
    try {
      const data = await adminApi.previewQuestionsPdf(buildForm());
      setPreview({
        fileName: data.fileName,
        fileSizeKb: data.fileSizeKb,
        difficulty: data.difficulty,
        count: data.count,
        questions: data.questions,
      });
      setShowPdfPreview(false);
    } catch (err) {
      setPreview(null);
      setError(err instanceof ApiError ? err.message : "Preview failed.");
    } finally {
      setBusy(null);
    }
  }

  async function onImport(event?: FormEvent) {
    event?.preventDefault();
    setError("");
    setResult(null);

    if (!languageId) {
      setError("Select a language.");
      return;
    }
    if (!file) {
      setError("Choose a PDF file first.");
      return;
    }

    setBusy("import");
    try {
      const data = await adminApi.importQuestionsPdf(buildForm());
      setResult({
        importedCount: data.importedCount,
        difficulty: data.difficulty,
        questions: data.questions,
      });
      setPreview(null);
      setFile(null);
      setFileKey((k) => k + 1);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setError("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Import failed.");
    } finally {
      setBusy(null);
    }
  }

  const levelTone =
    difficulty === "expert"
      ? "from-hard/20 to-white border-hard/30"
      : difficulty === "intermediate"
        ? "from-medium/20 to-white border-medium/30"
        : "from-easy/20 to-white border-easy/30";

  return (
    <div>
      <AdminPageHeader
        title="PDF Bulk Import"
        description="Download the PDF template to see how Question / Answer / Explanation should look, then upload your own PDF, preview, and import."
        actions={
          <div className="flex flex-wrap gap-2">
            <a
              href="/templates/interviewhub-questions-template.pdf"
              download
              className="inline-flex items-center justify-center rounded-lg border border-accent/40 bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-accent/25 transition hover:bg-orange-600"
            >
              Download PDF template
            </a>
            <a
              href="/templates/interviewhub-questions-template.txt"
              download
              className="inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Text template
            </a>
            <AdminSecondaryButton href="/admin/questions">Back</AdminSecondaryButton>
          </div>
        }
      />

      {/* Colorful steps */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            step: "1",
            title: "PDF template",
            text: "Download PDF — see Question, Answer, Explanation layout",
            tone: "border-primary/25 bg-gradient-to-br from-primary/15 to-white text-primary",
          },
          {
            step: "2",
            title: "Upload & preview",
            text: "Choose your PDF and review parsed rows",
            tone: "border-accent/30 bg-gradient-to-br from-accent/15 to-white text-accent",
          },
          {
            step: "3",
            title: "Import",
            text: "Save questions to SQL Server",
            tone: "border-easy/30 bg-gradient-to-br from-easy/15 to-white text-easy",
          },
        ].map((item) => (
          <div
            key={item.step}
            className={`rounded-2xl border p-4 shadow-sm ${item.tone}`}
          >
            <p className="text-xs font-bold uppercase tracking-wide opacity-80">
              Step {item.step}
            </p>
            <p className="mt-1 text-base font-bold text-navy">{item.title}</p>
            <p className="mt-1 text-xs text-muted">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <AdminCard className={`space-y-4 border bg-gradient-to-b ${levelTone}`}>
          <form className="space-y-4" onSubmit={onImport}>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-navy">Language</span>
              <select
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value)}
                className="w-full rounded-xl border border-primary/20 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary"
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
              <span className="mb-1 block font-semibold text-navy">Difficulty</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty | "auto")}
                className="w-full rounded-xl border border-primary/20 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary"
              >
                <option value="auto">Auto from filename</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </label>

            <div className="block text-sm">
              <span className="mb-1 block font-semibold text-navy">PDF file</span>
              <input
                key={fileKey}
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
              />
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor={fileInputId}
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary-dark"
                >
                  Choose PDF
                </label>
                {file ? (
                  <button
                    type="button"
                    onClick={clearFile}
                    className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-muted hover:text-navy"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
              <p
                className={`mt-2 rounded-xl border px-3 py-2 text-sm ${
                  file
                    ? "border-primary/25 bg-primary/10 text-navy"
                    : "border-dashed border-border bg-white text-muted"
                }`}
              >
                {file ? (
                  <>
                    <span className="font-semibold text-primary">{file.name}</span>
                    <span className="text-muted">
                      {" "}
                      · {Math.max(1, Math.round(file.size / 1024))} KB
                    </span>
                  </>
                ) : (
                  "No file selected yet"
                )}
              </p>
            </div>

            <div className="rounded-xl border border-primary/15 bg-white/90 p-3 text-xs text-muted">
              <p className="font-semibold text-primary">Format (template matches this)</p>
              <pre className="mt-2 max-h-36 overflow-auto whitespace-pre-wrap rounded-lg bg-surface-tint/80 p-2 font-mono text-[11px] text-navy">
{`Q1. What is React?
Answer: React is a JavaScript library...
Explanation: React builds UIs with components.

Q2. What is JSX?
Answer: HTML-like syntax in JavaScript.
Explanation: Babel compiles JSX for React.`}
              </pre>
            </div>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                disabled={!file || busy !== null}
                onClick={onPreview}
                className="inline-flex items-center justify-center rounded-xl border border-accent/40 bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy === "preview" ? "Previewing…" : "Preview parse"}
              </button>
              <AdminPrimaryButton type="submit" disabled={!languageId || !file || busy !== null}>
                {busy === "import" ? "Importing…" : "Import PDF"}
              </AdminPrimaryButton>
            </div>
          </form>
        </AdminCard>

        <div className="space-y-4">
          {/* PDF visual preview */}
          {file && pdfObjectUrl ? (
            <div className="overflow-hidden rounded-2xl border border-primary/20 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/10 bg-gradient-to-r from-primary/10 via-white to-accent/10 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-navy">File preview</p>
                  <p className="text-xs text-muted">{file.name}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPdfPreview((v) => !v)}
                    className="rounded-lg border border-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white"
                  >
                    {showPdfPreview ? "Hide PDF" : "Show PDF"}
                  </button>
                  <a
                    href={pdfObjectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-white"
                  >
                    Open in tab
                  </a>
                </div>
              </div>
              {showPdfPreview ? (
                <iframe
                  title="PDF preview"
                  src={pdfObjectUrl}
                  className="h-[420px] w-full bg-slate-50"
                />
              ) : (
                <p className="px-4 py-8 text-center text-sm text-muted">
                  PDF preview hidden. Use “Show PDF” or “Preview parse” for Q&amp;A rows.
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-primary/25 bg-gradient-to-br from-surface-tint to-white px-6 py-14 text-center">
              <p className="text-sm font-semibold text-navy">No PDF loaded</p>
              <p className="mt-2 text-xs text-muted">
                Download the template, export as PDF, then choose the file to preview here.
              </p>
              <a
                href="/templates/interviewhub-questions-template.pdf"
                download
                className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/25 hover:bg-primary-dark"
              >
                Download PDF template
              </a>
            </div>
          )}

          {/* Parsed preview */}
          {preview ? (
            <div className="overflow-hidden rounded-2xl border border-accent/25 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-accent/15 bg-gradient-to-r from-accent/15 to-primary/10 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-navy">Parsed questions preview</p>
                  <p className="text-xs text-muted">
                    {preview.count} question{preview.count === 1 ? "" : "s"} · level{" "}
                    <span className="font-semibold text-accent">{preview.difficulty}</span>
                    {typeof preview.imagesFound === "number" ? (
                      <>
                        {" "}
                        ·{" "}
                        <span className="font-semibold text-primary">
                          {preview.imagesFound} diagram
                          {preview.imagesFound === 1 ? "" : "s"} found
                        </span>
                      </>
                    ) : null}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onImport()}
                  disabled={!languageId || busy !== null}
                  className="rounded-lg bg-easy px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
                >
                  Confirm import
                </button>
              </div>
              <ul className="max-h-[480px] space-y-3 overflow-y-auto p-4">
                {preview.questions.map((q) => (
                  <li
                    key={q.index}
                    className="rounded-xl border border-primary/10 bg-gradient-to-br from-white to-surface-tint/60 p-4 shadow-sm"
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                      Question {q.index}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-navy">{q.questionText}</p>
                    <div className="mt-3 rounded-lg border border-easy/20 bg-easy/10 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-easy">
                        Answer
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-ink">{q.answerText}</p>
                    </div>
                    {q.descriptionText ? (
                      <div className="mt-2 rounded-lg border border-accent/20 bg-accent/10 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-accent">
                          Explanation
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted">
                          {q.descriptionText}
                        </p>
                      </div>
                    ) : null}
                    {q.descriptionImagePreview ? (
                      <div className="mt-2 overflow-hidden rounded-lg border border-primary/20 bg-white p-2">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-primary">
                          Diagram / image (will import)
                        </p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={q.descriptionImagePreview}
                          alt={`Diagram for question ${q.index}`}
                          className="max-h-64 w-full rounded-md border border-primary/10 object-contain"
                        />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result ? (
            <div className="overflow-hidden rounded-2xl border border-easy/30 bg-white shadow-sm">
              <div className="border-b border-easy/20 bg-gradient-to-r from-easy/20 to-white px-4 py-3">
                <p className="text-sm font-bold text-navy">
                  Imported {result.importedCount} question
                  {result.importedCount === 1 ? "" : "s"} as{" "}
                  <span className="text-easy">{result.difficulty}</span>
                  {typeof result.imagesAttached === "number" ? (
                    <>
                      {" "}
                      · {result.imagesAttached} diagram
                      {result.imagesAttached === 1 ? "" : "s"} attached
                    </>
                  ) : null}
                </p>
              </div>
              <ul className="divide-y divide-border">
                {result.questions.map((q) => (
                  <li
                    key={q.id}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                  >
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
              <div className="flex flex-wrap gap-2 border-t border-border p-4">
                <AdminSecondaryButton href={`/admin/questions?languageId=${languageId}`}>
                  View language questions
                </AdminSecondaryButton>
                <AdminSecondaryButton href="/admin/questions">All questions</AdminSecondaryButton>
              </div>
            </div>
          ) : null}
        </div>
      </div>
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
