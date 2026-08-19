const { query } = require("../config/db");
const { getSettings } = require("./settingsService");

async function trafficBetween(hours) {
  const { sql } = require("../config/db");
  const result = await query(
    `SELECT
        COUNT(DISTINCT visitor_hash) AS visitors,
        COUNT(*) AS views
     FROM dbo.page_views
     WHERE viewed_at >= DATEADD(HOUR, -@hours, SYSUTCDATETIME())
       AND visitor_hash IS NOT NULL`,
    { hours: { type: sql.Int, value: hours } },
  );
  const row = result.recordset[0] || {};
  return {
    visitors: Number(row.visitors || 0),
    views: Number(row.views || 0),
  };
}

function bucketKey(date, unit) {
  const d = new Date(date);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  if (unit === "hour") return `${y}-${m}-${day}T${h}`;
  if (unit === "day") return `${y}-${m}-${day}`;
  return `${y}-${m}`;
}

function fillBuckets(rows, unit, steps) {
  const map = new Map(rows.map((row) => [String(row.bucket), Number(row.c || 0)]));
  const values = [];
  const now = new Date();
  for (let i = steps - 1; i >= 0; i -= 1) {
    const t = new Date(now);
    if (unit === "hour") t.setUTCHours(now.getUTCHours() - i, 0, 0, 0);
    else if (unit === "day") {
      t.setUTCDate(now.getUTCDate() - i);
      t.setUTCHours(0, 0, 0, 0);
    } else {
      t.setUTCMonth(now.getUTCMonth() - i, 1);
      t.setUTCHours(0, 0, 0, 0);
    }
    values.push(map.get(bucketKey(t, unit)) || 0);
  }
  return values;
}

async function visitorSeries(unit, steps, intervalSql, format) {
  const result = await query(
    `SELECT to_char(viewed_at AT TIME ZONE 'UTC', '${format}') AS bucket,
            COUNT(DISTINCT visitor_hash) AS c
     FROM dbo.page_views
     WHERE viewed_at >= NOW() - INTERVAL '${intervalSql}'
       AND visitor_hash IS NOT NULL
     GROUP BY 1`,
  );
  return fillBuckets(result.recordset, unit, steps);
}

async function getDashboard() {
  const settings = await getSettings();

  const counts = await query(`
    SELECT
      (SELECT COUNT(*) FROM dbo.languages) AS languages,
      (SELECT COUNT(*) FROM dbo.categories) AS categories,
      (SELECT COUNT(*) FROM dbo.questions) AS questions,
      (SELECT COUNT(*) FROM dbo.blogs) AS blogs,
      (SELECT COUNT(*) FROM dbo.questions WHERE status = 'published') AS publishedQuestions,
      (SELECT COUNT(*) FROM dbo.questions WHERE status = 'draft') AS draftQuestions,
      (SELECT COUNT(*) FROM dbo.questions WHERE difficulty = 'beginner') AS beginner,
      (SELECT COUNT(*) FROM dbo.questions WHERE difficulty = 'intermediate') AS intermediate,
      (SELECT COUNT(*) FROM dbo.questions WHERE difficulty = 'expert') AS expert
  `);
  const c = counts.recordset[0];

  const last24h = await trafficBetween(24);
  const last7d = await trafficBetween(24 * 7);
  const last30d = await trafficBetween(24 * 30);
  const last12m = await trafficBetween(24 * 365);

  const [series24h, series7d, series30d, series12m] = await Promise.all([
    visitorSeries("hour", 24, "24 hours", 'YYYY-MM-DD"T"HH24'),
    visitorSeries("day", 7, "7 days", "YYYY-MM-DD"),
    visitorSeries("day", 30, "30 days", "YYYY-MM-DD"),
    visitorSeries("month", 12, "12 months", "YYYY-MM"),
  ]);

  const topPages = await query(`
    SELECT TOP 5 path, COUNT(*) AS views
    FROM dbo.page_views
    WHERE viewed_at >= DATEADD(DAY, -30, SYSUTCDATETIME())
    GROUP BY path
    ORDER BY COUNT(*) DESC
  `);

  const adsense = await query(`
    SELECT
      ISNULL(SUM(CASE WHEN stat_date = CAST(SYSUTCDATETIME() AS DATE) THEN earnings_usd END), 0) AS today,
      ISNULL(SUM(CASE WHEN stat_date >= DATEADD(DAY, -7, CAST(SYSUTCDATETIME() AS DATE)) THEN earnings_usd END), 0) AS last7d,
      ISNULL(SUM(CASE WHEN stat_date >= DATEADD(DAY, -30, CAST(SYSUTCDATETIME() AS DATE)) THEN earnings_usd END), 0) AS last30d,
      ISNULL(SUM(earnings_usd), 0) AS ytd,
      ISNULL(AVG(rpm), 0) AS rpm,
      ISNULL(AVG(ctr), 0) AS ctr
    FROM dbo.adsense_stats
  `);
  const a = adsense.recordset[0];

  const activity = await query(`
    SELECT TOP 10 'question' AS kind, LEFT(question_text, 80) AS target, updated_at AS at
    FROM dbo.questions
    ORDER BY updated_at DESC
  `);

  return {
    traffic: {
      last24h: last24h.visitors,
      last7d: last7d.visitors,
      last30d: last30d.visitors,
      last12m: last12m.visitors,
      views24h: last24h.views,
      views7d: last7d.views,
      views30d: last30d.views,
      views12m: last12m.views,
    },
    trafficSeries: {
      "24h": series24h,
      "7d": series7d,
      "30d": series30d,
      "12m": series12m,
    },
    topPages: topPages.recordset.map((r) => ({
      path: r.path,
      views: Number(r.views),
    })),
    adsense: {
      connected: settings.adsenseConnected,
      today: Number(a.today),
      last7d: Number(a.last7d),
      last30d: Number(a.last30d),
      ytd: Number(a.ytd),
      rpm: Number(a.rpm),
      ctr: Number(a.ctr),
      topEarning: [],
    },
    content: {
      languages: Number(c.languages),
      categories: Number(c.categories),
      questions: Number(c.questions),
      blogs: Number(c.blogs),
      publishedQuestions: Number(c.publishedQuestions),
      draftQuestions: Number(c.draftQuestions),
      byDifficulty: {
        beginner: Number(c.beginner),
        intermediate: Number(c.intermediate),
        expert: Number(c.expert),
      },
    },
    recentActivity: activity.recordset.map((row, i) => ({
      id: String(i),
      action: "Updated question",
      target: row.target,
      actor: "Admin",
      at: new Date(row.at).toISOString(),
    })),
    settings,
  };
}

module.exports = { getDashboard };
