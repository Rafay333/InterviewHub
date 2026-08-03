import type { Metadata } from "next";
import { BlogPageContent } from "@/components/blog/BlogPageContent";
import { fetchBlogs } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Interview Prep Blog & Guides | InterviewHub",
  description:
    "Read interview prep guides — system design, coding interviews, SQL, behavioral STAR method, and career tips.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await fetchBlogs();
  return <BlogPageContent posts={posts} />;
}
