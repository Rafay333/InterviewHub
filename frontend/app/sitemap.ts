import type { MetadataRoute } from "next";
import { fetchBlogs, fetchCategories, fetchLanguages } from "@/lib/public-api";
import { absUrl } from "@/lib/seo";

const LEVELS = ["beginner", "intermediate", "expert"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [languages, categories, blogs] = await Promise.all([
    fetchLanguages(),
    fetchCategories(),
    fetchBlogs(),
  ]);
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: absUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absUrl("/languages"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absUrl("/categories"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  ];

  for (const language of languages) {
    entries.push({
      url: absUrl(`/languages/${language.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const level of LEVELS) {
      entries.push({
        url: absUrl(`/languages/${language.slug}/${level}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  for (const category of categories) {
    entries.push({
      url: absUrl(`/categories/${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const level of LEVELS) {
      entries.push({
        url: absUrl(`/categories/${category.slug}/${level}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  for (const post of blogs) {
    entries.push({
      url: absUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "monthly",
      priority: post.featured ? 0.8 : 0.65,
    });
  }

  return entries;
}
