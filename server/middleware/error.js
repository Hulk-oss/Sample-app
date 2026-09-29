import { AppError } from "../utils/errors.js";
export function notFoundHandler(req, res) {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
}
export function errorHandler(err, req, res, next) {
  if (err?.name === "ValidationError") {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid request data", details: err.errors } });
  }
  const error = err instanceof AppError ? err : new AppError(500, "INTERNAL_ERROR", "Something went wrong");
  if (error.status >= 500) console.error(err);
  res.status(error.status).json({ error: { code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) } });
}
