"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  adminInputClass,
  adminLabelClass,
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type {
  AdminCategory,
  AdminLanguage,
  AdminQuestion,
  Difficulty,
} from "@/lib/admin/types";

const inputClass = adminInputClass;

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
      <label className="inline-flex cursor-pointer items-center rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10">
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
        <img
          src={preview}
          alt=""
          className="mt-2 max-h-40 rounded-xl border border-primary/15 object-contain shadow-sm"
        />
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
  const preCategory = search.get("category") ?? "";

  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [languageId, setLanguageId] = useState(initial?.languageId || preLang || "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId || preCategory || "");
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
    Promise.all([adminApi.listLanguages(), adminApi.listCategories()])
      .then(([langs, cats]) => {
        setLanguages(langs);
        setCategories(cats);
      })
      .catch((err) => setError(err.message));
  }, []);

  const languageOptions = useMemo(() => {
    if (!categoryId) return languages;
    const inCategory = languages.filter((l) => l.categoryId === categoryId);
    return inCategory.length > 0 ? inCategory : languages;
  }, [languages, categoryId]);

  const backHref = categoryId
    ? `/admin/categories/${categoryId}`
    : languageId
      ? `/admin/languages/${languageId}`
      : "/admin/questions";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!languageId && !categoryId) {
      setError("Select a category and/or a language");
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
      form.append("status", "published");
      if (languageId) form.append("languageId", languageId);
      if (categoryId) form.append("categoryId", categoryId);
      if (qFile) form.append("questionImage", qFile);
      if (aFile) form.append("answerImage", aFile);
      if (dFile) form.append("descriptionImage", dFile);

      if (mode === "create") await adminApi.createQuestion(form);
      else if (initial) await adminApi.updateQuestion(initial.id, form);

      router.push(backHref);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const importHref = categoryId
    ? `/admin/questions/import?category=${categoryId}`
    : languageId
      ? `/admin/questions/import?language=${languageId}`
      : "/admin/questions/import";

  return (
    <div>
      <AdminPageHeader
        title={mode === "create" ? "Add Question" : "Edit Question"}
        description="Attach to a Category and/or Language, then pick Beginner / Intermediate / Expert."
        actions={<AdminSecondaryButton href={backHref}>Back</AdminSecondaryButton>}
      />

      <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-4">
        <AdminCard className="bg-gradient-to-br from-primary/5 to-white">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            <label className="block text-sm sm:col-span-1">
              <span className={adminLabelClass}>Category</span>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputClass}
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-1">
              <span className={adminLabelClass}>Language</span>
              <select
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value)}
                className={inputClass}
              >
                <option value="">None</option>
                {languageOptions.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className={adminLabelClass}>Level</span>
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
          <p className="mt-2 text-xs text-muted">Pick at least Category or Language (or both).</p>
        </AdminCard>

        <AdminCard className="bg-gradient-to-br from-teal/5 to-white">
          <label className="block text-sm">
            <span className={adminLabelClass}>Question</span>
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

        <AdminCard className="bg-gradient-to-br from-easy/5 to-white">
          <label className="block text-sm">
            <span className={adminLabelClass}>Answer</span>
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

        <AdminCard className="bg-gradient-to-br from-accent/5 to-white">
          <label className="block text-sm">
            <span className={adminLabelClass}>Description</span>
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

        {error ? (
          <p className="rounded-xl border border-hard/20 bg-hard/10 px-3 py-2 text-sm text-hard">{error}</p>
        ) : null}
        <AdminPrimaryButton type="submit">{saving ? "Saving…" : "Save question"}</AdminPrimaryButton>
      </form>
    </div>
  );
}
