const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const required = ["PORT", "NODE_ENV", "CLIENT_URL"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const databaseUrl = (process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL || "")
  .trim()
  .replace(/^["']|["']$/g, "");

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
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
