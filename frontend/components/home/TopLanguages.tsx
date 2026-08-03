import Link from "next/link";
import type { PublicLanguage } from "@/lib/public-api";
import { getAccent } from "@/lib/theme";

type Props = {
  languages: PublicLanguage[];
};

export function TopLanguages({ languages }: Props) {
  const items = languages.slice(0, 6);

  return (
    <section className="border-t border-primary/10 bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy">Top languages</h2>
            <p className="mt-2 text-sm text-muted">From admin-published language hubs.</p>
          </div>
          <Link href="/languages" className="text-sm font-semibold text-primary hover:text-primary-dark">
            View all →
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-muted">No languages published yet.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((lang, index) => {
              const accent = getAccent(index);
              return (
                <Link
                  key={lang.id}
                  href={`/languages/${lang.slug}`}
                  className={`rounded-2xl border border-primary/10 bg-gradient-to-br p-5 shadow-sm transition hover:-translate-y-0.5 ${accent.glow}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${accent.icon}`}
                    >
                      {lang.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-navy">{lang.name}</h3>
                      <p className="text-xs text-muted">{lang.questionCount} questions</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
