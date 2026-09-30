import { AppError } from "../utils/errors.js";

function isDatabaseError(err) {
  if (err?.code === 11000 || err?.code === "11000") return false;
  const name = String(err?.name || "");
  const code = String(err?.code || "");
  const message = String(err?.message || "");

  return (
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    name === "MongooseServerSelectionError" ||
    name === "MongoNetworkError" ||
    name === "MongoServerSelectionError" ||
    name === "MongoTimeoutError" ||
    /MongoServerSelectionError|MongoNetworkError|topology was destroyed|timed out/i.test(message)
  );
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
}

export function errorHandler(err, req, res, next) {
  if (err?.name === "ValidationError") {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details: err.errors
      }
    });
  }

  // Handle MongoDB duplicate key errors (code 11000)
  if (err?.code === 11000 || err?.code === "11000") {
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    const fieldName = fields[0] || "field";
    return res.status(409).json({
      error: {
        code: "DUPLICATE_KEY",
        message: `An account or record with this ${fieldName} already exists.`,
        details: { fields }
      }
    });
  }

  if (isDatabaseError(err)) {
    console.error("Database request failure:", err);
    return res.status(503).json({
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "The database is unavailable. Check the production MONGODB_URI and MongoDB network access settings."
      }
    });
  }

  const error = err instanceof AppError
    ? err
    : new AppError(500, "INTERNAL_ERROR", "Something went wrong");

  if (error.status >= 500) {
    console.error("Unhandled API error:", err);
  }

  res.status(error.status).json({
    error: {
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {})
    }
  });
}
