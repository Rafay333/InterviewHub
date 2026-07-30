const { query, sql } = require("../config/db");
const { uniqueSlug } = require("../utils/slugify");

function mapQuestion(row) {
  return {
    id: row.id,
    title: row.question_text,
    questionText: row.question_text,
    answer: row.answer_text,
    answerText: row.answer_text,
    description: row.description_text || "",
    descriptionText: row.description_text || "",
    questionImage: row.question_image_url || null,
    answerImage: row.answer_image_url || null,
    descriptionImage: row.description_image_url || null,
    difficulty: row.difficulty,
    languageId: row.language_id || null,
    languageIds: row.language_id ? [row.language_id] : [],
    languageName: row.language_name || null,
    categoryId: row.category_id || null,
    categoryIds: row.category_id ? [row.category_id] : [],
    categoryName: row.category_name || null,
    status: row.status,
    slug: row.slug,
    metaTitle: row.meta_title || "",
    metaDescription: row.meta_description || "",
    updatedAt: row.updated_at
      ? new Date(row.updated_at).toISOString().slice(0, 10)
      : null,
  };
}

const selectSql = `
  SELECT q.*,
    l.name AS language_name,
    c.name AS category_name
  FROM dbo.questions q
  LEFT JOIN dbo.languages l ON l.id = q.language_id
  LEFT JOIN dbo.categories c ON c.id = q.category_id
`;

