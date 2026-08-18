const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { query, sql } = require("../config/db");

const adminCache = new Map();
const ADMIN_CACHE_MS = 5 * 60 * 1000;

async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const cacheKey = String(payload.sub || "");
    const cached = adminCache.get(cacheKey);
    if (cached && Date.now() - cached.at < ADMIN_CACHE_MS) {
      req.admin = cached.admin;
      return next();
    }

    const found = await query(
      `SELECT TOP 1 id, name, email, role, is_active FROM dbo.admin_users WHERE id = @id`,
      { id: { type: sql.UniqueIdentifier, value: payload.sub } },
    );
    const admin = found.recordset[0];
    if (!admin || !admin.is_active) {
      adminCache.delete(cacheKey);
      return res.status(401).json({
        message: "Please sign in again. Your admin session is out of date.",
      });
    }

    req.admin = {
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: "admin",
    };
    adminCache.set(cacheKey, { at: Date.now(), admin: req.admin });
    adminCache.set(String(admin.id), { at: Date.now(), admin: req.admin });
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { requireAdmin };
