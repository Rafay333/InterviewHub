/**
 * Resolve a clean logo for a language hub.
 * Prefer admin-uploaded picture; otherwise match common tech names.
 */
const KNOWN_LOGOS: { match: RegExp; url: string }[] = [
  { match: /\bnext\.?\s*js\b|\bnextjs\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { match: /\breact\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { match: /\bnode\.?\s*js\b|\bnodejs\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { match: /\btypescript\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { match: /\bjavascript\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { match: /\bpython\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { match: /\bjava\b(?!\s*script)/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { match: /\bc#|csharp|\.net\b|asp\.?\s*net/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
  { match: /\bc\+\+|\bcpp\b|cplusplus/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { match: /\bruby\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg" },
  { match: /\bdart\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },
  { match: /\bscala\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg" },
  { match: /\blua\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg" },
  { match: /\bmatlab\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" },
  { match: /(^|\s)r(\s|$)|\/r$/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" },
  { match: /\bflutter\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  { match: /\bangular\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
  { match: /\bvue\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  { match: /\blaravel\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
  { match: /\bphp\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { match: /\bsql\b|mysql|postgres|database/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { match: /\bdocker\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { match: /\bgo(?:lang)?\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
  { match: /\bkotlin\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
  { match: /\bswift\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
  { match: /\brust\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" },
  { match: /\bhtml\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { match: /\bcss\b/i, url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
];

export function resolveLanguageLogo(name: string, slug: string, pictureUrl?: string | null) {
  if (pictureUrl) return pictureUrl;
  const haystack = `${name} ${slug}`;
  for (const item of KNOWN_LOGOS) {
    if (item.match.test(haystack)) return item.url;
  }
  return null;
}

/** Short display name: "React Interview Questions" → "React" */
export function shortLanguageName(name: string) {
  return name
    .replace(/\s*interview\s*questions?\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim() || name;
}
