import type { Metadata } from "next";
import { BlogPageContent } from "@/components/blog/BlogPageContent";

export const metadata: Metadata = {
  title: "Interview Prep Blog & Guides | InterviewHub",
  description:
    "Read interview prep guides — system design, coding interviews, SQL, behavioral STAR method, Redis caching, and career tips.",
};

export default function BlogPage() {
  return <BlogPageContent />;
}
