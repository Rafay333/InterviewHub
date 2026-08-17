/**
 * Shared seeder: ensure category, insert 15/15/15 with Full HD visuals.
 */
const { getPool, query, sql } = require("../../src/config/db");
const questionService = require("../../src/services/questionService");
const categoryService = require("../../src/services/categoryService");
const { renderVisual } = require("../../src/utils/fhdVisuals");
const { CORE_CATEGORIES, matchCoreCategory } = require("../../src/data/coreCategories");

async function ensureCategory(pack, adminId) {
  await categoryService.ensureCoreCategories(adminId);
  const cats = await categoryService.listCategories();
  const existing = cats.find((c) => {
    if (pack.slug && c.slug === pack.slug) return true;
    return matchCoreCategory(c, {
      slug: pack.slug || "",
      name: pack.name,
      aliases: pack.aliases || [],
    });
  });
  if (existing) {
    console.log("Using category:", existing.name, existing.id);
    return existing;
  }
  const spec = CORE_CATEGORIES.find(
    (c) => c.slug === pack.slug || c.name === pack.name,
  );
  const created = await categoryService.createCategory({
    name: pack.name,
    description: pack.description || spec?.description || `${pack.name} interview questions.`,
    status: "published",
    pictureUrl: spec?.iconUrl || `/category-icons/${pack.slug}.svg`,
    adminId,
    slug: pack.slug,
    sortOrder: spec?.sortOrder,
  });
  console.log("Created category", pack.name, created.id);
  return created;
}

async function countQuestions(categoryId) {
  const r = await query(
    `SELECT COUNT_BIG(1) AS n FROM dbo.questions WHERE category_id = @id AND language_id IS NULL`,
    { id: { type: sql.UniqueIdentifier, value: categoryId } },
  );
  return Number(r.recordset[0].n);
}

async function existingQuestionTexts(categoryId) {
  const r = await query(
    `SELECT question_text FROM dbo.questions WHERE category_id = @id AND language_id IS NULL`,
    { id: { type: sql.UniqueIdentifier, value: categoryId } },
  );
  return new Set(r.recordset.map((row) => String(row.question_text || "")));
}

async function insertAll(items, difficulty, cat, adminId, theme, already) {
  let n = 0;
  let skipped = 0;
  for (const item of items) {
    if (already.has(item.q)) {
      skipped += 1;
      continue;
    }
    const descriptionImageUrl = renderVisual(item.visual, theme);
    if (!descriptionImageUrl) {
      throw new Error("Visual render failed — is @napi-rs/canvas installed?");
    }
    await questionService.createQuestion({
      questionText: item.q,
      answerText: item.a,
      descriptionText: item.e,
      descriptionImageUrl,
      difficulty,
      languageId: null,
      categoryId: cat.id,
      status: "published",
      adminId,
    });
    already.add(item.q);
    n += 1;
    process.stdout.write(`${difficulty[0].toUpperCase()}${n} `);
  }
  if (skipped) process.stdout.write(`(skip ${skipped}) `);
  return n;
}

async function refreshImages(pack, cat) {
  const all = [...pack.beginner, ...pack.intermediate, ...pack.expert];
  const rows = await query(
    `SELECT id, question_text FROM dbo.questions WHERE category_id = @id AND language_id IS NULL`,
    { id: { type: sql.UniqueIdentifier, value: cat.id } },
  );
  let u = 0;
  for (const row of rows.recordset) {
    const hit = all.find((it) =>
      String(row.question_text || "").startsWith(it.q.slice(0, 40)),
    );
    if (!hit) continue;
    const url = renderVisual(hit.visual, pack.theme);
    await query(
      `UPDATE dbo.questions SET description_image_url=@url, updated_at=SYSUTCDATETIME() WHERE id=@id`,
      {
        id: { type: sql.UniqueIdentifier, value: row.id },
        url: { type: sql.NVarChar(500), value: url },
      },
    );
    u += 1;
    process.stdout.write(".");
  }
  console.log(`\nUpdated ${u} ${pack.name} diagrams.`);
}

async function seedCategoryPack(pack, options = {}) {
  await getPool();
  const admin = await query(`SELECT TOP 1 id FROM dbo.admin_users ORDER BY created_at`);
  const adminId = admin.recordset[0]?.id || null;
  const cat = await ensureCategory(pack, adminId);

  const existing = await countQuestions(cat.id);
  const expected =
    pack.beginner.length + pack.intermediate.length + pack.expert.length;

  if (existing >= expected) {
    console.log(`${pack.name} already has ${existing} questions.`);
    if (options.refreshImages) {
      console.log("Rebuilding images for matching questions…");
      await refreshImages(pack, cat);
    } else {
      console.log("Skipping insert to avoid duplicates. Pass --refresh-images to rebuild pictures.");
    }
    return { cat, skipped: true, existing };
  }

  if (existing > 0) {
    console.log(`${pack.name} has ${existing}/${expected} — resuming remaining questions…`);
  }

  const already = await existingQuestionTexts(cat.id);
  const b = await insertAll(pack.beginner, "beginner", cat, adminId, pack.theme, already);
  const i = await insertAll(pack.intermediate, "intermediate", cat, adminId, pack.theme, already);
  const e = await insertAll(pack.expert, "expert", cat, adminId, pack.theme, already);
  console.log(`\nDone ${pack.name}: inserted B${b} I${i} E${e} with Full HD visuals.`);
  return { cat, skipped: false, b, i, e };
}

module.exports = { seedCategoryPack, ensureCategory, countQuestions };
