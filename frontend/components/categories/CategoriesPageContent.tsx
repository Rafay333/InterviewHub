"use client";

import { useMemo, useState } from "react";
import { CategoryCard } from "@/components/categories/CategoryCard";
import type { PublicCategory } from "@/lib/public-api";
import { heroWashClass } from "@/lib/theme";

type Props = {
  categories: PublicCategory[];
};

export function CategoriesPageContent({ categories }: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.seoHeading.toLowerCase().includes(term),
    );
  }, [categories, q]);

  return (
    <div className={heroWashClass}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Interview by topic
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Categories
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base">
            Topic hubs from admin — each with its own languages and questions.
          </p>
        </header>

        <div className="mt-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search categories…"
            className="w-full max-w-md rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 text-sm text-muted">
            No published categories yet. Add some in the admin CMS.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
