"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AdminCard,
  AdminPageHeader,
  AdminSecondaryButton,
} from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type { AdminLanguage } from "@/lib/admin/types";

function PdfImportInner() {
  const search = useSearchParams();
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [languageId, setLanguageId] = useState(search.get("language") || "");

  useEffect(() => {
    adminApi.listLanguages().then((rows) => {
      setLanguages(rows);
      if (!languageId && rows[0]) setLanguageId(rows[0].id);
    });
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="PDF Bulk Import"
        description="UI ready — full PDF extract/import API can be wired next. Languages load from SQL Server."
        actions={<AdminSecondaryButton href="/admin/questions">Back</AdminSecondaryButton>}
      />
      <AdminCard className="max-w-xl space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Language</span>
          <select
            value={languageId}
            onChange={(e) => setLanguageId(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          >
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <input type="file" accept="application/pdf" className="block w-full text-sm" />
        <p className="text-sm text-muted">
          For now, add questions manually via Add Question. PDF parsing will write into
          `pdf_imports` / `pdf_import_items` next.
        </p>
      </AdminCard>
    </div>
  );
}

export default function PdfImportPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
      <PdfImportInner />
    </Suspense>
  );
}
