import mongoose from "mongoose";
import app from "../server/app.js";
import { env } from "../server/config.js";

let connectionPromise;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (!env.mongoUri) {
    throw new Error("Production MongoDB configuration is missing.");
  }
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.mongoUri).catch(error => {
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
    console.error("API startup failure", error);
    return res.status(503).json({
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "The backend is not connected to the database. Check the production MONGODB_URI configuration.",
      },
    });
  }
}
