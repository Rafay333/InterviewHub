import type { Metadata } from "next";
import { LanguagesPageContent } from "@/components/languages/LanguagesPageContent";
import { fetchLanguages, type PublicLanguage } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Languages",
  description: "Browse interview question hubs by programming language.",
};

export const dynamic = "force-dynamic";

export default async function LanguagesPage() {
  const languages: PublicLanguage[] = await fetchLanguages();

  return (
    <main>
      <LanguagesPageContent languages={languages} />
    </main>
  );
}
