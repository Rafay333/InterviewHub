import Link from "next/link";
import { topLanguages } from "@/lib/home-data";
import { getAccent } from "@/lib/theme";

export function TopLanguages() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Start here
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Top technologies
          </h2>
        </div>
        <Link
          href="/languages"
          className="text-sm font-semibold text-primary transition hover:text-primary-dark"
        >
          View all →
        </Link>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topLanguages.map((lang, index) => {
          const accent = getAccent(index);
          return (
            <li key={lang.slug}>
              <Link
                href={`/languages/${lang.slug}`}
                className={`group flex h-full flex-col rounded-2xl border border-border bg-gradient-to-b ${accent.glow} p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${accent.ring}`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold shadow-sm ${accent.icon}`}
                >
                  {lang.icon}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-navy group-hover:text-primary">
                  {lang.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {lang.description}
                </p>
                <span className="mt-4 text-sm font-semibold text-primary">
                  {lang.questionCount} Questions →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
