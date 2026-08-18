const store = new Map();
const TTL_MS = 45 * 1000;

function cacheKey(req) {
  return `GET:${req.originalUrl || req.url}`;
}

function getCached(key) {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    store.delete(key);
    return null;
  }
  return hit.body;
}

function setCached(key, body) {
  store.set(key, { body, expires: Date.now() + TTL_MS });
}

function clearPublicCache() {
  store.clear();
}

function publicCache(req, res, next) {
  if (req.method !== "GET") return next();
  const key = cacheKey(req);
  const hit = getCached(key);
  if (hit !== null) {
    res.set("Cache-Control", "public, max-age=15, s-maxage=45");
    res.set("X-Cache", "HIT");
    return res.json(hit);
  }

  const sendJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200) setCached(key, body);
    res.set("Cache-Control", "public, max-age=15, s-maxage=45");
    res.set("X-Cache", "MISS");
    return sendJson(body);
  };
  next();
}

module.exports = { publicCache, clearPublicCache };
