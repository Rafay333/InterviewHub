const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query, sql } = require("../config/db");
const { env } = require("../config/env");

async function login(email, password) {
  const result = await query(
    `SELECT TOP 1 id, name, email, password_hash, role, is_active
     FROM dbo.admin_users WHERE LOWER(email) = LOWER(@email)`,
    { email: { type: sql.NVarChar(255), value: email } },
  );
  const user = result.recordset[0];
  if (!user || !user.is_active) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  await query(
    `UPDATE dbo.admin_users SET last_login_at = SYSUTCDATETIME(), updated_at = SYSUTCDATETIME()
     WHERE id = @id`,
    { id: { type: sql.UniqueIdentifier, value: user.id } },
  );

  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: "admin" },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );

  return {
    token,
    admin: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = { login };
