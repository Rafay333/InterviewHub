import type { Metadata } from "next";
import type { PublicBlog, PublicCategory, PublicLanguage, PublicQuestionListItem } from "@/lib/public-api";
import { siteContact } from "@/lib/site-pages";

export const SITE_NAME = "InterviewHub";
export const SITE_TAGLINE = "Connect. Practice. Succeed.";
export const DEFAULT_OG_IMAGE = "/hero-interview.png";

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export function absUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function brandTitle(title: string) {
  const trimmed = String(title || "")
    .replace(/\s*\|\s*InterviewHub\s*$/i, "")
    .trim();
  return trimmed ? `${trimmed} | ${SITE_NAME}` : SITE_NAME;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string | null;
  authors?: string[];
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  keywords,
  type = "website",
  publishedTime,
  authors,
}: PageMetaInput): Metadata {
  const url = absUrl(path);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absUrl(image)
    : absUrl(DEFAULT_OG_IMAGE);
  const fullTitle = brandTitle(title);

  return {
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      locale: "en_US",
      images: [{ url: ogImage, alt: title }],
      ...(type === "article"
        ? {
            publishedTime: publishedTime || undefined,
            authors: authors?.length ? authors : undefined,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  };
}

export function itemListJsonLd(
  name: string,
  description: string,
  path: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absUrl("/") },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absUrl(item.path),
      })),
    },
  };
}

export function languageHubJsonLd(language: PublicLanguage) {
  const name = language.seoHeading || `${language.name} Interview Questions`;
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description: language.metaDescription || language.description,
    url: absUrl(`/languages/${language.slug}`),
    educationalLevel: ["Beginner", "Intermediate", "Expert"],
    learningResourceType: "Interview questions",
    inLanguage: "en",
    provider: { "@type": "Organization", name: SITE_NAME, url: absUrl("/") },
  };
}

export function categoryHubJsonLd(category: PublicCategory) {
  const name = category.seoHeading || `${category.name} Interview Questions`;
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description: category.metaDescription || category.description,
    url: absUrl(`/categories/${category.slug}`),
    educationalLevel: ["Beginner", "Intermediate", "Expert"],
    learningResourceType: "Interview questions",
    inLanguage: "en",
    provider: { "@type": "Organization", name: SITE_NAME, url: absUrl("/") },
  };
}

export function faqJsonLd(questions: PublicQuestionListItem[]) {
  const items = questions
    .filter((q) => (q.title || q.questionText) && (q.answer || q.summary))
    .slice(0, 15);
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.title || q.questionText,
      acceptedAnswer: {
        "@type": "Answer",
        text: String(q.answer || q.summary || "").slice(0, 5000),
      },
    })),
  };
}

export function articleJsonLd(post: PublicBlog) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoHeading || post.title,
    description: post.metaDescription || post.excerpt,
    url: absUrl(`/blog/${post.slug}`),
    datePublished: post.publishedAt || undefined,
    author: {
      "@type": "Person",
      name: post.authorName || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absUrl("/"),
    },
    image: post.featuredImageUrl
      ? post.featuredImageUrl.startsWith("http")
        ? post.featuredImageUrl
        : absUrl(post.featuredImageUrl)
      : absUrl(DEFAULT_OG_IMAGE),
    articleSection: post.category,
    wordCount: post.body?.split(/\s+/).filter(Boolean).length,
    timeRequired: `PT${post.readMinutes || 5}M`,
  };
}

export function websiteJsonLd() {
  const url = absUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    description:
      "Practice technical interview questions by programming language and category — with clear answers and explanations.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}languages?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absUrl("/"),
    slogan: SITE_TAGLINE,
    description:
      "InterviewHub helps developers prepare for technical interviews with real questions, answers, and diagrams.",
    email: siteContact.email,
    founder: {
      "@type": "Person",
      name: siteContact.founderName,
      url: siteContact.githubUrl,
      email: siteContact.email,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rawalpindi",
      addressCountry: "PK",
    },
    sameAs: [siteContact.githubUrl],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteContact.email,
      contactType: "customer support",
      url: absUrl("/contact"),
      areaServed: "PK",
    },
  };
}

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${SITE_NAME}`,
    url: absUrl("/about"),
    description:
      "InterviewHub is a technical interview practice site with real questions by language and category, clear answers, and diagrams.",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absUrl("/") },
  };
}

export function contactPageJsonLd(email?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${SITE_NAME}`,
    url: absUrl("/contact"),
    description: "Send a question, content request, or feedback to the InterviewHub team.",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absUrl("/") },
    ...(email ? { email } : {}),
  };
}
