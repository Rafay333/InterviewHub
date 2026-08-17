import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetailView } from "@/components/categories/CategoryDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchCategory, fetchCategoryQuestions } from "@/lib/public-api";
import { breadcrumbJsonLd, buildPageMetadata, categoryHubJsonLd } from "@/lib/seo";

type CategoryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategory(slug);
  if (!category) return { title: "Category not found", robots: { index: false } };
  return buildPageMetadata({
    title: category.metaTitle || `${category.name} Interview Questions`,
    description:
      category.metaDescription ||
      `Practice ${category.name} interview questions with answers — Beginner, Intermediate, and Expert. ${category.description}`,
    path: `/categories/${category.slug}`,
    image: category.pictureUrl || "/categories-hero.png",
    keywords: [
      `${category.name} interview questions`,
      `${category.name} coding interview`,
      "technical interview topics",
    ],
  });
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params;
  const category = await fetchCategory(slug);
  if (!category) notFound();
  const questions = await fetchCategoryQuestions(slug);

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Categories", path: "/categories" },
            { name: category.name, path: `/categories/${category.slug}` },
          ]),
          categoryHubJsonLd(category),
        ]}
      />
      <CategoryDetailView category={category} questions={questions} />
    </main>
  );
}
