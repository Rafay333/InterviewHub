/**
 * One-shot seed — SQL Beginner (15). Safe to delete after run.
 */
const fs = require("fs");
const path = require("path");
const { query, sql, getPool } = require("../src/config/db");
const questionService = require("../src/services/questionService");
const languageService = require("../src/services/languageService");
const { uploadRoot } = require("../src/middleware/upload");

const BASE = process.env.PUBLIC_API_BASE || "http://localhost:5050";

const beginner = [
  {
    q: "What is SQL?",
    a: "SQL (Structured Query Language) is the standard language for working with relational databases—querying, inserting, updating, and deleting data, plus defining and managing schema.",
    e: "SQL is declarative: you say what data you want, not how to step through rows. Core families of statements include DQL (SELECT), DML (INSERT/UPDATE/DELETE), DDL (CREATE/ALTER/DROP), and DCL (GRANT/REVOKE).",
  },
  {
    q: "What is a database table?",
    a: "A table stores data in rows and columns. Each column has a name and data type; each row is one record.",
    e: "Think of a spreadsheet: columns are fields (name, email, price) and rows are instances (one customer, one order). Good table names are plural nouns (employees, products).",
    diagram: "table",
  },
  {
    q: "What is the difference between a database and a table?",
    a: "A database is a container for related objects (tables, views, indexes, procedures). A table is one of those objects that holds row/column data.",
    e: "One database often has many tables linked by keys (customers, orders, products). The database is the whole “file room”; a table is one “cabinet.”",
  },
  {
    q: "How do you select all columns from a table?",
    a: "Use SELECT * FROM table_name; for example SELECT * FROM employees;",
    e: "The * means “all columns.” For production code, prefer listing only the columns you need for clarity and a smaller result set: SELECT id, name FROM employees;",
  },
  {
    q: "How do you filter rows with WHERE?",
    a: "Add a WHERE clause after FROM: SELECT * FROM orders WHERE status = 'paid';",
    e: "WHERE supports comparison operators (=, <>, >, <, >=, <=), AND/OR/NOT, IN, BETWEEN, LIKE, and IS NULL. Filters run before grouping and aggregation.",
  },
  {
    q: "What is the difference between CHAR and VARCHAR?",
    a: "CHAR is fixed length (padded to the defined size). VARCHAR stores variable-length text up to a max size and only uses space needed (plus small overhead).",
    e: "Use CHAR for truly fixed codes (e.g. country code 'US' if always 2 chars). Use VARCHAR for names, emails, and free text. Exact storage rules depend on the engine.",
  },
  {
    q: "What does ORDER BY do?",
    a: "ORDER BY sorts the result set by one or more columns, ascending (ASC, default) or descending (DESC).",
    e: "Example: SELECT name, salary FROM employees ORDER BY salary DESC, name ASC; Without ORDER BY, row order is not guaranteed. Sort only when you need a specific order.",
  },
  {
    q: "What are PRIMARY KEY and NULL?",
    a: "A PRIMARY KEY uniquely identifies each row and cannot be NULL. NULL means “unknown / missing value,” not zero or empty string.",
    e: "Most tables have a primary key (id). Comparisons with NULL need IS NULL / IS NOT NULL because “value = NULL” is never true in three-valued logic.",
  },
  {
    q: "How do you insert a new row into a table?",
    a: "INSERT INTO table_name (col1, col2) VALUES (val1, val2);",
    e: "Column list should match the values list in order and count. Omit columns that have defaults or are IDENTITY/auto-generated. Always quote string and date literals correctly for your dialect.",
  },
  {
    q: "How do you update existing data?",
    a: "UPDATE table_name SET col = new_value WHERE condition;",
    e: "Always include a precise WHERE unless you truly mean to update every row. Example: UPDATE employees SET salary = salary * 1.05 WHERE department = 'Sales'; Test with a SELECT first when possible.",
  },
  {
    q: "How do you delete rows from a table?",
    a: "DELETE FROM table_name WHERE condition;",
    e: "Without WHERE, DELETE removes all rows (dangerous). DELETE is DML and can fire triggers; it is different from DROP TABLE, which removes the table object itself.",
  },
  {
    q: "What is the difference between COUNT(*) and COUNT(column)?",
    a: "COUNT(*) counts all rows in the group/result. COUNT(column) counts non-NULL values in that column only.",
    e: "If a column has NULLs, COUNT(column) will be smaller than COUNT(*). COUNT(DISTINCT column) counts unique non-NULL values—useful for “how many different cities?”",
  },
  {
    q: "What is DISTINCT used for?",
    a: "DISTINCT removes duplicate rows from the SELECT result based on the selected columns.",
    e: "SELECT DISTINCT city FROM customers; returns each city once. DISTINCT can be expensive on large data; sometimes GROUP BY is clearer when you also need aggregates.",
  },
  {
    q: "What is a simple JOIN and why use it?",
    a: "A JOIN combines rows from two (or more) tables using a related column, usually a foreign key matching a primary key.",
    e: "Example: employees.department_id = departments.id. Without joins you would copy department names into every employee row (duplication). Beginners usually start with INNER JOIN.",
    diagram: "beginner-join",
  },
  {
    q: "What is the difference between SQL and a DBMS?",
    a: "SQL is the language. A DBMS (Database Management System) is the software that stores data and runs SQL—examples: SQL Server, PostgreSQL, MySQL, Oracle.",
    e: "You write SQL; the DBMS parses it, plans execution, enforces security, manages transactions, backups, and storage. Dialects differ slightly (TOP vs LIMIT, string functions, etc.).",
  },
];

