import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DIFFICULTY_LEVELS,
  filterByDifficulty,
  isDifficultyLevel,
} from "@/components/questions/DifficultyLevelPages";
import { DifficultyQuestionsFullList } from "@/components/questions/DifficultyQuestionsFullList";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchCategory, fetchCategoryQuestions } from "@/lib/public-api";
import { breadcrumbJsonLd, buildPageMetadata, faqJsonLd } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string; level: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, level } = await params;
  if (!isDifficultyLevel(level)) return { title: "Not found", robots: { index: false } };
  const category = await fetchCategory(slug);
  if (!category) return { title: "Not found", robots: { index: false } };
  const label = DIFFICULTY_LEVELS.find((l) => l.key === level)?.label || level;
  return buildPageMetadata({
    title: `${label} ${category.name} Interview Questions`,
    description: `All ${label.toLowerCase()} ${category.name} interview questions with answers and explanations. Prepare for technical interviews on InterviewHub.`,
    path: `/categories/${category.slug}/${level}`,
    image: category.pictureUrl || "/categories-hero.png",
    keywords: [
      `${label} ${category.name} interview questions`,
      `${category.name} ${label.toLowerCase()} interview`,
    ],
  });
}

export default async function CategoryDifficultyPage({ params }: Props) {
  const { slug, level } = await params;
  if (!isDifficultyLevel(level)) notFound();

  const category = await fetchCategory(slug);
  if (!category) notFound();

  const allQuestions = await fetchCategoryQuestions(slug, {
    difficulty: level,
    full: true,
  });
  const questions = filterByDifficulty(allQuestions, level);
  const label = DIFFICULTY_LEVELS.find((l) => l.key === level)?.label || level;

  return (
    <main className="bg-white">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Categories", path: "/categories" },
            { name: category.name, path: `/categories/${category.slug}` },
            { name: label, path: `/categories/${category.slug}/${level}` },
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
            <Link href="/categories" className="font-medium text-primary hover:text-primary-dark">
              Categories
            </Link>
            <span aria-hidden>/</span>
            <Link
              href={`/categories/${category.slug}`}
              className="font-medium text-primary hover:text-primary-dark"
            >
              {category.name}
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
          {label} {category.name} Interview Questions
        </h1>
        <p className="mt-3 text-sm text-muted sm:text-base">
          {questions.length} {label.toLowerCase()} {category.name.toLowerCase()} question
          {questions.length === 1 ? "" : "s"} with answers and explanations for technical interviews.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {DIFFICULTY_LEVELS.map((item) => (
            <Link
              key={item.key}
              href={`/categories/${category.slug}/${item.key}`}
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
            href={`/categories/${category.slug}`}
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
