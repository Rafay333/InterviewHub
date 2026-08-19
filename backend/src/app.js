const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { env } = require("./config/env");
const routes = require("./routes");
const { uploadRoot } = require("./middleware/upload");

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.nodeEnv !== "production") {
        return callback(null, true);
      }
      const extra = String(process.env.CORS_ORIGINS || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      const allowed = new Set([
        env.clientUrl,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        ...extra,
      ]);
      if (allowed.has(origin)) return callback(null, true);
      try {
        const host = new URL(origin).hostname;
        if (host.endsWith(".vercel.app")) return callback(null, true);
      } catch {
        /* ignore */
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/uploads/:file", (req, res, next) => {
  require("./utils/uploadStore").serveUpload(req, res, next);
});
app.use("/uploads", express.static(uploadRoot));

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
