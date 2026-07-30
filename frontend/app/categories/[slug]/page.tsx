import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetailView } from "@/components/categories/CategoryDetailView";
import {
  featuredCategories,
  getCategoryBySlug,
} from "@/lib/categories-data";

type CategoryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return featuredCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { title: "Category not found" };
  }
  return {
    title: category.metaTitle,
    description: category.metaDescription,
  };
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <main>
      <CategoryDetailView category={category} />
    </main>
  );
}
