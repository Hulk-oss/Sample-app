import { AppError } from "../utils/errors.js";

function isDatabaseError(err) {
  const name = String(err?.name || "");
  const code = String(err?.code || "");
  const message = String(err?.message || "");

  return (
    name.includes("Mongo") ||
    name.includes("Mongoose") ||
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    /MongoServerSelectionError|MongoNetworkError|topology was destroyed/i.test(message)
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
