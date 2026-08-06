import type { Metadata } from "next";
import { LanguagesPageContent } from "@/components/languages/LanguagesPageContent";
import { fetchLanguages, type PublicLanguage } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Languages",
  description: "Browse interview question hubs by programming language.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function LanguagesPage({ searchParams }: Props) {
  const languages: PublicLanguage[] = await fetchLanguages();
  const { q } = await searchParams;

  return (
    <main>
      <LanguagesPageContent languages={languages} initialQuery={q || ""} />
    </main>
  );
}
