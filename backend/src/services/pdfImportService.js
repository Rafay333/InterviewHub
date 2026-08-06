const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { query, sql } = require("../config/db");
const questionService = require("./questionService");
const { uploadRoot } = require("../middleware/upload");

/**
 * Parse PDF text. Supports both:
 *   Question 1: ...
 *   Q1. What is React?
 * with Answer: / Explanation: blocks (like React Beginner PDF).
 */
function parseQaExplanationText(rawText) {
  let text = String(rawText || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();

  if (!text) return [];

  text = text.replace(
    /(?:^|\n)\s*(?:Question\s+(\d+)|Q(\d+))\s*[.):]\s+/gi,
    (_m, q1, q2) => `\n__Q__${q1 || q2}__\n`,
  );

  const items = [];
  const blocks = text.split(/\n__Q__\d+__\n/).map((b) => b.trim()).filter(Boolean);

  for (const block of blocks) {
    const answerIdx = block.search(/\bAnswers?\s*:/i);
    if (answerIdx < 0) continue;

    const questionText = cleanLine(block.slice(0, answerIdx).replace(/^[\d.)\s-]+/, ""));
    const afterAnswerLabel = block
      .slice(answerIdx)
      .replace(/^\s*Answers?\s*:\s*/i, "");
    const explanationIdx = afterAnswerLabel.search(/\bExplanations?\s*:/i);

    let answerText;
    let descriptionText = "";

    if (explanationIdx >= 0) {
      answerText = cleanLine(afterAnswerLabel.slice(0, explanationIdx));
      descriptionText = cleanLine(
        afterAnswerLabel
          .slice(explanationIdx)
          .replace(/^\s*Explanations?\s*:\s*/i, ""),
      );
    } else {
      answerText = cleanLine(afterAnswerLabel);
    }

    if (!questionText || !answerText) continue;

    items.push({
      questionText,
      answerText,
      descriptionText,
    });
  }

  if (items.length === 0) {
    const blockRe =
      /(?:Question\s+\d+|Q\s*\d+)\s*[.:)\-]\s*([\s\S]*?)(?=(?:Question\s+\d+|Q\s*\d+)\s*[.:)\-]|$)/gi;
    let match;
    while ((match = blockRe.exec(String(rawText || ""))) !== null) {
      const block = match[1].trim();
      const answerIdx = block.search(/\bAnswers?\s*:/i);
      if (answerIdx < 0) continue;
      const questionText = cleanLine(block.slice(0, answerIdx));
      const afterAnswer = block.slice(answerIdx).replace(/^\s*Answers?\s*:\s*/i, "");
      const explanationIdx = afterAnswer.search(/\bExplanations?\s*:/i);
      let answerText;
      let descriptionText = "";
      if (explanationIdx >= 0) {
        answerText = cleanLine(afterAnswer.slice(0, explanationIdx));
        descriptionText = cleanLine(
          afterAnswer.slice(explanationIdx).replace(/^\s*Explanations?\s*:\s*/i, ""),
        );
      } else {
        answerText = cleanLine(afterAnswer);
      }
      if (questionText && answerText) {
        items.push({ questionText, answerText, descriptionText });
      }
    }
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
  return extractTextFromPdfBuffer(buffer);
}

