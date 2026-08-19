const { env } = require("../src/config/env");
const { ensureSchema } = require("../src/config/db");
const authService = require("../src/services/adminAuthService");

async function main() {
  await ensureSchema();
  const email = process.argv[2] || env.adminSeedEmail;
  const password = process.argv[3] || env.adminSeedPassword;
  const updated = await authService.setPassword(email, password);
  if (!updated) {
    console.error(`[reset-admin] No admin_users row for ${email}`);
    process.exit(1);
  }
  console.log(`[reset-admin] Password updated for ${updated.email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[reset-admin]", err.message || err);
  process.exit(1);
});
