import type { Metadata } from "next";
import { CategoriesPageContent } from "@/components/categories/CategoriesPageContent";
import { fetchCategories, type PublicCategory } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse interview topics by category.",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories: PublicCategory[] = await fetchCategories();

  return (
    <main>
      <CategoriesPageContent categories={categories} />
    </main>
  );
}
