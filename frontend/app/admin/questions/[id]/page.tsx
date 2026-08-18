"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  DifficultyBadge,
  StatusBadge,
} from "@/components/admin/AdminUi";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { adminApi } from "@/lib/admin/api";
import type { AdminQuestion } from "@/lib/admin/types";

function Block({
  title,
  text,
  image,
}: {
  title: string;
  text?: string;
  image?: string | null;
}) {
  const body = (text || "").trim();
  if (!body && !image) return null;
  return (
    <AdminCard>
      <h2 className="text-sm font-bold text-navy">{title}</h2>
      {body ? (
        <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{body}</div>
      ) : null}
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="mt-4 max-h-[28rem] w-full rounded-xl border border-border object-contain bg-surface-soft" />
      ) : null}
    </AdminCard>
  );
}

export default function AdminQuestionViewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [question, setQuestion] = useState<AdminQuestion | null>(null);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    adminApi
      .getQuestion(params.id)
      .then(setQuestion)
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Question not found" eyebrow="Questions" />
        <p className="mb-3 rounded-xl border border-hard/20 bg-hard/10 px-3 py-2 text-sm text-hard">
          {error}
        </p>
        <AdminSecondaryButton href="/admin/questions">Back to questions</AdminSecondaryButton>
      </div>
    );
  }
  if (!question) return <p className="text-sm text-muted">Loading…</p>;

  const answer = question.answerText || question.answer || "";
  const explanation = question.descriptionText || question.description || "";

  return (
    <div>
      <AdminPageHeader
        title={question.title || question.questionText}
        eyebrow="Questions"
        description={[question.languageName, question.categoryName].filter(Boolean).join(" · ") || "Interview Q&A"}
        actions={
          <>
            {question.slug ? (
              <AdminSecondaryButton href={`/questions/${question.slug}`}>
                View on site
              </AdminSecondaryButton>
            ) : null}
            <AdminPrimaryButton href={`/admin/questions/${question.id}/edit`}>
              Edit
            </AdminPrimaryButton>
            <AdminSecondaryButton onClick={() => setConfirmDelete(true)}>
              Delete
            </AdminSecondaryButton>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <DifficultyBadge difficulty={question.difficulty} />
        <StatusBadge status={question.status} />
      </div>

      <div className="space-y-4">
        <Block title="Question" text={question.questionText} image={question.questionImage} />
        <Block title="Answer" text={answer} image={question.answerImage} />
        <Block title="Explanation" text={explanation} image={question.descriptionImage} />
      </div>

      <div className="mt-6">
        <AdminSecondaryButton href="/admin/questions">Back to questions</AdminSecondaryButton>
      </div>

      <ConfirmModal
        open={confirmDelete}
        title="Delete question?"
        message="This permanently removes the question."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          try {
            await adminApi.deleteQuestion(question.id);
            router.push("/admin/questions");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
            setConfirmDelete(false);
          }
        }}
      />
    </div>
  );
}
