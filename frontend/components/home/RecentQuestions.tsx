import Link from "next/link";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { recentQuestions } from "@/lib/home-data";

export function RecentQuestions() {
  return (
    <section className="border-t border-border bg-gradient-to-b from-white to-surface-tint/80">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
          Latest
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          Fresh from the field
        </h2>

        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-sm">
          {recentQuestions.map((question) => (
            <li key={question.slug}>
              <Link
                href={`/questions/${question.slug}`}
                className="flex flex-col gap-3 px-5 py-5 transition hover:bg-surface-tint sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={question.difficulty} />
                    <span className="text-xs text-muted">{question.sharedAt}</span>
                  </div>
                  <h3 className="text-base font-semibold text-navy sm:text-lg">
                    {question.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link
            href="/questions"
            className="inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary-dark"
          >
            Load more questions
          </Link>
        </div>
      </div>
    </section>
  );
}
