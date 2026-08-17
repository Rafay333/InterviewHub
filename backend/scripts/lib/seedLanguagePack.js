/**
 * Shared seeder: ensure language, insert 15/15/15 with themed Full HD visuals.
 */
const { getPool, query, sql } = require("../../src/config/db");
const questionService = require("../../src/services/questionService");
const languageService = require("../../src/services/languageService");
const { renderVisual } = require("../../src/utils/fhdVisuals");

async function ensureLanguage(pack, adminId) {
  const langs = await languageService.listLanguages();
  const existing = langs.find((l) => {
    if (pack.match && pack.match.test(l.name)) return true;
    return String(l.name || "").toLowerCase() === String(pack.name).toLowerCase();
  });
  if (existing) {
    console.log("Using language:", existing.name, existing.id);
    return existing;
  }
  const created = await languageService.createLanguage({
    name: pack.name,
    description:
      pack.description ||
      `${pack.name} interview questions — beginner, intermediate, and expert.`,
    status: "published",
    pictureUrl: null,
    categoryId: null,
    adminId,
  });
  console.log("Created language", pack.name, created.id);
  return created;
}

async function countQuestions(languageId) {
  const r = await query(
    `SELECT COUNT_BIG(1) AS n FROM dbo.questions WHERE language_id = @id`,
    { id: { type: sql.UniqueIdentifier, value: languageId } },
  );
  return Number(r.recordset[0].n);
}

async function existingQuestionTexts(languageId) {
  const r = await query(
    `SELECT question_text FROM dbo.questions WHERE language_id = @id`,
    { id: { type: sql.UniqueIdentifier, value: languageId } },
  );
  return new Set(r.recordset.map((row) => String(row.question_text || "")));
}

async function insertAll(items, difficulty, lang, adminId, theme, already) {
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
      languageId: lang.id,
      categoryId: lang.categoryId || null,
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

async function refreshImages(pack, lang) {
  const all = [...pack.beginner, ...pack.intermediate, ...pack.expert];
  const rows = await query(
    `SELECT id, question_text FROM dbo.questions WHERE language_id = @id`,
    { id: { type: sql.UniqueIdentifier, value: lang.id } },
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

async function seedLanguagePack(pack, options = {}) {
  await getPool();
  const admin = await query(`SELECT TOP 1 id FROM dbo.admin_users ORDER BY created_at`);
  const adminId = admin.recordset[0]?.id || null;
  const lang = await ensureLanguage(pack, adminId);

  const existing = await countQuestions(lang.id);
  const expected =
    pack.beginner.length + pack.intermediate.length + pack.expert.length;

  if (existing >= expected) {
    console.log(`${pack.name} already has ${existing} questions.`);
    if (options.refreshImages) {
      console.log("Rebuilding images for matching questions…");
      await refreshImages(pack, lang);
    } else {
      console.log("Skipping insert to avoid duplicates. Pass --refresh-images to rebuild pictures.");
    }
    return { lang, skipped: true, existing };
  }

  if (existing > 0) {
    console.log(`${pack.name} has ${existing}/${expected} — resuming remaining questions…`);
  }

  const already = await existingQuestionTexts(lang.id);
  const b = await insertAll(pack.beginner, "beginner", lang, adminId, pack.theme, already);
  const i = await insertAll(pack.intermediate, "intermediate", lang, adminId, pack.theme, already);
  const e = await insertAll(pack.expert, "expert", lang, adminId, pack.theme, already);
  console.log(`\nDone ${pack.name}: inserted B${b} I${i} E${e} with varied Full HD visuals.`);
  return { lang, skipped: false, b, i, e };
}

module.exports = { seedLanguagePack, ensureLanguage, countQuestions };
