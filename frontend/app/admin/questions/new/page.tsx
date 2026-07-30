import { Suspense } from "react";
import { QuestionForm } from "@/components/admin/QuestionForm";

export default function NewQuestionPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading form…</div>}>
      <QuestionForm mode="create" />
    </Suspense>
  );
}
