import Link from "next/link";
import type { PublicQuestionListItem } from "@/lib/public-api";

export const DIFFICULTY_LEVELS = [
  {
    key: "beginner",
    label: "Beginner",
    hint: "Core concepts & foundations",
    badge: "B",
    idle: "border-easy/30 bg-gradient-to-br from-easy/15 via-white to-white text-easy shadow-sm shadow-easy/10",
    hover:
      "hover:-translate-y-1 hover:border-easy hover:shadow-lg hover:shadow-easy/15",
    count: "text-navy",
    pill: "bg-easy/15 text-easy",
  },
  {
    key: "intermediate",
    label: "Intermediate",
    hint: "Real interview depth",
    badge: "I",
    idle: "border-medium/30 bg-gradient-to-br from-medium/15 via-white to-white text-medium shadow-sm shadow-medium/10",
    hover:
      "hover:-translate-y-1 hover:border-medium hover:shadow-lg hover:shadow-medium/15",
    count: "text-navy",
    pill: "bg-medium/15 text-medium",
  },
  {
    key: "expert",
    label: "Expert",
    hint: "Advanced & senior topics",
    badge: "E",
    idle: "border-hard/30 bg-gradient-to-br from-hard/15 via-white to-white text-hard shadow-sm shadow-hard/10",
    hover:
      "hover:-translate-y-1 hover:border-hard hover:shadow-lg hover:shadow-hard/15",
    count: "text-navy",
    pill: "bg-hard/15 text-hard",
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

/** Large Beginner / Intermediate / Expert cards used on language & category hubs. */
export function DifficultyLevelButtons({ basePath, counts }: LevelButtonsProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {DIFFICULTY_LEVELS.map((level) => {
        const count = counts[level.key];
        const href = `${basePath}/${level.key}`;
        const body = (
          <>
            <div className="flex items-start justify-between gap-3">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${level.pill}`}
              >
                {level.badge}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${level.pill}`}
              >
                {count === 0 ? "Empty" : `${count} Qs`}
              </span>
            </div>
            <p className="mt-5 text-lg font-bold tracking-tight text-navy">{level.label}</p>
            <p className="mt-1 text-xs leading-relaxed opacity-80">{level.hint}</p>
            <p className={`mt-5 text-3xl font-bold ${level.count}`}>{count}</p>
            <p className="mt-2 text-xs font-semibold opacity-80">
              {count === 0 ? "No questions yet" : "Open all questions →"}
            </p>
          </>
        );

        if (count === 0) {
          return (
            <div
              key={level.key}
              className={`rounded-2xl border p-5 text-left opacity-50 ${level.idle}`}
            >
              {body}
            </div>
          );
        }

        return (
          <Link
            key={level.key}
            href={href}
            className={`rounded-2xl border p-5 text-left transition ${level.idle} ${level.hover}`}
          >
            {body}
          </Link>
        );
      })}
    </div>
  );
}

type MiniLevelsProps = {
  basePath: string;
  beginner: number;
  intermediate: number;
  expert: number;
};

/** Compact level row for language/category listing cards. */
export function DifficultyLevelMiniLinks({
  basePath,
  beginner,
  intermediate,
  expert,
}: MiniLevelsProps) {
  const counts = { beginner, intermediate, expert };
  return (
    <div className="mt-3 grid grid-cols-3 gap-1.5">
      {DIFFICULTY_LEVELS.map((level) => {
        const count = counts[level.key];
        const className = `rounded-lg border px-1.5 py-1.5 text-center transition ${
          count === 0
            ? "border-slate-100 bg-slate-50 text-slate-300"
            : `${level.idle} hover:scale-[1.02]`
        }`;
        const inner = (
          <>
            <p className="text-[10px] font-bold uppercase tracking-wide">{level.label.slice(0, 3)}</p>
            <p className="mt-0.5 text-sm font-bold text-navy">{count}</p>
          </>
        );
        if (count === 0) {
          return (
            <div key={level.key} className={className} aria-disabled>
              {inner}
            </div>
          );
        }
        return (
          <Link key={level.key} href={`${basePath}/${level.key}`} className={className}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}

