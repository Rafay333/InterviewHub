const { query, sql } = require("../config/db");

async function getSettings() {
  const result = await query(`SELECT TOP 1 * FROM dbo.site_settings ORDER BY created_at`);
  const row = result.recordset[0];
  if (!row) {
    return {
      siteName: "InterviewHub",
      metaSuffix: "| InterviewHub",
      ga4Connected: false,
      ga4MeasurementId: "",
      adsenseConnected: false,
      adsensePublisherId: "",
    };
  }
  return {
    id: row.id,
    siteName: row.site_name,
    metaSuffix: row.meta_suffix,
    ga4Connected: !!row.ga4_connected,
    ga4MeasurementId: row.ga4_measurement_id || "",
    adsenseConnected: !!row.adsense_connected,
    adsensePublisherId: row.adsense_publisher_id || "",
  };
}

async function updateSettings(payload, adminId) {
  const current = await getSettings();
  if (!current.id) {
    await query(
      `INSERT INTO dbo.site_settings
        (site_name, meta_suffix, ga4_connected, ga4_measurement_id, adsense_connected, adsense_publisher_id, updated_by)
       VALUES (@site_name, @meta_suffix, @ga4_connected, @ga4_measurement_id, @adsense_connected, @adsense_publisher_id, @updated_by)`,
      {
        site_name: { type: sql.NVarChar(120), value: payload.siteName || "InterviewHub" },
        meta_suffix: {
          type: sql.NVarChar(120),
          value: payload.metaSuffix || "| InterviewHub",
        },
        ga4_connected: { type: sql.Bit, value: payload.ga4Connected ? 1 : 0 },
        ga4_measurement_id: {
          type: sql.NVarChar(64),
          value: payload.ga4MeasurementId || null,
        },
        adsense_connected: { type: sql.Bit, value: payload.adsenseConnected ? 1 : 0 },
        adsense_publisher_id: {
          type: sql.NVarChar(64),
          value: payload.adsensePublisherId || null,
        },
        updated_by: { type: sql.UniqueIdentifier, value: adminId || null },
      },
    );
  } else {
    await query(
      `UPDATE dbo.site_settings SET
        site_name = @site_name,
        meta_suffix = @meta_suffix,
        ga4_connected = @ga4_connected,
        ga4_measurement_id = @ga4_measurement_id,
        adsense_connected = @adsense_connected,
        adsense_publisher_id = @adsense_publisher_id,
        updated_by = @updated_by,
        updated_at = SYSUTCDATETIME()
       WHERE id = @id`,
      {
        id: { type: sql.UniqueIdentifier, value: current.id },
        site_name: {
          type: sql.NVarChar(120),
          value: payload.siteName || current.siteName,
        },
        meta_suffix: {
          type: sql.NVarChar(120),
          value: payload.metaSuffix || current.metaSuffix,
        },
        ga4_connected: { type: sql.Bit, value: payload.ga4Connected ? 1 : 0 },
        ga4_measurement_id: {
          type: sql.NVarChar(64),
          value: payload.ga4MeasurementId || null,
        },
        adsense_connected: { type: sql.Bit, value: payload.adsenseConnected ? 1 : 0 },
        adsense_publisher_id: {
          type: sql.NVarChar(64),
          value: payload.adsensePublisherId || null,
        },
        updated_by: { type: sql.UniqueIdentifier, value: adminId || null },
      },
    );
  }
  return getSettings();
}

module.exports = { getSettings, updateSettings };
