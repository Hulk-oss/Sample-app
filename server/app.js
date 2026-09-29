import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { env } from "./config.js";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import invoiceRoutes from "./routes/invoices.js";
import financeRoutes from "./routes/finance.js";
import aiRoutes from "./routes/ai.js";
import companyRoutes from "./routes/company.js";
import adminRoutes from "./routes/admin.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

const app = express();

app.set("trust proxy", 1);
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

app.get("/api", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "freelancer-cfo-api",
    message: "API is reachable. Use /api/health for database status."
  });
});

app.get("/api/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbState = states[mongoose.connection.readyState] || "unknown";
  res.status(dbState === "connected" ? 200 : 503).json({
    ok: dbState === "connected",
    service: "freelancer-cfo-api",
    database: dbState,
    environment: env.nodeEnv,
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api", financeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
