import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/blog/BlogPostView";
import { fetchBlog, fetchBlogs } from "@/lib/public-api";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlog(slug);
  if (!post) {
    return { title: "Post not found" };
  }
  return {
    title: post.metaTitle,
    description: post.metaDescription,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([fetchBlog(slug), fetchBlogs()]);
  if (!post) notFound();

  return (
    <main>
      <BlogPostView post={post} relatedPosts={posts} />
    </main>
  );
}
