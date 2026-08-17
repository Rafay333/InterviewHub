/**
 * Resolve a clean icon for a category hub.
 */
const KNOWN_ICONS: { match: RegExp; url: string }[] = [
  { match: /programming|fundamentals|basics/i, url: "/category-icons/programming-fundamentals.svg" },
  { match: /object-oriented|\boop\b/i, url: "/category-icons/object-oriented-programming-oop.svg" },
  { match: /data.?struct|algorithm|\bdsa\b/i, url: "/category-icons/data-structures-algorithms.svg" },
  { match: /database|\bsql\b/i, url: "/category-icons/database-sql.svg" },
  { match: /web\s*dev/i, url: "/category-icons/web-development.svg" },
  { match: /framework|librar/i, url: "/category-icons/frameworks-libraries.svg" },
  { match: /system\s*design|architecture/i, url: "/category-icons/system-design.svg" },
  { match: /cloud|devops/i, url: "/category-icons/cloud-devops.svg" },
  { match: /test|debug/i, url: "/category-icons/testing-debugging.svg" },
  { match: /security|auth/i, url: "/category-icons/security-authentication.svg" },
];

export function resolveCategoryIcon(name: string, slug: string, pictureUrl?: string | null) {
  if (pictureUrl) return pictureUrl;
  const haystack = `${name} ${slug}`;
  for (const item of KNOWN_ICONS) {
    if (item.match.test(haystack)) return item.url;
  }
  return `/category-icons/${slug}.svg`;
}

export function shortCategoryName(name: string) {
  return name
    .replace(/\s*interview\s*questions?\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim() || name;
}
