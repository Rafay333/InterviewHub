const { query, sql } = require("../config/db");
const { uniqueSlug } = require("../utils/slugify");

function mapLanguage(row) {
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

async function listLanguages() {
  const result = await query(`
    SELECT l.*,
      ISNULL(v.beginner, 0) AS beginner,
      ISNULL(v.intermediate, 0) AS intermediate,
      ISNULL(v.expert, 0) AS expert
    FROM dbo.languages l
    LEFT JOIN dbo.v_language_question_counts v ON v.language_id = l.id
    ORDER BY l.name
  `);
  return result.recordset.map(mapLanguage);
}

async function getLanguage(id) {
  const result = await query(
    `SELECT l.*,
      ISNULL(v.beginner, 0) AS beginner,
      ISNULL(v.intermediate, 0) AS intermediate,
      ISNULL(v.expert, 0) AS expert
     FROM dbo.languages l
     LEFT JOIN dbo.v_language_question_counts v ON v.language_id = l.id
     WHERE l.id = @id`,
    { id: { type: sql.UniqueIdentifier, value: id } },
  );
  const row = result.recordset[0];
  return row ? mapLanguage(row) : null;
}

async function createLanguage({ name, description, status, pictureUrl, adminId }) {
  const slug = await uniqueSlug(name, async (candidate) => {
    const r = await query(`SELECT TOP 1 id FROM dbo.languages WHERE slug = @slug`, {
      slug: { type: sql.NVarChar(160), value: candidate },
    });
    return r.recordset.length > 0;
  });
  const seoHeading = `${name} Interview Questions`;
  const metaTitle = `${seoHeading} | InterviewHub`;

  const result = await query(
    `INSERT INTO dbo.languages
      (name, slug, description, picture_url, seo_heading, meta_title, meta_description, status, created_by)
     OUTPUT INSERTED.id
     VALUES (@name, @slug, @description, @picture_url, @seo_heading, @meta_title, @meta_description, @status, @created_by)`,
    {
      name: { type: sql.NVarChar(120), value: name },
      slug: { type: sql.NVarChar(160), value: slug },
      description: { type: sql.NVarChar(sql.MAX), value: description || null },
      picture_url: { type: sql.NVarChar(500), value: pictureUrl || null },
      seo_heading: { type: sql.NVarChar(255), value: seoHeading },
      meta_title: { type: sql.NVarChar(255), value: metaTitle },
      meta_description: {
        type: sql.NVarChar(sql.MAX),
        value: description || `Practice ${seoHeading}.`,
      },
      status: { type: sql.VarChar(20), value: status || "published" },
      created_by: { type: sql.UniqueIdentifier, value: adminId || null },
    },
  );
  return getLanguage(result.recordset[0].id);
}

async function updateLanguage(id, { name, description, status, pictureUrl, adminId }) {
  const current = await getLanguage(id);
  if (!current) return null;

  let slug = current.slug;
  if (name && name !== current.name) {
    slug = await uniqueSlug(name, async (candidate) => {
      const r = await query(
        `SELECT TOP 1 id FROM dbo.languages WHERE slug = @slug AND id <> @id`,
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
    `UPDATE dbo.languages SET
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
  return getLanguage(id);
}

async function deleteLanguage(id) {
  const result = await query(`DELETE FROM dbo.languages WHERE id = @id`, {
    id: { type: sql.UniqueIdentifier, value: id },
  });
  return result.rowsAffected[0] > 0;
}

module.exports = {
  listLanguages,
  getLanguage,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};
