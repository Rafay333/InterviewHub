/**
 * Seed the 10 core interview categories (idempotent).
 *
 *   node scripts/seed-core-categories.js
 */
const { getPool, query } = require("../src/config/db");
const categoryService = require("../src/services/categoryService");
const { CORE_CATEGORIES } = require("../src/data/coreCategories");

async function main() {
  await getPool();
  const admin = await query(`SELECT TOP 1 id FROM dbo.admin_users ORDER BY created_at`);
  const adminId = admin.recordset[0]?.id || null;

  const result = await categoryService.ensureCoreCategories(adminId);
  console.log(`Core categories: created ${result.created}, updated ${result.updated}`);
  for (const spec of CORE_CATEGORIES) {
    const row = result.categories.find((c) => c.sortOrder === spec.sortOrder);
    console.log(`  ${spec.sortOrder}. ${row ? row.name : spec.name}`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
