const { Pool } = require("pg");
const { env } = require("./env");

/** Dummy mssql-style types so existing `{ type: sql.NVarChar, value }` calls keep working. */
const sql = {
  MAX: Number.MAX_SAFE_INTEGER,
  NVarChar: Object.assign(() => ({}), {}),
  VarChar: () => ({}),
  UniqueIdentifier: {},
  Int: {},
  BigInt: {},
  Bit: { __pgBit: true },
  DateTime2: {},
};

const ENUM_CASTS = {
  status: "publish_status",
  difficulty: "difficulty_level",
  default_difficulty: "difficulty_level",
  role: "admin_role",
  file_type: "media_type",
};

let pool = null;

function toPostgresSql(text) {
  let sqlText = String(text);
  sqlText = sqlText.replace(/\bdbo\./gi, "");
  sqlText = sqlText.replace(/\bISNULL\s*\(/gi, "COALESCE(");
  sqlText = sqlText.replace(/\bCOUNT_BIG\s*\(/gi, "COUNT(");
  sqlText = sqlText.replace(/\bSYSUTCDATETIME\s*\(\s*\)/gi, "NOW()");
  sqlText = sqlText.replace(/\bCAST\s*\(\s*NOW\(\)\s+AS\s+DATE\s*\)/gi, "CURRENT_DATE");
  sqlText = sqlText.replace(
    /\bDATEADD\s*\(\s*HOUR\s*,\s*-@(\w+)\s*,\s*NOW\(\)\s*\)/gi,
    "NOW() - CAST(@$1 AS INTEGER) * INTERVAL '1 hour'",
  );
  sqlText = sqlText.replace(
    /\bDATEADD\s*\(\s*DAY\s*,\s*-(\d+)\s*,\s*NOW\(\)\s*\)/gi,
    "NOW() - INTERVAL '$1 days'",
  );
  sqlText = sqlText.replace(
    /\bDATEADD\s*\(\s*DAY\s*,\s*-(\d+)\s*,\s*CURRENT_DATE\s*\)/gi,
    "CURRENT_DATE - $1",
  );

  let returning = null;
  sqlText = sqlText.replace(/\s+OUTPUT\s+INSERTED\.(\w+|\*)/gi, (_, col) => {
    returning = col === "*" ? "*" : col;
    return "";
  });

  const topMatch = sqlText.match(/SELECT\s+TOP\s+\(?(@?\w+|\d+)\)?\s+/i);
  if (topMatch) {
    const n = topMatch[1];
    sqlText = sqlText.replace(/SELECT\s+TOP\s+\(?(@?\w+|\d+)\)?\s+/i, "SELECT ");
    sqlText = `${sqlText.trim()}\nLIMIT ${n}`;
  }

  if (returning) {
    sqlText = `${sqlText.trim()}\nRETURNING ${returning}`;
  }
  return sqlText;
}

function unwrap(raw) {
  if (raw && typeof raw === "object" && "value" in raw && "type" in raw) {
    let value = raw.value;
    if (raw.type && raw.type.__pgBit) {
      value = Boolean(value);
    }
    return value;
  }
  return raw;
}

function bindNamed(sqlText, inputs = {}) {
  const keys = Object.keys(inputs).sort((a, b) => b.length - a.length);
  const values = [];
  let out = sqlText;
  for (const key of keys) {
    const placeholder = `$${values.length + 1}`;
    const cast = ENUM_CASTS[key] ? `::${ENUM_CASTS[key]}` : "";
    const token = `${placeholder}${cast}`;
    const pattern = new RegExp(`@${key}(?![A-Za-z0-9_])`, "g");
    if (pattern.test(out)) {
      pattern.lastIndex = 0;
      out = out.replace(pattern, token);
      values.push(unwrap(inputs[key]));
    }
  }
  return { text: out, values };
}

function pgConfig(connectionString) {
  const url = String(connectionString || "").replace(/[?&]sslmode=[^&]*/gi, "");
  const isInternal =
    url.includes("railway.internal") ||
    url.includes("localhost") ||
    url.includes("127.0.0.1");
  return {
    connectionString: url,
    // Private Railway Postgres does not use SSL; the public proxy does.
    ssl: isInternal ? false : { rejectUnauthorized: false },
  };
}

function getPool() {
  if (!pool) {
    if (!env.databaseUrl) {
      throw new Error("Missing DATABASE_URL. Put your Railway public URL in backend/.env");
    }
    pool = new Pool({
      ...pgConfig(env.databaseUrl),
      max: 8,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 8_000,
      keepAlive: true,
    });
    pool.on("error", (err) => {
      console.error("[db] Pool error:", err.message);
    });
    console.log("[db] Using PostgreSQL (Railway)");
  }
  return pool;
}

async function query(text, inputs = {}) {
  const pgSql = toPostgresSql(text);
  const { text: bound, values } = bindNamed(pgSql, inputs);
  const result = await getPool().query(bound, values);
  return {
    recordset: result.rows,
    rows: result.rows,
    rowsAffected: [result.rowCount],
    rowCount: result.rowCount,
  };
}

async function ensureSchema() {
  await query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER`);
  await query(`ALTER TABLE languages ADD COLUMN IF NOT EXISTS category_id UUID`);
  await query(`
    DO $$ BEGIN
      ALTER TABLE languages
        ADD CONSTRAINT fk_languages_category
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
      WHEN invalid_table_definition THEN NULL;
    END $$;
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_languages_category ON languages (category_id)`);
  await query(
    `CREATE INDEX IF NOT EXISTS idx_questions_updated_at ON questions (updated_at DESC)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_questions_status_updated ON questions (status, updated_at DESC)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_questions_language_status ON questions (language_id, status, difficulty)`,
  );
  await query(
    `CREATE INDEX IF NOT EXISTS idx_questions_category_status ON questions (category_id, status, difficulty)`,
  );
  await query(`CREATE INDEX IF NOT EXISTS idx_questions_slug ON questions (slug)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_languages_slug ON languages (slug)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug)`);

  await query(`
    CREATE OR REPLACE VIEW v_language_question_counts AS
    SELECT
      l.id AS language_id,
      l.name,
      l.slug,
      COUNT(q.id) FILTER (WHERE q.difficulty::text = 'beginner' AND q.status::text = 'published') AS beginner,
      COUNT(q.id) FILTER (WHERE q.difficulty::text = 'intermediate' AND q.status::text = 'published') AS intermediate,
      COUNT(q.id) FILTER (WHERE q.difficulty::text = 'expert' AND q.status::text = 'published') AS expert,
      COUNT(q.id) FILTER (WHERE q.status::text = 'published') AS total_published
    FROM languages l
    LEFT JOIN questions q ON q.language_id = l.id
    GROUP BY l.id, l.name, l.slug
  `);
  await query(`
    CREATE OR REPLACE VIEW v_category_question_counts AS
    SELECT
      c.id AS category_id,
      c.name,
      c.slug,
      COUNT(q.id) FILTER (WHERE q.difficulty::text = 'beginner' AND q.status::text = 'published') AS beginner,
      COUNT(q.id) FILTER (WHERE q.difficulty::text = 'intermediate' AND q.status::text = 'published') AS intermediate,
      COUNT(q.id) FILTER (WHERE q.difficulty::text = 'expert' AND q.status::text = 'published') AS expert,
      COUNT(q.id) FILTER (WHERE q.status::text = 'published') AS total_published
    FROM categories c
    LEFT JOIN questions q ON q.category_id = c.id
    GROUP BY c.id, c.name, c.slug
  `);

  // Copy used replica mode, so some created_by IDs may not exist.
  // Postgres re-checks that FK on UPDATE (updated_at trigger), which blocks admin edits.
  await query(`
    UPDATE questions SET created_by = NULL
     WHERE created_by IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM admin_users a WHERE a.id = questions.created_by)
  `);
  await query(`
    UPDATE languages SET created_by = NULL
     WHERE created_by IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM admin_users a WHERE a.id = languages.created_by)
  `);
  await query(`
    UPDATE categories SET created_by = NULL
     WHERE created_by IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM admin_users a WHERE a.id = categories.created_by)
  `);
  await query(`
    UPDATE blogs SET created_by = NULL
     WHERE created_by IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM admin_users a WHERE a.id = blogs.created_by)
  `);
  await query(`
    UPDATE pdf_imports SET created_by = NULL
     WHERE created_by IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM admin_users a WHERE a.id = pdf_imports.created_by)
  `);
  await query(`
    UPDATE media_files SET uploaded_by = NULL
     WHERE uploaded_by IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM admin_users a WHERE a.id = media_files.uploaded_by)
  `);
  await query(`
    UPDATE site_settings SET updated_by = NULL
     WHERE updated_by IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM admin_users a WHERE a.id = site_settings.updated_by)
  `);
  await query(`
    UPDATE blog_comments SET moderated_by = NULL
     WHERE moderated_by IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM admin_users a WHERE a.id = blog_comments.moderated_by)
  `);
}

module.exports = {
  sql,
  getPool,
  query,
  ensureSchema,
  toPostgresSql,
};
