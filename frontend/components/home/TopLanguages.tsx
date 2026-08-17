import Link from "next/link";
import { LanguageLogo } from "@/components/ui/LanguageLogo";
import { homeFeaturedLanguages } from "@/lib/home-data";
import { shortLanguageName } from "@/lib/language-logo";
import type { PublicLanguage } from "@/lib/public-api";
import { getAccent } from "@/lib/theme";

function pickHomeLanguages(languages: PublicLanguage[]) {
  const used = new Set<string>();
  return homeFeaturedLanguages
    .map(({ match }) =>
      languages.find((lang) => {
        if (used.has(lang.id)) return false;
        const haystack = `${shortLanguageName(lang.name)} ${lang.slug}`;
        if (!match.test(haystack)) return false;
        used.add(lang.id);
        return true;
      }),
    )
    .filter((lang): lang is PublicLanguage => Boolean(lang));
}

type Props = {
  languages: PublicLanguage[];
};

function FeaturedLanguageCard({
  language,
  index,
}: {
  language: PublicLanguage;
  index: number;
}) {
  const total =
    language.questionCount ||
    language.beginner + language.intermediate + language.expert;
  const title = shortLanguageName(language.name);
  const accent = getAccent(index);

  return (
    <Link
      href={`/languages/${language.slug}`}
      className={`group relative overflow-hidden rounded-2xl border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 ${accent.ring}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70 ${accent.glow}`}
        aria-hidden
      />
      <div className="relative">
        <LanguageLogo
          name={language.name}
          slug={language.slug}
          pictureUrl={language.pictureUrl}
          iconFallback={language.icon}
          size="lg"
        />
        <h3 className="mt-4 truncate text-lg font-bold text-navy group-hover:text-primary">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {total > 0 ? `${total}+ interview questions` : "Questions coming soon"}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {language.beginner > 0 && (
            <span className="rounded-full bg-easy/15 px-2 py-0.5 text-[10px] font-semibold text-easy">
              Beginner
            </span>
          )}
          {language.intermediate > 0 && (
            <span className="rounded-full bg-medium/15 px-2 py-0.5 text-[10px] font-semibold text-medium">
              Intermediate
            </span>
          )}
          {language.expert > 0 && (
            <span className="rounded-full bg-hard/15 px-2 py-0.5 text-[10px] font-semibold text-hard">
              Expert
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/** Home preview — four featured stacks, then More → /languages */
export function TopLanguages({ languages }: Props) {
  const items = pickHomeLanguages(languages);
  const remaining = Math.max(languages.length - items.length, 0);

  return (
    <section className="border-t border-slate-100 bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Start here
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy">
            Popular languages
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Four stacks to begin with. Open the languages page for the full catalog.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-muted">No languages published yet.</p>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((lang, index) => (
                <FeaturedLanguageCard key={lang.id} language={lang} index={index} />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/languages"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary-dark"
              >
                {remaining > 0 ? `More languages (${remaining})` : "More languages"}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
