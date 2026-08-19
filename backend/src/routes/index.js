const express = require("express");
const { env } = require("../config/env");
const adminRoutes = require("./admin");
const publicRoutes = require("./public");

const router = express.Router();

router.get("/health", async (_req, res) => {
  let database = "disconnected";
  try {
    if (!env.databaseUrl) {
      database = "missing-url";
    } else {
      const { query } = require("../config/db");
      await query("SELECT 1 AS ok");
      database = "connected";
    }
  } catch (err) {
    database = String(err.message || "error").slice(0, 180);
  }
  res.status(200).json({
    status: "ok",
    environment: env.nodeEnv,
    database,
    timestamp: new Date().toISOString(),
  });
});

router.use("/public", publicRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
