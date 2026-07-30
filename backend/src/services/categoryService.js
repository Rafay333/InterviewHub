const { query, sql } = require("../config/db");
const { uniqueSlug } = require("../utils/slugify");

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    pictureUrl: row.picture_url || null,
    seoHeading: row.seo_heading || `${row.name} Interview Questions`,
    metaTitle: row.meta_title || `${row.name} Interview Questions | InterviewHub`,
    metaDescription: row.meta_description || "",
    status: row.status,
    beginner: Number(row.beginner || 0),
    intermediate: Number(row.intermediate || 0),
    expert: Number(row.expert || 0),
    updatedAt: row.updated_at
      ? new Date(row.updated_at).toISOString().slice(0, 10)
      : null,
  };
}

async function listCategories() {
  const result = await query(`
    SELECT c.*,
      ISNULL(v.beginner, 0) AS beginner,
      ISNULL(v.intermediate, 0) AS intermediate,
      ISNULL(v.expert, 0) AS expert
    FROM dbo.categories c
    LEFT JOIN dbo.v_category_question_counts v ON v.category_id = c.id
    ORDER BY c.name
  `);
  return result.recordset.map(mapCategory);
}

async function getCategory(id) {
  const result = await query(
    `SELECT c.*,
      ISNULL(v.beginner, 0) AS beginner,
      ISNULL(v.intermediate, 0) AS intermediate,
      ISNULL(v.expert, 0) AS expert
     FROM dbo.categories c
     LEFT JOIN dbo.v_category_question_counts v ON v.category_id = c.id
     WHERE c.id = @id`,
    { id: { type: sql.UniqueIdentifier, value: id } },
  );
  const row = result.recordset[0];
  return row ? mapCategory(row) : null;
}

async function createCategory({ name, description, status, pictureUrl, adminId }) {
  const slug = await uniqueSlug(name, async (candidate) => {
    const r = await query(`SELECT TOP 1 id FROM dbo.categories WHERE slug = @slug`, {
      slug: { type: sql.NVarChar(160), value: candidate },
    });
    return r.recordset.length > 0;
  });
  const seoHeading = `${name} Interview Questions`;

  const result = await query(
    `INSERT INTO dbo.categories
      (name, slug, description, picture_url, seo_heading, meta_title, meta_description, status, created_by)
     OUTPUT INSERTED.id
     VALUES (@name, @slug, @description, @picture_url, @seo_heading, @meta_title, @meta_description, @status, @created_by)`,
    {
      name: { type: sql.NVarChar(120), value: name },
      slug: { type: sql.NVarChar(160), value: slug },
      description: { type: sql.NVarChar(sql.MAX), value: description || null },
      picture_url: { type: sql.NVarChar(500), value: pictureUrl || null },
      seo_heading: { type: sql.NVarChar(255), value: seoHeading },
      meta_title: { type: sql.NVarChar(255), value: `${seoHeading} | InterviewHub` },
      meta_description: {
        type: sql.NVarChar(sql.MAX),
        value: description || `Practice ${seoHeading}.`,
      },
      status: { type: sql.VarChar(20), value: status || "published" },
      created_by: { type: sql.UniqueIdentifier, value: adminId || null },
    },
  );
  return getCategory(result.recordset[0].id);
}

async function updateCategory(id, { name, description, status, pictureUrl }) {
  const current = await getCategory(id);
  if (!current) return null;

  let slug = current.slug;
  if (name && name !== current.name) {
    slug = await uniqueSlug(name, async (candidate) => {
      const r = await query(
        `SELECT TOP 1 id FROM dbo.categories WHERE slug = @slug AND id <> @id`,
        {
          slug: { type: sql.NVarChar(160), value: candidate },
          id: { type: sql.UniqueIdentifier, value: id },
        },
      );
      return r.recordset.length > 0;
    });
  }

  const nextName = name || current.name;
  const seoHeading = `${nextName} Interview Questions`;

  await query(
    `UPDATE dbo.categories SET
      name = @name,
      slug = @slug,
      description = @description,
      picture_url = @picture_url,
      seo_heading = @seo_heading,
      meta_title = @meta_title,
      meta_description = @meta_description,
      status = @status,
      updated_at = SYSUTCDATETIME()
     WHERE id = @id`,
    {
      id: { type: sql.UniqueIdentifier, value: id },
      name: { type: sql.NVarChar(120), value: nextName },
      slug: { type: sql.NVarChar(160), value: slug },
      description: {
        type: sql.NVarChar(sql.MAX),
        value: description ?? current.description ?? null,
      },
      picture_url: {
        type: sql.NVarChar(500),
        value: pictureUrl !== undefined ? pictureUrl : current.pictureUrl,
      },
      seo_heading: { type: sql.NVarChar(255), value: seoHeading },
      meta_title: { type: sql.NVarChar(255), value: `${seoHeading} | InterviewHub` },
      meta_description: {
        type: sql.NVarChar(sql.MAX),
        value: description ?? current.description ?? null,
      },
      status: { type: sql.VarChar(20), value: status || current.status },
    },
  );
  return getCategory(id);
}

async function deleteCategory(id) {
  const result = await query(`DELETE FROM dbo.categories WHERE id = @id`, {
    id: { type: sql.UniqueIdentifier, value: id },
  });
  return result.rowsAffected[0] > 0;
}

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
