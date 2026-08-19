const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query, sql } = require("../config/db");
const { env } = require("../config/env");

function httpError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    lastLoginAt: row.last_login_at ? new Date(row.last_login_at).toISOString() : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: "user" },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeName(name) {
  return String(name || "").trim().replace(/\s+/g, " ");
}

async function findByEmail(email) {
  const result = await query(
    `SELECT TOP 1 id, name, email, password_hash, is_active, last_login_at, created_at
     FROM dbo.users WHERE LOWER(email) = LOWER(@email)`,
    { email: { type: sql.NVarChar(255), value: email } },
  );
  return result.recordset[0] || null;
}

async function findById(id) {
  const result = await query(
    `SELECT TOP 1 id, name, email, is_active, last_login_at, created_at
     FROM dbo.users WHERE id = @id`,
    { id: { type: sql.UniqueIdentifier, value: id } },
  );
  return result.recordset[0] || null;
}

async function touchLogin(id) {
  await query(
    `UPDATE dbo.users
     SET last_login_at = SYSUTCDATETIME(), updated_at = SYSUTCDATETIME()
     WHERE id = @id`,
    { id: { type: sql.UniqueIdentifier, value: id } },
  );
}

async function register({ name, email, password }) {
  const cleanName = normalizeName(name);
  const cleanEmail = normalizeEmail(email);
  const cleanPassword = String(password || "");

  if (cleanName.length < 2) throw httpError("Please enter your name.", 400);
  if (cleanName.length > 120) throw httpError("Name is too long.", 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw httpError("Please enter a valid email address.", 400);
  }
  if (cleanPassword.length < 8) {
    throw httpError("Password must be at least 8 characters.", 400);
  }

  const existing = await findByEmail(cleanEmail);
  if (existing) {
    throw httpError("An account with this email already exists. Sign in instead.", 409);
  }

  const passwordHash = await bcrypt.hash(cleanPassword, 10);
  const inserted = await query(
    `INSERT INTO dbo.users (name, email, password_hash, last_login_at)
     OUTPUT INSERTED.id
     VALUES (@name, @email, @passwordHash, SYSUTCDATETIME())`,
    {
      name: { type: sql.NVarChar(120), value: cleanName },
      email: { type: sql.NVarChar(255), value: cleanEmail },
      passwordHash: { type: sql.NVarChar(sql.MAX), value: passwordHash },
    },
  );
  const createdId = inserted.recordset[0]?.id;
  const user = createdId ? await findById(createdId) : null;
  if (!user) throw httpError("Could not create account.", 500);

  return {
    token: signToken(user),
    user: mapUser(user),
  };
}

async function login(email, password) {
  const cleanEmail = normalizeEmail(email);
  const user = await findByEmail(cleanEmail);
  if (!user || !user.is_active || !user.password_hash) {
    throw httpError("Invalid email or password.", 401);
  }
  const ok = await bcrypt.compare(String(password || ""), user.password_hash);
  if (!ok) throw httpError("Invalid email or password.", 401);

  await touchLogin(user.id);
  const fresh = (await findById(user.id)) || user;

  return {
    token: signToken(fresh),
    user: mapUser(fresh),
  };
}

async function getMe(id) {
  const user = await findById(id);
  if (!user || !user.is_active) throw httpError("Please sign in again.", 401);
  return mapUser(user);
}

module.exports = { register, login, getMe };
