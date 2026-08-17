import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DIFFICULTY_LEVELS,
  DifficultyQuestionsFullList,
  filterByDifficulty,
  isDifficultyLevel,
} from "@/components/questions/DifficultyLevelPages";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchLanguage, fetchLanguageQuestions } from "@/lib/public-api";
import { shortLanguageName } from "@/lib/language-logo";
import { breadcrumbJsonLd, buildPageMetadata, faqJsonLd } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string; level: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, level } = await params;
  if (!isDifficultyLevel(level)) return { title: "Not found", robots: { index: false } };
  const language = await fetchLanguage(slug);
  if (!language) return { title: "Not found", robots: { index: false } };
  const label = DIFFICULTY_LEVELS.find((l) => l.key === level)?.label || level;
  const name = shortLanguageName(language.name);
  return buildPageMetadata({
    title: `${label} ${name} Interview Questions`,
    description: `All ${label.toLowerCase()} ${name} interview questions with answers, explanations, and diagrams. Practice for coding interviews on InterviewHub.`,
    path: `/languages/${language.slug}/${level}`,
    image: language.pictureUrl || "/languages-hero.png",
    keywords: [
      `${label} ${name} interview questions`,
      `${name} ${label.toLowerCase()} coding interview`,
      `${name} interview answers`,
    ],
  });
}

export default async function LanguageDifficultyPage({ params }: Props) {
  const { slug, level } = await params;
  if (!isDifficultyLevel(level)) notFound();

  const language = await fetchLanguage(slug);
  if (!language) notFound();

  const allQuestions = await fetchLanguageQuestions(slug);
  const questions = filterByDifficulty(allQuestions, level);
  const label = DIFFICULTY_LEVELS.find((l) => l.key === level)?.label || level;
  const name = shortLanguageName(language.name);

  return (
    <main className="bg-white">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Languages", path: "/languages" },
            { name, path: `/languages/${language.slug}` },
            { name: label, path: `/languages/${language.slug}/${level}` },
          ]),
          faqJsonLd(questions),
        ]}
      />
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
          {label} {name} Interview Questions
        </h1>
        <p className="mt-3 text-sm text-muted sm:text-base">
          {questions.length} {label.toLowerCase()} {name} interview question
          {questions.length === 1 ? "" : "s"} with answers and explanations — ready for coding interviews.
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
