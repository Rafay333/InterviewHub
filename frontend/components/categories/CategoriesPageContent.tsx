"use client";

import Image from "next/image";
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
    <div className="relative overflow-hidden">
      <div className={`pointer-events-none absolute inset-0 ${heroWashClass}`} aria-hidden />
      <div
        className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-1/3 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <header className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="order-2 lg:order-1">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
              <span aria-hidden>✦</span> Interview by topic
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
              Technical Interview Question Categories
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
              Study by topic — programming fundamentals, OOP, data structures, SQL, web, system design, cloud, testing, and security. Answers from beginner to expert.
            </p>

            <div className="mt-7 w-full max-w-md">
              <label htmlFor="categories-search" className="sr-only">
                Search categories
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-white px-4 py-2.5 shadow-lg shadow-primary/10">
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
                  id="categories-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="search"
                  placeholder="Search categories…"
                  className="h-9 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/80"
                />
              </div>
            </div>
          </div>

          <div className="order-1 relative mx-auto w-full max-w-md lg:order-2 lg:max-w-none lg:justify-self-end">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/15 via-white/50 to-accent/20 blur-2xl"
              aria-hidden
            />
            <Image
              src="/categories-hero.png"
              alt="Web, data, cloud, and mobile interview topic categories"
              width={960}
              height={960}
              priority
              className="h-auto w-full object-contain object-center drop-shadow-md lg:scale-105 lg:translate-x-1"
            />
          </div>
        </header>

        {filtered.length === 0 ? (
          <p className="mt-12 text-sm text-muted">
            No published categories yet. Check back soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
