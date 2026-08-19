import Link from "next/link";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { StudyText } from "@/components/questions/StudyText";
import type { PublicQuestionDetail } from "@/lib/public-api";

type Props = {
  question: PublicQuestionDetail;
};

export function QuestionDetailView({ question }: Props) {
  return (
    <article className="bg-white">
      <div className="border-y border-primary/10 bg-gradient-to-r from-surface-tint via-white to-[#fff7ed]">
        <div className="mx-auto max-w-3xl px-4 py-3 text-xs text-muted sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
            <Link href="/" className="font-medium text-primary hover:text-primary-dark">
              Home
            </Link>
            {question.languageSlug ? (
              <>
                <span aria-hidden>/</span>
                <Link
                  href={`/languages/${question.languageSlug}`}
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  {question.languageName}
                </Link>
              </>
            ) : null}
            {question.categorySlug ? (
              <>
                <span aria-hidden>/</span>
                <Link
                  href={`/categories/${question.categorySlug}`}
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  {question.categoryName}
                </Link>
              </>
            ) : null}
            <span aria-hidden>/</span>
            <span className="font-semibold text-navy">Question</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <DifficultyBadge difficulty={question.difficulty} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          {question.title}
        </h1>

        <section className="mt-8 rounded-2xl border border-primary/15 bg-gradient-to-br from-surface-tint/70 to-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Question</h2>
          <div className="mt-4">
            <StudyText text={question.questionText} />
          </div>
          {question.questionImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={question.questionImage}
              alt=""
              className="mt-5 max-h-80 rounded-xl border border-border object-contain"
            />
          ) : null}
        </section>

        <section className="mt-6 rounded-2xl border border-primary/15 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Answer</h2>
          <div className="mt-4">
            <StudyText text={question.answer} />
          </div>
          {question.answerImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={question.answerImage}
              alt=""
              className="mt-5 max-h-80 rounded-xl border border-border object-contain"
            />
          ) : null}
        </section>

        {question.description ? (
          <section className="mt-6 rounded-2xl border border-border bg-surface-tint/30 p-5 sm:p-7">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-navy">
              Explanation
            </h2>
            <div className="mt-4">
              <StudyText text={question.description} muted />
            </div>
            {question.descriptionImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={question.descriptionImage}
                alt=""
                className="mt-6 w-full rounded-xl border border-border/80 bg-slate-50 object-contain object-center shadow-sm sm:max-h-[min(85vh,900px)]"
              />
            ) : null}
          </section>
        ) : null}
      </div>
    </article>
  );
}
