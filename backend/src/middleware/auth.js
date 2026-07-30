const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function requireAdmin(req, res, next) {
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
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { requireAdmin };
