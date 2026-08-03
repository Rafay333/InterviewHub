import Link from "next/link";
import type { PublicQuestionListItem } from "@/lib/public-api";

export const DIFFICULTY_LEVELS = [
  {
    key: "beginner",
    label: "Beginner",
    tone: "border-easy/25 bg-easy/10 text-easy hover:border-easy hover:bg-easy hover:text-white",
  },
  {
    key: "intermediate",
    label: "Intermediate",
    tone: "border-medium/25 bg-medium/10 text-medium hover:border-medium hover:bg-medium hover:text-white",
  },
  {
    key: "expert",
    label: "Expert",
    tone: "border-hard/25 bg-hard/10 text-hard hover:border-hard hover:bg-hard hover:text-white",
  },
] as const;

export type DifficultyLevelKey = (typeof DIFFICULTY_LEVELS)[number]["key"];

export function isDifficultyLevel(value: string): value is DifficultyLevelKey {
  return DIFFICULTY_LEVELS.some((level) => level.key === value);
}

export function normalizeDifficulty(value: string): DifficultyLevelKey {
  if (value === "easy") return "beginner";
  if (value === "medium") return "intermediate";
  if (value === "hard") return "expert";
  if (isDifficultyLevel(value)) return value;
  return "beginner";
}

export function countByDifficulty(questions: PublicQuestionListItem[]) {
  const counts: Record<DifficultyLevelKey, number> = {
    beginner: 0,
    intermediate: 0,
    expert: 0,
  };
  for (const q of questions) {
    counts[normalizeDifficulty(q.difficulty)] += 1;
  }
  return counts;
}

export function filterByDifficulty(
  questions: PublicQuestionListItem[],
  level: DifficultyLevelKey,
) {
  return questions.filter((q) => normalizeDifficulty(q.difficulty) === level);
}

type LevelButtonsProps = {
  basePath: string;
  counts: Record<DifficultyLevelKey, number>;
};

export function DifficultyLevelButtons({ basePath, counts }: LevelButtonsProps) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {DIFFICULTY_LEVELS.map((level) => {
        const count = counts[level.key];
        const href = `${basePath}/${level.key}`;
        if (count === 0) {
          return (
            <div
              key={level.key}
              className={`rounded-2xl border px-4 py-4 text-left opacity-45 ${level.tone}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide">{level.label}</p>
              <p className="mt-1 text-2xl font-bold text-navy">0</p>
              <p className="mt-1 text-xs font-semibold opacity-80">No questions</p>
            </div>
          );
        }
        return (
          <Link
            key={level.key}
            href={href}
            className={`rounded-2xl border px-4 py-4 text-left transition ${level.tone}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide">{level.label}</p>
            <p className="mt-1 text-2xl font-bold text-navy">{count}</p>
            <p className="mt-1 text-xs font-semibold opacity-80">Open all →</p>
          </Link>
        );
      })}
    </div>
  );
}

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
              {question.answer || question.summary || "—"}
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
                className="mt-3 max-h-72 rounded-xl border border-border object-contain"
              />
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
