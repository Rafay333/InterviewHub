const { query, sql } = require("../config/db");

function iconFromName(name) {
  const parts = String(name || "").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return String(name || "?").slice(0, 2).toUpperCase();
}

function mapLanguage(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || "",
    pictureUrl: row.picture_url || null,
    icon: iconFromName(row.name),
    seoHeading: row.seo_heading || `${row.name} Interview Questions`,
    metaTitle: row.meta_title || `${row.name} Interview Questions | InterviewHub`,
    metaDescription:
      row.meta_description ||
      row.description ||
      `Practice ${row.name} interview questions.`,
    beginner: Number(row.beginner || 0),
    intermediate: Number(row.intermediate || 0),
    expert: Number(row.expert || 0),
    questionCount:
      Number(row.beginner || 0) +
      Number(row.intermediate || 0) +
      Number(row.expert || 0),
    updatedLabel: row.updated_at
      ? `Updated ${new Date(row.updated_at).toISOString().slice(0, 10)}`
      : "",
  };
}

function mapCategory(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || "",
    pictureUrl: row.picture_url || null,
    icon: iconFromName(row.name),
    seoHeading: row.seo_heading || `${row.name} Interview Questions`,
    metaTitle: row.meta_title || `${row.name} Interview Questions | InterviewHub`,
    metaDescription:
      row.meta_description ||
      row.description ||
      `Practice ${row.name} interview questions.`,
    beginner: Number(row.beginner || 0),
    intermediate: Number(row.intermediate || 0),
    expert: Number(row.expert || 0),
    easy: Number(row.beginner || 0),
    medium: Number(row.intermediate || 0),
    hard: Number(row.expert || 0),
    questionCount:
      Number(row.beginner || 0) +
      Number(row.intermediate || 0) +
      Number(row.expert || 0),
    focus: "Interview prep",
  };
}

function mapQuestionListItem(row) {
  const text = row.description_text || row.answer_text || "";
  return {
    id: row.id,
    slug: row.slug,
    title: row.question_text,
    difficulty: row.difficulty,
    summary: String(text).slice(0, 140),
    languageName: row.language_name || null,
    categoryName: row.category_name || null,
  };
}

function mapQuestionDetail(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.question_text,
    questionText: row.question_text,
    answer: row.answer_text,
    description: row.description_text || "",
    difficulty: row.difficulty,
    questionImage: row.question_image_url || null,
    answerImage: row.answer_image_url || null,
    descriptionImage: row.description_image_url || null,
    languageName: row.language_name || null,
    languageSlug: row.language_slug || null,
    categoryName: row.category_name || null,
    categorySlug: row.category_slug || null,
    metaTitle: row.meta_title || `${row.question_text} | InterviewHub`,
    metaDescription: row.meta_description || String(row.answer_text || "").slice(0, 160),
  };
}

function mapBlog(row) {
  return {
    id: row.id,
    slug: row.slug,
    seoHeading: row.seo_heading || row.title,
    title: row.title,
    excerpt: row.excerpt || "",
    body: row.body || "",
    category: row.category_tag || "Interview Prep",
    authorName: row.author_name || "InterviewHub",
    authorTitle: row.author_title || "Editor",
    readMinutes: row.read_minutes || 5,
    featured: !!row.is_featured,
    featuredImageUrl: row.featured_image_url || null,
    metaTitle: row.meta_title || `${row.title} | InterviewHub`,
    metaDescription: row.meta_description || row.excerpt || "",
    publishedAt: row.published_at
      ? new Date(row.published_at).toISOString().slice(0, 10)
      : null,
    publishedLabel: row.published_at
      ? new Date(row.published_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    tone: "blue",
    bodyParagraphs: String(row.body || "")
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean),
  };
}

async function listLanguages() {
  const result = await query(`
    SELECT l.*,
      ISNULL(v.beginner, 0) AS beginner,
      ISNULL(v.intermediate, 0) AS intermediate,
      ISNULL(v.expert, 0) AS expert
    FROM dbo.languages l
    LEFT JOIN dbo.v_language_question_counts v ON v.language_id = l.id
    WHERE l.status = 'published'
    ORDER BY l.name
  `);
  return result.recordset.map(mapLanguage);
}

async function getLanguageBySlug(slug) {
  const result = await query(
    `SELECT l.*,
      ISNULL(v.beginner, 0) AS beginner,
      ISNULL(v.intermediate, 0) AS intermediate,
      ISNULL(v.expert, 0) AS expert
     FROM dbo.languages l
     LEFT JOIN dbo.v_language_question_counts v ON v.language_id = l.id
     WHERE l.slug = @slug AND l.status = 'published'`,
    { slug: { type: sql.NVarChar(160), value: slug } },
  );
  const row = result.recordset[0];
  return row ? mapLanguage(row) : null;
}

