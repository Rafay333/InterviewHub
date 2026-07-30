import Link from "next/link";
import { BlogCommentForm } from "@/components/blog/BlogCommentForm";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import type { BlogPost } from "@/lib/blogs-data";

type BlogPostViewProps = {
  post: BlogPost;
};

export function BlogPostView({ post }: BlogPostViewProps) {
  return (
    <article className="bg-white">
      <div className="border-b border-border bg-gradient-to-b from-surface-tint to-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-xs text-muted">
            <Link href="/" className="font-medium text-primary hover:text-primary-dark">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="font-medium text-primary hover:text-primary-dark">
              Blog
            </Link>
            <span aria-hidden>/</span>
            <span className="font-semibold text-navy">{post.category}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
              {post.category}
            </span>
            <span className="text-muted">{post.readMinutes} min read</span>
            <span className="text-muted">{post.publishedLabel}</span>
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            {post.seoHeading}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {post.excerpt}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-primary shadow-sm">
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
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <div>
          <div className="space-y-5 text-base leading-relaxed text-ink">
            {post.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-primary/15 bg-surface-tint/50 p-5">
            <h2 className="text-sm font-semibold text-navy">Keep practicing</h2>
            <p className="mt-2 text-sm text-muted">
              Browse related interview questions by language or category while you read.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/languages"
                className="text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Languages →
              </Link>
              <Link
                href="/categories"
                className="text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Categories →
              </Link>
            </div>
          </div>

          <BlogCommentForm />
        </div>

        <BlogSidebar excludeSlug={post.slug} />
      </div>
    </article>
  );
}
