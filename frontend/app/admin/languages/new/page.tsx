"use client";

import { Suspense } from "react";
import { LanguageForm } from "@/components/admin/LanguageForm";

export default function NewLanguagePage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <LanguageForm mode="create" />
    </Suspense>
  );
}