function ensureUploadDir() {
  if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });
}

function savePng(buffer, name) {
  ensureUploadDir();
  const filename = `${Date.now()}-${name}.png`;
  fs.writeFileSync(path.join(uploadRoot, filename), buffer);
  return `${BASE}/uploads/${filename}`;
}

function tryMakeDiagrams() {
  let createCanvas;
  try {
    ({ createCanvas } = require("@napi-rs/canvas"));
  } catch {
    console.warn("canvas unavailable — text only");
    return {};
  }

  const diagrams = {};

  {
    const w = 640;
    const h = 300;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("Table = rows × columns", 24, 36);
    ctx.fillStyle = "#2563eb";
    roundRect(ctx, 40, 70, 560, 180, 12);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px sans-serif";
    ["id", "name", "email"].forEach((h, i) => ctx.fillText(h, 70 + i * 170, 105));
    ctx.font = "13px sans-serif";
    [
      ["1", "Ada", "ada@ex.com"],
      ["2", "Bob", "bob@ex.com"],
      ["3", "Cara", "cara@ex.com"],
    ].forEach((r, ri) => {
      r.forEach((c, ci) => ctx.fillText(c, 70 + ci * 170, 145 + ri * 30));
    });
    diagrams.table = savePng(canvas.toBuffer("image/png"), "sql-table");
  }

  {
    const w = 640;
    const h = 280;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("Simple JOIN idea", 24, 34);
    ctx.fillStyle = "#2563eb";
    roundRect(ctx, 40, 70, 220, 140, 12);
    ctx.fill();
    ctx.fillStyle = "#0d9488";
    roundRect(ctx, 380, 70, 220, 140, 12);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("employees", 70, 110);
    ctx.fillText("departments", 410, 110);
    ctx.font = "13px sans-serif";
    ctx.fillText("department_id  →", 70, 150);
    ctx.fillText("←  id", 420, 150);
    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(260, 140);
    ctx.lineTo(380, 140);
    ctx.stroke();
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "13px sans-serif";
    ctx.fillText("Match keys to combine related data into one result.", 40, 250);
    diagrams["beginner-join"] = savePng(canvas.toBuffer("image/png"), "sql-beginner-join");
  }

  return diagrams;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function main() {
  await getPool();
  const admin = await query(`SELECT TOP 1 id FROM dbo.admin_users ORDER BY created_at`);
  const adminId = admin.recordset[0]?.id || null;

  const langs = await languageService.listLanguages();
  let lang = langs.find((l) => /^sql$/i.test(l.name) || /sql server/i.test(l.name));
  if (!lang) {
    lang = await languageService.createLanguage({
      name: "SQL",
      description:
        "SQL interview questions covering queries, joins, indexing, transactions, and performance.",
      status: "published",
      pictureUrl: null,
      categoryId: null,
      adminId,
    });
    console.log(`Created language SQL (${lang.id})`);
  } else {
    console.log(`Using language: ${lang.name} (${lang.id})`);
  }

  const marker = await query(
    `SELECT TOP 1 id FROM dbo.questions
     WHERE language_id = @lid AND difficulty = 'beginner'
       AND question_text LIKE @q`,
    {
      lid: { type: sql.UniqueIdentifier, value: lang.id },
      q: { type: sql.NVarChar(200), value: "%What is SQL?%" },
    },
  );
  if (marker.recordset.length > 0) {
    console.log("SQL beginner questions already present — skipping duplicates.");
    process.exit(0);
  }

  const diagrams = tryMakeDiagrams();
  let count = 0;
  for (const item of beginner) {
    await questionService.createQuestion({
      questionText: item.q,
      answerText: item.a,
      descriptionText: item.e,
      descriptionImageUrl: item.diagram ? diagrams[item.diagram] || null : null,
      difficulty: "beginner",
      languageId: lang.id,
      categoryId: lang.categoryId || null,
      status: "published",
      adminId,
    });
    count += 1;
    process.stdout.write(`B${count} `);
  }

  console.log(`\nDone. Beginner: ${count}, languageId=${lang.id}`);
  console.log("Open public site → Languages → SQL → Beginner.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
