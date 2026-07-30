"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type { AdminLanguage, AdminQuestion, Difficulty } from "@/lib/admin/types";

const inputClass =
  "w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary";

function OptionalPicture({
  label,
  preview,
  onPick,
}: {
  label: string;
  preview: string | null;
  onPick: (file: File | null) => void;
}) {
  return (
    <div className="mt-2">
      <label className="inline-flex cursor-pointer items-center rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-xs font-semibold">
        {preview ? "Change picture" : "Add picture (optional)"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
      </label>
      <span className="ml-2 text-xs text-muted">{label}</span>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="mt-2 max-h-40 rounded-lg border object-contain" />
      ) : null}
    </div>
  );
}

export function QuestionForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: AdminQuestion;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const preLang = search.get("language") ?? "";

  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [languageId, setLanguageId] = useState(initial?.languageId || preLang || "");
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? "beginner");
  const [question, setQuestion] = useState(initial?.questionText || initial?.title || "");
  const [answer, setAnswer] = useState(initial?.answer || initial?.answerText || "");
  const [description, setDescription] = useState(
    initial?.description || initial?.descriptionText || "",
  );
  const [qFile, setQFile] = useState<File | null>(null);
  const [aFile, setAFile] = useState<File | null>(null);
  const [dFile, setDFile] = useState<File | null>(null);
  const [qPreview, setQPreview] = useState<string | null>(initial?.questionImage ?? null);
  const [aPreview, setAPreview] = useState<string | null>(initial?.answerImage ?? null);
  const [dPreview, setDPreview] = useState<string | null>(initial?.descriptionImage ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .listLanguages()
      .then((rows) => {
        setLanguages(rows);
        if (!languageId && rows[0]) setLanguageId(rows[0].id);
      })
      .catch((err) => setError(err.message));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!languageId) {
      setError("Select a language");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const form = new FormData();
      form.append("questionText", question);
      form.append("answerText", answer);
      form.append("descriptionText", description);
      form.append("difficulty", difficulty);
      form.append("languageId", languageId);
      form.append("status", "published");
      if (qFile) form.append("questionImage", qFile);
      if (aFile) form.append("answerImage", aFile);
      if (dFile) form.append("descriptionImage", dFile);

      if (mode === "create") await adminApi.createQuestion(form);
      else if (initial) await adminApi.updateQuestion(initial.id, form);

      router.push("/admin/questions");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const importHref = languageId
    ? `/admin/questions/import?language=${languageId}`
    : "/admin/questions/import";

  return (
    <div>
      <AdminPageHeader
        title={mode === "create" ? "Add Question" : "Edit Question"}
        description="Saved to SQL Server."
        actions={<AdminSecondaryButton href="/admin/questions">Back</AdminSecondaryButton>}
      />

      <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-4">
        <AdminCard>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block flex-1 text-sm">
              <span className="mb-1 block font-medium">Language</span>
              <select
                required
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value)}
                className={inputClass}
              >
                <option value="">Select language</option>
                {languages.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block flex-1 text-sm">
              <span className="mb-1 block font-medium">Level</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className={inputClass}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </label>
            <AdminSecondaryButton href={importHref}>Import</AdminSecondaryButton>
          </div>
        </AdminCard>

        <AdminCard>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Question</span>
            <textarea required rows={4} value={question} onChange={(e) => setQuestion(e.target.value)} className={inputClass} />
          </label>
          <OptionalPicture
            label="optional"
            preview={qPreview}
            onPick={(file) => {
              setQFile(file);
              setQPreview(file ? URL.createObjectURL(file) : initial?.questionImage ?? null);
            }}
          />
        </AdminCard>

        <AdminCard>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Answer</span>
            <textarea required rows={5} value={answer} onChange={(e) => setAnswer(e.target.value)} className={inputClass} />
          </label>
          <OptionalPicture
            label="optional"
            preview={aPreview}
            onPick={(file) => {
              setAFile(file);
              setAPreview(file ? URL.createObjectURL(file) : initial?.answerImage ?? null);
            }}
          />
        </AdminCard>

        <AdminCard>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Description</span>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
          </label>
          <OptionalPicture
            label="optional"
            preview={dPreview}
            onPick={(file) => {
              setDFile(file);
              setDPreview(file ? URL.createObjectURL(file) : initial?.descriptionImage ?? null);
            }}
          />
        </AdminCard>

        {error ? <p className="text-sm text-hard">{error}</p> : null}
        <AdminPrimaryButton type="submit">{saving ? "Saving…" : "Save question"}</AdminPrimaryButton>
      </form>
    </div>
  );
}
