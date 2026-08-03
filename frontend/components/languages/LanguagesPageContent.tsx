"use client";

import { useMemo, useState } from "react";
import { LanguageCard } from "@/components/languages/LanguageCard";
import type { PublicLanguage } from "@/lib/public-api";
import { heroWashClass } from "@/lib/theme";

type Props = {
  languages: PublicLanguage[];
};

export function LanguagesPageContent({ languages }: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return languages;
    return languages.filter(
      (l) =>
        l.name.toLowerCase().includes(term) ||
        l.description.toLowerCase().includes(term) ||
        l.seoHeading.toLowerCase().includes(term),
    );
  }, [languages, q]);

  return (
    <div className={heroWashClass}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Interview by stack
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Languages
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base">
            Browse interview question hubs added by admin — Beginner, Intermediate, and Expert.
          </p>
        </header>

        <div className="mt-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search languages…"
            className="w-full max-w-md rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 text-sm text-muted">
            No published languages yet. Add some in the admin CMS.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((language, index) => (
              <LanguageCard key={language.id} language={language} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
