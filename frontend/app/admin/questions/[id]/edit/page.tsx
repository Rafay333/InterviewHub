"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { QuestionForm } from "@/components/admin/QuestionForm";
import { AdminPageHeader, AdminSecondaryButton } from "@/components/admin/AdminUi";
import { adminQuestions } from "@/lib/admin/data";

function EditQuestionInner() {
  const params = useParams<{ id: string }>();
  const question = adminQuestions.find((q) => q.id === params.id);
  if (!question) {
    return (
      <div>
        <AdminPageHeader title="Question not found" />
        <AdminSecondaryButton href="/admin/questions">Back</AdminSecondaryButton>
      </div>
    );
  }
  return <QuestionForm mode="edit" initial={question} />;
}

export default function EditQuestionPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading form…</div>}>
      <EditQuestionInner />
    </Suspense>
  );
}
