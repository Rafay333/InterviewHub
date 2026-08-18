import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageDetailView } from "@/components/languages/LanguageDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchLanguage } from "@/lib/public-api";
import { shortLanguageName } from "@/lib/language-logo";
import { breadcrumbJsonLd, buildPageMetadata, languageHubJsonLd } from "@/lib/seo";

type LanguageDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({
  params,
}: LanguageDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const language = await fetchLanguage(slug);
  if (!language) return { title: "Language not found", robots: { index: false } };
  const name = shortLanguageName(language.name);
  return buildPageMetadata({
    title: language.metaTitle || `${name} Interview Questions`,
    description:
      language.metaDescription ||
      `Practice ${name} interview questions with answers and explanations — Beginner, Intermediate, and Expert.`,
    path: `/languages/${language.slug}`,
    image: language.pictureUrl || "/languages-hero.png",
    keywords: [
      `${name} interview questions`,
      `${name} coding interview`,
      `${name} beginner interview questions`,
      `technical interview ${name}`,
    ],
  });
}

export default async function LanguageDetailPage({ params }: LanguageDetailPageProps) {
  const { slug } = await params;
  const language = await fetchLanguage(slug);
  if (!language) notFound();
  const name = shortLanguageName(language.name);

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Languages", path: "/languages" },
            { name: name, path: `/languages/${language.slug}` },
          ]),
          languageHubJsonLd(language),
        ]}
      />
      <LanguageDetailView language={language} />
    </main>
  );
}
