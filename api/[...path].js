import mongoose from "mongoose";
import app from "../server/app.js";
import { env, validateProductionConfig } from "../server/config.js";

let connectionPromise;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;

  if (!env.mongoUri) {
    throw new Error("Production MongoDB configuration is missing.");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 0,
    }).catch(error => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
}

export default async function handler(req, res) {
  try {
    validateProductionConfig();
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("API startup failure:", error);

    const isMissingConfig = error?.code === "MISSING_PRODUCTION_CONFIG";
    const isDatabaseError =
      /Mongo|Mongoose|ECONNREFUSED|ENOTFOUND|server selection|topology/i.test(
        String(error?.name || "") + " " + String(error?.message || "")
      );

    return res.status(isMissingConfig || isDatabaseError ? 503 : 500).json({
      error: {
        code: isMissingConfig
          ? "MISSING_PRODUCTION_CONFIG"
          : isDatabaseError
            ? "DATABASE_UNAVAILABLE"
            : "API_STARTUP_FAILED",
        message: isMissingConfig
          ? error.message
          : isDatabaseError
            ? "The backend could not connect to MongoDB. Check MONGODB_URI and MongoDB Atlas network access."
            : "The backend failed to start. Check the Vercel function logs for the startup error.",
      },
    });
  }
}
