"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  DifficultyBadge,
} from "@/components/admin/AdminUi";
import {
  adminCategories,
  adminLanguages,
  pdfImports,
  type Difficulty,
} from "@/lib/admin/data";

type Step = "upload" | "processing" | "review" | "done";

function PdfImportInner() {
  const router = useRouter();
  const search = useSearchParams();
  const jobId = search.get("job");
  const existing = pdfImports.find((p) => p.id === jobId);

  const [step, setStep] = useState<Step>(
    existing?.status === "review" ? "review" : existing?.status === "imported" ? "done" : "upload",
  );
  const [languageId, setLanguageId] = useState(
    search.get("language") ?? existing?.languageId ?? adminLanguages[0]?.id ?? "",
  );
  const [categoryId, setCategoryId] = useState(search.get("category") ?? existing?.categoryId ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    existing?.defaultDifficulty ?? "intermediate",
  );
  const [fileName, setFileName] = useState(existing?.fileName ?? "");
  const [parsed, setParsed] = useState(
    existing?.parsedQuestions ?? [
      {
        id: "pq-new-1",
        title: "Find second highest salary",
        difficulty: "intermediate" as Difficulty,
        answerPreview: "Use ORDER BY salary DESC LIMIT 1 OFFSET 1…",
        include: true,
      },
      {
        id: "pq-new-2",
        title: "Explain INNER JOIN vs LEFT JOIN",
        difficulty: "beginner" as Difficulty,
        answerPreview: "INNER JOIN returns matching rows only…",
        include: true,
      },
      {
        id: "pq-new-3",
        title: "Low quality extract",
        difficulty: "beginner" as Difficulty,
        answerPreview: "…",
        include: false,
      },
    ],
  );
  const [importedCount, setImportedCount] = useState(existing?.importedCount ?? 0);

  const included = useMemo(() => parsed.filter((p) => p.include).length, [parsed]);

  const startImport = () => {
    if (!fileName || !languageId) return;
    setStep("processing");
    setTimeout(() => setStep("review"), 1200);
  };

  const confirmImport = () => {
    setImportedCount(included);
    setStep("done");
  };

  return (
    <div>
      <AdminPageHeader
        title="PDF Bulk Import"
        description="Upload a Q&A PDF → extract → review → create Beginner / Intermediate / Expert questions."
        actions={<AdminSecondaryButton href="/admin/questions">Back to questions</AdminSecondaryButton>}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(["upload", "processing", "review", "done"] as Step[]).map((s, i) => (
          <span
            key={s}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              step === s ? "bg-primary text-white" : "bg-white text-muted border border-border"
            }`}
          >
            {i + 1}. {s}
          </span>
        ))}
      </div>

      {step === "upload" ? (
        <AdminCard className="max-w-2xl space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Language (required)</span>
            <select
              value={languageId}
              onChange={(e) => setLanguageId(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {adminLanguages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Category (optional)</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {adminCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Default difficulty</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">PDF file</span>
            <input
              type="file"
              accept="application/pdf"
              className="block w-full text-sm text-muted"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
            {fileName ? <p className="mt-1 text-xs text-muted">Selected: {fileName}</p> : null}
          </label>
          <AdminPrimaryButton onClick={startImport}>Upload & extract</AdminPrimaryButton>
        </AdminCard>
      ) : null}

      {step === "processing" ? (
        <AdminCard className="max-w-lg">
          <p className="font-semibold text-navy">Extracting questions from PDF…</p>
          <p className="mt-2 text-sm text-muted">
            Mock pipeline: Uploading → Extracting → Review. Backend OCR/parser will plug in later.
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-soft">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
          </div>
        </AdminCard>
      ) : null}

      {step === "review" ? (
        <div className="space-y-4">
          <AdminCard>
            <p className="text-sm text-muted">
              Review parsed items. Uncheck junk rows, adjust difficulty, then confirm import.
              Selected: <strong className="text-ink">{included}</strong>
            </p>
          </AdminCard>
          <div className="space-y-3">
            {parsed.map((item, index) => (
              <AdminCard key={item.id} className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={item.include}
                      onChange={(e) =>
                        setParsed((prev) =>
                          prev.map((p, i) =>
                            i === index ? { ...p, include: e.target.checked } : p,
                          ),
                        )
                      }
                    />
                    <span>
                      <span className="block font-semibold text-navy">{item.title}</span>
                      <span className="mt-1 block text-muted">{item.answerPreview}</span>
                    </span>
                  </label>
                  <DifficultyBadge difficulty={item.difficulty} />
                </div>
                <div className="flex flex-wrap gap-3">
                  <input
                    value={item.title}
                    onChange={(e) =>
                      setParsed((prev) =>
                        prev.map((p, i) => (i === index ? { ...p, title: e.target.value } : p)),
                      )
                    }
                    className="min-w-[220px] flex-1 rounded-lg border border-border px-3 py-1.5 text-sm"
                  />
                  <select
                    value={item.difficulty}
                    onChange={(e) =>
                      setParsed((prev) =>
                        prev.map((p, i) =>
                          i === index
                            ? { ...p, difficulty: e.target.value as Difficulty }
                            : p,
                        ),
                      )
                    }
                    className="rounded-lg border border-border px-3 py-1.5 text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </AdminCard>
            ))}
          </div>
          <AdminPrimaryButton onClick={confirmImport}>
            Confirm import ({included})
          </AdminPrimaryButton>
        </div>
      ) : null}

      {step === "done" ? (
        <AdminCard className="max-w-lg space-y-3">
          <p className="text-lg font-bold text-navy">Import complete</p>
          <p className="text-sm text-muted">
            Created <strong className="text-ink">{importedCount}</strong> questions
            {fileName ? ` from ${fileName}` : ""}. They appear under Questions as drafts ready to edit.
          </p>
          <div className="flex flex-wrap gap-2">
            <AdminPrimaryButton href="/admin/questions">View questions</AdminPrimaryButton>
            <AdminSecondaryButton onClick={() => router.push("/admin/media")}>
              Open in Media
            </AdminSecondaryButton>
          </div>
        </AdminCard>
      ) : null}

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Import history
        </h2>
        <div className="space-y-2">
          {pdfImports.map((job) => (
            <AdminCard key={job.id} className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-navy">{job.fileName}</p>
                <p className="text-xs text-muted">
                  {adminLanguages.find((l) => l.id === job.languageId)?.name} · {job.status} ·{" "}
                  {job.importedCount} imported · {job.createdAt}
                </p>
              </div>
              <AdminSecondaryButton href={`/admin/questions/import?job=${job.id}`}>
                Open
              </AdminSecondaryButton>
            </AdminCard>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function PdfImportPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading import wizard…</div>}>
      <PdfImportInner />
    </Suspense>
  );
}
