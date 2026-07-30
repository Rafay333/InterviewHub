import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageDetailView } from "@/components/languages/LanguageDetailView";
import {
  featuredLanguages,
  getLanguageBySlug,
  getLanguageSeo,
} from "@/lib/languages-data";

type LanguageDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return featuredLanguages.map((lang) => ({ slug: lang.slug }));
}

export async function generateMetadata({
  params,
}: LanguageDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const language = getLanguageBySlug(slug);
  if (!language) {
    return { title: "Language not found" };
  }
  const seo = getLanguageSeo(language);
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
  };
}

export default async function LanguageDetailPage({ params }: LanguageDetailPageProps) {
  const { slug } = await params;
  const language = getLanguageBySlug(slug);
  if (!language) notFound();

  return (
    <main>
      <LanguageDetailView language={language} />
    </main>
  );
}
