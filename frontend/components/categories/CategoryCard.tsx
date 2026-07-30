import Link from "next/link";
import type { CategoryTopic } from "@/lib/categories-data";
import { getAccent } from "@/lib/theme";

type CategoryCardProps = {
  category: CategoryTopic;
  accentIndex?: number;
};

export function CategoryCard({ category, accentIndex = 0 }: CategoryCardProps) {
  const accent = getAccent(accentIndex);

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-border bg-gradient-to-b ${accent.glow} p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${accent.ring}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold shadow-sm ${accent.icon}`}
        >
          {category.icon}
        </span>
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-muted">
          {category.focus}
        </span>
      </div>

      <h2 className="mt-4 text-xl font-bold text-navy">{category.seoHeading}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {category.description}
      </p>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="font-medium text-[#64748b]">Total Questions</span>
        <span className="text-lg font-bold text-[#2563eb]">{category.questionCount}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-easy/20 bg-easy/10 px-2 py-2 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-easy">Easy</p>
          <p className="mt-1 text-sm font-bold text-navy">{category.easy}</p>
        </div>
        <div className="rounded-lg border border-medium/20 bg-medium/10 px-2 py-2 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-medium">
            Medium
          </p>
          <p className="mt-1 text-sm font-bold text-navy">{category.medium}</p>
        </div>
        <div className="rounded-lg border border-hard/20 bg-hard/10 px-2 py-2 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-hard">Hard</p>
          <p className="mt-1 text-sm font-bold text-navy">{category.hard}</p>
        </div>
      </div>

      <Link
        href={`/categories/${category.slug}`}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary-dark"
      >
        Browse category
      </Link>
    </article>
  );
}
