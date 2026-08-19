function apiOrigin() {
  const fromEnv = String(process.env.PUBLIC_API_URL || "").trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const railway = String(process.env.RAILWAY_PUBLIC_DOMAIN || "").trim().replace(/\/$/, "");
  if (railway) return railway.startsWith("http") ? railway : `https://${railway}`;
  if (process.env.RAILWAY_ENVIRONMENT) {
    return "https://interviewhub-production-586d.up.railway.app";
  }
  return "";
}

function mediaUrl(value) {
  if (value == null) return null;
  let url = String(value).trim();
  if (!url) return null;
  const origin = apiOrigin();
  if (origin) {
    url = url.replace(/https?:\/\/localhost:\d+/gi, origin);
    url = url.replace(/https?:\/\/127\.0\.0\.1:\d+/gi, origin);
    if (url.startsWith("/uploads/")) return `${origin}${url}`;
  }
  return url;
}

function publicOrigin(req) {
  return apiOrigin() || `${req.protocol}://${req.get("host")}`;
}

module.exports = { apiOrigin, mediaUrl, publicOrigin };
