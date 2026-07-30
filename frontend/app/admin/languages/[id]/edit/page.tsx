"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LanguageForm } from "@/components/admin/LanguageForm";
import { AdminPageHeader, AdminSecondaryButton } from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type { AdminLanguage } from "@/lib/admin/types";

export default function EditLanguagePage() {
  const params = useParams<{ id: string }>();
  const [lang, setLang] = useState<AdminLanguage | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getLanguage(params.id)
      .then(setLang)
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Language not found" />
        <p className="text-sm text-hard">{error}</p>
        <AdminSecondaryButton href="/admin/languages">Back</AdminSecondaryButton>
      </div>
    );
  }
  if (!lang) return <p className="text-sm text-muted">Loading…</p>;
  return <LanguageForm mode="edit" initial={lang} />;
}
