const { query, sql } = require("../config/db");
const { env } = require("../config/env");

const DEFAULT_ADSENSE_PUBLISHER_ID = env.adsensePublisherId || "ca-pub-1311833234933388";

function mapRow(row) {
  const adsensePublisherId = row.adsense_publisher_id || DEFAULT_ADSENSE_PUBLISHER_ID;
  return {
    id: row.id,
    siteName: row.site_name,
    metaSuffix: row.meta_suffix,
    ga4Connected: !!row.ga4_connected,
    ga4MeasurementId: row.ga4_measurement_id || "",
    adsenseConnected: !!row.adsense_connected || !!adsensePublisherId,
    adsensePublisherId,
  };
}

async function persistAdsenseDefaults(row) {
  const publisherId = row.adsense_publisher_id || DEFAULT_ADSENSE_PUBLISHER_ID;
  if (row.adsense_connected && row.adsense_publisher_id) return;
  await query(
    `UPDATE dbo.site_settings SET
      adsense_connected = 1,
      adsense_publisher_id = @adsense_publisher_id,
      updated_at = SYSUTCDATETIME()
     WHERE id = @id`,
    {
      id: { type: sql.UniqueIdentifier, value: row.id },
      adsense_publisher_id: { type: sql.NVarChar(64), value: publisherId },
    },
  );
}

async function getSettings() {
  const result = await query(`SELECT TOP 1 * FROM dbo.site_settings ORDER BY created_at`);
  const row = result.recordset[0];
  if (!row) {
    return {
      siteName: "InterviewHub",
      metaSuffix: "| InterviewHub",
      ga4Connected: false,
      ga4MeasurementId: "",
      adsenseConnected: true,
      adsensePublisherId: DEFAULT_ADSENSE_PUBLISHER_ID,
    };
  }
  try {
    await persistAdsenseDefaults(row);
  } catch (err) {
    console.error("[settings] adsense persist", err.message || err);
  }
  return mapRow({
    ...row,
    adsense_connected: true,
    adsense_publisher_id: row.adsense_publisher_id || DEFAULT_ADSENSE_PUBLISHER_ID,
  });
}

async function updateSettings(payload, adminId) {
  const current = await getSettings();
  const publisherId = payload.adsensePublisherId || current.adsensePublisherId || DEFAULT_ADSENSE_PUBLISHER_ID;
  const connected =
    payload.adsenseConnected !== undefined
      ? !!payload.adsenseConnected
      : !!publisherId;
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
        adsense_connected: { type: sql.Bit, value: connected ? 1 : 0 },
        adsense_publisher_id: {
          type: sql.NVarChar(64),
          value: publisherId || null,
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
        adsense_connected: { type: sql.Bit, value: connected ? 1 : 0 },
        adsense_publisher_id: {
          type: sql.NVarChar(64),
          value: publisherId || null,
        },
        updated_by: { type: sql.UniqueIdentifier, value: adminId || null },
      },
    );
  }
  return getSettings();
}

module.exports = { getSettings, updateSettings };
