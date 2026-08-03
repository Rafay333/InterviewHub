const fs = require("fs");
const pdfParse = require("pdf-parse");
const { query, sql } = require("../config/db");
const questionService = require("./questionService");

/**
 * Parse PDF text in the format:
 *   Question 1: ...
 *   Answer: ...
 *   Explanation: ...
 */
function parseQaExplanationText(rawText) {
  const text = String(rawText || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .trim();

  if (!text) return [];

  const items = [];
  const blockRe =
    /Question\s+\d+\s*:\s*([\s\S]*?)(?=Question\s+\d+\s*:|$)/gi;
  let match;

  while ((match = blockRe.exec(text)) !== null) {
    const block = match[1].trim();
    if (!block) continue;

    const answerIdx = block.search(/\bAnswer\s*:/i);
    if (answerIdx < 0) continue;

    const questionText = cleanLine(block.slice(0, answerIdx));
    const afterAnswer = block.slice(answerIdx).replace(/^\s*Answer\s*:\s*/i, "");
    const explanationIdx = afterAnswer.search(/\bExplanation\s*:/i);

    let answerText;
    let descriptionText = "";

    if (explanationIdx >= 0) {
      answerText = cleanLine(afterAnswer.slice(0, explanationIdx));
      descriptionText = cleanLine(
        afterAnswer.slice(explanationIdx).replace(/^\s*Explanation\s*:\s*/i, ""),
      );
    } else {
      answerText = cleanLine(afterAnswer);
    }

    if (!questionText || !answerText) continue;

    items.push({
      questionText,
      answerText,
      descriptionText,
    });
  }

  return items;
}

function cleanLine(value) {
  return String(value || "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function inferDifficulty(fileName, explicit) {
  if (explicit && ["beginner", "intermediate", "expert"].includes(explicit)) {
    return explicit;
  }
  const name = String(fileName || "").toLowerCase();
  if (/(beginner|basic|easy)/.test(name)) return "beginner";
  if (/(expert|advanced|hard)/.test(name)) return "expert";
  if (/(intermediate|medium)/.test(name)) return "intermediate";
  return "beginner";
}

async function extractTextFromPdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const errors = [];

  try {
    const data = await pdfParse(buffer);
    if (data.text && data.text.trim()) return data.text;
  } catch (err) {
    errors.push(`pdf-parse: ${err.message}`);
  }

  try {
    const text = await extractTextWithPdfJs(buffer);
    if (text.trim()) return text;
  } catch (err) {
    errors.push(`pdfjs: ${err.message}`);
  }

  const fallback = extractLiteralStringsFromPdf(buffer);
  if (fallback.trim()) return fallback;

  const err = new Error(
    `Could not read PDF text (${errors.join(" | ") || "empty text"}). Re-save the PDF (Print → Save as PDF) and try again.`,
  );
  err.status = 400;
  throw err;
}

async function extractTextWithPdfJs(buffer) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    stopAtErrors: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });
  const doc = await loadingTask.promise;
  const parts = [];
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum += 1) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const line = content.items.map((item) => item.str || "").join(" ");
    if (line.trim()) parts.push(line);
  }
  return parts.join("\n");
}

/** Best-effort text scrape when PDF structure is broken (bad XRef). */
function extractLiteralStringsFromPdf(buffer) {
  const latin1 = buffer.toString("latin1");
  const chunks = [];

  const tjRe = /\((?:\\.|[^\\)])*\)\s*Tj/g;
  let match;
  while ((match = tjRe.exec(latin1)) !== null) {
    const inner = match[0].replace(/\s*Tj$/, "").slice(1, -1);
    chunks.push(decodePdfString(inner));
  }

  const tjArrayRe = /\[((?:[^\]]|\n)*)\]\s*TJ/g;
  while ((match = tjArrayRe.exec(latin1)) !== null) {
    const parts = [];
    const strRe = /\((?:\\.|[^\\)])*\)/g;
    let s;
    while ((s = strRe.exec(match[1])) !== null) {
      parts.push(decodePdfString(s[0].slice(1, -1)));
    }
    if (parts.length) chunks.push(parts.join(""));
  }

  return chunks.join("\n");
}

function decodePdfString(value) {
  return String(value || "")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\")
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}


async function getLanguageTarget(languageId) {
  const result = await query(
    `SELECT id, category_id FROM dbo.languages WHERE id = @id`,
    { id: { type: sql.UniqueIdentifier, value: languageId } },
  );
  return result.recordset[0] || null;
}

