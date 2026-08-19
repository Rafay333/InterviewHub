const express = require("express");
const { env } = require("../config/env");
const adminRoutes = require("./admin");
const publicRoutes = require("./public");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

router.use("/public", publicRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
