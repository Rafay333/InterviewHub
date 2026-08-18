import type { Metadata } from "next";
import { CategoriesPageContent } from "@/components/categories/CategoriesPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchCategories, type PublicCategory } from "@/lib/public-api";
import { breadcrumbJsonLd, buildPageMetadata, itemListJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Technical Interview Question Categories",
  description:
    "Study interview topics by category — OOP, data structures, SQL, web development, system design, cloud, testing, and security. Beginner to expert with answers.",
  path: "/categories",
  image: "/categories-hero.png",
  keywords: [
    "interview question categories",
    "OOP interview questions",
    "data structures interview questions",
    "system design interview",
    "SQL interview topics",
    "web development interview",
  ],
});

export default async function CategoriesPage() {
  const categories: PublicCategory[] = await fetchCategories();

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Categories", path: "/categories" },
          ]),
          itemListJsonLd(
            "Technical Interview Question Categories",
            "Interview topics from fundamentals through security.",
            "/categories",
            categories.map((cat) => ({
              name: `${cat.name} Interview Questions`,
              path: `/categories/${cat.slug}`,
            })),
          ),
        ]}
      />
      <CategoriesPageContent categories={categories} />
    </main>
  );
}
