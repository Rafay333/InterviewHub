import type { Metadata } from "next";
import { LanguagesPageContent } from "@/components/languages/LanguagesPageContent";

export const metadata: Metadata = {
  title: "Programming Interview Questions by Language | InterviewHub",
  description:
    "Browse interview questions by language — React, JavaScript, Python, SQL, Java, AWS, and more.",
};

export default function LanguagesPage() {
  return (
    <main>
      <LanguagesPageContent />
    </main>
  );
}