async function extractTextFromPdfBuffer(buffer) {
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

async function loadPdfJs() {
  return import("pdfjs-dist/legacy/build/pdf.mjs");
}

function tryLoadCanvas() {
  try {
    // Optional: needed to render vector diagrams (boxes/arrows) into PNGs
    return require("@napi-rs/canvas");
  } catch {
    return null;
  }
}

function createCanvasFactory(createCanvas) {
  return {
    create(width, height) {
      const canvas = createCanvas(Math.max(1, Math.ceil(width)), Math.max(1, Math.ceil(height)));
      return {
        canvas,
        context: canvas.getContext("2d"),
      };
    },
    reset(canvasAndContext, width, height) {
      canvasAndContext.canvas.width = Math.max(1, Math.ceil(width));
      canvasAndContext.canvas.height = Math.max(1, Math.ceil(height));
    },
    destroy(canvasAndContext) {
      if (canvasAndContext?.canvas) {
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
      }
      canvasAndContext.canvas = null;
      canvasAndContext.context = null;
    },
  };
}

async function extractTextWithPdfJs(buffer) {
  const pdfjs = await loadPdfJs();
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

/**
 * Extract diagrams/images and attach them to parsed questions.
 *
 * Why text-only import fails for the "Next.js File-Based Routing" figure:
 * many PDFs draw boxes/arrows as vector paths + text, NOT as JPEG/PNG
 * streams. pdf-parse never sees them. We render page regions to PNG.
 *
 * Strategy:
 *  1) Locate Qn markers and "Visual Explanation" lines with page coords
 *  2) Render those page regions (vector diagrams included) to PNG
 *  3) Fallback: extract embedded bitmap XObjects near each question
 */
async function attachImagesToQuestions(pdfBuffer, parsedItems) {
  const canvasLib = tryLoadCanvas();
  if (!canvasLib || !parsedItems.length) {
    return parsedItems.map((item) => ({ ...item, descriptionImageBuffer: null }));
  }

  const { createCanvas, loadImage } = canvasLib;
  const pdfjs = await loadPdfJs();
  const canvasFactory = createCanvasFactory(createCanvas);

  const doc = await pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    stopAtErrors: false,
    isEvalSupported: false,
    useSystemFonts: true,
    canvasFactory,
  }).promise;

  const scale = 2;
  /** @type {Map<number, { png: Buffer, width: number, height: number }>} */
  const pageRenders = new Map();
  /** @type {{ page: number, y: number, type: 'q'|'visual', qNum?: number }[]} */
  const markers = [];
  /** @type {{ page: number, y: number, w: number, h: number, png: Buffer }[]} */
  const embedded = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum += 1) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    // Full-page render captures vector diagrams that are not image XObjects
    const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
    const renderTask = page.render({
      canvasContext: canvasAndContext.context,
      viewport,
      canvasFactory,
    });
    await renderTask.promise;
    const pagePng = canvasAndContext.canvas.toBuffer("image/png");
    pageRenders.set(pageNum, {
      png: pagePng,
      width: viewport.width,
      height: viewport.height,
    });
    canvasFactory.destroy(canvasAndContext);

    const content = await page.getTextContent();
    for (const item of content.items) {
      const str = String(item.str || "").trim();
      if (!str || !item.transform) continue;

      const [vx, vy] = viewport.convertToViewportPoint(item.transform[4], item.transform[5]);
      // text baseline → use a small offset toward the top of the glyph line
      const y = Math.max(0, vy - 4);

      const qMatch =
        str.match(/^Q\s*(\d+)\s*[.)]/i) ||
        str.match(/^Question\s+(\d+)\s*[.:)]/i) ||
        str.match(/^(\d+)\s*[.)]\s+\S/);
      if (qMatch) {
        markers.push({
          page: pageNum,
          y,
          type: "q",
          qNum: Number(qMatch[1]),
        });
        continue;
      }

      if (/visual\s*explanation/i.test(str) || /^visual\s*:/i.test(str)) {
        markers.push({ page: pageNum, y, type: "visual" });
      }
    }

    // Embedded bitmaps (screenshots, photos) — separate from vector drawings
    try {
      const pageEmbedded = await extractEmbeddedImagesFromPage(page, pdfjs, createCanvas);
      for (const img of pageEmbedded) {
        embedded.push({ page: pageNum, y: viewport.height * 0.5, ...img });
      }
    } catch {
      // ignore image extraction failures on broken pages
    }
  }

  const qMarkers = markers
    .filter((m) => m.type === "q" && Number.isFinite(m.qNum))
    .sort((a, b) => a.page - b.page || a.y - b.y || a.qNum - b.qNum);

  // Prefer unique q numbers in document order; fall back to sequential by index
  const uniqueQ = [];
  const seenQ = new Set();
  for (const m of qMarkers) {
    if (seenQ.has(m.qNum)) continue;
    seenQ.add(m.qNum);
    uniqueQ.push(m);
  }

  const results = [];

  for (let i = 0; i < parsedItems.length; i += 1) {
    const item = parsedItems[i];
    let imageBuffer = null;

    const start = uniqueQ[i] || uniqueQ.find((m) => m.qNum === i + 1) || null;
    const end = uniqueQ[i + 1] || null;

    // 1) Crop region starting at "Visual Explanation" inside this question’s span
    if (start) {
      const visual = markers.find(
        (m) =>
          m.type === "visual" &&
          isMarkerAfter(m, start) &&
          (!end || isMarkerBefore(m, end)),
      );

      if (visual) {
        imageBuffer = await cropQuestionRegion({
          pageRenders,
          loadImage,
          createCanvas,
          start: visual,
          end,
          paddingTop: 6,
          minHeight: 120,
        });
      }

      // 2) If no labeled visual but description hints at a figure, crop lower half of Q block
      if (
        !imageBuffer &&
        /visual|diagram|figure|routing|structure|architecture/i.test(item.descriptionText || "")
      ) {
        const mid = {
          page: start.page,
          y: start.y + 80,
          type: "visual",
        };
        imageBuffer = await cropQuestionRegion({
          pageRenders,
          loadImage,
          createCanvas,
          start: mid,
          end,
          paddingTop: 0,
          minHeight: 100,
        });
      }
    }

    // 3) Fallback — first decent embedded bitmap whose page sits in this question span
    if (!imageBuffer && embedded.length && start) {
      const pageFrom = start.page;
      const pageTo = end ? end.page : pageFrom;
      const candidate = embedded.find(
        (img) => img.page >= pageFrom && img.page <= pageTo && img.w >= 40 && img.h >= 40,
      );
      if (candidate) imageBuffer = candidate.png;
    }

    // 4) Last resort: first unused embedded image on sequential order
    if (!imageBuffer && embedded[i] && embedded[i].w >= 40 && embedded[i].h >= 40) {
      imageBuffer = embedded[i].png;
    }

    results.push({
      ...item,
      descriptionImageBuffer: imageBuffer,
    });
  }

  return results;
}

