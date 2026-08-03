import Link from "next/link";
import type { PublicLanguage } from "@/lib/public-api";
import { getAccent } from "@/lib/theme";

type LanguageCardProps = {
  language: PublicLanguage;
  index?: number;
};

export function LanguageCard({ language, index = 0 }: LanguageCardProps) {
  const accent = getAccent(index);
  const total =
    language.questionCount ||
    language.beginner + language.intermediate + language.expert;

  return (
    <Link
      href={`/languages/${language.slug}`}
      className={`group relative overflow-hidden rounded-2xl border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accent.ring}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 ${accent.glow}`}
      />
      <div className="relative flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${accent.icon}`}
        >
          {language.icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-navy group-hover:text-primary">
            {language.seoHeading || `${language.name} Interview Questions`}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{language.description}</p>
          <p className="mt-3 text-sm font-semibold text-primary">
            {total} questions
          </p>
        </div>
      </div>
    </Link>
  );
}
