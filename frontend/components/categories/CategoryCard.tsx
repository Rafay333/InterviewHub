import Link from "next/link";
import type { PublicCategory } from "@/lib/public-api";
import { getAccent } from "@/lib/theme";

type CategoryCardProps = {
  category: PublicCategory;
  index?: number;
};

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const accent = getAccent(index);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative overflow-hidden rounded-2xl border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accent.ring}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 ${accent.glow}`}
      />
      <div className="relative flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${accent.icon}`}
        >
          {category.icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-navy group-hover:text-primary">
            {category.seoHeading}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{category.description}</p>
          <p className="mt-3 text-sm font-semibold text-primary">
            {category.questionCount} questions
          </p>
        </div>
      </div>
    </Link>
  );
}
