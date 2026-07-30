import Link from "next/link";
import type { BlogPost } from "@/lib/blogs-data";

const toneClass = {
  navy: "from-navy to-primary-dark",
  blue: "from-primary to-[#38bdf8]",
  teal: "from-teal to-primary",
  orange: "from-accent to-[#fb923c]",
  slate: "from-slate-600 to-slate-800",
} as const;

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div
          className={`flex h-40 items-end bg-gradient-to-br p-4 text-white ${toneClass[post.tone]}`}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
            {post.category}
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {post.category}
          </p>
          <h2 className="mt-2 text-lg font-bold leading-snug text-navy">
            {post.seoHeading}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
          <div className="mt-4 flex items-center justify-between text-sm text-muted">
            <span>{post.publishedLabel}</span>
            <span className="font-semibold text-primary" aria-hidden>
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
