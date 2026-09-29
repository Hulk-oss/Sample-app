import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || (isProduction ? "" : "mongodb://127.0.0.1:27017/freelancer_cfo"),
  jwtSecret: process.env.JWT_SECRET || (isProduction ? "" : "change-me-in-production"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  platformOwnerEmail: (process.env.PLATFORM_OWNER_EMAIL || "").trim().toLowerCase(),
};

export function validateProductionConfig() {
  if (!isProduction) return;

  const missing = [];
  if (!env.mongoUri) missing.push("MONGODB_URI");
  if (!env.jwtSecret) missing.push("JWT_SECRET");

  if (missing.length) {
    const error = new Error("Missing production environment variables: " + missing.join(", "));
    error.code = "MISSING_PRODUCTION_CONFIG";
    throw error;
  }
}
