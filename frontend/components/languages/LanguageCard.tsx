import Link from "next/link";
import type { FeaturedLanguage } from "@/lib/languages-data";
import { getLanguageSeo, getTotalQuestions } from "@/lib/languages-data";
import { getAccent } from "@/lib/theme";

type LanguageCardProps = {
  language: FeaturedLanguage;
  accentIndex?: number;
};

export function LanguageCard({ language, accentIndex = 0 }: LanguageCardProps) {
  const total = getTotalQuestions(language);
  const accent = getAccent(accentIndex);
  const seo = getLanguageSeo(language);

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-border bg-gradient-to-b ${accent.glow} p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${accent.ring}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold shadow-sm ${accent.icon}`}
        >
          {language.icon}
        </span>
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-muted">
          {language.updatedLabel}
        </span>
      </div>

      <h2 className="mt-4 text-xl font-bold text-navy">{seo.heading}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{language.description}</p>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="font-medium text-[#64748b]">Total Questions</span>
        <span className="text-lg font-bold text-[#2563eb]">{total}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-easy/20 bg-easy/10 px-2 py-2 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-easy">
            Beginner
          </p>
          <p className="mt-1 text-sm font-bold text-navy">{language.beginner}</p>
        </div>
        <div className="rounded-lg border border-medium/20 bg-medium/10 px-2 py-2 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-medium">
            Intermediate
          </p>
          <p className="mt-1 text-sm font-bold text-navy">{language.intermediate}</p>
        </div>
        <div className="rounded-lg border border-hard/20 bg-hard/10 px-2 py-2 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-hard">
            Expert
          </p>
          <p className="mt-1 text-sm font-bold text-navy">{language.expert}</p>
        </div>
      </div>

      <Link
        href={`/languages/${language.slug}`}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary-dark"
      >
        Browse Questions
      </Link>
    </article>
  );
}
