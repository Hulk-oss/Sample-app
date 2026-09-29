import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config.js";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import invoiceRoutes from "./routes/invoices.js";
import financeRoutes from "./routes/finance.js";
import aiRoutes from "./routes/ai.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: env.clientOrigin.split(",").map(item => item.trim()),
  credentials: false,
}));
app.use(express.json({ limit: "100kb" }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
}));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "freelancer-cfo-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api", financeRoutes);
app.use("/api/ai", aiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

mongoose.connect(env.mongoUri)
  .then(() => {
    app.listen(env.port, () => {
      console.log("Freelancer CFO API listening on http://localhost:" + env.port);
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
