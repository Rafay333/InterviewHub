/**
 * One-shot content seed — SQL Intermediate (15) + Expert (15).
 * Not part of the app; safe to delete after run.
 */
const fs = require("fs");
const path = require("path");
const { query, sql, getPool } = require("../src/config/db");
const questionService = require("../src/services/questionService");
const languageService = require("../src/services/languageService");
const { uploadRoot } = require("../src/middleware/upload");

const BASE = process.env.PUBLIC_API_BASE || "http://localhost:5050";

const intermediate = [
  {
    q: "What is the difference between INNER JOIN and LEFT JOIN?",
    a: "INNER JOIN returns only rows that match in both tables. LEFT JOIN returns all rows from the left table plus matching rows from the right table; non-matches on the right become NULL.",
    e: "Use INNER JOIN when you only care about related rows. Use LEFT JOIN when you need every left-row even if no related right-row exists (e.g. customers without orders). RIGHT JOIN is the mirror of LEFT JOIN; FULL OUTER JOIN keeps unmatched rows from both sides.",
    diagram: "joins",
  },
  {
    q: "What is the difference between WHERE and HAVING?",
    a: "WHERE filters rows before grouping. HAVING filters groups after GROUP BY (and after aggregate functions run).",
    e: "You cannot use aggregated results (SUM, COUNT, AVG) in WHERE because aggregates do not exist yet. Put non-aggregate filters in WHERE for performance and clarity; put conditions on aggregates in HAVING. Example: WHERE status = 'paid' GROUP BY customer_id HAVING SUM(amount) > 1000.",
  },
  {
    q: "Explain GROUP BY with aggregate functions.",
    a: "GROUP BY groups rows that share the same values in specified columns. Aggregate functions (COUNT, SUM, AVG, MIN, MAX) then compute one result per group.",
    e: "Every non-aggregated column in SELECT must appear in GROUP BY (or be functionally dependent on it in engines that allow that). Grouping turns many input rows into fewer summary rows—ideal for reports like “orders per customer” or “average salary by department.”",
  },
  {
    q: "When would you use a subquery instead of a JOIN?",
    a: "Subqueries help when you need a scalar value, an existence check, or a derived set that is clearer nested. JOINs are often better when you need columns from multiple tables in one result set.",
    e: "Correlated subqueries run once per outer row and can be slow if not careful; non-correlated subqueries run once. Many optimizers rewrite simple subqueries as joins. Prefer JOINs for “expand rows with related data”; prefer EXISTS for “does a related row exist?” checks.",
  },
  {
    q: "What is the difference between IN and EXISTS?",
    a: "IN compares a value against a list/set of values. EXISTS checks whether a subquery returns at least one row and typically short-circuits on the first match.",
    e: "EXISTS is often preferred with large correlated sets because it stops early. IN can behave awkwardly with NULL membership. Anti-join patterns: NOT EXISTS is usually safer than NOT IN when NULLs may appear in the subquery.",
  },
  {
    q: "UNION vs UNION ALL — which should you use?",
    a: "UNION combines result sets and removes duplicate rows. UNION ALL keeps all rows including duplicates and is usually faster.",
    e: "Both require the same number of columns and compatible data types in the same order. Prefer UNION ALL when duplicates are impossible or acceptable; use UNION only when you truly need distinct rows across sets.",
  },
  {
    q: "What is the difference between a clustered and a non-clustered index?",
    a: "A clustered index defines the physical order of table data (usually one per table, often the primary key). A non-clustered index is a separate structure pointing to rows with a key and includes or points to row locations.",
    e: "Clustered indexes are great for range scans on the key. Non-clustered indexes speed lookups/filters on other columns. Too many indexes slow writes. Covering non-clustered indexes (INCLUDE columns) can avoid key lookups.",
    diagram: "index",
  },
  {
    q: "Primary key vs unique key (unique constraint).",
    a: "A primary key uniquely identifies each row, does not allow NULL, and there is only one per table. A unique key also enforces uniqueness but may allow NULL(s) depending on the engine, and you can have multiple unique constraints.",
    e: "Primary keys are the usual target of foreign keys. Unique constraints model business uniqueness (e.g. email). In SQL Server, UNIQUE allows one NULL by default unless the column is not nullable.",
  },
  {
    q: "Explain database normalization (1NF, 2NF, 3NF).",
    a: "1NF: atomic values, no repeating groups. 2NF: 1NF + no partial dependency of non-key attributes on part of a composite key. 3NF: 2NF + no transitive dependency of non-key attributes on non-keys.",
    e: "Normalization reduces update anomalies and redundancy. Denormalization may be used later for read performance with trade-offs. Aim for 3NF as a solid default unless you have a measured reason to denormalize.",
  },
  {
    q: "What is a SQL VIEW and when is it useful?",
    a: "A VIEW is a named saved query that behaves like a virtual table. It does not store data by default (unless materialized, engine-dependent).",
    e: "Views simplify complex joins, enforce a stable API for applications, and can restrict columns for security. Updates through views may be restricted if the view is not updatable. Use views for clarity; do not assume they always improve performance without checking the plan.",
  },
  {
    q: "What is a correlated subquery?",
    a: "A correlated subquery references columns from the outer query, so it is conceptually re-evaluated per outer row.",
    e: "Example: employees whose salary > the average of their department (outer emp, inner AVG filtered by department_id). These can be expensive; alternatives include JOINs to aggregated CTEs or window functions (AVG() OVER (PARTITION BY ...)).",
  },
  {
    q: "How does CASE WHEN work in SQL?",
    a: "CASE is an expression that returns different values based on conditions—either searched (WHEN condition) or simple (CASE column WHEN value).",
    e: "Use CASE in SELECT for derived labels, in ORDER BY for custom sorts, and in aggregations for conditional sums (SUM(CASE WHEN paid = 1 THEN amount ELSE 0 END)). CASE evaluates WHEN clauses in order and stops at the first true match.",
  },
  {
    q: "COALESCE vs ISNULL / NULLIF — what is the difference?",
    a: "COALESCE returns the first non-NULL of its arguments (ANSI, variable arity). ISNULL(a,b) is vendor-specific (SQL Server) replacing a with b if a is NULL. NULLIF(a,b) returns NULL when a equals b.",
    e: "Prefer COALESCE for portable code. Watch data-type and precedence differences (ISNULL return type follows the first argument). NULLIF is handy to avoid divide-by-zero: amount / NULLIF(qty, 0).",
  },
  {
    q: "DELETE vs TRUNCATE vs DROP — when to use each?",
    a: "DELETE removes rows (optional WHERE), can fire triggers, and is logged row-wise. TRUNCATE removes all rows quickly, resets identity in many engines, and usually cannot use WHERE. DROP removes the table object entirely.",
    e: "TRUNCATE is a DDL/minimal-logged operation in many systems and may need stronger permissions; it cannot always run if FKs reference the table. Prefer DELETE for partial cleanup; TRUNCATE for emptying large tables; DROP when the table is no longer needed.",
  },
  {
    q: "What are foreign keys and why do they matter?",
    a: "A foreign key constrains a column (or set) to reference a primary/unique key in another (or same) table, protecting referential integrity.",
    e: "They prevent orphan rows (e.g. order.customer_id that does not exist). Cascading actions (ON DELETE CASCADE / SET NULL) define what happens when the parent is deleted or updated. Always index FK columns for join/delete performance.",
  },
];

