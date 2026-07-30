import type { Metadata } from "next";
import { CategoriesPageContent } from "@/components/categories/CategoriesPageContent";

export const metadata: Metadata = {
  title: "Interview Questions by Category | InterviewHub",
  description:
    "Browse interview questions by category — system design, DSA, SQL, behavioral, OOP, frontend, backend, and more.",
};

export default function CategoriesPage() {
  return (
    <main>
      <CategoriesPageContent />
    </main>
  );
}
