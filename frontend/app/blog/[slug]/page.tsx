import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/blog/BlogPostView";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchBlog, fetchBlogs } from "@/lib/public-api";
import { articleJsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlog(slug);
  if (!post) {
    return { title: "Post not found", robots: { index: false } };
  }
  return buildPageMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.featuredImageUrl || "/hero-interview.png",
    type: "article",
    publishedTime: post.publishedAt,
    authors: post.authorName ? [post.authorName] : undefined,
    keywords: [
      post.category,
      post.title,
      "programming blog",
      "interview prep",
    ].filter(Boolean),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([fetchBlog(slug), fetchBlogs()]);
  if (!post) notFound();

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleJsonLd(post),
        ]}
      />
      <BlogPostView post={post} relatedPosts={posts} />
    </main>
  );
}
