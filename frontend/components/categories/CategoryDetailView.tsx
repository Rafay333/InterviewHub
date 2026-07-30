import Link from "next/link";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import type { CategoryTopic } from "@/lib/categories-data";
import { getCategoryQuestions } from "@/lib/categories-data";

type CategoryDetailViewProps = {
  category: CategoryTopic;
};

export function CategoryDetailView({ category }: CategoryDetailViewProps) {
  const questions = getCategoryQuestions(category.slug);

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
          <p className="font-semibold text-primary">
            Showing {category.questionCount} questions
          </p>
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

          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            <Stat label="Easy" value={category.easy} tone="easy" />
            <Stat label="Medium" value={category.medium} tone="medium" />
            <Stat label="Hard" value={category.hard} tone="hard" />
          </div>
        </header>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy">
                Top {category.name.toLowerCase()} questions
              </h2>
              <p className="mt-2 text-sm text-muted">
                Placeholder list for MVP — real CMS content comes later.
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden text-sm font-semibold text-primary hover:text-primary-dark sm:inline"
            >
              All categories →
            </Link>
          </div>

          <ul className="mt-6 divide-y divide-primary/10 overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-sm">
            {questions.map((question) => (
              <li key={question.slug}>
                <Link
                  href={`/questions/${question.slug}`}
                  className="flex flex-col gap-3 px-5 py-5 transition hover:bg-surface-tint sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-2">
                    <DifficultyBadge difficulty={question.difficulty} />
                    <h3 className="text-base font-semibold text-navy sm:text-lg">
                      {question.title}
                    </h3>
                    <p className="text-sm text-muted">{question.summary}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-primary">
                    Open →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            href="/languages"
            className="rounded-2xl border border-primary/15 bg-surface-tint/60 p-5 transition hover:border-primary/40"
          >
            <h3 className="font-semibold text-navy">Browse by language</h3>
            <p className="mt-2 text-sm text-muted">
              Prefer React, Python, SQL, or another stack? Start from languages.
            </p>
          </Link>
          <Link
            href="/categories"
            className="rounded-2xl border border-accent/20 bg-[#fff7ed] p-5 transition hover:border-accent/40"
          >
            <h3 className="font-semibold text-navy">Back to all categories</h3>
            <p className="mt-2 text-sm text-muted">
              Explore algorithms, behavioral, DevOps, security, and more.
            </p>
          </Link>
        </div>
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "easy" | "medium" | "hard";
}) {
  const styles = {
    easy: "border-easy/20 bg-easy/10 text-easy",
    medium: "border-medium/20 bg-medium/10 text-medium",
    hard: "border-hard/20 bg-hard/10 text-hard",
  } as const;

  return (
    <div className={`rounded-xl border px-3 py-3 text-center ${styles[tone]}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-lg font-bold text-navy">{value}</p>
    </div>
  );
}
