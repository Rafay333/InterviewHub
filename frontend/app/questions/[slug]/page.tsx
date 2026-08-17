import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionDetailView } from "@/components/questions/QuestionDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchQuestion } from "@/lib/public-api";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const question = await fetchQuestion(slug);
  if (!question) return { title: "Question not found", robots: { index: false } };
  return buildPageMetadata({
    title: question.metaTitle || question.title,
    description:
      question.metaDescription ||
      String(question.answer || "").slice(0, 160) ||
      `Interview question: ${question.title}`,
    path: `/questions/${question.slug}`,
    keywords: [
      question.title,
      question.languageName ? `${question.languageName} interview question` : "",
      question.categoryName ? `${question.categoryName} interview question` : "",
    ].filter(Boolean),
  });
}

export default async function QuestionPage({ params }: Props) {
  const { slug } = await params;
  const question = await fetchQuestion(slug);
  if (!question) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    question.languageSlug
      ? { name: question.languageName || "Languages", path: `/languages/${question.languageSlug}` }
      : question.categorySlug
        ? { name: question.categoryName || "Categories", path: `/categories/${question.categorySlug}` }
        : { name: "Languages", path: "/languages" },
    { name: question.title, path: `/questions/${question.slug}` },
  ];

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <QuestionDetailView question={question} />
    </main>
  );
}
