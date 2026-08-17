/**
 * Seed programming-focused blog posts (idempotent).
 *
 *   node scripts/seed-blogs.js
 */
const { getPool, query } = require("../src/config/db");
const blogService = require("../src/services/blogService");
const { slugify } = require("../src/utils/slugify");
const POSTS = require("./packs/blogs");

async function main() {
  await getPool();
  const admin = await query(`SELECT TOP 1 id FROM dbo.admin_users ORDER BY created_at`);
  const adminId = admin.recordset[0]?.id || null;
  const existing = await blogService.listBlogs();

  let created = 0;
  let updated = 0;

  for (const post of POSTS) {
    const slug = slugify(post.title);
    const hit = existing.find(
      (row) =>
        row.slug === slug ||
        String(row.title || "").toLowerCase() === String(post.title).toLowerCase(),
    );

    const payload = {
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      category: post.category,
      authorName: "InterviewHub Editorial",
      authorTitle: "Staff writer",
      readMinutes: post.readMinutes,
      featured: !!post.featured,
      status: "published",
      featuredImageUrl: post.featuredImageUrl,
      metaTitle: `${post.title} | InterviewHub`,
      metaDescription: post.excerpt,
      adminId,
    };

    if (hit) {
      await blogService.updateBlog(hit.id, payload);
      updated += 1;
      console.log("Updated:", post.title);
    } else {
      await blogService.createBlog(payload);
      created += 1;
      console.log("Created:", post.title);
    }
  }

  if (POSTS.some((p) => p.featured)) {
    const featuredTitles = new Set(
      POSTS.filter((p) => p.featured).map((p) => p.title.toLowerCase()),
    );
    const latest = await blogService.listBlogs();
    for (const row of latest) {
      if (row.featured && !featuredTitles.has(row.title.toLowerCase())) {
        await blogService.updateBlog(row.id, { featured: false, status: row.status });
      }
    }
  }

  console.log(`Blogs: created ${created}, updated ${updated}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
