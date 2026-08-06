import Link from "next/link";
import { LanguageCard } from "@/components/languages/LanguageCard";
import type { PublicLanguage } from "@/lib/public-api";

type Props = {
  languages: PublicLanguage[];
};

/** Home dashboard — same clean language cards as /languages */
export function TopLanguages({ languages }: Props) {
  const items = languages.slice(0, 12);

  return (
    <section className="border-t border-slate-100 bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-navy">Popular Languages</h2>
          <Link
            href="/languages"
            className="text-sm font-semibold text-primary transition hover:text-primary-dark"
          >
            View all →
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-muted">No languages published yet.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {items.map((lang) => (
              <LanguageCard key={lang.id} language={lang} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
