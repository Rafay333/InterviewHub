const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

function pickDatabaseUrl() {
  const strip = (value) => String(value || "").trim().replace(/^["']|["']$/g, "");
  const internal = strip(process.env.DATABASE_URL);
  const pub = strip(process.env.DATABASE_PUBLIC_URL);
  // railway.internal only works from another Railway service, not from your PC.
  if (internal.includes("railway.internal") && !process.env.RAILWAY_ENVIRONMENT) {
    return pub || internal;
  }
  return internal || pub;
}

const databaseUrl = pickDatabaseUrl();

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv:
    process.env.NODE_ENV ||
    (process.env.RAILWAY_ENVIRONMENT ? "production" : "development"),
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "interviewhub-dev-jwt-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || "",
  adminSeedEmail: process.env.ADMIN_SEED_EMAIL || "admin@interviewhub.com",
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD || "admin123",
  adminSeedName: process.env.ADMIN_SEED_NAME || "Founder Admin",
  databaseUrl,
};

module.exports = { env };
