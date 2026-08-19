const crypto = require("crypto");
const { query, sql } = require("../config/db");
const { env } = require("../config/env");

const BOT_UA =
  /googlebot|bingbot|yandexbot|baiduspider|twitterbot|facebookexternalhit|linkedinbot|slackbot|discordbot|telegrambot|whatsapp|applebot|pingdom|uptimerobot|lighthouse|chrome-lighthouse|headlesschrome|gptbot|claudebot|anthropic|bytespider|semrush|ahrefsbot|dotbot|mj12bot|petalbot|duckduckbot|crawler|spider/i;

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")
    .map((part) => part.trim())
    .find(Boolean);
  const ip = forwarded || req.ip || req.socket?.remoteAddress || "";
  return ip.replace(/^::ffff:/, "").slice(0, 64);
}

function normalizePath(raw) {
  if (typeof raw !== "string") return null;
  let path = raw.trim();
  if (!path) return null;
  try {
    if (/^https?:\/\//i.test(path)) {
      path = new URL(path).pathname;
    }
  } catch {
    return null;
  }
  path = path.split("?")[0].split("#")[0];
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1) path = path.replace(/\/+$/, "");
  if (path.length > 500) path = path.slice(0, 500);
  if (
    path.startsWith("/admin") ||
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.startsWith("/uploads")
  ) {
    return null;
  }
  return path;
}

function visitorHash({ vid, ip, userAgent }) {
  const clientId = String(vid || "").trim();
  const seed =
    /^[a-zA-Z0-9-]{8,80}$/.test(clientId)
      ? `vid:${clientId}`
      : `ip:${ip}|${userAgent}`;
  return crypto
    .createHash("sha256")
    .update(`${seed}|${env.jwtSecret}`)
    .digest("hex")
    .slice(0, 64);
}

function isBot(userAgent) {
  return !userAgent || BOT_UA.test(userAgent);
}

async function recordPageView(req) {
  const userAgent = String(req.headers["user-agent"] || "").slice(0, 500);
  if (isBot(userAgent)) return { recorded: false, reason: "bot" };

  const body = req.body || {};
  const path = normalizePath(body.path || req.headers.referer);
  if (!path) return { recorded: false, reason: "path" };

  const ip = clientIp(req);
  const hash = visitorHash({ vid: body.vid, ip, userAgent });
  const referrer = String(body.referrer || "").slice(0, 500) || null;

  const recent = await query(
    `SELECT TOP 1 id FROM dbo.page_views
     WHERE visitor_hash = @hash AND path = @path
       AND viewed_at >= NOW() - INTERVAL '20 seconds'`,
    {
      hash: { type: sql.NVarChar(64), value: hash },
      path: { type: sql.NVarChar(500), value: path },
    },
  );
  if (recent.recordset.length > 0) {
    return { recorded: false, reason: "duplicate" };
  }

  await query(
    `INSERT INTO dbo.page_views (path, visitor_hash, referrer, user_agent)
     VALUES (@path, @hash, @referrer, @userAgent)`,
    {
      path: { type: sql.NVarChar(500), value: path },
      hash: { type: sql.NVarChar(64), value: hash },
      referrer: { type: sql.NVarChar(500), value: referrer },
      userAgent: { type: sql.NVarChar(500), value: userAgent || null },
    },
  );
  return { recorded: true };
}

module.exports = { recordPageView };
