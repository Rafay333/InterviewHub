"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSidebar, FeaturedPost } from "@/components/blog/BlogSidebar";
import {
  blogFilterCategories,
  blogPosts,
  getFeaturedPost,
  type BlogCategory,
} from "@/lib/blogs-data";

export function BlogPageContent() {
  const [filter, setFilter] = useState<BlogCategory>("All Posts");
  const featured = getFeaturedPost();

  const gridPosts = useMemo(() => {
    const rest = blogPosts.filter((post) => post.slug !== featured.slug);
    if (filter === "All Posts") return rest;
    return rest.filter((post) => post.category === filter);
  }, [featured.slug, filter]);

  return (
    <main className="bg-white">
      <section className="border-b border-border bg-gradient-to-b from-surface-tint to-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            InterviewHub Blog
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Interview Prep Blog & Guides
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Practical articles for coding interviews, system design, SQL, behavioral
            rounds, and career growth — written for search and for real prep.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <FeaturedPost post={featured} />

        <div className="mt-10 flex flex-wrap gap-2">
          {blogFilterCategories.map((category) => {
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
            <ul className="grid gap-6 sm:grid-cols-2">
              {gridPosts.map((post) => (
                <li key={post.slug}>
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>

            {gridPosts.length === 0 ? (
              <p className="mt-8 text-sm text-muted">No posts in this category yet.</p>
            ) : null}

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                className="inline-flex h-11 items-center rounded-xl border border-primary/30 bg-white px-6 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Load more articles
              </button>
            </div>
          </div>

          <BlogSidebar />
        </div>
      </div>
    </main>
  );
}
