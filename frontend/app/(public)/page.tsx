import { FocusCategories } from "@/components/home/FocusCategories";
import { HomeHero } from "@/components/home/HomeHero";
import { RecentQuestions } from "@/components/home/RecentQuestions";
import { TopLanguages } from "@/components/home/TopLanguages";
import {
  fetchCategories,
  fetchLanguages,
  fetchRecentQuestions,
  type PublicCategory,
  type PublicLanguage,
  type PublicQuestionListItem,
} from "@/lib/public-api";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Technical Interview Questions & Practice",
  description:
    "Master technical interviews with real questions by language and category. Clear answers, diagrams, and blog guides — including how AI is changing programming.",
  path: "/",
  image: "/hero-interview.png",
  keywords: [
    "technical interview questions",
    "coding interview practice",
    "programming interview prep",
  ],
});

export default async function HomePage() {
  let languages: PublicLanguage[] = [];
  let categories: PublicCategory[] = [];
  let questions: PublicQuestionListItem[] = [];

  try {
    [languages, categories, questions] = await Promise.all([
      fetchLanguages(),
      fetchCategories(),
      fetchRecentQuestions(8),
    ]);
  } catch {
    // API offline — show empty states
  }

  return (
    <main>
      <HomeHero />
      <TopLanguages languages={languages} />
      <FocusCategories categories={categories} />
      <RecentQuestions questions={questions} />
    </main>
  );
}
