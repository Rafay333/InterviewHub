const { env } = require("./config/env");
const app = require("./app");
const { getPool, ensureSchema } = require("./config/db");
const { ensureSeedAdmin } = require("./services/seed");

async function start() {
  try {
    await getPool();
    await ensureSchema();
    await ensureSeedAdmin();
  } catch (err) {
    console.error("Database startup failed:", err.message);
    console.error("Check DATABASE_URL in backend/.env (Railway PostgreSQL public URL).");
    process.exit(1);
  }

  const server = app.listen(env.port, "0.0.0.0", () => {
    console.log(`InterviewHub API listening on http://localhost:${env.port}`);
    console.log(`Health: http://localhost:${env.port}/api/health`);
    console.log(`Admin API: http://localhost:${env.port}/api/admin`);
  });

  server.on("error", (err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
}

start();
