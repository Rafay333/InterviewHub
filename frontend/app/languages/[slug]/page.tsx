import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageDetailView } from "@/components/languages/LanguageDetailView";
import { fetchLanguage, fetchLanguageQuestions } from "@/lib/public-api";

type LanguageDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: LanguageDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const language = await fetchLanguage(slug);
  if (!language) return { title: "Language not found" };
  return {
    title: language.metaTitle,
    description: language.metaDescription,
  };
}

export default async function LanguageDetailPage({ params }: LanguageDetailPageProps) {
  const { slug } = await params;
  const language = await fetchLanguage(slug);
  if (!language) notFound();
  const questions = await fetchLanguageQuestions(slug);

  return (
    <main>
      <LanguageDetailView language={language} questions={questions} />
    </main>
  );
}
