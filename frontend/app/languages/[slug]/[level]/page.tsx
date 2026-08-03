import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DIFFICULTY_LEVELS,
  DifficultyQuestionsFullList,
  filterByDifficulty,
  isDifficultyLevel,
} from "@/components/questions/DifficultyLevelPages";
import { fetchLanguage, fetchLanguageQuestions } from "@/lib/public-api";

type Props = {
  params: Promise<{ slug: string; level: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, level } = await params;
  if (!isDifficultyLevel(level)) return { title: "Not found" };
  const language = await fetchLanguage(slug);
  if (!language) return { title: "Not found" };
  const label = DIFFICULTY_LEVELS.find((l) => l.key === level)?.label || level;
  return {
    title: `${label} ${language.name} Interview Questions | InterviewHub`,
    description: `All ${label.toLowerCase()} ${language.name} interview questions with answers and explanations.`,
  };
}

export default async function LanguageDifficultyPage({ params }: Props) {
  const { slug, level } = await params;
  if (!isDifficultyLevel(level)) notFound();

  const language = await fetchLanguage(slug);
  if (!language) notFound();

  const allQuestions = await fetchLanguageQuestions(slug);
  const questions = filterByDifficulty(allQuestions, level);
  const label = DIFFICULTY_LEVELS.find((l) => l.key === level)?.label || level;

  return (
    <main className="bg-white">
      <div className="border-y border-primary/10 bg-gradient-to-r from-surface-tint via-white to-[#fff7ed]">
        <div className="mx-auto max-w-3xl px-4 py-3 text-xs text-muted sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
            <Link href="/" className="font-medium text-primary hover:text-primary-dark">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/languages" className="font-medium text-primary hover:text-primary-dark">
              Languages
            </Link>
            <span aria-hidden>/</span>
            <Link
              href={`/languages/${language.slug}`}
              className="font-medium text-primary hover:text-primary-dark"
            >
              {language.name}
            </Link>
            <span aria-hidden>/</span>
            <span className="font-semibold text-navy">{label}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {label} level
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          {language.name} — {label}
        </h1>
        <p className="mt-3 text-sm text-muted sm:text-base">
          All {questions.length} {label.toLowerCase()} question
          {questions.length === 1 ? "" : "s"} with answers and explanations on this page.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {DIFFICULTY_LEVELS.map((item) => (
            <Link
              key={item.key}
              href={`/languages/${language.slug}/${item.key}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                item.key === level
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`/languages/${language.slug}`}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted hover:border-primary hover:text-primary"
          >
            Back to levels
          </Link>
        </div>

        <DifficultyQuestionsFullList questions={questions} levelLabel={label} />
      </div>
    </main>
  );
}