function isMarkerAfter(m, start) {
  return m.page > start.page || (m.page === start.page && m.y >= start.y - 2);
}

function isMarkerBefore(m, end) {
  return m.page < end.page || (m.page === end.page && m.y <= end.y + 2);
}

async function cropQuestionRegion({
  pageRenders,
  loadImage,
  createCanvas,
  start,
  end,
  paddingTop = 4,
  minHeight = 100,
}) {
  const pageInfo = pageRenders.get(start.page);
  if (!pageInfo) return null;

  const marginX = Math.round(pageInfo.width * 0.04);
  const top = Math.max(0, Math.floor(start.y - paddingTop));
  let bottom;

  if (end && end.page === start.page) {
    bottom = Math.min(pageInfo.height, Math.floor(end.y - 8));
  } else {
    // Take rest of page (diagrams often sit at the bottom of the current page)
    bottom = pageInfo.height - Math.round(pageInfo.height * 0.03);
  }

  if (bottom - top < minHeight) {
    bottom = Math.min(pageInfo.height, top + Math.max(minHeight, Math.round(pageInfo.height * 0.35)));
  }
  if (bottom <= top + 20) return null;

  const cropW = Math.max(1, pageInfo.width - marginX * 2);
  const cropH = Math.max(1, bottom - top);

  const img = await loadImage(pageInfo.png);
  const canvas = createCanvas(cropW, cropH);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, cropW, cropH);
  ctx.drawImage(img, marginX, top, cropW, cropH, 0, 0, cropW, cropH);

  // Skip near-empty crops (mostly white)
  if (isMostlyBlankCanvas(ctx, cropW, cropH)) return null;

  return canvas.toBuffer("image/png");
}

function isMostlyBlankCanvas(ctx, w, h) {
  const sample = ctx.getImageData(0, 0, Math.min(w, 600), Math.min(h, 400)).data;
  let dark = 0;
  const step = 16 * 4; // sample every 16 pixels
  for (let i = 0; i < sample.length; i += step) {
    const r = sample[i];
    const g = sample[i + 1];
    const b = sample[i + 2];
    // non-white-ish pixel
    if (r < 250 || g < 250 || b < 250) dark += 1;
  }
  const samples = Math.ceil(sample.length / step);
  return dark / samples < 0.02;
}

/**
 * Pull raster XObject images out of a page (when PDF embeds real images).
 */
async function extractEmbeddedImagesFromPage(page, pdfjs, createCanvas) {
  const ops = await page.getOperatorList();
  const images = [];
  const names = new Set();

  for (let i = 0; i < ops.fnArray.length; i += 1) {
    const fn = ops.fnArray[i];
    const isPaint =
      fn === pdfjs.OPS.paintImageXObject ||
      fn === pdfjs.OPS.paintImageXObjectRepeat ||
      fn === pdfjs.OPS.paintInlineImageXObject ||
      (pdfjs.OPS.paintJpegXObject != null && fn === pdfjs.OPS.paintJpegXObject);
    if (isPaint) {
      const name = ops.argsArray[i]?.[0];
      if (name) names.add(name);
    }
  }

  for (const name of names) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const imgData = await new Promise((resolve, reject) => {
        let settled = false;
        const timer = setTimeout(() => {
          if (!settled) {
            settled = true;
            reject(new Error("image timeout"));
          }
        }, 3000);
        try {
          page.objs.get(name, (data) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(data);
          });
        } catch (err) {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            reject(err);
          }
        }
      });

      if (!imgData || !imgData.width || !imgData.height || !imgData.data) continue;
      if (imgData.width < 40 || imgData.height < 40) continue;

      const png = imageDataToPng(imgData, createCanvas);
      if (png) {
        images.push({ w: imgData.width, h: imgData.height, png });
      }
    } catch {
      // skip unresolved image objects
    }
  }

  return images;
}

