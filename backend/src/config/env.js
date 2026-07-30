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

const trustedConnection =
  String(process.env.DB_TRUSTED_CONNECTION || "true").toLowerCase() === "true";

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
  dbTrustedConnection: trustedConnection,
  db: {
    server: process.env.DB_SERVER || "localhost",
    database: process.env.DB_DATABASE || "InterviewHub",
    ...(trustedConnection
      ? {
          options: {
            trustedConnection: true,
            encrypt:
              String(process.env.DB_ENCRYPT || "false").toLowerCase() === "true",
            trustServerCertificate:
              String(process.env.DB_TRUST_SERVER_CERTIFICATE || "true").toLowerCase() ===
              "true",
          },
        }
      : {
          port: Number(process.env.DB_PORT) || 1433,
          user: process.env.DB_USER || "sa",
          password: process.env.DB_PASSWORD || "",
          options: {
            encrypt:
              String(process.env.DB_ENCRYPT || "false").toLowerCase() === "true",
            trustServerCertificate:
              String(process.env.DB_TRUST_SERVER_CERTIFICATE || "true").toLowerCase() ===
              "true",
          },
        }),
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },
};

module.exports = { env };
