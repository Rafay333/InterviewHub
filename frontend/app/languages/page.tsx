import type { Metadata } from "next";
import { LanguagesPageContent } from "@/components/languages/LanguagesPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchLanguages, type PublicLanguage } from "@/lib/public-api";
import { shortLanguageName } from "@/lib/language-logo";
import { breadcrumbJsonLd, buildPageMetadata, itemListJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Programming Language Interview Questions",
  description:
    "Browse interview questions by programming language — JavaScript, Python, Java, SQL, React, C#, and more. Beginner, Intermediate, and Expert answers with diagrams.",
  path: "/languages",
  image: "/languages-hero.png",
  keywords: [
    "programming language interview questions",
    "JavaScript interview questions",
    "Python interview questions",
    "Java interview questions",
    "SQL interview questions",
    "React interview questions",
    "coding interview prep",
  ],
});

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function LanguagesPage({ searchParams }: Props) {
  const languages: PublicLanguage[] = await fetchLanguages();
  const { q } = await searchParams;

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Languages", path: "/languages" },
          ]),
          itemListJsonLd(
            "Programming Language Interview Questions",
            "Interview question hubs by programming language.",
            "/languages",
            languages.map((lang) => ({
              name: `${shortLanguageName(lang.name)} Interview Questions`,
              path: `/languages/${lang.slug}`,
            })),
          ),
        ]}
      />
      <LanguagesPageContent languages={languages} initialQuery={q || ""} />
    </main>
  );
}