async function importPdfQuestions({
  file,
  languageId,
  categoryId,
  difficulty,
  status,
  adminId,
}) {
  if (!file) {
    const err = new Error("PDF file is required");
    err.status = 400;
    throw err;
  }
  if (!languageId && !categoryId) {
    const err = new Error("Select a language or category");
    err.status = 400;
    throw err;
  }

  let resolvedCategoryId = categoryId || null;
  if (languageId && !resolvedCategoryId) {
    const language = await getLanguageTarget(languageId);
    if (!language) {
      const err = new Error("Language not found");
      err.status = 404;
      throw err;
    }
    resolvedCategoryId = language.category_id || null;
  }

  const defaultDifficulty = inferDifficulty(file.originalname, difficulty);
  const publishStatus = status === "draft" ? "draft" : "published";

  const importRow = await query(
    `INSERT INTO dbo.pdf_imports
      (file_name, language_id, category_id, default_difficulty, status, created_by)
     OUTPUT INSERTED.id
     VALUES
      (@file_name, @language_id, @category_id, @default_difficulty, 'extracting', @created_by)`,
    {
      file_name: { type: sql.NVarChar(255), value: file.originalname },
      language_id: { type: sql.UniqueIdentifier, value: languageId || null },
      category_id: { type: sql.UniqueIdentifier, value: resolvedCategoryId },
      default_difficulty: { type: sql.VarChar(20), value: defaultDifficulty },
      created_by: { type: sql.UniqueIdentifier, value: adminId || null },
    },
  );
  const importId = importRow.recordset[0].id;

  try {
    const text = await extractTextFromPdf(file.path);
    const parsed = parseQaExplanationText(text);

    if (parsed.length === 0) {
      const err = new Error(
        "No questions found. Expected format: Question N: … / Answer: … / Explanation: …",
      );
      err.status = 400;
      throw err;
    }

    const created = [];
    let sortOrder = 0;

    for (const item of parsed) {
      const question = await questionService.createQuestion({
        questionText: item.questionText,
        answerText: item.answerText,
        descriptionText: item.descriptionText,
        difficulty: defaultDifficulty,
        languageId: languageId || null,
        categoryId: resolvedCategoryId,
        status: publishStatus,
        adminId,
      });

      await query(
        `INSERT INTO dbo.pdf_import_items
          (pdf_import_id, question_text, answer_text, description_text, difficulty, include_item, sort_order, created_question_id)
         VALUES
          (@pdf_import_id, @question_text, @answer_text, @description_text, @difficulty, 1, @sort_order, @created_question_id)`,
        {
          pdf_import_id: { type: sql.UniqueIdentifier, value: importId },
          question_text: { type: sql.NVarChar(sql.MAX), value: item.questionText },
          answer_text: { type: sql.NVarChar(sql.MAX), value: item.answerText },
          description_text: {
            type: sql.NVarChar(sql.MAX),
            value: item.descriptionText || null,
          },
          difficulty: { type: sql.VarChar(20), value: defaultDifficulty },
          sort_order: { type: sql.Int, value: sortOrder },
          created_question_id: { type: sql.UniqueIdentifier, value: question.id },
        },
      );

      created.push({
        id: question.id,
        title: question.title,
        slug: question.slug,
        difficulty: question.difficulty,
      });
      sortOrder += 1;
    }

    await query(
      `UPDATE dbo.pdf_imports
       SET status = 'imported',
           imported_count = @imported_count,
           error_message = NULL,
           updated_at = SYSUTCDATETIME()
       WHERE id = @id`,
      {
        id: { type: sql.UniqueIdentifier, value: importId },
        imported_count: { type: sql.Int, value: created.length },
      },
    );

    return {
      importId,
      importedCount: created.length,
      difficulty: defaultDifficulty,
      status: publishStatus,
      questions: created,
    };
  } catch (err) {
    await query(
      `UPDATE dbo.pdf_imports
       SET status = 'failed',
           error_message = @error_message,
           updated_at = SYSUTCDATETIME()
       WHERE id = @id`,
      {
        id: { type: sql.UniqueIdentifier, value: importId },
        error_message: {
          type: sql.NVarChar(sql.MAX),
          value: String(err.message || "Import failed").slice(0, 4000),
        },
      },
    );
    throw err;
  } finally {
    if (file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch {
        // ignore cleanup errors
      }
    }
  }
}

module.exports = {
  parseQaExplanationText,
  importPdfQuestions,
};
