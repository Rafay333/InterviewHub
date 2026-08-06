/**
 * Regenerate .NET intermediate/expert images at Full HD 1920×1080.
 */
const { getPool, query, sql } = require("../src/config/db");
const { renderCleanDiagram } = require("../src/utils/cleanDiagram");
const { intermediate, expert } = require("./seed-dotnet-intermediate-expert");

async function main() {
  await getPool();
  const langs = await query(
    `SELECT id, name FROM dbo.languages
     WHERE name LIKE N'%.Net%' OR name LIKE N'%.NET%' OR name LIKE N'%Net Interview%'`,
  );
  const lang = langs.recordset[0];
  if (!lang) {
    console.error(".NET language not found");
    process.exit(1);
  }
  console.log("Language:", lang.name);

  const specs = [...intermediate, ...expert].map((item) => ({
    match: item.q.slice(0, 48),
    full: item.q,
    diagram: item.diagram,
  }));

  const qs = await query(
    `SELECT id, question_text FROM dbo.questions
     WHERE language_id = @id AND difficulty IN ('intermediate', 'expert')`,
    { id: { type: sql.UniqueIdentifier, value: lang.id } },
  );

  let updated = 0;
  for (const row of qs.recordset) {
    const text = String(row.question_text || "");
    const hit =
      specs.find((s) => text === s.full) ||
      specs.find((s) => text.startsWith(s.match));
    if (!hit) {
      console.warn("unmatched:", text.slice(0, 70));
      continue;
    }
    const url = renderCleanDiagram(hit.diagram);
    await query(
      `UPDATE dbo.questions
       SET description_image_url = @url, updated_at = SYSUTCDATETIME()
       WHERE id = @id`,
      {
        id: { type: sql.UniqueIdentifier, value: row.id },
        url: { type: sql.NVarChar(500), value: url },
      },
    );
    updated += 1;
    process.stdout.write(".");
  }
  console.log(`\n.NET Full HD images: ${updated}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
