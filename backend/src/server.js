const { env } = require("./config/env");
const app = require("./app");
const { getPool, ensureSchema } = require("./config/db");
const { ensureSeedAdmin } = require("./services/seed");

async function start() {
  const server = app.listen(env.port, "0.0.0.0", () => {
    console.log(`InterviewHub API listening on 0.0.0.0:${env.port}`);
    console.log(`Health: /api/health`);
  });

  server.on("error", (err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });

  try {
    getPool();
    await ensureSchema();
    await ensureSeedAdmin();
    console.log("[db] Schema ready");
  } catch (err) {
    console.error("Database startup failed:", err.message);
    console.error("Set DATABASE_URL from the Postgres service in Railway Variables.");
  }
}

start();