async function listCategories() {
  const result = await query(`
    SELECT c.*,
      ISNULL(v.beginner, 0) AS beginner,
      ISNULL(v.intermediate, 0) AS intermediate,
      ISNULL(v.expert, 0) AS expert
    FROM dbo.categories c
    LEFT JOIN dbo.v_category_question_counts v ON v.category_id = c.id
    WHERE c.status = 'published'
    ORDER BY c.name
  `);
  return result.recordset.map(mapCategory);
}

async function getCategoryBySlug(slug) {
  const result = await query(
    `SELECT c.*,
      ISNULL(v.beginner, 0) AS beginner,
      ISNULL(v.intermediate, 0) AS intermediate,
      ISNULL(v.expert, 0) AS expert
     FROM dbo.categories c
     LEFT JOIN dbo.v_category_question_counts v ON v.category_id = c.id
     WHERE c.slug = @slug AND c.status = 'published'`,
    { slug: { type: sql.NVarChar(160), value: slug } },
  );
  const row = result.recordset[0];
  return row ? mapCategory(row) : null;
}

async function listQuestionsByLanguageSlug(slug) {
  const result = await query(
    `SELECT q.*, l.name AS language_name, c.name AS category_name
     FROM dbo.questions q
     INNER JOIN dbo.languages l ON l.id = q.language_id
     LEFT JOIN dbo.categories c ON c.id = q.category_id
     WHERE l.slug = @slug AND l.status = 'published' AND q.status = 'published'
     ORDER BY
       CASE q.difficulty WHEN 'beginner' THEN 1 WHEN 'intermediate' THEN 2 ELSE 3 END,
       q.updated_at DESC`,
    { slug: { type: sql.NVarChar(160), value: slug } },
  );
  return result.recordset.map(mapQuestionListItem);
}

async function listQuestionsByCategorySlug(slug) {
  const result = await query(
    `SELECT q.*, l.name AS language_name, c.name AS category_name
     FROM dbo.questions q
     INNER JOIN dbo.categories c ON c.id = q.category_id
     LEFT JOIN dbo.languages l ON l.id = q.language_id
     WHERE c.slug = @slug AND c.status = 'published' AND q.status = 'published'
     ORDER BY
       CASE q.difficulty WHEN 'beginner' THEN 1 WHEN 'intermediate' THEN 2 ELSE 3 END,
       q.updated_at DESC`,
    { slug: { type: sql.NVarChar(160), value: slug } },
  );
  return result.recordset.map(mapQuestionListItem);
}

async function getQuestionBySlug(slug) {
  const result = await query(
    `SELECT q.*,
      l.name AS language_name, l.slug AS language_slug,
      c.name AS category_name, c.slug AS category_slug
     FROM dbo.questions q
     LEFT JOIN dbo.languages l ON l.id = q.language_id
     LEFT JOIN dbo.categories c ON c.id = q.category_id
     WHERE q.slug = @slug AND q.status = 'published'`,
    { slug: { type: sql.NVarChar(220), value: slug } },
  );
  const row = result.recordset[0];
  return row ? mapQuestionDetail(row) : null;
}

async function listRecentQuestions(limit = 8) {
  const result = await query(
    `SELECT TOP (@limit) q.*, l.name AS language_name, c.name AS category_name
     FROM dbo.questions q
     LEFT JOIN dbo.languages l ON l.id = q.language_id
     LEFT JOIN dbo.categories c ON c.id = q.category_id
     WHERE q.status = 'published'
     ORDER BY q.updated_at DESC`,
    { limit: { type: sql.Int, value: limit } },
  );
  return result.recordset.map(mapQuestionListItem);
}

async function listBlogs() {
  const result = await query(`
    SELECT * FROM dbo.blogs
    WHERE status = 'published'
    ORDER BY ISNULL(published_at, created_at) DESC
  `);
  return result.recordset.map(mapBlog);
}

async function getBlogBySlug(slug) {
  const result = await query(
    `SELECT * FROM dbo.blogs WHERE slug = @slug AND status = 'published'`,
    { slug: { type: sql.NVarChar(220), value: slug } },
  );
  const row = result.recordset[0];
  return row ? mapBlog(row) : null;
}

module.exports = {
  listLanguages,
  getLanguageBySlug,
  listCategories,
  getCategoryBySlug,
  listQuestionsByLanguageSlug,
  listQuestionsByCategorySlug,
  getQuestionBySlug,
  listRecentQuestions,
  listBlogs,
  getBlogBySlug,
};
