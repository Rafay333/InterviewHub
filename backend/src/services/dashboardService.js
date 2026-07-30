const { query } = require("../config/db");
const { getSettings } = require("./settingsService");

async function countBetween(hours) {
  const { sql } = require("../config/db");
  const result = await query(
    `SELECT COUNT(*) AS c FROM dbo.page_views
     WHERE viewed_at >= DATEADD(HOUR, -@hours, SYSUTCDATETIME())`,
    { hours: { type: sql.Int, value: hours } },
  );
  return Number(result.recordset[0].c || 0);
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

  const last24h = await countBetween(24);
  const last7d = await countBetween(24 * 7);
  const last30d = await countBetween(24 * 30);
  const last12m = await countBetween(24 * 365);

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
      last24h,
      last7d,
      last30d,
      last12m,
    },
    trafficSeries: {
      "24h": [last24h],
      "7d": [last7d],
      "30d": [last30d],
      "12m": [last12m],
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
