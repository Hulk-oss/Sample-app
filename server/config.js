import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

const mongoUri = process.env.MONGODB_URI || (isProduction ? "" : "mongodb://127.0.0.1:27017/freelancer_cfo");
const jwtSecret = process.env.JWT_SECRET || (isProduction ? "" : "change-me-in-production");

if (isProduction && !mongoUri) {
  throw new Error("MONGODB_URI is required in production.");
}
if (isProduction && !jwtSecret) {
  throw new Error("JWT_SECRET is required in production.");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "*",
};
