import Link from "next/link";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import type { PublicLanguage, PublicQuestionListItem } from "@/lib/public-api";

type LanguageDetailViewProps = {
  language: PublicLanguage;
  questions: PublicQuestionListItem[];
};

export function LanguageDetailView({ language, questions }: LanguageDetailViewProps) {
  const total =
    language.questionCount ||
    language.beginner + language.intermediate + language.expert;

  return (
    <article className="bg-white">
      <div className="border-y border-primary/10 bg-gradient-to-r from-surface-tint via-white to-[#fff7ed]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
            <Link href="/" className="font-medium text-primary hover:text-primary-dark">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/languages" className="font-medium text-primary hover:text-primary-dark">
              Languages
            </Link>
            <span aria-hidden>/</span>
            <span className="font-semibold text-navy">{language.name}</span>
          </nav>
          <p className="font-semibold text-primary">Showing {questions.length} questions</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
              {language.icon}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {language.name} stack
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {language.seoHeading}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {language.metaDescription || language.description}
              </p>
            </div>
          </div>

          <div className="mt-6 grid max-w-md grid-cols-3 gap-3">
            <Stat label="Beginner" value={language.beginner} tone="easy" />
            <Stat label="Intermediate" value={language.intermediate} tone="medium" />
            <Stat label="Expert" value={language.expert} tone="hard" />
          </div>
        </header>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy">Top {language.name} questions</h2>
              <p className="mt-2 text-sm text-muted">
                Content comes from the admin CMS.
              </p>
            </div>
            <Link
              href="/languages"
              className="hidden text-sm font-semibold text-primary hover:text-primary-dark sm:inline"
            >
              All languages →
            </Link>
          </div>

          {questions.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-primary/20 bg-surface-tint/40 px-5 py-10 text-center text-sm text-muted">
              No published questions for {language.name} yet.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-primary/10 overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-sm">
              {questions.map((question) => (
                <li key={question.id}>
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
                    <span className="shrink-0 text-sm font-semibold text-primary">Open →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
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
