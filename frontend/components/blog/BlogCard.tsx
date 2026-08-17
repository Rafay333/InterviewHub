import Link from "next/link";
import type { PublicBlog } from "@/lib/public-api";

type BlogCardProps = {
  post: PublicBlog;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.featuredImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featuredImageUrl}
            alt=""
            className="h-40 w-full object-cover"
          />
        ) : (
          <div className="flex h-40 items-end bg-gradient-to-br from-primary to-[#38bdf8] p-4 text-white">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
              {post.category}
            </span>
          </div>
        )}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {post.category}
          </p>
          <h2 className="mt-2 text-lg font-bold leading-snug text-navy">{post.seoHeading}</h2>
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
