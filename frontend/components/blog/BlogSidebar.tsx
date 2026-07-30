"use client";

import Link from "next/link";
import type { BlogPost } from "@/lib/blogs-data";
import { getPopularPosts, recommendedTopics } from "@/lib/blogs-data";

type BlogSidebarProps = {
  excludeSlug?: string;
};

export function BlogSidebar({ excludeSlug }: BlogSidebarProps) {
  const popular = getPopularPosts().filter((post) => post.slug !== excludeSlug);

  return (
    <aside className="space-y-8">
      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
          <span className="text-primary" aria-hidden>
            ✦
          </span>
          Popular Posts
        </h2>
        <ol className="mt-4 space-y-4">
          {popular.map((post, index) => (
            <li key={post.slug} className="flex gap-3">
              <span className="text-2xl font-bold text-slate-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-navy transition hover:text-primary"
                >
                  {post.seoHeading}
                </Link>
                {post.readsLabel ? (
                  <p className="mt-1 text-xs text-muted">{post.readsLabel}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-lg shadow-primary/20">
        <h2 className="text-xl font-bold">Level up your engineering career</h2>
        <p className="mt-2 text-sm text-blue-100">
          Get interview tips and new guides in your inbox. (Coming soon — form is a UI stub.)
        </p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="email@company.com"
            className="h-11 w-full rounded-lg border border-white/20 bg-primary-dark/40 px-3 text-sm text-white outline-none placeholder:text-blue-200 focus:ring-2 focus:ring-white/40"
          />
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-white text-sm font-semibold text-primary transition hover:bg-blue-50"
          >
            Subscribe
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-bold text-navy">Recommended Topics</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {recommendedTopics.map((topic) => (
            <Link
              key={topic.label}
              href={topic.href}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted transition hover:border-primary hover:text-primary"
            >
              {topic.label}
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}

export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="grid overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-md lg:grid-cols-2"
    >
      <div className="min-h-56 bg-gradient-to-br from-navy via-primary-dark to-primary p-8 text-white lg:min-h-72">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
          Featured guide
        </p>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-blue-100">
          Deep-dive interview prep writing for engineers who want clear, practical answers.
        </p>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
            Featured
          </span>
          <span className="text-muted">{post.readMinutes} min read</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          {post.seoHeading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          {post.excerpt}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-tint text-xs font-bold text-primary">
            {post.authorName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </span>
          <div>
            <p className="text-sm font-semibold text-navy">{post.authorName}</p>
            <p className="text-xs text-muted">{post.authorTitle}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
