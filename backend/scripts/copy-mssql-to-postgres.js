/**
 * Copy InterviewHub data: local SQL Server → Railway PostgreSQL.
 * Does not change the running app's DATABASE_URL.
 */
const path = require("path");
const { Client } = require("pg");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const TABLES = [
  {
    name: "admin_users",
    casts: { role: "admin_role", is_active: "boolean" },
  },
  { name: "media_files", casts: { file_type: "media_type" } },
  { name: "categories", casts: { status: "publish_status" } },
  { name: "languages", casts: { status: "publish_status" } },
  {
    name: "questions",
    casts: { difficulty: "difficulty_level", status: "publish_status" },
  },
  { name: "question_categories", casts: {} },
  { name: "blogs", casts: { status: "publish_status", is_featured: "boolean" } },
  { name: "blog_comments", casts: { status: "comment_status" } },
  {
    name: "pdf_imports",
    casts: { default_difficulty: "difficulty_level", status: "pdf_import_status" },
  },
  {
    name: "pdf_import_items",
    casts: { difficulty: "difficulty_level", include_item: "boolean" },
  },
  {
    name: "site_settings",
    casts: { ga4_connected: "boolean", adsense_connected: "boolean" },
  },
  { name: "page_views", casts: {} },
  { name: "adsense_stats", casts: {} },
  { name: "users", casts: { is_active: "boolean" } },
  { name: "bookmarks", casts: {} },
  { name: "reading_history", casts: {} },
];

function pgConfig(url) {
  return {
    connectionString: String(url || "").replace(/[?&]sslmode=[^&]*/gi, ""),
    ssl: { rejectUnauthorized: false },
  };
}

function uuid(value) {
  if (value == null || value === "") return null;
  return String(value);
}

function bool(value) {
  if (value == null) return null;
  if (value === true || value === 1 || value === "1") return true;
  if (value === false || value === 0 || value === "0") return false;
  return Boolean(value);
}

function cell(value, cast) {
  if (cast === "boolean") return bool(value);
  if (value == null) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && value !== null && Buffer.isBuffer(value)) {
    return value;
  }
  if (typeof value === "object") return uuid(value);
  return value;
}

async function connectMssql() {
  const sql = require("mssql/msnodesqlv8");
  const instance = process.env.MSSQL_SERVER || ".\\ABDULRAFAY";
  const database = process.env.MSSQL_DATABASE || "InterviewHub";
  const server = instance.includes("\\")
    ? `lpc:.\\${instance.split("\\").pop()}`
    : `lpc:${instance}`;
  const connectionString = [
    "Driver={ODBC Driver 17 for SQL Server}",
    `Server=${server}`,
    `Database=${database}`,
    "Trusted_Connection=Yes",
    "TrustServerCertificate=Yes",
  ].join(";");
  console.log(`[mssql] Connecting to ${database} via Windows Auth…`);
  const pool = await new sql.ConnectionPool({ connectionString, pool: { max: 4 } }).connect();
  console.log("[mssql] Connected.");
  return pool;
}

async function copyTable(mssql, pg, spec) {
  const { name, casts } = spec;
  let countResult;
  try {
    countResult = await mssql.request().query(`SELECT COUNT(*) AS n FROM dbo.${name}`);
  } catch (err) {
    console.log(`  skip ${name} (not on SQL Server): ${err.message}`);
    return;
  }

  const total = Number(countResult.recordset[0].n || 0);
  const destCols = await pg.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1`,
    [name],
  );
  const allowed = new Set(destCols.rows.map((r) => r.column_name));

  await pg.query(`TRUNCATE TABLE ${name} CASCADE`);
  if (total === 0) {
    console.log(`  ${name}: 0 rows`);
    return;
  }

  const pageSize = name === "questions" || name === "blogs" ? 5 : 50;
  let copied = 0;
  let insertSql = null;
  let columns = null;

  while (copied < total) {
    const page = await mssql.request().query(`
      SELECT * FROM dbo.${name}
      ORDER BY id
      OFFSET ${copied} ROWS FETCH NEXT ${pageSize} ROWS ONLY
    `);
    const rows = page.recordset || [];
    if (rows.length === 0) break;

    if (!columns) {
      columns = Object.keys(rows[0])
        .map((k) => k.toLowerCase())
        .filter((k) => allowed.has(k));
      const enumCasts = [
        "publish_status",
        "difficulty_level",
        "media_type",
        "admin_role",
        "comment_status",
        "pdf_import_status",
      ];
      const placeholders = columns.map((col, i) => {
        const cast = casts[col];
        if (enumCasts.includes(cast)) return `$${i + 1}::${cast}`;
        return `$${i + 1}`;
      });
      insertSql = `INSERT INTO ${name} (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`;
    }

    for (const row of rows) {
      const lower = {};
      for (const [key, value] of Object.entries(row)) {
        lower[key.toLowerCase()] = value;
      }
      const values = columns.map((col) => {
        const raw = lower[col];
        if (col.endsWith("_id") || col === "id") return uuid(raw);
        return cell(raw, casts[col]);
      });
      await pg.query(insertSql, values);
      copied += 1;
    }
    console.log(`  ${name}: ${copied}/${total}`);
  }
  console.log(`  ${name}: copied ${copied}`);
}

async function main() {
  const databaseUrl = (process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL || "").trim();
  if (!databaseUrl) {
    console.error("Missing DATABASE_URL in backend/.env");
    process.exit(1);
  }
  if (databaseUrl.includes("railway.internal")) {
    console.error("Use the public Railway URL from your PC, not railway.internal");
    process.exit(1);
  }

  const mssql = await connectMssql();
  const pg = new Client(pgConfig(databaseUrl));
  await pg.connect();
  console.log("[postgres] Connected to Railway.");
  console.log("Copying your SQL Server data. Questions can take several minutes.");

  await pg.query("SET session_replication_role = replica");
  try {
    for (const spec of TABLES) {
      await copyTable(mssql, pg, spec);
    }
  } finally {
    await pg.query("SET session_replication_role = origin");
    await pg.end();
    await mssql.close();
  }

  console.log("Done. Refresh admin Languages / Categories / Questions.");
}

main().catch((err) => {
  console.error("Copy failed:", err.message);
  process.exit(1);
});
