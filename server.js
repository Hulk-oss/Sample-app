import mongoose from "mongoose";
import app from "./server/app.js";
import { env, validateProductionConfig } from "./server/config.js";

let connectionPromise;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;

  validateProductionConfig();

  if (!env.mongoUri) {
    const error = new Error("MONGODB_URI is not configured.");
    error.code = "MISSING_PRODUCTION_CONFIG";
    throw error;
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
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Vercel API startup failure:", error);

    const invalidConfig = [
      "MISSING_PRODUCTION_CONFIG",
      "INVALID_PRODUCTION_DATABASE",
    ].includes(error?.code);

    const databaseError = /Mongo|Mongoose|ECONNREFUSED|ENOTFOUND|server selection|topology/i.test(
      String(error?.name || "") + " " + String(error?.message || "")
    );

    return res.status(503).json({
      error: {
        code: invalidConfig
          ? error.code
          : databaseError
            ? "DATABASE_UNAVAILABLE"
            : "API_UNAVAILABLE",
        message: invalidConfig
          ? error.message
          : databaseError
            ? "The API cannot connect to MongoDB. Check MONGODB_URI and MongoDB Atlas network access."
            : "The API could not start. Check the deployment runtime logs.",
      },
    });
  }
}
