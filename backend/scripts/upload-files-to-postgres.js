/**
 * Copy local backend/uploads files into Railway Postgres so explanation pictures work live.
 * Run from your PC: npm run db:uploads
 */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const uploadDir = path.resolve(__dirname, "../uploads");

function databaseUrl() {
  const strip = (value) => String(value || "").trim().replace(/^["']|["']$/g, "");
  const internal = strip(process.env.DATABASE_URL);
  const pub = strip(process.env.DATABASE_PUBLIC_URL);
  if (internal.includes("railway.internal")) return pub || internal;
  return pub || internal;
}

function mimeFromName(name) {
  const ext = path.extname(name).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

async function main() {
  const url = databaseUrl();
  if (!url) {
    console.error("Missing DATABASE_URL in backend/.env");
    process.exit(1);
  }
  if (!fs.existsSync(uploadDir)) {
    console.error("No backend/uploads folder found.");
    process.exit(1);
  }

  const files = fs.readdirSync(uploadDir).filter((name) => {
    const full = path.join(uploadDir, name);
    return fs.statSync(full).isFile();
  });
  console.log(`Uploading ${files.length} files from backend/uploads ...`);

  const client = new Client({
    connectionString: url.replace(/[?&]sslmode=[^&]*/gi, ""),
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS upload_files (
      file_name TEXT PRIMARY KEY,
      mime_type TEXT,
      byte_size INTEGER,
      bytes BYTEA NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  let done = 0;
  for (const name of files) {
    const bytes = fs.readFileSync(path.join(uploadDir, name));
    await client.query(
      `INSERT INTO upload_files (file_name, mime_type, byte_size, bytes)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (file_name) DO UPDATE SET
         mime_type = EXCLUDED.mime_type,
         byte_size = EXCLUDED.byte_size,
         bytes = EXCLUDED.bytes,
         updated_at = NOW()`,
      [name, mimeFromName(name), bytes.length, bytes],
    );
    done += 1;
    if (done % 50 === 0 || done === files.length) {
      console.log(`  ${done}/${files.length}`);
    }
  }

  const count = await client.query(`SELECT COUNT(*)::int AS n FROM upload_files`);
  console.log(`Done. Railway now has ${count.rows[0].n} pictures.`);
  await client.end();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
