"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "@/components/admin/AdminUi";
import {
  adminLanguages,
  type AdminQuestion,
  type Difficulty,
} from "@/lib/admin/data";

const inputClass =
  "w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary";

function OptionalPicture({
  label,
  preview,
  onPick,
  onClear,
}: {
  label: string;
  preview: string | null;
  onPick: (file: File | null) => void;
  onClear: () => void;
}) {
  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-xs font-semibold text-ink hover:bg-white">
          {preview ? "Change picture" : "Add picture (optional)"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          />
        </label>
        {preview ? (
          <button type="button" onClick={onClear} className="text-xs font-semibold text-hard hover:underline">
            Remove picture
          </button>
        ) : (
          <span className="text-xs text-muted">Optional</span>
        )}
      </div>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt={`${label} preview`}
          className="mt-2 max-h-40 rounded-lg border border-border object-contain"
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

  const [languageId, setLanguageId] = useState(
    initial?.languageIds[0] ?? preLang ?? adminLanguages[0]?.id ?? "",
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? "beginner");
  const [question, setQuestion] = useState(initial?.title ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [questionImage, setQuestionImage] = useState<string | null>(initial?.questionImage ?? null);
  const [answerImage, setAnswerImage] = useState<string | null>(initial?.answerImage ?? null);
  const [descriptionImage, setDescriptionImage] = useState<string | null>(
    initial?.descriptionImage ?? null,
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    return () => {
      [questionImage, answerImage, descriptionImage].forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [questionImage, answerImage, descriptionImage]);

  const pickImage = (
    file: File | null,
    current: string | null,
    setter: (v: string | null) => void,
  ) => {
    if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
    if (!file) {
      setter(null);
      return;
    }
    setter(URL.createObjectURL(file));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => router.push("/admin/questions"), 500);
  };

  const importHref = languageId
    ? `/admin/questions/import?language=${languageId}`
    : "/admin/questions/import";

  return (
    <div>
      <AdminPageHeader
        title={mode === "create" ? "Add Question" : "Edit Question"}
        description="Pick a language and level, then fill Question, Answer, and Description."
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
                <option value="" disabled>
                  Select language
                </option>
                {adminLanguages.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block flex-1 text-sm">
              <span className="mb-1 block font-medium">Level</span>
              <select
                required
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
            <textarea
              required
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={inputClass}
              placeholder="Write the interview question…"
            />
          </label>
          <OptionalPicture
            label="Question"
            preview={questionImage}
            onPick={(file) => pickImage(file, questionImage, setQuestionImage)}
            onClear={() => pickImage(null, questionImage, setQuestionImage)}
          />
        </AdminCard>

        <AdminCard>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Answer</span>
            <textarea
              required
              rows={5}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={inputClass}
              placeholder="Write the answer…"
            />
          </label>
          <OptionalPicture
            label="Answer"
            preview={answerImage}
            onPick={(file) => pickImage(file, answerImage, setAnswerImage)}
            onClear={() => pickImage(null, answerImage, setAnswerImage)}
          />
        </AdminCard>

        <AdminCard>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Description</span>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Extra explanation, tips, or notes…"
            />
          </label>
          <OptionalPicture
            label="Description"
            preview={descriptionImage}
            onPick={(file) => pickImage(file, descriptionImage, setDescriptionImage)}
            onClear={() => pickImage(null, descriptionImage, setDescriptionImage)}
          />
        </AdminCard>

        <div className="flex flex-wrap gap-2">
          <AdminPrimaryButton type="submit">
            {saved ? "Saved…" : mode === "create" ? "Save question" : "Save changes"}
          </AdminPrimaryButton>
          <AdminSecondaryButton href="/admin/questions">Cancel</AdminSecondaryButton>
        </div>
      </form>
    </div>
  );
}
