"use client";

import { useParams } from "next/navigation";
import { LanguageForm } from "@/components/admin/LanguageForm";
import { AdminPageHeader, AdminSecondaryButton } from "@/components/admin/AdminUi";
import { adminLanguages } from "@/lib/admin/data";

export default function EditLanguagePage() {
  const params = useParams<{ id: string }>();
  const lang = adminLanguages.find((l) => l.id === params.id);

  if (!lang) {
    return (
      <div>
        <AdminPageHeader title="Language not found" />
        <AdminSecondaryButton href="/admin/languages">Back</AdminSecondaryButton>
      </div>
    );
  }

  return <LanguageForm mode="edit" initial={lang} />;
}
