import Link from "next/link";
import { getCategoryBySlug } from "@/lib/categories-data";

const homeCategorySlugs = ["system-design", "algorithms-ds", "behavioral"] as const;

const toneClass = {
  "system-design": "bg-gradient-to-br from-navy via-primary-dark to-primary text-white",
  "algorithms-ds": "bg-gradient-to-br from-teal to-primary text-white",
  behavioral: "bg-gradient-to-br from-accent to-[#fb923c] text-white",
} as const;

export function FocusCategories() {
  const categories = homeCategorySlugs
    .map((slug) => getCategoryBySlug(slug))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Categories
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Focus your study
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            Browse by interview topic — system design, algorithms, behavioral,
            and more — then drill into questions by difficulty.
          </p>
          <Link
            href="/categories"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary-dark"
          >
            Explore all categories
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {categories.map((category, index) => (
            <li
              key={category.slug}
              className={index === 2 ? "sm:col-span-2" : undefined}
            >
              <Link
                href={`/categories/${category.slug}`}
                className={`block rounded-2xl p-6 shadow-md transition hover:scale-[1.01] hover:shadow-xl ${toneClass[category.slug as keyof typeof toneClass]}`}
              >
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/90">
                  {category.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
