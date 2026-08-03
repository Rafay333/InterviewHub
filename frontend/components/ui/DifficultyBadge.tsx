import type { Difficulty } from "@/lib/home-data";

const styles: Record<string, string> = {
  beginner: "bg-easy/10 text-easy",
  intermediate: "bg-medium/10 text-medium",
  expert: "bg-hard/10 text-hard",
  easy: "bg-easy/10 text-easy",
  medium: "bg-medium/10 text-medium",
  hard: "bg-hard/10 text-hard",
};

const labels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
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
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${styles[difficulty] || styles.beginner}`}
    >
      {labels[difficulty] || difficulty}
    </span>
  );
}
