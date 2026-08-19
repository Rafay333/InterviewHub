const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query, sql } = require("../config/db");
const { env } = require("../config/env");

async function login(email, password) {
  const cleanEmail = String(email || "").trim();
  const cleanPassword = String(password || "");
  const result = await query(
    `SELECT TOP 1 id, name, email, password_hash, role, is_active
     FROM dbo.admin_users WHERE LOWER(email) = LOWER(@email)`,
    { email: { type: sql.NVarChar(255), value: cleanEmail } },
  );
  const user = result.recordset[0];
  if (!user || !user.is_active) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }
  const hash = String(user.password_hash || "").trim();
  const ok = hash ? await bcrypt.compare(cleanPassword, hash) : false;
  if (!ok) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const adminId = String(user.id);
  await query(
    `UPDATE dbo.admin_users SET last_login_at = SYSUTCDATETIME(), updated_at = SYSUTCDATETIME()
     WHERE id = @id`,
    { id: { type: sql.UniqueIdentifier, value: adminId } },
  );

  const token = jwt.sign(
    { sub: adminId, email: user.email, name: user.name, role: "admin" },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );

  return {
    token,
    admin: {
      id: adminId,
      name: user.name,
      email: user.email,
      role: "admin",
    },
  };
}

async function setPassword(email, password) {
  const cleanEmail = String(email || "").trim();
  const hash = await bcrypt.hash(String(password || ""), 10);
  const result = await query(
    `UPDATE dbo.admin_users
     SET password_hash = @hash, updated_at = SYSUTCDATETIME()
     OUTPUT INSERTED.email
     WHERE LOWER(email) = LOWER(@email)`,
    {
      hash: { type: sql.NVarChar(sql.MAX), value: hash },
      email: { type: sql.NVarChar(255), value: cleanEmail },
    },
  );
  return result.recordset[0] || null;
}

module.exports = { login, setPassword };
