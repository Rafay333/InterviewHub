import Link from "next/link";
import type { PublicCategory } from "@/lib/public-api";
import { getAccent } from "@/lib/theme";

type Props = {
  categories: PublicCategory[];
};

export function FocusCategories({ categories }: Props) {
  const items = categories.slice(0, 6);

  return (
    <section className="border-t border-primary/10 bg-surface-tint/40 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy">Focus categories</h2>
            <p className="mt-2 text-sm text-muted">Topic hubs published in admin.</p>
          </div>
          <Link href="/categories" className="text-sm font-semibold text-primary hover:text-primary-dark">
            View all →
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-muted">No categories published yet.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((cat, index) => {
              const accent = getAccent(index + 2);
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className={`rounded-2xl border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 ${accent.ring}`}
                >
                  <h3 className="font-bold text-navy">{cat.seoHeading}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{cat.description}</p>
                  <p className="mt-3 text-xs font-semibold text-primary">
                    {cat.questionCount} questions
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
