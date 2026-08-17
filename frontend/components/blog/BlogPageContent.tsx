"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSidebar, FeaturedPost } from "@/components/blog/BlogSidebar";
import type { PublicBlog } from "@/lib/public-api";

type Props = {
  posts: PublicBlog[];
};

export function BlogPageContent({ posts }: Props) {
  const categories = useMemo(() => {
    const set = new Set<string>(["All Posts"]);
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  const [filter, setFilter] = useState("All Posts");
  const featured = posts.find((p) => p.featured) || posts[0] || null;

  const gridPosts = useMemo(() => {
    const rest = featured ? posts.filter((post) => post.slug !== featured.slug) : posts;
    if (filter === "All Posts") return rest;
    return rest.filter((post) => post.category === filter);
  }, [posts, featured, filter]);

  return (
    <main className="bg-white">
      <section className="border-b border-border bg-gradient-to-b from-surface-tint to-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            InterviewHub Blog
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Programming Interview Blog & Career Guides
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Practical writing for developers: interview prep, SQL, debugging, APIs, and how AI is changing the future of programming.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {featured ? <FeaturedPost post={featured} /> : null}

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = filter === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "border border-border bg-white text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            {posts.length === 0 ? (
              <p className="text-sm text-muted">No published blog posts yet.</p>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2">
                {gridPosts.map((post) => (
                  <li key={post.slug}>
                    <BlogCard post={post} />
                  </li>
                ))}
              </ul>
            )}
            {gridPosts.length === 0 && posts.length > 0 ? (
              <p className="mt-8 text-sm text-muted">No posts in this category yet.</p>
            ) : null}
          </div>
          <BlogSidebar posts={posts} />
        </div>
      </div>
    </main>
  );
}
