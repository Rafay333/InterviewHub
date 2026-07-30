function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 200);
}

async function uniqueSlug(base, existsFn) {
  let slug = slugify(base) || "item";
  let candidate = slug;
  let i = 2;
  while (await existsFn(candidate)) {
    candidate = `${slug}-${i}`;
    i += 1;
  }
  return candidate;
}

module.exports = { slugify, uniqueSlug };
