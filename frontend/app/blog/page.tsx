import type { Metadata } from "next";
import { BlogPageContent } from "@/components/blog/BlogPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchBlogs } from "@/lib/public-api";
import { breadcrumbJsonLd, buildPageMetadata, itemListJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Programming Interview Blog & Career Guides",
  description:
    "Read practical programming guides — interview prep, SQL, readable code, debugging, REST APIs, and how AI is changing the future of software work.",
  path: "/blog",
  image: "/hero-interview.png",
  keywords: [
    "programming blog",
    "coding interview guides",
    "how AI changes programming",
    "SQL joins explained",
    "software career tips",
  ],
});

export default async function BlogPage() {
  const posts = await fetchBlogs();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          itemListJsonLd(
            "Programming Interview Blog & Career Guides",
            "Articles on programming craft, interviews, and AI.",
            "/blog",
            posts.map((post) => ({
              name: post.seoHeading || post.title,
              path: `/blog/${post.slug}`,
            })),
          ),
        ]}
      />
      <BlogPageContent posts={posts} />
    </>
  );
}
