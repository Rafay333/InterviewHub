const { query, sql } = require("../config/db");
const { uniqueSlug } = require("../utils/slugify");
const { mediaUrl } = require("../utils/publicUrl");

function mapBlog(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || "",
    body: row.body || "",
    category: row.category_tag || "",
    featuredImageUrl: mediaUrl(row.featured_image_url),
    authorName: row.author_name || "",
    authorTitle: row.author_title || "",
    readMinutes: row.read_minutes,
    featured: !!row.is_featured,
    status: row.status,
    metaTitle: row.meta_title || "",
    metaDescription: row.meta_description || "",
    publishedAt: row.published_at
      ? new Date(row.published_at).toISOString().slice(0, 10)
      : null,
    commentPending: Number(row.comment_pending || 0),
  };
}

async function listBlogs() {
  const result = await query(`
    SELECT b.*,
      (SELECT COUNT(*) FROM dbo.blog_comments bc
        WHERE bc.blog_id = b.id AND bc.status = 'pending') AS comment_pending
    FROM dbo.blogs b
    ORDER BY ISNULL(b.published_at, b.created_at) DESC
  `);
  return result.recordset.map(mapBlog);
}

async function getBlog(id) {
  const result = await query(
    `SELECT b.*,
      (SELECT COUNT(*) FROM dbo.blog_comments bc
        WHERE bc.blog_id = b.id AND bc.status = 'pending') AS comment_pending
     FROM dbo.blogs b WHERE b.id = @id`,
    { id: { type: sql.UniqueIdentifier, value: id } },
  );
  const row = result.recordset[0];
  return row ? mapBlog(row) : null;
}

async function createBlog(payload) {
  const slug = await uniqueSlug(payload.title, async (candidate) => {
    const r = await query(`SELECT TOP 1 id FROM dbo.blogs WHERE slug = @slug`, {
      slug: { type: sql.NVarChar(220), value: candidate },
    });
    return r.recordset.length > 0;
  });
  const status = payload.status || "draft";
  const result = await query(
    `INSERT INTO dbo.blogs
      (title, slug, excerpt, body, category_tag, featured_image_url,
       author_name, author_title, read_minutes, is_featured, status,
       seo_heading, meta_title, meta_description, published_at, created_by)
     OUTPUT INSERTED.id
     VALUES
      (@title, @slug, @excerpt, @body, @category_tag, @featured_image_url,
       @author_name, @author_title, @read_minutes, @is_featured, @status,
       @seo_heading, @meta_title, @meta_description, @published_at, @created_by)`,
    {
      title: { type: sql.NVarChar(255), value: payload.title },
      slug: { type: sql.NVarChar(220), value: slug },
      excerpt: { type: sql.NVarChar(sql.MAX), value: payload.excerpt || null },
      body: { type: sql.NVarChar(sql.MAX), value: payload.body || "" },
      category_tag: { type: sql.NVarChar(120), value: payload.category || null },
      featured_image_url: {
        type: sql.NVarChar(500),
        value: payload.featuredImageUrl || null,
      },
      author_name: { type: sql.NVarChar(120), value: payload.authorName || null },
      author_title: { type: sql.NVarChar(120), value: payload.authorTitle || null },
      read_minutes: { type: sql.Int, value: payload.readMinutes || 5 },
      is_featured: { type: sql.Bit, value: payload.featured ? 1 : 0 },
      status: { type: sql.VarChar(20), value: status },
      seo_heading: { type: sql.NVarChar(255), value: payload.title },
      meta_title: {
        type: sql.NVarChar(255),
        value: payload.metaTitle || `${payload.title} | InterviewHub`,
      },
      meta_description: {
        type: sql.NVarChar(sql.MAX),
        value: payload.metaDescription || payload.excerpt || null,
      },
      published_at: {
        type: sql.DateTime2,
        value: status === "published" ? new Date() : null,
      },
      created_by: { type: sql.UniqueIdentifier, value: payload.adminId || null },
    },
  );
  return getBlog(result.recordset[0].id);
}

async function updateBlog(id, payload) {
  const current = await getBlog(id);
  if (!current) return null;
  const status = payload.status || current.status;
  await query(
    `UPDATE dbo.blogs SET
      title = @title,
      excerpt = @excerpt,
      body = @body,
      category_tag = @category_tag,
      featured_image_url = @featured_image_url,
      author_name = @author_name,
      author_title = @author_title,
      read_minutes = @read_minutes,
      is_featured = @is_featured,
      status = @status,
      seo_heading = @seo_heading,
      meta_title = @meta_title,
      meta_description = @meta_description,
      published_at = CASE
        WHEN @status = 'published' AND published_at IS NULL THEN SYSUTCDATETIME()
        WHEN @status = 'draft' THEN NULL
        ELSE published_at
      END,
      updated_at = SYSUTCDATETIME()
     WHERE id = @id`,
    {
      id: { type: sql.UniqueIdentifier, value: id },
      title: { type: sql.NVarChar(255), value: payload.title || current.title },
      excerpt: {
        type: sql.NVarChar(sql.MAX),
        value: payload.excerpt ?? current.excerpt ?? null,
      },
      body: { type: sql.NVarChar(sql.MAX), value: payload.body ?? current.body },
      category_tag: {
        type: sql.NVarChar(120),
        value: payload.category ?? current.category ?? null,
      },
      featured_image_url: {
        type: sql.NVarChar(500),
        value:
          payload.featuredImageUrl !== undefined
            ? payload.featuredImageUrl
            : current.featuredImageUrl,
      },
      author_name: {
        type: sql.NVarChar(120),
        value: payload.authorName ?? current.authorName ?? null,
      },
      author_title: {
        type: sql.NVarChar(120),
        value: payload.authorTitle ?? current.authorTitle ?? null,
      },
      read_minutes: {
        type: sql.Int,
        value: payload.readMinutes || current.readMinutes || 5,
      },
      is_featured: {
        type: sql.Bit,
        value: (payload.featured ?? current.featured) ? 1 : 0,
      },
      status: { type: sql.VarChar(20), value: status },
      seo_heading: {
        type: sql.NVarChar(255),
        value: payload.title || current.title,
      },
      meta_title: {
        type: sql.NVarChar(255),
        value:
          payload.metaTitle ||
          current.metaTitle ||
          `${payload.title || current.title} | InterviewHub`,
      },
      meta_description: {
        type: sql.NVarChar(sql.MAX),
        value: payload.metaDescription ?? current.metaDescription ?? null,
      },
    },
  );
  return getBlog(id);
}

async function deleteBlog(id) {
  const result = await query(`DELETE FROM dbo.blogs WHERE id = @id`, {
    id: { type: sql.UniqueIdentifier, value: id },
  });
  return result.rowsAffected[0] > 0;
}

module.exports = { listBlogs, getBlog, createBlog, updateBlog, deleteBlog };