const expert = [
  {
    q: "Explain ROW_NUMBER, RANK, and DENSE_RANK window functions.",
    a: "ROW_NUMBER assigns unique sequential numbers per partition. RANK leaves gaps after ties. DENSE_RANK ranks ties the same without gaps in subsequent ranks.",
    e: "Syntax pattern: ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC). Use ROW_NUMBER for strict top-N per group (pick one row). Use RANK/DENSE_RANK for competition-style ranking. Combine with CTE/filter for “top 3 salaries per department.”",
    diagram: "window",
  },
  {
    q: "What are recursive CTEs and when do you use them?",
    a: "A recursive CTE has an anchor member UNION ALL a recursive member that references the CTE itself, iterating until empty or a max recursion limit.",
    e: "Classic uses: org charts (manager → reports), bill of materials, path expansion, number sequences. Always define a termination condition. In SQL Server control depth with OPTION (MAXRECURSION n). Prefer graph/specialized structures for very deep or heavily concurrent hierarchy workloads.",
  },
  {
    q: "How do you read a query execution plan to find bottlenecks?",
    a: "Look for high-cost operators: table/clustered index scans on large tables, key lookups, expensive sorts/hashes, nested loops with huge row estimates, and warnings (implicit conversion, missing stats).",
    e: "Compare estimated vs actual rows (cardinality miss → bad plan). Fix with better stats, selective indexes, rewrite to SARGable predicates, avoid functions on indexed columns, and reduce row width early. Actual plans (with runtime stats) beat estimated-only plans for real triage.",
  },
  {
    q: "List common SQL transaction isolation levels and what they prevent.",
    a: "From weaker to stronger typically: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE (plus SNAPSHOT in SQL Server).",
    e: "Phenomena: dirty reads, non-repeatable reads, phantoms. Stronger isolation reduces anomalies but increases blocking or versioning cost. SNAPSHOT/row-versioning reduces readers-blocking-writers. Choose isolation to match correctness needs—not always SERIALIZABLE by default.",
    diagram: "isolation",
  },
  {
    q: "What causes deadlocks and how do you reduce them?",
    a: "A deadlock happens when two (or more) sessions wait on each other’s locks in a cycle. The engine picks a victim and rolls it back.",
    e: "Prevention tips: access objects in a consistent order, keep transactions short, use appropriate indexes to lock fewer rows, avoid user interaction inside transactions, consider lower isolation or optimistic concurrency. Capture deadlock graphs (extended events / profiler) to fix order and hotspots.",
  },
  {
    q: "Describe practical SQL query optimization techniques.",
    a: "Select only needed columns, ensure SARGable WHERE, use covering indexes, avoid N+1 patterns, batch DML, rewrite OR INTO UNION ALL when helpful, and keep statistics current.",
    e: "Parameter sniffing can poison plans—sometimes OPTIMIZE FOR / recompile / plan guides are needed. Temp tables vs table variables trade stats for memory. Measure with actual plans and runtime IO/CPU; micro-changes without evidence often hurt.",
  },
  {
    q: "Table partitioning — what problem does it solve?",
    a: "Partitioning splits a large table into physical pieces (usually by range of a partition key like date) while presenting one logical table.",
    e: "Benefits: partition elimination for date filters, faster loads/switches (sliding window archives), more manageable maintenance. It is not a free speedup for all queries—bad partition keys hurt. Design for switch-in/out of historical data archives.",
  },
  {
    q: "What is a covering index?",
    a: "A covering index includes all columns a query needs so the engine can answer from the index alone (index-only scan) without base-table lookups.",
    e: "In SQL Server use INCLUDE for non-key columns to widen a non-clustered index without changing sort order. Great for heavy read queries; costly on write-heavy tables. Verify with the plan that key lookups disappear.",
  },
  {
    q: "Explain the MERGE statement and its risks.",
    a: "MERGE upserts: matches a source to a target and runs INSERT/UPDATE/DELETE actions in one statement based on match conditions.",
    e: "Useful for slowly changing dimensions and sync jobs. Risks include subtle race conditions under concurrency, complex WHEN clauses, and historical bugs in some engines—many teams prefer transactional INSERT/UPDATE patterns for clarity and safety. Always define a true match key and test concurrency.",
  },
  {
    q: "What is a slowly changing dimension (SCD) in databases?",
    a: "SCD techniques track how attribute values change over time in dimensional warehousing (Type 1 overwrite, Type 2 historical rows with effective dates, Type 3 limited previous columns).",
    e: "Type 2 is common: new row + surrogates + valid_from/valid_to, current flag. Temporal tables (system-versioned) can support type-2 history with period columns. Design for query patterns: “as-of” joins need the effective range predicates.",
  },
  {
    q: "How do locks, latches, and blocking differ?",
    a: "Locks protect logical data consistency between transactions. Latches protect short-term memory structures inside the engine. Blocking is when one session waits on another’s lock.",
    e: "Long blocking cascades into timeouts and deadlocks. Diagnose with DMVs (sys.dm_tran_locks, waiting_tasks). Fix by better indexing, shorter transactions, and sometimes row-versioning isolation. Latches (PAGEIOLATCH, PAGELATCH) point to IO or hot-page contention, not necessarily lock design.",
  },
  {
    q: "How do you detect and fix parameter sniffing issues?",
    a: "Parameter sniffing is when the optimizer builds a plan from the first parameter values and reuses it for later values that need a different plan shape.",
    e: "Symptoms: a query is sometimes fast and sometimes catastrophically slow. Techniques: OPTIMIZE FOR UNKNOWN / specific values, RECOMPILE for critical queries, local variables (trade-offs), plan guides, and fixing data distribution with better stats or filtered indexes. Prefer targeted fixes over disabling sniffing globally.",
  },
  {
    q: "What is SARGability and why does it matter for indexes?",
    a: "A SARGable predicate allows the optimizer to seek an index efficiently. Wrapping columns in functions (YEAR(col), CAST(col AS ...), col + 1) often forces scans.",
    e: "Write col >= @d AND col < @d2 instead of CONVERT(date, col) = @d. Avoid leading-wildcard likes ('%abc') for seeks. Persist computed columns and index them if you must apply transforms frequently.",
  },
  {
    q: "Compare horizontal sharding vs table partitioning.",
    a: "Partitioning is usually within one database/instance. Sharding spreads data across multiple databases/servers by a shard key, with app or middleware routing.",
    e: "Sharding scales writes and storage beyond one box but adds cross-shard join/query complexity and operational cost. Partitioning is simpler operationally when one instance is enough. Choose based on growth, multi-tenant isolation needs, and team maturity.",
  },
  {
    q: "How would you design an efficient pagination query for large tables?",
    a: "Avoid deep OFFSET/FETCH on huge offsets (it still scans skipped rows). Prefer keyset (seek) pagination: WHERE (sort_col, id) > (@last_sort, @last_id) ORDER BY sort_col, id FETCH NEXT @n.",
    e: "Keyset needs a stable unique order. Cursor-style continuity works for infinite scroll and “next page.” For deep arbitrary page jumps, accept cost or precompute page boundaries. Always index the ORDER BY columns used for pagination.",
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
    console.warn("canvas unavailable — seeding text only");
    return {};
  }

  const diagrams = {};

  // JOIN diagram
  {
    const w = 720;
    const h = 360;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("SQL JOIN types (concept)", 24, 36);

    const boxes = [
      { title: "INNER", sub: "A ∩ B", x: 40, color: "#2563eb" },
      { title: "LEFT", sub: "All A + match B", x: 200, color: "#0d9488" },
      { title: "RIGHT", sub: "All B + match A", x: 370, color: "#ea580c" },
      { title: "FULL", sub: "A ∪ B matches", x: 540, color: "#7c3aed" },
    ];
    boxes.forEach((b) => {
      ctx.fillStyle = b.color;
      roundRect(ctx, b.x, 90, 140, 160, 16);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(b.title, b.x + 18, 150);
      ctx.font = "14px sans-serif";
      wrapText(ctx, b.sub, b.x + 14, 185, 112, 18);
    });
    ctx.fillStyle = "#64748b";
    ctx.font = "13px sans-serif";
    ctx.fillText("Matching rows join on the ON predicate (e.g. a.id = b.a_id).", 24, 300);
    diagrams.joins = savePng(canvas.toBuffer("image/png"), "sql-joins");
  }

  // Index diagram
  {
    const w = 720;
    const h = 340;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("Clustered vs Non-clustered index", 24, 36);

    ctx.fillStyle = "#2563eb";
    roundRect(ctx, 40, 80, 300, 200, 14);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("Clustered", 60, 120);
    ctx.font = "14px sans-serif";
    wrapText(
      ctx,
      "Table rows stored in key order. Usually one clustered index (often PK).",
      60,
      150,
      250,
      20,
    );

    ctx.fillStyle = "#0d9488";
    roundRect(ctx, 380, 80, 300, 200, 14);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("Non-clustered", 400, 120);
    ctx.font = "14px sans-serif";
    wrapText(
      ctx,
      "Separate structure: keys → row pointers. INCLUDE covers more columns.",
      400,
      150,
      250,
      20,
    );
    diagrams.index = savePng(canvas.toBuffer("image/png"), "sql-index");
  }

  // Window function diagram
  {
    const w = 720;
    const h = 360;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("Window: PARTITION BY dept  ORDER BY salary DESC", 24, 36);

    const rows = [
      ["Alice", "Eng", "120k", "1"],
      ["Bob", "Eng", "110k", "2"],
      ["Cara", "Sales", "100k", "1"],
      ["Dan", "Sales", "95k", "2"],
    ];
    ctx.fillStyle = "#e2e8f0";
    roundRect(ctx, 40, 70, 640, 220, 12);
    ctx.fill();
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "bold 14px sans-serif";
    ["Name", "Dept", "Salary", "ROW_NUMBER()"].forEach((h, i) => {
      ctx.fillText(h, 60 + i * 150, 100);
    });
    ctx.font = "14px sans-serif";
    rows.forEach((r, ri) => {
      r.forEach((c, ci) => ctx.fillText(c, 60 + ci * 150, 140 + ri * 36));
    });
    ctx.fillStyle = "#2563eb";
    ctx.font = "13px sans-serif";
    ctx.fillText("Numbering restarts for each partition (department).", 40, 320);
    diagrams.window = savePng(canvas.toBuffer("image/png"), "sql-window");
  }

  // Isolation levels strip
  {
    const w = 720;
    const h = 300;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#0b1f3a";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("Isolation spectrum (typical)", 24, 36);
    const levels = [
      { t: "READ UNCOMMITTED", d: "Dirty reads possible" },
      { t: "READ COMMITTED", d: "Default in many engines" },
      { t: "REPEATABLE READ", d: "Stable reads in txn" },
      { t: "SERIALIZABLE", d: "Strongest consistency" },
    ];
    levels.forEach((lv, i) => {
      const x = 30 + i * 170;
      const alpha = 0.35 + i * 0.18;
      ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
      roundRect(ctx, x, 80, 155, 140, 12);
      ctx.fill();
      ctx.fillStyle = "#0b1f3a";
      ctx.font = "bold 12px sans-serif";
      wrapText(ctx, lv.t, x + 10, 120, 135, 16);
      ctx.font = "12px sans-serif";
      wrapText(ctx, lv.d, x + 10, 165, 135, 16);
    });
    diagrams.isolation = savePng(canvas.toBuffer("image/png"), "sql-isolation");
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

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (let n = 0; n < words.length; n += 1) {
    const test = `${line}${words[n]} `;
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, cy);
      line = `${words[n]} `;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, cy);
}