async function listQuestions(filters = {}) {
  const clauses = [];
  const inputs = {};
  if (filters.languageId) {
    clauses.push("q.language_id = @languageId");
    inputs.languageId = { type: sql.UniqueIdentifier, value: filters.languageId };
  }
  if (filters.categoryId) {
    clauses.push("q.category_id = @categoryId");
    inputs.categoryId = { type: sql.UniqueIdentifier, value: filters.categoryId };
  }
  if (filters.difficulty && filters.difficulty !== "all") {
    clauses.push("q.difficulty = @difficulty");
    inputs.difficulty = { type: sql.VarChar(20), value: filters.difficulty };
  }
  if (filters.status && filters.status !== "all") {
    clauses.push("q.status = @status");
    inputs.status = { type: sql.VarChar(20), value: filters.status };
  }
  if (filters.q) {
    clauses.push("q.question_text LIKE @q");
    inputs.q = { type: sql.NVarChar(500), value: `%${filters.q}%` };
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const result = await query(
    `${selectSql} ${where} ORDER BY q.updated_at DESC`,
    inputs,
  );
  return result.recordset.map(mapQuestion);
}

async function getQuestion(id) {
  const result = await query(`${selectSql} WHERE q.id = @id`, {
    id: { type: sql.UniqueIdentifier, value: id },
  });
  const row = result.recordset[0];
  return row ? mapQuestion(row) : null;
}

async function createQuestion(payload) {
  const {
    questionText,
    answerText,
    descriptionText,
    difficulty,
    languageId,
    categoryId,
    status,
    questionImageUrl,
    answerImageUrl,
    descriptionImageUrl,
    adminId,
  } = payload;

  if (!languageId && !categoryId) {
    const err = new Error("Select a language or category");
    err.status = 400;
    throw err;
  }

  const slug = await uniqueSlug(questionText.slice(0, 80), async (candidate) => {
    const r = await query(`SELECT TOP 1 id FROM dbo.questions WHERE slug = @slug`, {
      slug: { type: sql.NVarChar(220), value: candidate },
    });
    return r.recordset.length > 0;
  });

  const result = await query(
    `INSERT INTO dbo.questions
      (question_text, answer_text, description_text,
       question_image_url, answer_image_url, description_image_url,
       language_id, category_id, difficulty, status, slug, meta_title, meta_description, created_by)
     OUTPUT INSERTED.id
     VALUES
      (@question_text, @answer_text, @description_text,
       @question_image_url, @answer_image_url, @description_image_url,
       @language_id, @category_id, @difficulty, @status, @slug, @meta_title, @meta_description, @created_by)`,
    {
      question_text: { type: sql.NVarChar(sql.MAX), value: questionText },
      answer_text: { type: sql.NVarChar(sql.MAX), value: answerText },
      description_text: { type: sql.NVarChar(sql.MAX), value: descriptionText || null },
      question_image_url: { type: sql.NVarChar(500), value: questionImageUrl || null },
      answer_image_url: { type: sql.NVarChar(500), value: answerImageUrl || null },
      description_image_url: {
        type: sql.NVarChar(500),
        value: descriptionImageUrl || null,
      },
      language_id: { type: sql.UniqueIdentifier, value: languageId || null },
      category_id: { type: sql.UniqueIdentifier, value: categoryId || null },
      difficulty: { type: sql.VarChar(20), value: difficulty || "beginner" },
      status: { type: sql.VarChar(20), value: status || "published" },
      slug: { type: sql.NVarChar(220), value: slug },
      meta_title: {
        type: sql.NVarChar(255),
        value: `${questionText.slice(0, 60)} | InterviewHub`,
      },
      meta_description: {
        type: sql.NVarChar(sql.MAX),
        value: descriptionText || answerText.slice(0, 160),
      },
      created_by: { type: sql.UniqueIdentifier, value: adminId || null },
    },
  );
  return getQuestion(result.recordset[0].id);
}

async function updateQuestion(id, payload) {
  const current = await getQuestion(id);
  if (!current) return null;

  const questionText = payload.questionText ?? current.questionText;
  const answerText = payload.answerText ?? current.answer;
  const descriptionText =
    payload.descriptionText !== undefined ? payload.descriptionText : current.description;
  const difficulty = payload.difficulty || current.difficulty;
  const languageId =
    payload.languageId !== undefined ? payload.languageId : current.languageId;
  const categoryId =
    payload.categoryId !== undefined ? payload.categoryId : current.categoryId;
  const status = payload.status || current.status;

  if (!languageId && !categoryId) {
    const err = new Error("Select a language or category");
    err.status = 400;
    throw err;
  }

  await query(
    `UPDATE dbo.questions SET
      question_text = @question_text,
      answer_text = @answer_text,
      description_text = @description_text,
      question_image_url = @question_image_url,
      answer_image_url = @answer_image_url,
      description_image_url = @description_image_url,
      language_id = @language_id,
      category_id = @category_id,
      difficulty = @difficulty,
      status = @status,
      meta_title = @meta_title,
      meta_description = @meta_description,
      updated_at = SYSUTCDATETIME()
     WHERE id = @id`,
    {
      id: { type: sql.UniqueIdentifier, value: id },
      question_text: { type: sql.NVarChar(sql.MAX), value: questionText },
      answer_text: { type: sql.NVarChar(sql.MAX), value: answerText },
      description_text: { type: sql.NVarChar(sql.MAX), value: descriptionText || null },
      question_image_url: {
        type: sql.NVarChar(500),
        value:
          payload.questionImageUrl !== undefined
            ? payload.questionImageUrl
            : current.questionImage,
      },
      answer_image_url: {
        type: sql.NVarChar(500),
        value:
          payload.answerImageUrl !== undefined
            ? payload.answerImageUrl
            : current.answerImage,
      },
      description_image_url: {
        type: sql.NVarChar(500),
        value:
          payload.descriptionImageUrl !== undefined
            ? payload.descriptionImageUrl
            : current.descriptionImage,
      },
      language_id: { type: sql.UniqueIdentifier, value: languageId || null },
      category_id: { type: sql.UniqueIdentifier, value: categoryId || null },
      difficulty: { type: sql.VarChar(20), value: difficulty },
      status: { type: sql.VarChar(20), value: status },
      meta_title: {
        type: sql.NVarChar(255),
        value: `${String(questionText).slice(0, 60)} | InterviewHub`,
      },
      meta_description: {
        type: sql.NVarChar(sql.MAX),
        value: descriptionText || String(answerText).slice(0, 160),
      },
    },
  );
  return getQuestion(id);
}

async function deleteQuestion(id) {
  const result = await query(`DELETE FROM dbo.questions WHERE id = @id`, {
    id: { type: sql.UniqueIdentifier, value: id },
  });
  return result.rowsAffected[0] > 0;
}

module.exports = {
  listQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
