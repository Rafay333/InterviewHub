/**
 * Rebuild every explanation diagram to Full HD with large, readable (zoomed) type.
 * Covers all languages that have questions.
 */
const { getPool, query, sql } = require("../src/config/db");
const { renderCleanDiagram } = require("../src/utils/cleanDiagram");

function indexDiagrams() {
  /** @type {Array<{ match: string, diagram: object }>} */
  const list = [];

  const add = (match, diagram) => {
    if (!match || !diagram || !diagram.panels) return;
    list.push({ match: String(match).trim().toLowerCase(), diagram });
  };

  // Python (all levels)
  try {
    const py = require("./seed-python-all-levels");
    for (const item of [...py.beginner, ...py.intermediate, ...py.expert]) {
      add(item.q, item.diagram);
    }
  } catch (e) {
    console.warn("python specs:", e.message);
  }

  // .NET intermediate + expert
  try {
    const dot = require("./seed-dotnet-intermediate-expert");
    for (const item of [...dot.intermediate, ...dot.expert]) {
      add(item.q, item.diagram);
    }
  } catch (e) {
    console.warn("dotnet specs:", e.message);
  }

  // Next.js
  try {
    const next = require("./refresh-nextjs-clean-diagrams");
    for (const it of next.items || []) {
      add(it.match, it.diagram);
    }
  } catch (e) {
    console.warn("next specs:", e.message);
  }

  // Next.js seed (if diagram objects embedded)
  try {
    delete require.cache[require.resolve("./seed-nextjs-intermediate-expert")];
    // arrays not exported — ignore
  } catch {
    /* ignore */
  }

  console.log("Indexed diagram templates:", list.length);
  return list;
}

function lookup(list, questionText) {
  const q = String(questionText || "")
    .trim()
    .toLowerCase();
  // exact / prefix
  let best = null;
  let bestLen = 0;
  for (const it of list) {
    if (q === it.match || q.startsWith(it.match) || it.match.startsWith(q.slice(0, 40))) {
      if (it.match.length > bestLen) {
        best = it.diagram;
        bestLen = it.match.length;
      }
    }
  }
  return best;
}

function fallbackDiagram(row) {
  const rawTitle = String(row.question_text || "Explanation").replace(/\?+\s*$/, "");
  const title = rawTitle.length > 64 ? `${rawTitle.slice(0, 61)}…` : rawTitle;

  const split = (text, max = 5) =>
    String(text || "")
      .replace(/\s+/g, " ")
      .split(/(?<=[.!;])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 8)
      .slice(0, max)
      .map((s) => (s.length > 70 ? `${s.slice(0, 67)}…` : s));

  const answer = split(row.answer_text, 5);
  const explain = split(row.description_text, 5);

  return {
    title,
    panels: [
      {
        h: "Key answer",
        lines: answer.length ? answer : ["Open the full answer on the page."],
      },
      {
        h: "Remember",
        lines: explain.length ? explain : ["Read the full explanation under the image."],
      },
    ],
    footer: [row.language_name, row.difficulty, "Full HD 1920×1080"].filter(Boolean).join(" · "),
  };
}

async function main() {
  await getPool();
  const templates = indexDiagrams();

  // Every published/draft question — regenerate picture when one already exists OR for major langs
  const rows = await query(
    `SELECT q.id, q.question_text, q.answer_text, q.description_text, q.difficulty,
            q.description_image_url, l.name AS language_name
     FROM dbo.questions q
     INNER JOIN dbo.languages l ON l.id = q.language_id
     ORDER BY l.name, q.difficulty, q.created_at`,
  );

  console.log("Total questions:", rows.recordset.length);

  let ok = 0;
  let skip = 0;
  for (const row of rows.recordset) {
    // Always rebuild if we have a template OR already had an image OR is a seeded language
    const hasTemplate = Boolean(lookup(templates, row.question_text));
    const hadImage = Boolean(row.description_image_url);
    const always =
      /python|next|\.net|sql|react/i.test(String(row.language_name || ""));

    if (!hasTemplate && !hadImage && !always) {
      skip += 1;
      continue;
    }

    const diagram = lookup(templates, row.question_text) || fallbackDiagram(row);
    const url = renderCleanDiagram(diagram);
    if (!url) {
      console.warn("render failed", row.id);
      continue;
    }
    await query(
      `UPDATE dbo.questions
       SET description_image_url = @url, updated_at = SYSUTCDATETIME()
       WHERE id = @id`,
      {
        id: { type: sql.UniqueIdentifier, value: row.id },
        url: { type: sql.NVarChar(500), value: url },
      },
    );
    ok += 1;
    if (ok % 15 === 0) process.stdout.write(`${ok}… `);
  }

  console.log(`\nUpdated ${ok} Full HD large-text images (skipped ${skip}).`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
