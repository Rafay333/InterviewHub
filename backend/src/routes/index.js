const express = require("express");
const { env } = require("../config/env");
const adminRoutes = require("./admin");
const publicRoutes = require("./public");

const router = express.Router();

router.get("/health", async (req, res) => {
  let database = "unknown";
  try {
    const { getPool } = require("../config/db");
    await getPool();
    database = "connected";
  } catch {
    database = "disconnected";
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
