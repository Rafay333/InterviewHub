const bcrypt = require("bcrypt");
const { query, sql } = require("../config/db");

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: "Admin",
    lastLogin: row.last_login_at
      ? new Date(row.last_login_at).toISOString().replace("T", " ").slice(0, 16)
      : "Never",
    active: !!row.is_active,
  };
}

async function listAdmins() {
  const result = await query(
    `SELECT id, name, email, role, is_active, last_login_at
     FROM dbo.admin_users ORDER BY created_at DESC`,
  );
  return result.recordset.map(mapUser);
}

async function createAdmin({ name, email, password }) {
  const hash = await bcrypt.hash(password || "ChangeMe123!", 10);
  try {
    const result = await query(
      `INSERT INTO dbo.admin_users (name, email, password_hash, role, is_active)
       OUTPUT INSERTED.id
       VALUES (@name, @email, @password_hash, 'admin', 1)`,
      {
        name: { type: sql.NVarChar(120), value: name },
        email: { type: sql.NVarChar(255), value: email },
        password_hash: { type: sql.NVarChar(sql.MAX), value: hash },
      },
    );
    const one = await query(
      `SELECT id, name, email, role, is_active, last_login_at FROM dbo.admin_users WHERE id = @id`,
      { id: { type: sql.UniqueIdentifier, value: result.recordset[0].id } },
    );
    return mapUser(one.recordset[0]);
  } catch (err) {
    if (String(err.message).includes("UQ_admin_users_email")) {
      const e = new Error("Email already exists");
      e.status = 409;
      throw e;
    }
    throw err;
  }
}

async function setAdminActive(id, active) {
  await query(
    `UPDATE dbo.admin_users SET is_active = @active, updated_at = SYSUTCDATETIME() WHERE id = @id`,
    {
      id: { type: sql.UniqueIdentifier, value: id },
      active: { type: sql.Bit, value: active ? 1 : 0 },
    },
  );
  const one = await query(
    `SELECT id, name, email, role, is_active, last_login_at FROM dbo.admin_users WHERE id = @id`,
    { id: { type: sql.UniqueIdentifier, value: id } },
  );
  return one.recordset[0] ? mapUser(one.recordset[0]) : null;
}

module.exports = { listAdmins, createAdmin, setAdminActive };
