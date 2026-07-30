"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QuestionForm } from "@/components/admin/QuestionForm";
import { AdminPageHeader, AdminSecondaryButton } from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type { AdminQuestion } from "@/lib/admin/types";

function EditQuestionInner() {
  const params = useParams<{ id: string }>();
  const [question, setQuestion] = useState<AdminQuestion | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getQuestion(params.id)
      .then(setQuestion)
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Question not found" />
        <p className="text-sm text-hard">{error}</p>
        <AdminSecondaryButton href="/admin/questions">Back</AdminSecondaryButton>
      </div>
    );
  }
  if (!question) return <p className="text-sm text-muted">Loading…</p>;
  return <QuestionForm mode="edit" initial={question} />;
}

export default function EditQuestionPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading form…</div>}>
      <EditQuestionInner />
    </Suspense>
  );
}