async function ensureSqlLanguage(adminId) {
  const langs = await languageService.listLanguages();
  const existing = langs.find((l) => /^sql$/i.test(l.name) || /sql server/i.test(l.name));
  if (existing) {
    console.log(`Using language: ${existing.name} (${existing.id})`);
    return existing;
  }
  // Prefer name "SQL" as shown on site
  const created = await languageService.createLanguage({
    name: "SQL",
    description:
      "SQL interview questions covering queries, joins, indexing, transactions, and performance.",
    status: "published",
    pictureUrl: null,
    categoryId: null,
    adminId,
  });
  console.log(`Created language SQL (${created.id})`);
  return created;
}

async function alreadySeededMarker(languageId) {
  // Avoid double-insert on re-run: look for one distinctive question
  const result = await query(
    `SELECT TOP 1 id FROM dbo.questions
     WHERE language_id = @lid AND question_text LIKE @q`,
    {
      lid: { type: sql.UniqueIdentifier, value: languageId },
      q: {
        type: sql.NVarChar(300),
        value: "%difference between INNER JOIN and LEFT JOIN%",
      },
    },
  );
  return result.recordset.length > 0;
}

async function main() {
  await getPool();
  const admin = await query(`SELECT TOP 1 id FROM dbo.admin_users ORDER BY created_at`);
  const adminId = admin.recordset[0]?.id || null;

  const lang = await ensureSqlLanguage(adminId);
  if (await alreadySeededMarker(lang.id)) {
    console.log("SQL intermediate/expert seed already present — skipping to avoid duplicates.");
    console.log("Delete those questions in admin if you want to re-seed.");
    process.exit(0);
  }

  const diagrams = tryMakeDiagrams();
  let iCount = 0;
  let eCount = 0;

  for (const item of intermediate) {
    const descriptionImageUrl = item.diagram ? diagrams[item.diagram] || null : null;
    await questionService.createQuestion({
      questionText: item.q,
      answerText: item.a,
      descriptionText: item.e,
      descriptionImageUrl,
      difficulty: "intermediate",
      languageId: lang.id,
      categoryId: lang.categoryId || null,
      status: "published",
      adminId,
    });
    iCount += 1;
    process.stdout.write(`I${iCount} `);
  }

  for (const item of expert) {
    const descriptionImageUrl = item.diagram ? diagrams[item.diagram] || null : null;
    await questionService.createQuestion({
      questionText: item.q,
      answerText: item.a,
      descriptionText: item.e,
      descriptionImageUrl,
      difficulty: "expert",
      languageId: lang.id,
      categoryId: lang.categoryId || null,
      status: "published",
      adminId,
    });
    eCount += 1;
    process.stdout.write(`E${eCount} `);
  }

  console.log(`\nDone. Intermediate: ${iCount}, Expert: ${eCount}, languageId=${lang.id}`);
  console.log("Open public site → Languages → SQL → Intermediate / Expert.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
