const bcrypt = require("bcrypt");
const { query, sql } = require("../config/db");
const { env } = require("../config/env");

async function ensureSeedAdmin() {
  const existing = await query("SELECT TOP 1 id FROM dbo.admin_users");
  if (existing.recordset.length > 0) return;

  const hash = await bcrypt.hash(env.adminSeedPassword, 10);
  await query(
    `INSERT INTO dbo.admin_users (name, email, password_hash, role, is_active)
     VALUES (@name, @email, @password_hash, 'admin', TRUE)`,
    {
      name: { type: sql.NVarChar(120), value: env.adminSeedName },
      email: { type: sql.NVarChar(255), value: env.adminSeedEmail },
      password_hash: { type: sql.NVarChar(sql.MAX), value: hash },
    },
  );
  console.log(`[seed] Created admin ${env.adminSeedEmail} / ${env.adminSeedPassword}`);
}

module.exports = { ensureSeedAdmin };
