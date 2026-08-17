import Link from "next/link";
import { CategoryLogo } from "@/components/ui/CategoryLogo";
import { DifficultyLevelMiniLinks } from "@/components/questions/DifficultyLevelPages";
import type { PublicCategory } from "@/lib/public-api";
import { getAccent } from "@/lib/theme";

type CategoryCardProps = {
  category: PublicCategory;
  index?: number;
};

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const accent = getAccent(index);

  return (
    <article
      className={`rounded-2xl border border-primary/10 bg-white p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md ${accent.ring}`}
    >
      <Link href={`/categories/${category.slug}`} className="group flex items-start gap-3">
        <CategoryLogo
          name={category.name}
          slug={category.slug}
          pictureUrl={category.pictureUrl}
          iconFallback={category.icon}
          size="md"
        />
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-navy group-hover:text-primary">
            {category.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{category.description}</p>
          <p className="mt-2 text-sm font-semibold text-primary">
            {category.questionCount} questions
          </p>
        </div>
      </Link>
      <DifficultyLevelMiniLinks
        basePath={`/categories/${category.slug}`}
        beginner={category.beginner}
        intermediate={category.intermediate}
        expert={category.expert}
      />
    </article>
  );
}
