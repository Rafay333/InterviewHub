import type { Difficulty } from "@/lib/home-data";

const styles: Record<Difficulty, string> = {
  easy: "bg-easy/10 text-easy",
  medium: "bg-medium/10 text-medium",
  hard: "bg-hard/10 text-hard",
};

const labels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

type DifficultyBadgeProps = {
  difficulty: Difficulty;
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[difficulty]}`}
    >
      {labels[difficulty]}
    </span>
  );
}
