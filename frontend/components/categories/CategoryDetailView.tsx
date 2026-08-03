import Link from "next/link";
import {
  countByDifficulty,
  DifficultyLevelButtons,
} from "@/components/questions/DifficultyLevelPages";
import type { PublicCategory, PublicQuestionListItem } from "@/lib/public-api";

type CategoryDetailViewProps = {
  category: PublicCategory;
  questions: PublicQuestionListItem[];
};

export function CategoryDetailView({ category, questions }: CategoryDetailViewProps) {
  const counts = countByDifficulty(questions);

  return (
    <article className="bg-white">
      <div className="border-y border-primary/10 bg-gradient-to-r from-surface-tint via-white to-[#fff7ed]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
            <Link href="/" className="font-medium text-primary hover:text-primary-dark">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/categories" className="font-medium text-primary hover:text-primary-dark">
              Categories
            </Link>
            <span aria-hidden>/</span>
            <span className="font-semibold text-navy">{category.name}</span>
          </nav>
          <p className="font-semibold text-primary">{questions.length} questions</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
              {category.icon}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {category.focus}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {category.seoHeading}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {category.description}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy">{category.name} by level</h2>
              <p className="mt-2 text-sm text-muted">
                Open Beginner, Intermediate, or Expert to see every question, answer, and
                explanation on one page.
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden text-sm font-semibold text-primary hover:text-primary-dark sm:inline"
            >
              All categories →
            </Link>
          </div>

          {questions.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-primary/20 bg-surface-tint/40 px-5 py-10 text-center text-sm text-muted">
              No published questions for {category.name} yet.
            </p>
          ) : (
            <DifficultyLevelButtons
              basePath={`/categories/${category.slug}`}
              counts={counts}
            />
          )}
        </section>
      </div>
    </article>
  );
}
