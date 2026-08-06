import Link from "next/link";
import {
  countByDifficulty,
  DifficultyLevelButtons,
} from "@/components/questions/DifficultyLevelPages";
import { LanguageLogo } from "@/components/ui/LanguageLogo";
import type { PublicLanguage, PublicQuestionListItem } from "@/lib/public-api";

type LanguageDetailViewProps = {
  language: PublicLanguage;
  questions: PublicQuestionListItem[];
};

export function LanguageDetailView({ language, questions }: LanguageDetailViewProps) {
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
            <Link href="/languages" className="font-medium text-primary hover:text-primary-dark">
              Languages
            </Link>
            <span aria-hidden>/</span>
            <span className="font-semibold text-navy">{language.name}</span>
          </nav>
          <p className="font-semibold text-primary">{questions.length} questions</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <div className="flex items-start gap-3">
            <LanguageLogo
              name={language.name}
              slug={language.slug}
              pictureUrl={language.pictureUrl}
              iconFallback={language.icon}
              size="lg"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Choose a level
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {language.seoHeading}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {language.metaDescription || language.description}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy">Beginner · Intermediate · Expert</h2>
              <p className="mt-2 text-sm text-muted">
                Open one level to see every question, answer, and explanation on one page.
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
            <DifficultyLevelButtons
              basePath={`/languages/${language.slug}`}
              counts={counts}
            />
          )}
        </section>
      </div>
    </article>
  );
}
