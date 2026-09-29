import mongoose from "mongoose";
import app from "../server/app.js";
import { env } from "../server/config.js";

let connectionPromise;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.mongoUri).catch(error => {
      connectionPromise = undefined;
      throw error;
    });
  }
  await connectionPromise;
}

export default async function handler(req, res) {
  await connectDatabase();
  return app(req, res);
}
