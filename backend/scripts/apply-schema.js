const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const databaseUrl = (process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL || "")
  .trim()
  .replace(/^["']|["']$/g, "");

if (!databaseUrl) {
  console.error("Missing DATABASE_URL in backend/.env");
  process.exit(1);
}
if (databaseUrl.includes("railway.internal")) {
  console.error("That URL is private (railway.internal). Use DATABASE_PUBLIC_URL from your PC.");
  process.exit(1);
}

const schemaPath = path.resolve(__dirname, "../../database/schema.sql");
const sql = fs.readFileSync(schemaPath, "utf8");

async function main() {
  const client = new Client({
    connectionString: databaseUrl.replace(/[?&]sslmode=[^&]*/gi, ""),
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  console.log("Connected to Railway PostgreSQL.");
  await client.query(sql);
  const tables = await client.query(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`,
  );
  console.log(`Tables ready (${tables.rows.length}):`);
  for (const row of tables.rows) {
    console.log(`  - ${row.tablename}`);
  }
  await client.end();
}

main().catch((err) => {
  console.error("Schema apply failed:", err.message);
  process.exit(1);
});
