import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionDetailView } from "@/components/questions/QuestionDetailView";
import { fetchQuestion } from "@/lib/public-api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const question = await fetchQuestion(slug);
  if (!question) return { title: "Question not found" };
  return {
    title: question.metaTitle,
    description: question.metaDescription,
  };
}

export default async function QuestionPage({ params }: Props) {
  const { slug } = await params;
  const question = await fetchQuestion(slug);
  if (!question) notFound();

  return (
    <main>
      <QuestionDetailView question={question} />
    </main>
  );
}
