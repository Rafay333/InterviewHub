import Link from "next/link";
import { LanguageLogo } from "@/components/ui/LanguageLogo";
import { shortLanguageName } from "@/lib/language-logo";
import type { PublicLanguage } from "@/lib/public-api";

type LanguageCardProps = {
  language: PublicLanguage;
  index?: number;
};

export function LanguageCard({ language }: LanguageCardProps) {
  const total =
    language.questionCount ||
    language.beginner + language.intermediate + language.expert;
  const title = shortLanguageName(language.name);
  const dots = [
    { on: language.beginner > 0, color: "bg-easy" },
    { on: language.intermediate > 0, color: "bg-medium" },
    { on: language.expert > 0, color: "bg-hard" },
    { on: total > 0, color: "bg-primary" },
  ];

  return (
    <Link
      href={`/languages/${language.slug}`}
      className="group flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white px-3.5 py-3.5 shadow-sm transition hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
    >
      <LanguageLogo
        name={language.name}
        slug={language.slug}
        pictureUrl={language.pictureUrl}
        iconFallback={language.icon}
        size="md"
      />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-bold text-navy group-hover:text-primary">
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-muted">
          {total > 0 ? `${total}+ Questions` : "0 Questions"}
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1" aria-hidden>
            {dots.map((dot, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${dot.on ? dot.color : "bg-slate-200"}`}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium text-muted">Beginner to Advanced</span>
        </div>
      </div>
    </Link>
  );
}
