const { query, sql } = require("../config/db");
const { mediaUrl } = require("../utils/publicUrl");

function mapMedia(row, baseUrl) {
  const publicUrl = mediaUrl(row.public_url) || `${baseUrl}/uploads/${row.file_name}`;
  return {
    id: row.id,
    name: row.original_name || row.file_name,
    type: row.file_type,
    sizeLabel: row.file_size_bytes
      ? `${Math.max(1, Math.round(row.file_size_bytes / 1024))} KB`
      : "—",
    usedIn: "Library",
    uploadedAt: row.created_at
      ? new Date(row.created_at).toISOString().slice(0, 10)
      : null,
    url: publicUrl,
  };
}

async function listMedia(baseUrl) {
  const result = await query(
    `SELECT * FROM dbo.media_files ORDER BY created_at DESC`,
  );
  return result.recordset.map((row) => mapMedia(row, baseUrl));
}

async function createMedia({ file, adminId, baseUrl }) {
  const fileType = file.mimetype.includes("pdf") ? "pdf" : "image";
  const publicUrl = `${baseUrl}/uploads/${file.filename}`;
  const result = await query(
    `INSERT INTO dbo.media_files
      (file_name, original_name, file_type, mime_type, file_size_bytes, storage_path, public_url, uploaded_by)
     OUTPUT INSERTED.id
     VALUES (@file_name, @original_name, @file_type, @mime_type, @file_size_bytes, @storage_path, @public_url, @uploaded_by)`,
    {
      file_name: { type: sql.NVarChar(255), value: file.filename },
      original_name: { type: sql.NVarChar(255), value: file.originalname },
      file_type: { type: sql.VarChar(20), value: fileType },
      mime_type: { type: sql.NVarChar(120), value: file.mimetype },
      file_size_bytes: { type: sql.BigInt, value: file.size },
      storage_path: { type: sql.NVarChar(500), value: file.path },
      public_url: { type: sql.NVarChar(500), value: publicUrl },
      uploaded_by: { type: sql.UniqueIdentifier, value: adminId || null },
    },
  );
  const one = await query(`SELECT * FROM dbo.media_files WHERE id = @id`, {
    id: { type: sql.UniqueIdentifier, value: result.recordset[0].id },
  });
  return mapMedia(one.recordset[0], baseUrl);
}

async function deleteMedia(id) {
  const result = await query(`DELETE FROM dbo.media_files WHERE id = @id`, {
    id: { type: sql.UniqueIdentifier, value: id },
  });
  return result.rowsAffected[0] > 0;
}

module.exports = { listMedia, createMedia, deleteMedia };
