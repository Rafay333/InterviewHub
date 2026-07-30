"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LanguageCard } from "@/components/languages/LanguageCard";
import {
  featuredLanguages,
  getTotalQuestions,
} from "@/lib/languages-data";

export function LanguagesPageContent() {
  const [query, setQuery] = useState("");

  const catalogTotal = featuredLanguages.reduce(
    (sum, lang) => sum + getTotalQuestions(lang),
    0
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return featuredLanguages;
    return featuredLanguages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#bfdbfe_0%,_transparent_50%),radial-gradient(ellipse_at_top_right,_#fed7aa_0%,_transparent_45%),linear-gradient(180deg,_#eff6ff_0%,_#f8fafc_100%)]"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-14">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Featured languages
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Interview Questions by Language
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Search phrases like React, SQL, or Python interview questions —
              open a language to see that question list immediately.
            </p>
            <label htmlFor="language-search" className="sr-only">
              Search technologies
            </label>
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-white px-4 shadow-md shadow-primary/10 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0 text-primary"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M20 20l-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="language-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search technologies..."
                className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/80"
              />
            </div>
          </div>

          <aside className="w-full max-w-xs overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-primary-dark p-5 text-white shadow-lg shadow-primary/25">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
              Catalog
            </p>
            <p className="mt-2 text-3xl font-bold">
              {catalogTotal.toLocaleString()}+
            </p>
            <p className="text-sm text-blue-100">Questions ready to browse</p>
            <div className="mt-4 rounded-xl bg-white/15 px-3 py-2 text-sm backdrop-blur-sm">
              Across{" "}
              <span className="font-semibold text-accent">
                {featuredLanguages.length}
              </span>{" "}
              featured languages
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((language, index) => (
            <li key={language.slug}>
              <LanguageCard language={language} accentIndex={index} />
            </li>
          ))}
        </ul>

        {filtered.length === 0 ? (
          <p className="mt-8 text-center text-sm text-muted">
            No languages match your search.
          </p>
        ) : null}

        <div className="mt-12">
          <Link
            href="/categories/system-design"
            className="block rounded-2xl bg-gradient-to-br from-navy via-primary-dark to-[#1d4ed8] p-6 text-white transition hover:scale-[1.01] hover:shadow-xl"
          >
            <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              New series
            </span>
            <h2 className="mt-3 text-xl font-bold">System Design Professional</h2>
            <p className="mt-2 text-sm leading-relaxed text-blue-100">
              Master scalability, availability, and reliability for senior interviews.
            </p>
            <span className="mt-5 inline-flex h-10 items-center rounded-lg bg-white/15 px-4 text-sm font-semibold backdrop-blur-sm">
              Start advanced track →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