function imageDataToPng(imgData, createCanvas) {
  const { width, height, data, kind } = imgData;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(width, height);
  const out = imageData.data;

  // pdf.js kind: 1 GRAYSCALE_1BPP, 2 RGB_24BPP, 3 RGBA_32BPP (values may differ by version)
  const bytes = data instanceof Uint8ClampedArray || data instanceof Uint8Array ? data : null;
  if (!bytes) return null;

  if (bytes.length >= width * height * 4) {
    out.set(bytes.subarray(0, width * height * 4));
  } else if (bytes.length >= width * height * 3) {
    let si = 0;
    for (let di = 0; di < out.length; di += 4) {
      out[di] = bytes[si++];
      out[di + 1] = bytes[si++];
      out[di + 2] = bytes[si++];
      out[di + 3] = 255;
    }
  } else if (bytes.length >= width * height) {
    let si = 0;
    for (let di = 0; di < out.length; di += 4) {
      const v = bytes[si++];
      out[di] = v;
      out[di + 1] = v;
      out[di + 2] = v;
      out[di + 3] = 255;
    }
  } else {
    return null;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toBuffer("image/png");
}

function saveImportPng(pngBuffer, label, baseUrl) {
  if (!pngBuffer || !pngBuffer.length) return null;
  const safe = String(label || "img").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 40);
  const filename = `${Date.now()}-${safe}.png`;
  const filepath = path.join(uploadRoot, filename);
  if (!fs.existsSync(uploadRoot)) {
    fs.mkdirSync(uploadRoot, { recursive: true });
  }
  fs.writeFileSync(filepath, pngBuffer);
  const root = String(baseUrl || "").replace(/\/$/, "");
  return root ? `${root}/uploads/${filename}` : `/uploads/${filename}`;
}

function bufferToDataUrl(pngBuffer) {
  if (!pngBuffer || !pngBuffer.length) return null;
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

async function parsePdfFileWithImages(filePath) {
  const buffer = fs.readFileSync(filePath);
  const text = await extractTextFromPdfBuffer(buffer);
  const parsed = parseQaExplanationText(text);

  if (parsed.length === 0) {
    return { text, items: [] };
  }

  let items;
  try {
    items = await attachImagesToQuestions(buffer, parsed);
  } catch (err) {
    // Text still usable even if image pass fails
    console.warn("[pdf-import] image attach failed:", err.message);
    items = parsed.map((item) => ({ ...item, descriptionImageBuffer: null }));
  }

  return { text, items };
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
  baseUrl,
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
    const { items: parsed } = await parsePdfFileWithImages(file.path);

    if (parsed.length === 0) {
      const err = new Error(
        "No questions found. Expected Q1. / Question 1: then Answer: and Explanation: (like React Beginner PDF).",
      );
      err.status = 400;
      throw err;
    }

    const created = [];
    let sortOrder = 0;
    let imagesAttached = 0;

    for (const item of parsed) {
      const descriptionImageUrl = item.descriptionImageBuffer
        ? saveImportPng(
            item.descriptionImageBuffer,
            `q${sortOrder + 1}-diagram`,
            baseUrl,
          )
        : null;
      if (descriptionImageUrl) imagesAttached += 1;

      const question = await questionService.createQuestion({
        questionText: item.questionText,
        answerText: item.answerText,
        descriptionText: item.descriptionText,
        descriptionImageUrl,
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
        hasDiagram: Boolean(descriptionImageUrl),
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
      imagesAttached,
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

async function previewPdfQuestions({ file, difficulty }) {
  if (!file) {
    const err = new Error("PDF file is required");
    err.status = 400;
    throw err;
  }

  try {
    const { text, items: parsed } = await parsePdfFileWithImages(file.path);
    const defaultDifficulty = inferDifficulty(file.originalname, difficulty);

    if (parsed.length === 0) {
      const err = new Error(
        "No questions found. Expected Q1. / Question 1: then Answer: and Explanation:.",
      );
      err.status = 400;
      throw err;
    }

    return {
      fileName: file.originalname,
      fileSizeKb: Math.max(1, Math.round((file.size || 0) / 1024)),
      difficulty: defaultDifficulty,
      count: parsed.length,
      imagesFound: parsed.filter((q) => q.descriptionImageBuffer).length,
      questions: parsed.map((item, index) => ({
        index: index + 1,
        questionText: item.questionText,
        answerText: item.answerText,
        descriptionText: item.descriptionText || "",
        descriptionImagePreview: bufferToDataUrl(item.descriptionImageBuffer),
      })),
      rawPreview: String(text || "").slice(0, 800),
    };
  } finally {
    if (file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch {
        // ignore
      }
    }
  }
}

module.exports = {
  parseQaExplanationText,
  previewPdfQuestions,
  importPdfQuestions,
};
