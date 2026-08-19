import type { PublicQuestionListItem } from "@/lib/public-api";

type FullListProps = {
  questions: PublicQuestionListItem[];
  levelLabel: string;
};

export function DifficultyQuestionsFullList({ questions, levelLabel }: FullListProps) {
  if (questions.length === 0) {
    return (
      <p className="mt-8 rounded-2xl border border-dashed border-primary/20 bg-surface-tint/40 px-5 py-10 text-center text-sm text-muted">
        No {levelLabel.toLowerCase()} questions yet.
      </p>
    );
  }

  return (
    <ol className="mt-8 space-y-6">
      {questions.map((question, index) => (
        <li
          key={question.id}
          className="rounded-2xl border border-primary/15 bg-white p-5 shadow-sm sm:p-7"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Question {index + 1}
          </p>
          <h2 className="mt-2 text-xl font-bold text-navy sm:text-2xl">{question.title}</h2>

          {question.questionImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={question.questionImage}
              alt=""
              className="mt-4 max-h-72 rounded-xl border border-border object-contain"
            />
          ) : null}

          <div className="mt-5 rounded-xl border border-border bg-surface-tint/40 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy">Answer</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink sm:text-base">
              {question.answer || "—"}
            </p>
            {question.answerImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={question.answerImage}
                alt=""
                className="mt-3 max-h-72 rounded-xl border border-border object-contain"
              />
            ) : null}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-white p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy">
              Explanation
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted sm:text-base">
              {question.description || "No explanation provided."}
            </p>
            {question.descriptionImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={question.descriptionImage}
                alt=""
                className="mt-5 w-full rounded-xl border border-border/80 bg-slate-50 object-contain object-center shadow-sm sm:max-h-[min(85vh,900px)]"
              />
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
