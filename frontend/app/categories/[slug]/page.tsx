import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetailView } from "@/components/categories/CategoryDetailView";
import { fetchCategory, fetchCategoryQuestions } from "@/lib/public-api";

type CategoryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategory(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.metaTitle,
    description: category.metaDescription,
  };
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params;
  const category = await fetchCategory(slug);
  if (!category) notFound();
  const questions = await fetchCategoryQuestions(slug);

  return (
    <main>
      <CategoryDetailView category={category} questions={questions} />
    </main>
  );
}
