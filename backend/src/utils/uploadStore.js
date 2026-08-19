const fs = require("fs");
const path = require("path");
const { getPool } = require("../config/db");
const { uploadRoot } = require("../middleware/upload");

function mimeFromName(name) {
  const ext = path.extname(String(name || "")).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".pdf") return "application/pdf";
  return "application/octet-stream";
}

async function upsertUploadBytes(fileName, bytes, mimeType) {
  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  const pool = getPool();
  await pool.query(
    `INSERT INTO upload_files (file_name, mime_type, byte_size, bytes)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (file_name) DO UPDATE SET
       mime_type = EXCLUDED.mime_type,
       byte_size = EXCLUDED.byte_size,
       bytes = EXCLUDED.bytes,
       updated_at = NOW()`,
    [fileName, mimeType || mimeFromName(fileName), buffer.length, buffer],
  );
}

async function persistLocalFile(fileName) {
  const safe = path.basename(String(fileName || ""));
  if (!safe) return;
  const full = path.join(uploadRoot, safe);
  if (!fs.existsSync(full)) return;
  await upsertUploadBytes(safe, fs.readFileSync(full), mimeFromName(safe));
}

async function serveUpload(req, res, next) {
  const fileName = path.basename(String(req.params.file || ""));
  if (!fileName) return res.status(404).end();
  const disk = path.join(uploadRoot, fileName);
  if (fs.existsSync(disk)) {
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.sendFile(disk);
  }
  try {
    const result = await getPool().query(
      `SELECT mime_type, bytes FROM upload_files WHERE file_name = $1`,
      [fileName],
    );
    const row = result.rows[0];
    if (!row) return res.status(404).end();
    res.set("Content-Type", row.mime_type || mimeFromName(fileName));
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    return res.send(row.bytes);
  } catch (err) {
    console.error("[uploads]", err.message);
    return next(err);
  }
}

module.exports = {
  mimeFromName,
  upsertUploadBytes,
  persistLocalFile,
  serveUpload,
};
