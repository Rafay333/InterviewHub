import Link from "next/link";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import type { PublicQuestionListItem } from "@/lib/public-api";

type Props = {
  questions: PublicQuestionListItem[];
};

export function RecentQuestions({ questions }: Props) {
  return (
    <section className="border-t border-primary/10 bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy">Recent questions</h2>
            <p className="mt-2 text-sm text-muted">Latest published Q&A from admin.</p>
          </div>
          <Link href="/languages" className="text-sm font-semibold text-primary hover:text-primary-dark">
            Browse languages →
          </Link>
        </div>

        {questions.length === 0 ? (
          <p className="mt-8 text-sm text-muted">No published questions yet.</p>
        ) : (
          <ul className="mt-8 divide-y divide-primary/10 overflow-hidden rounded-2xl border border-primary/15">
            {questions.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/questions/${q.slug}`}
                  className="flex flex-col gap-2 px-5 py-4 transition hover:bg-surface-tint sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <DifficultyBadge difficulty={q.difficulty} />
                    <h3 className="font-semibold text-navy">{q.title}</h3>
                    <p className="text-xs text-muted">
                      {[q.languageName, q.categoryName].filter(Boolean).join(" · ") || "InterviewHub"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary">Open →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
